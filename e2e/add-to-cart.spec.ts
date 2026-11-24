import { expect, test } from "@playwright/test";

const CART_KEY = "solex:cart:v1";

test.beforeEach(async ({ page }) => {
  await page.goto("/cart");
  await page.evaluate(() => {
    localStorage.removeItem("solex:cart:v1");
  });
  await page.reload();
});

test("recommendation button updates Redux, badge, feedback, and persisted cart", async ({ page }) => {
  await expect(page.getByTestId("empty-cart")).toBeVisible();

  const recommendation = page.getByTestId("product-recommendation").filter({ hasText: "Nike Air Jordan 1" });
  const addButton = recommendation.getByTestId("add-to-cart-button");
  await expect(addButton).toHaveText("Add to Cart");
  await expect(page.locator(".sx-icon-btn--cart b")).toHaveCount(0);

  await addButton.click();
  await expect(addButton).toHaveText("Added to Bag");
  await expect(page.locator(".sx-icon-btn--cart b")).toHaveText("1");
  await expect(page.getByTestId("cart-item")).toHaveCount(1);
  await expect(page.getByTestId("cart-item").locator("output")).toHaveText("1");
  await expect(recommendation.getByTestId("add-to-cart-button")).toBeDisabled();
  await expect(recommendation).toContainText("In Cart · 1");

  await expect(addButton).toHaveText("Add Another", { timeout: 2500 });
  await addButton.click();
  await expect(addButton).toHaveText("Added to Bag");
  await expect(page.locator(".sx-icon-btn--cart b")).toHaveText("2");
  await expect(page.getByTestId("cart-item").locator("output")).toHaveText("2");

  await page.reload();
  const persistedRecommendation = page.getByTestId("product-recommendation").filter({ hasText: "Nike Air Jordan 1" });
  await expect(page.locator(".sx-icon-btn--cart b")).toHaveText("2");
  await expect(page.getByTestId("cart-item").locator("output")).toHaveText("2");
  await expect(persistedRecommendation.getByTestId("add-to-cart-button")).toHaveText("Add Another");
  expect(await page.evaluate((key) => localStorage.getItem(key), CART_KEY)).not.toBeNull();

  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole("heading", { name: /Shipping/ })).toBeVisible();
});

test("recommendation card and button fit the viewport", async ({ page }) => {
  await expect(page.getByTestId("product-recommendations")).toBeVisible();
  const card = page.getByTestId("product-recommendation").first();
  const button = card.getByTestId("add-to-cart-button");
  const geometry = await card.evaluate((element) => {
    const cardRect = element.getBoundingClientRect();
    const buttonRect = element.querySelector("button")!.getBoundingClientRect();
    return {
      cardRight: cardRect.right,
      buttonRight: buttonRect.right,
      viewportWidth: window.innerWidth,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    };
  });
  expect(geometry.cardRight).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.buttonRight).toBeLessThanOrEqual(geometry.cardRight + 1);
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
  await expect(button).toBeVisible();
});
