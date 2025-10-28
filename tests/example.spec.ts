import { test, expect } from '@playwright/test';

/**
 * Example test file demonstrating how to write additional Playwright tests
 * 
 * This file serves as a template for adding new test suites to the project.
 * Copy this file and modify it to test new features or components.
 */

test.describe('Example Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // This runs before each test in this describe block
    await page.goto('/');
  });

  test.skip('example test - basic page interaction', async ({ page }) => {
    // Use test.skip() for tests that are works in progress
    // Remove .skip when the test is ready
    
    // Example: Click on an element
    // await page.click('.some-button');
    
    // Example: Fill a form field
    // await page.fill('input[name="email"]', 'test@example.com');
    
    // Example: Check if text is visible
    // await expect(page.locator('text=Success')).toBeVisible();
  });

  test.skip('example test - checking element attributes', async ({ page }) => {
    // Example: Get an element's attribute
    // const href = await page.getAttribute('a.some-link', 'href');
    // expect(href).toBe('https://example.com');
    
    // Example: Check if element has specific class
    // await expect(page.locator('.some-element')).toHaveClass(/active/);
  });

  test.skip('example test - working with lists', async ({ page }) => {
    // Example: Count elements
    // const items = page.locator('.list-item');
    // expect(await items.count()).toBeGreaterThan(0);
    
    // Example: Iterate through elements
    // const count = await items.count();
    // for (let i = 0; i < count; i++) {
    //   await expect(items.nth(i)).toBeVisible();
    // }
  });

  test.skip('example test - waiting for conditions', async ({ page }) => {
    // Example: Wait for element to be visible
    // await page.waitForSelector('.dynamic-content', { state: 'visible' });
    
    // Example: Wait for a specific timeout
    // await page.waitForTimeout(1000);
    
    // Example: Wait for network to be idle
    // await page.waitForLoadState('networkidle');
  });

  test.skip('example test - screenshots and debugging', async ({ page }) => {
    // Example: Take a screenshot
    // await page.screenshot({ path: 'screenshot.png' });
    
    // Example: Take a screenshot of a specific element
    // await page.locator('.some-element').screenshot({ path: 'element.png' });
    
    // Example: Get page content for debugging
    // const content = await page.content();
    // console.log(content);
  });
});

/**
 * Useful Playwright Commands:
 * 
 * Run all tests:
 *   npm test
 * 
 * Run tests in UI mode (interactive):
 *   npm run test:ui
 * 
 * Run tests in headed mode (see browser):
 *   npm run test:headed
 * 
 * Run tests in debug mode:
 *   npm run test:debug
 * 
 * Run specific test file:
 *   npx playwright test example.spec.ts
 * 
 * Run tests matching a pattern:
 *   npx playwright test --grep "example test"
 * 
 * Generate code with Playwright codegen:
 *   npx playwright codegen http://localhost:5173
 */
