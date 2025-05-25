import time

from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
from selenium.webdriver import ActionChains
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait


class BasePage:
    """Base class that all page models can inherit from"""

    def __init__(self, driver):
        self.driver = driver

    def wait_for_element(self, locator, timeout=20):
        """Wait for an element to be present and visible"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                ec.visibility_of_element_located(locator)
            )
            return element
        except TimeoutException:
            print(f"Element {locator} not visible after {timeout} seconds")
            return None

    def wait_for_clickable(self, locator, timeout=20):
        """Wait for an element to be clickable"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                ec.element_to_be_clickable(locator)
            )
            return element
        except TimeoutException:
            print(f"Element {locator} not clickable after {timeout} seconds")
            return None

    def is_element_present(self, locator, timeout=5):
        """Check if element is present with a shorter timeout"""
        try:
            WebDriverWait(self.driver, timeout).until(
                ec.presence_of_element_located(locator)
            )
            return True
        except TimeoutException:
            return False

    def wait_for_page_load(self, timeout=30):
        """Wait for page to finish loading"""
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            return True
        except TimeoutException:
            print(f"Page did not load completely after {timeout} seconds")
            return False

    def wait_for_url_change(self, current_url, timeout=30):
        """Wait for URL to change from current URL"""
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda d: d.current_url != current_url
            )
            return True
        except TimeoutException:
            print(f"URL did not change from {current_url} after {timeout} seconds")
            return False

    def safe_click(self, locator, timeout=20):
        """Safely click an element by waiting for it to be clickable first"""
        element = self.wait_for_clickable(locator, timeout)
        if element:
            try:
                element.click()
                return True
            except (StaleElementReferenceException, TimeoutException):
                # Try with JavaScript if regular click fails
                try:
                    self.driver.execute_script("arguments[0].click();", element)
                    return True
                except Exception as e:
                    print(f"Failed to click element {locator}: {e}")
                    return False
        return False

    def move_to_element(self, locator, timeout=20):
        """Move mouse to element"""
        element = self.wait_for_element(locator, timeout)
        if element:
            try:
                ActionChains(self.driver).move_to_element(element).perform()
                return True
            except Exception as e:
                print(f"Failed to move to element {locator}: {e}")
                return False
        return False

    def get_cookies(self):
        """Get all cookies"""
        return self.driver.get_cookies()

    def accept_cookies(self, cookie_accept_locator):
        """Handle cookie consent popup if it appears"""
        if self.is_element_present(cookie_accept_locator):
            self.safe_click(cookie_accept_locator)
            time.sleep(1)  # Allow time for cookie banner to disappear

    def save_page_source(self, file_name):
        with open(file_name, "w", encoding="utf-8") as file:
            file.write(self.driver.page_source)

    def save_screenshot(self, file_name):
        self.driver.save_screenshot(file_name)

    def save_screenshot_and_source(self, file_name):
        self.save_screenshot(file_name + ".png")
        self.save_page_source(file_name + ".html")
