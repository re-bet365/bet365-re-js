from datetime import datetime
from pathlib import Path

import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import WebDriverWait

from .base_page import BasePage


class CloudflareChallengePage(BasePage):
    current_directory = Path(__file__).parent.absolute()
    project_root_directory = (current_directory / "../../../../..").resolve()
    output_directory = (project_root_directory / "output").absolute()
    """Page object for handling Cloudflare security challenges"""

    # Locators
    TURNSTILE_IFRAME = (By.CSS_SELECTOR, "iframe[src*='challenges.cloudflare.com']")
    TURNSTILE_CHECKBOX = (By.CSS_SELECTOR, "input[type='checkbox'],div.ctp-checkbox-label")
    TURNSTILE_CHALLENGE = (By.CSS_SELECTOR, ".ctp-challenge")
    CHALLENGE_IMAGE = (By.CSS_SELECTOR, "img.ctp-image")
    CHALLENGE_OPTIONS = (By.CSS_SELECTOR, ".answer-example,.task-example")
    CHALLENGE_VERIFY_BUTTON = (By.CSS_SELECTOR, "button[type='submit'],.ctp-submit-button")
    CHALLENGE_LOADING = (By.CSS_SELECTOR, ".ctp-loading")
    CHALLENGE_SUCCESS = (By.CSS_SELECTOR, ".success-icon")

    def __init__(self, driver, redirect_page):
        super().__init__(driver)
        self.redirect_page = redirect_page
        self.follow_link = str(self.driver.execute_script("return window._cf_chl_opt.fa"))

    def is_cloudflare_page(self):
        """Check if we are on a Cloudflare challenge page"""
        return (self.is_element_present((By.CSS_SELECTOR, "#challenge-running")) or
                self.is_element_present((By.CSS_SELECTOR, "#challenge-stage")) or
                self.is_element_present(self.TURNSTILE_IFRAME))

    def wait_for_challenge_to_appear(self, timeout=10):
        """Wait for the Cloudflare challenge to appear"""
        return self.is_element_present(self.TURNSTILE_IFRAME, timeout)

    def switch_to_iframe(self):
        """Switch to the Cloudflare iframe if it exists"""
        print("waiting for cloudflare iframe")
        self.save_screenshot_and_source(f"{self.output_directory}/bet365-before-iframe-switch-{datetime.now().timestamp()}")
        iframe = self.wait_for_element(self.TURNSTILE_IFRAME)
        if iframe:
            try:
                self.driver.switch_to.frame(iframe)
                return True
            except Exception as e:
                print(f"Failed to switch to iframe: {e}")
                return False
        print("cloudflare iframe was not present")
        return False

    def switch_to_default_content(self):
        """Switch back to the main content"""
        self.driver.switch_to.default_content()

    def solve_checkbox_challenge(self):
        """Solve the simple checkbox challenge"""
        if self.switch_to_iframe():
            turnstile_checkbox_present = self.is_element_present(self.TURNSTILE_CHECKBOX)
            print("turnstile checkbox present: " + turnstile_checkbox_present)
            if turnstile_checkbox_present:
                success = self.safe_click(self.TURNSTILE_CHECKBOX)
                print("turnstile checkbox click success: " + success)
                self.switch_to_default_content()
                return success
            self.switch_to_default_content()
        return False

    def wait_for_challenge_completion(self, timeout=30):
        """Wait for the challenge to be completed automatically or via timeout"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            if not self.is_cloudflare_page():
                return True
            time.sleep(1)
        return False

    def handle_challenge(self, output_directory):
        print("Cloudflare challenge detected, attempting to solve...")

        if self.is_cloudflare_page():
            # original_window_handle = self.driver.current_window_handle
            # self.driver.switch_to.new_window("tab")
            # latest_window_handle = self.driver.window_handles[-1]
            # self.driver.get(self.follow_link)
            # self.wait_for_page_load()
            print("follow_link: " + self.follow_link)
            timestamp = datetime.now().timestamp()
            self.driver.save_screenshot(f"{output_directory}/bet365-challenge-{timestamp}.png")

        # Wait for the spinner to disappear first
        WebDriverWait(self.driver, 30).until_not(
            ec.presence_of_element_located((By.CSS_SELECTOR, "div[class*='spinner']"))
        )
        timestamp = datetime.now().timestamp()
        self.driver.save_screenshot(f"{output_directory}/bet365-challenge-spinner-gone-{timestamp}.png")

        # Try checkbox challenge first
        if self.solve_checkbox_challenge():
            print("Checkbox challenge completed")
            if self.wait_for_challenge_completion(5) and not self.is_cloudflare_page():
                return self.redirect_page

        self.driver.save_screenshot(f"{output_directory}/bet365-after-checkbox-{timestamp}.png")

        # If still on challenge page, wait longer for it to resolve
        print("Waiting for challenge to complete...")
        if self.wait_for_challenge_completion(20) and not self.is_cloudflare_page():
            return self.redirect_page

        self.driver.save_screenshot(f"{output_directory}/bet365-challenge-end-{timestamp}.png")

        return self
