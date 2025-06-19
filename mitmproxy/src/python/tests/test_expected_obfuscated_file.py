import subprocess
import time
from datetime import datetime
from pathlib import Path

import pytest
from playwright.sync_api import sync_playwright, ProxySettings, ViewportSize, Error

current_directory = Path(__file__).parent.absolute()
project_root_directory = (current_directory / "../../../..").resolve()
script_directory = (project_root_directory / "mitmproxy/src/python/main").absolute()
javascript_directory = (project_root_directory / "mitmproxy/src/javascript").absolute()
output_directory = (project_root_directory / "output").absolute()


def start_mitmproxy():
    # Start mitmproxy in transparent modes
    process = subprocess.Popen(["mitmdump", "-s", f"{script_directory}/download-payload.py"])
    return process


@pytest.fixture(scope="session", autouse=True)
def setup_and_teardown():
    # this will setup mitmproxy for this session, which can cause conflict if other tests spun up mitmproxy
    mitmproxy_process = start_mitmproxy()
    yield
    mitmproxy_process.terminate()


def configure_stealth_context(context):
    # Configure various evasions
    context.set_extra_http_headers({
        "Accept-Language": "en-US,en;q=0.9",
    })

    # Add scripts to evaluate on new document
    context.add_init_script("""
    Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
    });    
    window.chrome = {
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {},
        webstore: {}
    };
    Object.defineProperty(navigator, 'plugins', {
        get: () => {
            const plugins = {length: 5};
            for (let i = 0; i < plugins.length; i < plugins.length; i++) {
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
    """)
    return context


def handle_cloudflare_challenge(page):
    while True:
        # Check if we're on a Cloudflare challenge page
        if page.locator("#challenge-running, #challenge-stage, iframe[src*='challenges.cloudflare.com']").count() == 0:
            break

        timestamp = datetime.now().timestamp()
        page.screenshot(path=f"{output_directory}/{timestamp}-bet365-challenge.png")

        # Wait for spinner to disappear
        page.wait_for_selector("div[class*='spinner']", state="hidden", timeout=30000)

        # Handle Cloudflare iframe if present
        iframe_locator = page.frame_locator("iframe[src*='challenges.cloudflare.com']")
        if iframe_locator.count() > 0:
            checkbox = iframe_locator.locator("input[type='checkbox'],div.ctp-checkbox-label")
            if checkbox.is_visible():
                checkbox.click()

        # Wait for potential redirect after challenge
        page.wait_for_load_state("networkidle")
        timestamp = datetime.now().timestamp()
        page.screenshot(path=f"{output_directory}/{timestamp}-bet365-after-challenge.png")

        # Check if we're still on challenge page after short wait
        page.wait_for_timeout(5000)
        if page.locator("#challenge-running, #challenge-stage, iframe[src*='challenges.cloudflare.com']").count() == 0:
            break


@pytest.fixture(scope="session")
def playwright():
    with sync_playwright() as p:
        yield p


@pytest.fixture(scope="session")
def browser_context_session(playwright):
    browser = playwright.chromium.launch(
        headless=True,
        proxy=ProxySettings(
            server="localhost:8080"
        )
    )

    context = browser.new_context(
        viewport=ViewportSize(width=1920, height=1080),
        ignore_https_errors=True
    )

    configure_stealth_context(context)

    yield context
    browser.close()


@pytest.fixture(scope="session", autouse=True)
def setup_tracing(browser_context_session):
    results_dir = Path("test-results")
    results_dir.mkdir(exist_ok=True)

    browser_context_session.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True
    )

    yield

    browser_context_session.tracing.stop(path=results_dir / "trace.zip")


@pytest.fixture
def page(browser_context_session):
    page = browser_context_session.new_page()
    yield page


def retry_goto(page, url, max_retries=20, delay=0.5):
    last_error = None
    retryable_errors = [
        "ERR_PROXY_CONNECTION_FAILED",
        "ERR_CONNECTION_RESET"
    ]

    for _ in range(max_retries):
        try:
            return page.goto(url, timeout=30000)  # 30 second timeout for each attempt
        except Error as e:
            error_str = str(e)
            if any(err in error_str for err in retryable_errors):
                last_error = e
                time.sleep(delay)
                continue
            raise
    raise last_error


def test_headless_browser_with_proxy(page):
    # Navigate to Bet365 with retries
    retry_goto(page, "https://www.bet365.com")
    # Rest of your test code...
    timestamp = datetime.now().timestamp()
    page.screenshot(path=f"{output_directory}/{timestamp}-bet365.png")

    # Handle Cloudflare challenge
    handle_cloudflare_challenge(page)

    # Wait for and verify obfuscated file

    def get_obfuscated_files():
        return [file for file in output_directory.glob("*.js")
                if file.open("r", encoding="utf-8").read(20).strip().startswith("(function()")]

    def wait_for_condition(condition_func, timeout=60, interval=0.5):
        start = time.time()
        while time.time() - start < timeout:
            if condition_func():
                return True
            time.sleep(interval)
        raise TimeoutError("Condition not met within timeout")

    timestamp = datetime.now().timestamp()
    try:
        wait_for_condition(get_obfuscated_files)
    except TimeoutError:
        page.screenshot(path=f"{output_directory}/{timestamp}-bet365-timeout.png")
        raise

    latest_obfuscated_file_path = get_obfuscated_files()[-1]
    latest_obfuscated_contents = latest_obfuscated_file_path.read_text(encoding="utf-8").strip()
    expected_obfuscated_contents = (javascript_directory / "obfuscated-new-raw.js").read_text(encoding="utf-8").strip()

    assert latest_obfuscated_contents == expected_obfuscated_contents
