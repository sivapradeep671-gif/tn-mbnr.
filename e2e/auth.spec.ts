import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should load the landing page and show title', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/TrustReg TN/);
    });

    test('should allow a merchant to login with phone number', async ({ page }) => {
        await page.goto('/login'); // Assuming the route is /login

        // Fill login details
        await page.fill('input[type="tel"]', '9123456789');
        await page.selectOption('select', 'business');
        await page.click('button:has-text("Login")');

        // Check for dashboard redirection (Merchant Dashboard)
        await expect(page).toHaveURL(/.*merchant/);
    });

    test('should show admin controls for admin role', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="tel"]', '9999988888');
        await page.selectOption('select', 'admin');
        await page.click('button:has-text("Login")');

        // Redirect to admin dashboard
        await expect(page).toHaveURL(/.*admin/);
        await expect(page.locator('text=Master Registry')).toBeVisible();
    });
});
