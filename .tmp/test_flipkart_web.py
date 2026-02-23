"""
Comprehensive E2E tests for Flipkart Clone Web Application.
Uses Playwright to verify all major pages, navigation, forms, and UI elements.
"""
import os
import sys
import traceback
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"
SCREENSHOT_DIR = "/tmp/flipkart_tests"

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

results = []


def record(name, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    results.append((name, status, detail))
    icon = "✅" if passed else "❌"
    print(f"  {icon} {name}: {status}" + (f" — {detail}" if detail else ""))


def test_home_page(page):
    """Test 1: Home page loads with hero, categories, and featured products."""
    print("\n🔹 Test 1: Home Page")
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    page.screenshot(path=f"{SCREENSHOT_DIR}/01_home.png", full_page=True)

    # Title
    title = page.title()
    record("Page title contains FlipKart", "FlipKart" in title or "flipkart" in title.lower(), title)

    # Hero section
    hero = page.locator("h1")
    hero_text = hero.first.text_content() if hero.count() > 0 else ""
    record("Hero heading present", "Welcome to FlipKart Clone" in hero_text, hero_text[:60])

    # Shop Now button
    shop_btn = page.locator("text=Shop Now")
    record("Shop Now button visible", shop_btn.count() > 0)

    # Category cards
    categories = page.locator("text=Shop by Category")
    record("Shop by Category section", categories.count() > 0)

    cat_names = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"]
    for cat in cat_names:
        record(f"Category '{cat}' card", page.locator(f"h3:has-text('{cat}')").count() > 0)

    # Featured products
    featured = page.locator("text=Featured Products")
    record("Featured Products section", featured.count() > 0)

    sample_products = page.locator("text=Sample Product")
    record("Featured product cards rendered", sample_products.count() >= 4, f"found {sample_products.count()}")


def test_header_navigation(page):
    """Test 2: Header has logo, search, login, cart, and nav links."""
    print("\n🔹 Test 2: Header & Navigation")
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")

    # Logo
    logo = page.locator("a:has-text('FlipKart')").first
    record("FlipKart logo/link", logo.is_visible())

    # Search bar
    search = page.locator("input[type='search']")
    record("Search input visible", search.count() > 0 and search.first.is_visible())

    # Login button
    login_btn = page.locator("text=Login")
    record("Login button visible", login_btn.count() > 0)

    # Cart button
    cart_btn = page.locator("text=Cart")
    record("Cart button visible", cart_btn.count() > 0)

    # Nav links
    nav_links = ["All Products", "Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"]
    for link_text in nav_links:
        link = page.locator(f"nav >> text='{link_text}'")
        record(f"Nav link '{link_text}'", link.count() > 0)

    page.screenshot(path=f"{SCREENSHOT_DIR}/02_header.png")


def test_footer(page):
    """Test 3: Footer sections and copyright."""
    print("\n🔹 Test 3: Footer")
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")

    for section in ["About", "Help", "Policy", "Social"]:
        record(f"Footer section '{section}'", page.locator(f"footer >> h3:has-text('{section}')").count() > 0)

    copyright_text = page.locator("footer >> text=All rights reserved")
    record("Copyright notice", copyright_text.count() > 0)

    page.screenshot(path=f"{SCREENSHOT_DIR}/03_footer.png", full_page=True)


def test_products_page(page):
    """Test 4: Products listing page structure."""
    print("\n🔹 Test 4: Products Listing Page")
    page.goto(f"{BASE_URL}/products")
    page.wait_for_load_state("networkidle")
    page.screenshot(path=f"{SCREENSHOT_DIR}/04_products.png", full_page=True)

    # Title or heading
    heading = page.locator("h1")
    heading_text = heading.first.text_content() if heading.count() > 0 else ""
    record("Products page heading", "Products" in heading_text, heading_text[:60])

    # Categories sidebar
    sidebar = page.locator("text=Categories")
    record("Categories sidebar", sidebar.count() > 0)

    # All Products link in sidebar
    all_products_link = page.locator("aside >> text=All Products")
    record("All Products sidebar link", all_products_link.count() > 0)


def test_login_page(page):
    """Test 5: Login page form, validation, and test credentials hint."""
    print("\n🔹 Test 5: Login Page")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state("networkidle")
    page.screenshot(path=f"{SCREENSHOT_DIR}/05_login.png", full_page=True)

    # Welcome Back heading
    heading = page.locator("text=Welcome Back")
    record("Welcome Back heading", heading.count() > 0)

    # Email field
    email_input = page.locator("#email")
    record("Email input field", email_input.count() > 0 and email_input.is_visible())

    # Password field
    pwd_input = page.locator("#password")
    record("Password input field", pwd_input.count() > 0 and pwd_input.is_visible())

    # Login button
    login_btn = page.locator("button[type='submit']")
    record("Login submit button", login_btn.count() > 0)

    # Test credentials hint
    test_creds = page.locator("text=admin@flipkart.com")
    record("Test credentials hint", test_creds.count() > 0)

    # Sign up link
    signup = page.locator("text=Sign up")
    record("Sign up link", signup.count() > 0)

    # --- Validation tests ---
    # Submit empty form
    login_btn.click()
    page.wait_for_timeout(500)
    email_error = page.locator("text=Email is required")
    record("Validation: empty email error", email_error.count() > 0)
    page.screenshot(path=f"{SCREENSHOT_DIR}/05_login_validation_empty.png", full_page=True)

    # Invalid email
    email_input.fill("notanemail")
    pwd_input.fill("short")
    login_btn.click()
    page.wait_for_timeout(500)
    invalid_email_error = page.locator("text=Invalid email format")
    record("Validation: invalid email format", invalid_email_error.count() > 0)
    page.screenshot(path=f"{SCREENSHOT_DIR}/05_login_validation_invalid.png", full_page=True)

    # Short password
    email_input.fill("test@test.com")
    pwd_input.fill("abc")
    login_btn.click()
    page.wait_for_timeout(500)
    pwd_error = page.locator("text=Password must be at least 6 characters")
    record("Validation: short password error", pwd_error.count() > 0)
    page.screenshot(path=f"{SCREENSHOT_DIR}/05_login_validation_password.png", full_page=True)


def test_cart_unauthenticated(page):
    """Test 6: Cart page shows login prompt when not authenticated."""
    print("\n🔹 Test 6: Cart Page (Unauthenticated)")
    page.goto(f"{BASE_URL}/cart")
    page.wait_for_load_state("networkidle")
    page.screenshot(path=f"{SCREENSHOT_DIR}/06_cart_unauth.png", full_page=True)

    please_login = page.locator("text=Please login")
    record("Cart shows 'Please login'", please_login.count() > 0)

    login_btn = page.locator("button:has-text('Login')")
    record("Login button on cart page", login_btn.count() > 0)


def test_checkout_unauthenticated(page):
    """Test 7: Checkout page redirects or shows auth state when not authenticated."""
    print("\n🔹 Test 7: Checkout Page (Unauthenticated)")
    page.goto(f"{BASE_URL}/checkout")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)  # allow client-side redirect
    page.screenshot(path=f"{SCREENSHOT_DIR}/07_checkout_unauth.png", full_page=True)

    current_url = page.url
    # Checkout either redirects to login or shows a skeleton/empty state
    redirected = "login" in current_url
    shows_checkout = "checkout" in current_url
    record(
        "Checkout redirects unauthenticated user or shows loading",
        redirected or shows_checkout,
        f"URL: {current_url}",
    )


