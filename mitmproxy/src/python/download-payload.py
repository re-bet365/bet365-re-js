import logging
import subprocess
import time
from os import listdir
from pathlib import Path

import jsbeautifier
from mitmproxy import http, flowfilter


class JavascriptExtractor:
    current_directory = Path(__file__).resolve()
    output_base_path = str((current_directory / "../../../../output").resolve()) + "/"
    javascript_base_path = str((current_directory / "../../javascript").resolve()) + "/"
    file_delimiter = b'\x03'b'\x06'b'\x05'
    obfuscated_start_template = "(function(){ %svar _0x1e16="
    obfuscated_code_logger_file_name = "obfuscated-code-logger.js"
    node_executable_file: str
    function_names: list
    filter: flowfilter.TFilter
    javascript_contents: dict
    replace_contents: dict

    def configure(self, updated):
        self.filter = flowfilter.parse("~u '/Api/1/Blob'")
        # work out function names from "*-new.js" files
        self.node_executable_file = subprocess.run(["which", "node"], capture_output=True, text=True).stdout.strip()
        if not self.node_executable_file:
            logging.error("Could not find node!")

    def response(self, flow: http.HTTPFlow) -> None:
        if flowfilter.match(self.filter, flow):
            file_identifier = str(time.time())
            split_content_bytes = flow.response.content.split(self.file_delimiter)
            sent_bytes_array = []
            for index, received_file_content_bytes in enumerate(split_content_bytes):
                sent_bytes = received_file_content_bytes
                start_byte = received_file_content_bytes[0:1]
                content_bytes = received_file_content_bytes[1:]
                obfuscated_start = self.obfuscated_start_template % ""
                content_start_string = content_bytes[:len(obfuscated_start)].decode()
                is_obfuscated_content = content_start_string.startswith(obfuscated_start)

                if is_obfuscated_content:
                    logging.info("Intercepting response: " + flow.request.url)
                    received_file_name = JavascriptExtractor.__get_file_name(self.output_base_path, received_file_content_bytes, file_identifier, "received", index)
                    received_file = JavascriptExtractor.__create_file(received_file_name, "received")
                    if received_file is not None:
                        received_file.write(content_bytes)
                        received_file.close()

                    refactor_file = Path(self.javascript_base_path + "/refactor-obfuscated-code-jscodeshift.js")
                    deobfuscated_file_name = JavascriptExtractor.__get_file_name(self.output_base_path, received_file_content_bytes, file_identifier, "deobfuscated", index)
                    subprocess.run([self.node_executable_file, refactor_file, received_file_name, deobfuscated_file_name], stdout=subprocess.PIPE)

                    logger_content_string = Path(self.javascript_base_path + self.obfuscated_code_logger_file_name).read_text()

                    obfuscated_file_content_string = Path(deobfuscated_file_name).read_text()
                    complete_file_content_string = logger_content_string + obfuscated_file_content_string

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
