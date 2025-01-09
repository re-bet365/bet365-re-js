import logging
import subprocess
import time
from pathlib import Path

import jsbeautifier
from mitmproxy import http, flowfilter
from rjsmin import jsmin


class JavascriptExtractor:
    current_directory = Path(__file__).resolve()
    output_base_path = str((current_directory / "../../../../output").resolve()) + "/"
    javascript_base_path = str((current_directory / "../../javascript").resolve()) + "/"
    file_delimiter = b'\x03'b'\x06'b'\x05'
    obfuscated_start_string = "(function(){ var _0x7c91="
    pre_transform_code_file_name = "pre-transform-code.js"
    post_transform_code_file_name = "post-transform-code.js"
    refactor_script_on_fly = True
    replace_contents: dict = {}
    node_executable_file: str
    function_names: list
    filter: flowfilter.TFilter

    def configure(self, updated):
        self.filter = flowfilter.parse("~u '/Api/1/Blob'")
        # work out function names from "*-new.js" files
        self.node_executable_file = subprocess.run(["which", "node"], capture_output=True, text=True).stdout.strip()
        if not self.node_executable_file:
            logging.error("Could not find node!")
        transformed_files = Path(self.javascript_base_path).glob('**/transformed-*.js')
        for transformed_file in transformed_files:
            identifier = transformed_file.name.removeprefix("transformed-").removesuffix(".js")
            post_transform_file = Path(self.javascript_base_path + f'/post-transform-{identifier}.js')
            if post_transform_file.is_file():
                transformed_file_contents = transformed_file.read_text()
                post_transform_file_contents = post_transform_file.read_text()
                self.replace_contents[jsmin(transformed_file_contents)] = jsmin(post_transform_file_contents)

    def response(self, flow: http.HTTPFlow) -> None:
        if flowfilter.match(self.filter, flow):
            file_identifier = str(time.time())
            split_content_bytes = flow.response.content.split(self.file_delimiter)
            sent_bytes_array = []
            for index, received_file_content_bytes in enumerate(split_content_bytes):
                sent_bytes = received_file_content_bytes
                start_byte = received_file_content_bytes[0:1]
                content_bytes = received_file_content_bytes[1:]
                content_start_string = content_bytes[:len(self.obfuscated_start_string)].decode()
                is_obfuscated_content = content_start_string.startswith(self.obfuscated_start_string)

                if is_obfuscated_content:
                    logging.info("Intercepting response: " + flow.request.url)
                    received_file_name = JavascriptExtractor.__get_file_name(self.output_base_path, received_file_content_bytes, file_identifier, "received", index)
                    received_file = JavascriptExtractor.__create_file(received_file_name, "received")
                    if received_file is not None:
                        received_file.write(content_bytes)
                        received_file.close()

                    # either deobfuscate on the fly or get the contents of deobfuscated.js
                    if self.refactor_script_on_fly:
                        refactor_file = Path(self.javascript_base_path + "/refactor-obfuscated-code-jscodeshift.js")
                        deobfuscated_file_name = JavascriptExtractor.__get_file_name(self.output_base_path, received_file_content_bytes, file_identifier, "deobfuscated", index)
                        subprocess.run([self.node_executable_file, refactor_file, received_file_name, deobfuscated_file_name], stdout=subprocess.PIPE)
                        pre_transform_code_content_string = Path(self.javascript_base_path + self.pre_transform_code_file_name).read_text()
                        deobfuscated_file_content_minified_string = jsmin(Path(deobfuscated_file_name).read_text())
                        post_transform_code_content_string = Path(self.javascript_base_path + self.post_transform_code_file_name).read_text()
                        for replace_content in self.replace_contents:
                            deobfuscated_file_content_minified_string = deobfuscated_file_content_minified_string.replace(replace_content, self.replace_contents[replace_content])
                        complete_file_content_string = pre_transform_code_content_string + deobfuscated_file_content_minified_string + post_transform_code_content_string
                    else:
                        deobfuscated_file = Path(self.javascript_base_path + "/deobfuscated.js")
                        complete_file_content_string = deobfuscated_file.read_text()

                    sent_file_name = JavascriptExtractor.__get_file_name(self.output_base_path, received_file_content_bytes, file_identifier, "sent", index)
                    sent_file = JavascriptExtractor.__create_file(sent_file_name, "sent")
                    if sent_file is not None:
                        pretty_js_string = jsbeautifier.beautify(complete_file_content_string)
                        sent_file.write(pretty_js_string.encode())
                        sent_file.close()

                    sent_bytes = start_byte + complete_file_content_string.encode()
                sent_bytes_array.append(sent_bytes)
            flow.response.content = self.file_delimiter.join(sent_bytes_array)

    @staticmethod
    def __javascript_full_path(javascript_base_path, function_name, suffix=None):
        suffix_part = ".js" if suffix is None else "-" + suffix + ".js"
        return javascript_base_path + function_name + suffix_part

    @staticmethod
    def __is_js(file_content):
        return bool(file_content) and 4 == file_content[0]

    @staticmethod
    def __is_css(file_content):
        return bool(file_content) and 5 == file_content[0]

    @staticmethod
    def __get_file_name(output_base_path, file_content, file_identifier, suffix, index):
        base_name = output_base_path + file_identifier + "-" + suffix + "-" + str(index)
        if JavascriptExtractor.__is_js(file_content):
            return base_name + ".js"
        elif JavascriptExtractor.__is_css(file_content):
            return base_name + ".css"
        elif not bool(file_content):
            # empty bytes shouldn't write to any file
            return None
        else:
            raise TypeError("unknown type: " + str(file_content[0]))

    @staticmethod
    def __create_file(file_name, file_type):
        if file_name is not None:
            return open(file_name, "wb")
        return None


addons = [JavascriptExtractor()]
