from .base_page import BasePage
from .cloudflare_challenge_page import CloudflareChallengePage


class Bet365HomePage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.url = "https://www.bet365.com"

    def navigate(self):
        """Navigate to Bet365 homepage"""
        self.driver.get(self.url)
        self.wait_for_page_load()

        # Check if we're on Cloudflare challenge page by page title
        if self.driver.title == "Just a moment...":
            return CloudflareChallengePage(self.driver, self)

        return self
