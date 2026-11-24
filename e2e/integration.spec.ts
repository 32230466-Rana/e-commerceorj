import { expect, test, type Page } from "@playwright/test";

/**
 * End-to-end journeys across all three developers' work:
 * Section A (Home, header, footer), Developer B (Products, wishlist drawer)
 * and Developer C (Cart, Checkout, Order Confirmation).
 * Runs in the desktop, tablet and mobile projects from playwright.config.ts.
 */

const header = (page: Page) => page.locator(".site-header");
const cartBadge = (page: Page) => page.locator(".site-header a[href='/cart'] .icon-count");
const wishlistBadge = (page: Page) => page.locator(".site-header a[href='/wishlist'] .icon-count");
const devBCard = (page: Page, name: string) => page.locator(".devb-card").filter({ hasText: name });
const cartItem = (page: Page, name: string) => page.getByTestId("cart-item").filter({ hasText: name });

/** Uses the header navigation; on narrow screens the links sit behind the menu button. */
async function navigate(page: Page, linkName: string) {
  const menu = header(page).getByRole("button", { name: "Open navigation" });
  if (await menu.isVisible()) await menu.click();
  await header(page).getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: linkName, exact: true }).click();
}

/** Console errors that matter. External images and fonts may be unavailable offline. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (/images\.unsplash\.com|fonts\.(googleapis|gstatic)\.com|net::ERR_/.test(text)) return;
    errors.push(text);
  });
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
});

test("Journey 1 — shopping: Home → Products → Cart, quantity, variants, remove", async ({ page }) => {
  const errors = trackErrors(page);
  await expect(page.locator(".home-hero")).toBeVisible();
  await expect(cartBadge(page)).toHaveCount(0);

  await navigate(page, "Shop all");
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.locator(".devb-card")).toHaveCount(8);

  // Select a sneaker with Developer B's search, then add it to the shared cart.
  await page.getByPlaceholder(/Search shoes/i).fill("Retro Skate");
  await expect(page.locator(".devb-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Add Retro Skate Classic Low to cart" }).click();
  await expect(cartBadge(page)).toHaveText("1");

  await header(page).getByRole("link", { name: /^Cart, 1 items/ }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByTestId("cart-item")).toHaveCount(1);
  await expect(page.getByTestId("summary-total")).toHaveText("$103.00"); // $95 + $8 shipping

  // Quantity updates the line, the total and the header badge together.
  const skate = cartItem(page, "Retro Skate Classic Low");
  await skate.getByRole("button", { name: "Increase quantity" }).click();
  await expect(skate.locator("output")).toHaveText("2");
  await expect(cartBadge(page)).toHaveText("2");
  await expect(page.getByTestId("summary-total")).toHaveText("$190.00");

  // Developer B's products have no variants; a Developer C product does.
  await expect(skate.getByRole("button", { name: /^Size / })).toHaveCount(0);
  await page.getByTestId("product-recommendation").filter({ hasText: "Nike Air Jordan 1" }).getByTestId("add-to-cart-button").click();
  const jordan = cartItem(page, "Nike Air Jordan 1");
  await jordan.getByRole("button", { name: "Size 43" }).click();
  await expect(jordan.getByRole("button", { name: "Size 43" })).toHaveAttribute("aria-pressed", "true");
  await jordan.getByRole("button", { name: "Color Black" }).click();
  await expect(jordan.getByRole("button", { name: "Color Black" })).toHaveAttribute("aria-pressed", "true");
  await expect(cartBadge(page)).toHaveText("3");

  await page.getByRole("button", { name: "Remove Retro Skate Classic Low" }).click();
  await expect(page.getByTestId("cart-item")).toHaveCount(1);
  await expect(cartBadge(page)).toHaveText("1");
  await expect(page.getByTestId("summary-total")).toHaveText("$179.99");

  expect(errors).toEqual([]);
});

test("Journey 2 — wishlist is shared by Home, Products, the drawer and the Wishlist page", async ({ page }) => {
  const errors = trackErrors(page);

  // Section A card on Home.
  const homeCard = page.locator(".featured-grid .product-card").first();
  const heart = homeCard.getByRole("button", { name: /to wishlist$/ });
  const homeName = (await heart.getAttribute("aria-label"))!.replace(/^Add (.*) to wishlist$/, "$1");
  await heart.click();
  await expect(wishlistBadge(page)).toHaveText("1");

  // Developer B card on Products.
  await navigate(page, "Shop all");
  await devBCard(page, "Neon Air Pulse V2").getByRole("button", { name: "Add to Wishlist" }).click();
  await expect(wishlistBadge(page)).toHaveText("2");
  await page.getByRole("button", { name: /Open wishlist, 2 items/ }).click();
  await expect(page.locator(".wishlist-drawer")).toContainText("Neon Air Pulse V2");
  await expect(page.locator(".wishlist-drawer")).toContainText(homeName);
  await page.getByRole("button", { name: "Close wishlist drawer" }).click();

  await header(page).getByRole("link", { name: /^Wishlist, 2 items/ }).click();
  await expect(page).toHaveURL(/\/wishlist$/);
  const grid = page.locator(".wishlist-grid");
  await expect(grid.locator(":scope > *")).toHaveCount(2);
  await expect(grid).toContainText("Neon Air Pulse V2");
  await expect(grid).toContainText(homeName);

  // Persists across a reload.
  await page.reload();
  await expect(grid.locator(":scope > *")).toHaveCount(2);

  // Remove both and check the empty state.
  await devBCard(page, "Neon Air Pulse V2").getByRole("button", { name: "Remove from Wishlist" }).click();
  await expect(grid.locator(":scope > *")).toHaveCount(1);
  await expect(grid).not.toContainText("Neon Air Pulse V2");
  await grid.getByRole("button", { name: `Remove ${homeName} from wishlist` }).click();
  await expect(page.getByRole("heading", { name: "Nothing saved. Yet." })).toBeVisible();
  await expect(wishlistBadge(page)).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("Journey 3 — checkout: totals, validation, order confirmation, purchased lines leave the cart", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/products");
  await page.getByRole("button", { name: "Add Retro Skate Classic Low to cart" }).click();
  await page.getByRole("button", { name: "Add Cyber Horizon High-Top to cart" }).click();
  await expect(cartBadge(page)).toHaveText("2");

  await page.goto("/cart");
  await page.getByTestId("product-recommendation").filter({ hasText: "Nike Air Jordan 1" }).getByTestId("add-to-cart-button").click();
  await expect(page.getByTestId("cart-item")).toHaveCount(3);
  // Keep the Jordan in the cart but out of this order.
  await page.getByRole("checkbox", { name: "Include Nike Air Jordan 1 in checkout" }).uncheck();
  await expect(page.getByTestId("summary-total")).toHaveText("$335.00"); // 95 + 240, free shipping

  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  const summary = page.locator(".sx-mini-summary");
  await expect(summary).toContainText("Retro Skate Classic Low");
  await expect(summary).toContainText("Cyber Horizon High-Top");
  await expect(summary).not.toContainText("Nike Air Jordan 1");
  await expect(summary).toContainText("$335.00");
  await expect(page.getByRole("button", { name: /Place order · \$335\.00/ })).toBeVisible();

  // Invalid input is blocked with field-level messages.
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Please fix" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Email address").blur();
  await expect(page.getByLabel("Email address")).toHaveAccessibleDescription("Enter a valid email address.");
  await page.getByLabel("Phone number").fill("abc");
  await page.getByLabel("Phone number").blur();
  await expect(page.getByLabel("Phone number")).toHaveAccessibleDescription(/Enter a valid phone number/);
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Phone number").fill("+961 70 123 456");
  await page.getByLabel("Street address").fill("12 Hamra Street");
  await page.getByLabel("City").fill("Beirut");
  await page.getByRole("button", { name: /Place order/ }).click();

  await expect(page).toHaveURL(/\/order-confirmation$/);
  await expect(page.getByRole("heading", { name: /Order SX-/ })).toBeVisible();
  const receipt = page.locator(".sx-receipt");
  await expect(receipt).toContainText("Retro Skate Classic Low");
  await expect(receipt).toContainText("Cyber Horizon High-Top");
  await expect(receipt).toContainText("$335.00");

  // Only the purchased lines left the cart.
  await expect(cartBadge(page)).toHaveText("1");
  await page.goto("/cart");
  await expect(page.getByTestId("cart-item")).toHaveCount(1);
  await expect(page.getByTestId("cart-item")).toContainText("Nike Air Jordan 1");

  expect(errors).toEqual([]);
});

test("Journey 4 — routes, refresh persistence, broken routes and console errors", async ({ page }) => {
  const errors = trackErrors(page);
  const routes: Array<[string, string]> = [
    ["/", ".home-hero"],
    ["/products", ".products-page-container"],
    ["/wishlist", ".wishlist-grid, .empty-state"],
    ["/cart", "[data-testid='empty-cart'], [data-testid='cart-item']"],
    ["/about", ".about-hero"],
  ];

  await page.goto("/products");
  await page.getByRole("button", { name: "Add Neon Air Pulse V2 to cart" }).click();
  await devBCard(page, "Neon Air Pulse V2").getByRole("button", { name: "Add to Wishlist" }).click();

  for (const [path, selector] of routes) {
    await page.goto(path);
    await expect(header(page).locator(".brand-wordmark")).toHaveText("SOLEX");
    await expect(page.locator(selector).first()).toBeVisible();
    await page.reload();
    await expect(page.locator(selector).first()).toBeVisible();
    await expect(cartBadge(page)).toHaveText("1");
    await expect(wishlistBadge(page)).toHaveText("1");
    await expect(page.locator(".not-found")).toHaveCount(0);
  }

  // Header navigation (behind the menu button on narrow screens).
  await page.goto("/");
  for (const [link, url] of [["Shop all", /\/products$/], ["Our story", /\/about$/], ["Home", /\/$/]] as const) {
    await navigate(page, link);
    await expect(page).toHaveURL(url);
  }
  // Footer links.
  for (const [link, url] of [["All sneakers", /\/products$/], ["Your bag", /\/cart$/], ["Wishlist", /\/wishlist$/]] as const) {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: link, exact: true }).click();
    await expect(page).toHaveURL(url);
  }

  // Unknown routes show the 404 page; checkout with nothing selected returns to the cart.
  await page.goto("/does-not-exist");
  await expect(page.locator(".not-found")).toBeVisible();
  await page.goto("/order-confirmation");
  await expect(page).not.toHaveURL(/\/order-confirmation$/);
  await page.evaluate(() => localStorage.removeItem("solex:cart:v1"));
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/cart$/);

  // No horizontal overflow on any page at this viewport.
  for (const [path] of routes) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1);
  }

  expect(errors).toEqual([]);
});
