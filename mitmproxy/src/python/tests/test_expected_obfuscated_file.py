import subprocess
from datetime import datetime
from pathlib import Path

import pytest
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from page.bet_365_home_page import Bet365HomePage
from page.cloudflare_challenge_page import CloudflareChallengePage

current_directory = Path(__file__).parent.absolute()
project_root_directory = (current_directory / "../../../..").resolve()
script_directory = (project_root_directory / "mitmproxy/src/python/main").absolute()
javascript_directory = (project_root_directory / "mitmproxy/src/javascript").absolute()
output_directory = (project_root_directory / "output").absolute()


def start_mitmproxy():
    # Start mitmproxy in transparent mode
    process = subprocess.Popen(["mitmdump", "-s", f"{script_directory}/download-payload.py"])
    return process


@pytest.fixture(scope="session", autouse=True)
def setup_and_teardown():
    # this will setup mitmproxy for this session, which can cause conflict if other tests spun up mitmproxy
    mitmproxy_process = start_mitmproxy()
    yield
    mitmproxy_process.terminate()


def get_stealth_chrome_options():
    # Configure headless browser with mitmproxy as proxy
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--proxy-server=http://localhost:8080")

    # Window size and appearance
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--start-maximized")
    # # Essential anti-detection options
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    # Browser fingerprinting protection
    chrome_options.add_argument("--disable-web-security")
    chrome_options.add_argument("--allow-running-insecure-content")
    chrome_options.add_argument("--disable-client-side-phishing-detection")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_argument("--disable-popup-blocking")
    # Privacy and tracking protection
    chrome_options.add_argument("--disable-features=IsolateOrigins,site-per-process")
    chrome_options.add_argument("--disable-site-isolation-trials")
    chrome_options.add_argument("--disable-features=EnableEphemeralFlashPermission")
    chrome_options.add_argument("--disable-features=CookiesWithoutSameSiteMustBeSecure")
    # Additional anti-fingerprinting measures
    chrome_options.add_argument("--disable-features=TranslateUI")
    chrome_options.add_argument("--disable-features=BlinkGenPropertyTrees")
    chrome_options.add_argument("--disable-plugins-discovery")
    chrome_options.add_argument("--disable-hang-monitor")
    chrome_options.add_argument("--disable-domain-reliability")
    # WebRTC settings (prevent IP leaks)
    chrome_options.add_argument("--disable-webrtc-encryption")
    chrome_options.add_argument("--disable-webrtc-hw-decoding")
    chrome_options.add_argument("--disable-webrtc-hw-encoding")
    chrome_options.add_argument("--disable-webrtc-multiple-routes")
    # Extra stealth tweaks
    chrome_options.add_argument('--disable-features=InterestCohort')  # Disable FLoC
    chrome_options.add_argument("--enable-features=NetworkService,NetworkServiceInProcess")
    chrome_options.add_argument("--lang=en-US,en;q=0.9")
    chrome_options.add_argument("--disable-extensions")
    # Override JS properties that are commonly used to detect automation
    chrome_options.add_argument("--disable-infobars")
    # Audio and video settings
    chrome_options.add_argument("--autoplay-policy=user-gesture-required")
    chrome_options.add_argument("--mute-audio")
    # Platform-specific
    chrome_options.add_argument("--disable-3d-apis")
    chrome_options.add_argument("--disable-background-networking")
    # Add preferences to further mask automation
    prefs = {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False,
        "profile.default_content_setting_values.notifications": 2,
        "profile.managed_default_content_settings.images": 1,
        "profile.default_content_setting_values.cookies": 1,
        "profile.default_content_setting_values.plugins": 1,
        "profile.default_content_setting_values.popups": 2,
        "profile.default_content_setting_values.geolocation": 2,
        "profile.default_content_setting_values.auto_select_certificate": 2,
        "profile.default_content_setting_values.mixed_script": 1,
        "profile.default_content_setting_values.media_stream": 2,
        "profile.default_content_setting_values.media_stream_mic": 2,
        "profile.default_content_setting_values.media_stream_camera": 2,
        "profile.default_content_setting_values.protocol_handlers": 2,
        "profile.default_content_setting_values.midi_sysex": 2,
        "profile.default_content_setting_values.push_messaging": 2,
        "profile.default_content_setting_values.ssl_cert_decisions": 2,
        "profile.default_content_setting_values.metro_switch_to_desktop": 2,
        "profile.default_content_setting_values.protected_media_identifier": 2,
        "profile.default_content_setting_values.site_engagement": 2,
        "profile.default_content_setting_values.durable_storage": 2,
        "useAutomationExtension": False,
        "excludeSwitches": ["enable-automation"],
        "plugins.always_open_pdf_externally": True
    }
    chrome_options.add_experimental_option("prefs", prefs)

    return chrome_options