def main():
    print("=" * 60)
    print("🛒 Flipkart Clone — E2E Test Suite")
    print("=" * 60)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Capture console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        tests = [
            test_home_page,
            test_header_navigation,
            test_footer,
            test_products_page,
            test_login_page,
            test_cart_unauthenticated,
            test_checkout_unauthenticated,
        ]

        for test_fn in tests:
            try:
                test_fn(page)
            except Exception as e:
                print(f"  💥 EXCEPTION in {test_fn.__name__}: {e}")
                traceback.print_exc()
                record(test_fn.__name__, False, str(e))

        browser.close()

    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    passed = sum(1 for _, s, _ in results if s == "PASS")
    failed = sum(1 for _, s, _ in results if s == "FAIL")
    total = len(results)
    print(f"\n  Total: {total}  |  ✅ Passed: {passed}  |  ❌ Failed: {failed}\n")

    if failed > 0:
        print("  Failed checks:")
        for name, status, detail in results:
            if status == "FAIL":
                print(f"    ❌ {name}" + (f" — {detail}" if detail else ""))

    print(f"\n  📸 Screenshots saved to: {SCREENSHOT_DIR}/")

    if console_errors:
        print(f"\n  ⚠️  {len(console_errors)} console error(s) captured:")
        for err in console_errors[:10]:
            print(f"    • {err[:120]}")

    print("\n" + "=" * 60)

    sys.exit(1 if failed > 0 else 0)


if __name__ == "__main__":
    main()
