import { expect, test, type Page } from "@playwright/test";

const CART_KEY = "solex:cart:v1";

async function seedCart(page: Page, items: unknown[]) {
  await page.goto("/cart");
  await page.evaluate(
    ([key, value]) => localStorage.setItem(key, value),
    [CART_KEY, JSON.stringify({ version: 1, cart: { items } })] as const
  );
  await page.reload();
}

const threeItems = [
  { productId: 1, quantity: 1, size: 42, color: "Red", selected: true },
  { productId: 2, quantity: 2, size: 41, color: "White", selected: true },
  { productId: 3, quantity: 1, size: 43, color: "Black", selected: true },
];

test.beforeEach(async ({ page }) => {
  await page.goto("/cart");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test("visual: demo cart screenshot", async ({ page }, testInfo) => {
  await page.goto("/cart?demo=cart");
  await expect(page.getByTestId("cart-item")).toHaveCount(3);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `test-results/cart-${testInfo.project.name}.png`, fullPage: true });
  // Demo data must never be persisted.
  expect(await page.evaluate((key) => localStorage.getItem(key), CART_KEY)).toBeNull();
});

test("empty cart is handled and checkout is blocked", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByTestId("empty-cart")).toBeVisible();
  await expect(page.getByRole("button", { name: "Proceed to Checkout" })).toBeDisabled();
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/cart$/);
});

test("picker switches the sneaker with a flip transition, safely under rapid clicks", async ({ page }) => {
  await seedCart(page, threeItems);
  const hero = page.getByTestId("hero-sneaker");
  const thumbs = page.locator(".sx-picker__thumb");
  await expect(page.getByText("Choose your sneaker")).toBeVisible();
  await expect(thumbs).toHaveCount(3);

  await thumbs.nth(2).click();
  await expect(hero).toHaveAttribute("data-phase", "exit");
  await expect(hero).toHaveAttribute("data-product-id", "3");
  await expect(hero).toHaveAttribute("data-phase", "idle");

  for (let k = 0; k < 12; k++) await thumbs.nth(k % 3).click();
  await thumbs.nth(1).click();
  await expect(hero).toHaveAttribute("data-product-id", "2", { timeout: 6000 });
  await expect(hero).toHaveAttribute("data-phase", "idle", { timeout: 6000 });

  // Rests tilted and completely still.
  await page.waitForTimeout(300);
  const first = await hero.screenshot();
  await page.waitForTimeout(800);
  expect(await hero.screenshot()).toEqual(first);
});

test("hero sneaker keeps its aspect ratio and never overlaps the picker or cart", async ({ page }) => {
  await seedCart(page, threeItems);
  for (const index of [0, 1, 2]) {
    await page.locator(".sx-picker__thumb").nth(index).click();
    await expect(page.getByTestId("hero-sneaker")).toHaveAttribute("data-phase", "idle");
    const r = await page.evaluate(() => {
      const img = document.querySelector<HTMLImageElement>(".sx-shoe__img")!;
      const box = img.getBoundingClientRect();
      const picker = document.querySelector(".sx-picker")!.getBoundingClientRect();
      return { ratio: img.offsetWidth / img.offsetHeight, natural: img.naturalWidth / img.naturalHeight, w: img.offsetWidth, nw: img.naturalWidth, bottom: box.bottom, pickerTop: picker.top };
    });
    expect(Math.abs(r.ratio - r.natural)).toBeLessThan(0.02);
    expect(r.w).toBeLessThanOrEqual(r.nw * 1.15 + 1);
    expect(r.bottom).toBeLessThanOrEqual(r.pickerTop);
  }
});

test("quantity, variants, remove, clear and persistence", async ({ page }) => {
  await seedCart(page, threeItems);
  await expect(page.getByTestId("summary-total")).toHaveText("$529.96");

  const jordan = page.getByTestId("cart-item").filter({ hasText: "Nike Air Jordan 1" });
  await jordan.getByRole("button", { name: "Increase quantity" }).click();
  await expect(jordan.locator("output")).toHaveText("2");
  await expect(page.getByTestId("summary-total")).toHaveText("$709.95");

  await jordan.getByRole("button", { name: "Size 44" }).click();
  await expect(jordan.getByRole("button", { name: "Size 44" })).toHaveAttribute("aria-pressed", "true");
  await jordan.getByRole("button", { name: "Color Black" }).click();
  await expect(jordan.getByRole("button", { name: "Color Black" })).toHaveAttribute("aria-pressed", "true");
  // Unsupported sizes are simply not offered (Jordan has no size 45).
  await expect(jordan.getByRole("button", { name: "Size 45" })).toHaveCount(0);

  await page.reload();
  const reloaded = page.getByTestId("cart-item").filter({ hasText: "Nike Air Jordan 1" });
  await expect(reloaded.locator("output")).toHaveText("2");
  await expect(reloaded.getByRole("button", { name: "Size 44" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Remove Adidas Samba OG" }).click();
  await expect(page.getByTestId("cart-item")).toHaveCount(2);
  await page.getByRole("button", { name: "Clear Cart" }).click();
  await expect(page.getByTestId("empty-cart")).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("empty-cart")).toBeVisible();
});

test("checkout validates with Zod and places a simulated order", async ({ page }) => {
  await seedCart(page, threeItems);
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByRole("alert")).toContainText("Please fix");
  const name = page.getByLabel("Full name");
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription("Enter your full name.");

  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Email address").blur();
  await expect(page.getByLabel("Email address")).toHaveAccessibleDescription("Enter a valid email address.");

  await name.fill("Alex Morgan");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Phone number").fill("+961 70 123 456");
  await page.getByLabel("Street address").fill("12 Hamra Street");
  await page.getByLabel("City").fill("Beirut");
  await page.getByRole("button", { name: /Place order/ }).click();

  await expect(page).toHaveURL(/\/order-confirmation$/);
  await expect(page.getByRole("heading", { name: /Order SX-/ })).toBeVisible();
  await expect(page.getByText("No payment was taken")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /Order SX-/ })).toBeVisible();

  await page.getByRole("link", { name: "Back to cart" }).click();
  await expect(page.getByTestId("empty-cart")).toBeVisible();
});
