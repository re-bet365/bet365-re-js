import subprocess
from datetime import datetime
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

current_directory = Path(__file__).parent.absolute()
project_root_directory = (current_directory / "../../../..").resolve()
script_directory = str((project_root_directory / "mitmproxy/src/python/main").absolute())
output_directory = str((project_root_directory / "output").absolute())
user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"


def start_mitmproxy():
    # Start mitmproxy in transparent mode
    process = subprocess.Popen(["mitmdump", "-s", f"{script_directory}/download-payload.py"])
    return process


@pytest.fixture(scope="session", autouse=True)
def setup_and_teardown():
    mitmproxy_process = start_mitmproxy()
    yield
    mitmproxy_process.terminate()


def test_headless_browser_with_proxy():
    # Configure headless browser with mitmproxy as proxy
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--proxy-server=http://localhost:8080")

    driver = webdriver.Chrome(options=chrome_options)

    # Test browser functionality (example: accessing a website)
    driver.get("https://www.bet365.com")
    timestamp = datetime.now().timestamp()
    driver.save_screenshot(f"{output_directory}/{timestamp}.png")

    driver.quit()


def test_headless_no_proxy():
    # Configure headless browser with mitmproxy as proxy
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--ignore-certificate-errors")

    driver = webdriver.Chrome(options=chrome_options)

    # Test browser functionality (example: accessing a website)
    driver.get("https://www.google.com")
    timestamp = datetime.now().timestamp()
    driver.save_screenshot(f"{output_directory}/{timestamp}.png")

    driver.quit()


def test_headless_with_proxy():
    # Configure headless browser with mitmproxy as proxy
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--proxy-server=http://localhost:8080")

    driver = webdriver.Chrome(options=chrome_options)

    # Test browser functionality (example: accessing a website)
    driver.get("https://www.google.com")
    timestamp = datetime.now().timestamp()
    driver.save_screenshot(f"{output_directory}/{timestamp}.png")

    driver.quit()
