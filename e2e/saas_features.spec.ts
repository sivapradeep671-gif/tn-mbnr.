import { test, expect } from '@playwright/test';

test.describe('SaaS Platform Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should allow switching between district nodes', async ({ page }) => {
        // Find tenant selector
        const selector = page.locator('button:has-text("Active Tenant")');
        await expect(selector).toBeVisible();
        
        // Open selector
        await selector.click();
        
        // Switch to Madurai
        await page.click('text=Madurai Municipality');
        
        // Check if banner updated
        await expect(page.locator('text=Enterprise Build – Madurai Municipality')).toBeVisible();
    });

    test('should navigate to and display the SaaS Marketplace', async ({ page }) => {
        // Click Services link in Navbar
        await page.click('button:has-text("Services")');
        
        // Check for Marketplace title
        await expect(page.locator('text=Enable Digital Services')).toBeVisible();
        
        // Verify multiple modules are present
        const modules = page.locator('.group.relative.bg-slate-900/40');
        await expect(modules).toHaveCount(6);
    });

    test('should navigate to and display SaaS Pricing plans', async ({ page }) => {
        // Click Pricing link in Navbar
        await page.click('button:has-text("Pricing")');
        
        // Check for Pricing title
        await expect(page.locator('text=Governance As A Service')).toBeVisible();
        
        // Verify pricing tiers
        await expect(page.locator('text=Township')).toBeVisible();
        await expect(page.locator('text=Smart City')).toBeVisible();
        await expect(page.locator('text=State Enterprise')).toBeVisible();
    });

    test('should show SaaS Control Center for admin users', async ({ page }) => {
        // Login as admin
        await page.click('button:has-text("Login")');
        await page.fill('input[type="tel"]', '9999988888');
        await page.selectOption('select', 'admin');
        await page.click('button:has-text("Commit Identification")');
        
        // Navigate to Control Center
        await page.click('button:has-text("Control Center")');
        
        // Check for Admin Dashboard elements
        await expect(page.locator('text=Managed District Nodes')).toBeVisible();
        await expect(page.locator('text=Global Node Management')).toBeVisible();
    });
});