def get_stealth_chrome_driver():
    driver = webdriver.Chrome(options=get_stealth_chrome_options())
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
    Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
    });
    // Overwrite the 'plugins' property to use a custom getter
    Object.defineProperty(navigator, 'plugins', {
        get: () => {
            // Create a fake plugins array with a length property
            const plugins = {length: 5};
            // Define some fake plugin items
            for (let i = 0; i < plugins.length; i++) {
                plugins[i] = {
                    name: `Plugin ${i+1}`,
                    description: `Fake plugin ${i+1} for anti-detection`,
                    filename: `plugin${i+1}.dll`,
                    length: 1
                };
            }
            return plugins;
        }
    });
    // Overwrite some chrome properties
    window.chrome = {
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {},
        webstore: {}
    };
    // Overwrite other navigator properties
    Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
    });
    // Override permissions API
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
        Promise.resolve({state: Notification.permission}) :
        originalQuery(parameters)
    );
    // Prevent iframe focus detection technique
    const originalFunction = HTMLIFrameElement.prototype.contentWindow;
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
        get() {
            const frame = originalFunction.call(this);
            try {
                if (this.src.indexOf('about:blank') !== -1) {
                    Object.defineProperty(frame, 'parent', {
                        get: () => null
                    });
                }
                return frame;
            } catch (e) {
                return frame;
            }
        }
    });
    """
    })
    return driver


def test_headless_browser_with_proxy():
    driver = get_stealth_chrome_driver()

    page = Bet365HomePage(driver)
    page = page.navigate()
    timestamp = datetime.now().timestamp()
    driver.save_screenshot(f"{output_directory}/bet365-{timestamp}.png")

    while isinstance(page, CloudflareChallengePage):
        page = page.handle_challenge(output_directory)

    wait_for_condition(get_obfuscated_files, lambda: save_timeout_screenshot_and_source(driver))
    latest_obfuscated_file_path = get_obfuscated_files()[-1]
    latest_obfuscated_contents = read_file_contents(latest_obfuscated_file_path)
    expected_obfuscated_contents = read_file_contents(javascript_directory / "obfuscated-new-raw.js")

    assert latest_obfuscated_contents == expected_obfuscated_contents

    driver.quit()


def save_timeout_screenshot_and_source(driver):
    timestamp = datetime.now().timestamp()
    driver.save_screenshot(f"{output_directory}/bet365-timeout-{timestamp}.png")
    with open(f"{output_directory}/bet365-timeout-{timestamp}.html", "w", encoding="utf-8") as file:
        file.write(driver.page_source)


def read_file_contents(file_path):
    with file_path.open("r", encoding="utf-8") as file:
        file_content = file.read()
    return file_content


def get_obfuscated_files():
    return [file for file in output_directory.glob("*.js") if file.open("r", encoding="utf-8").read(20).strip().startswith("(function()")]


def wait_for_condition(condition_function, timeout_function=None, timeout_seconds=60, interval_seconds=0.5):
    start = time.time()
    while time.time() - start < timeout_seconds:
        if condition_function():
            return True
        time.sleep(interval_seconds)
    if timeout_function:
        timeout_function()
    raise TimeoutError("Timeout error")
