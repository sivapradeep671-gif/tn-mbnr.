import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the landing page and show title', async ({ page }) => {
        await expect(page).toHaveTitle(/TN-MBNR/);
    });

    test('should allow a merchant to login with phone number', async ({ page }) => {
        // Find and click Login button in Navbar
        await page.click('button:has-text("Login")');

        // Fill login details
        await page.fill('input[type="tel"]', '9123456789');
        await page.selectOption('select', 'business');
        await page.click('button:has-text("Commit Identification")'); // Updated button text

        // Check for dashboard content
        await expect(page.locator('text=Management Console')).toBeVisible();
    });

    test('should show admin controls for admin role', async ({ page }) => {
        await page.click('button:has-text("Login")');

        await page.fill('input[type="tel"]', '9999988888');
        await page.selectOption('select', 'admin');
        await page.click('button:has-text("Commit Identification")');

        // Check for admin-specific content
        await expect(page.locator('text=Governance Intelligence Console')).toBeVisible();
        await expect(page.locator('text=Master Registry')).toBeVisible();
    });
});
