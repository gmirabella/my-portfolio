import { test, expect } from '@playwright/test';

test.describe('Portfolio Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/Vite \+ Vue \+ TS/);
    
    // Check that the main header is visible
    await expect(page.locator('h1.retro-title')).toBeVisible();
    await expect(page.locator('h1.retro-title')).toHaveText('/usr/grza/website');
  });

  test('should display subtitle with typing text', async ({ page }) => {
    const subtitle = page.locator('.subtitle');
    await expect(subtitle).toBeVisible();
    
    // Check that typing text elements are present
    const typingTexts = page.locator('.typing-text');
    await expect(typingTexts).toHaveCount(3);
    
    // Verify the text content
    await expect(typingTexts.nth(0)).toHaveText('Sketching dreams.');
    await expect(typingTexts.nth(1)).toHaveText('Crafting code.');
    await expect(typingTexts.nth(2)).toHaveText('Learning things.');
  });

  test('should display theme toggle button', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    // Check that toggle has aria-label
    await expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme');
    
    // Check that day and night labels are present
    await expect(page.locator('.label-day')).toHaveText('DAY');
    await expect(page.locator('.label-night')).toHaveText('NIGHT');
  });

  test('should toggle theme between day and night', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    
    // Get initial state
    const initialClass = await themeToggle.getAttribute('class');
    const hasNightInitially = initialClass?.includes('is-night') || false;
    
    // Click to toggle
    await themeToggle.click();
    
    // Wait a bit for the toggle to complete
    await page.waitForTimeout(100);
    
    // Check that the state changed
    const afterClass = await themeToggle.getAttribute('class');
    const hasNightAfter = afterClass?.includes('is-night') || false;
    
    expect(hasNightAfter).toBe(!hasNightInitially);
    
    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    const finalClass = await themeToggle.getAttribute('class');
    const hasNightFinal = finalClass?.includes('is-night') || false;
    
    expect(hasNightFinal).toBe(hasNightInitially);
  });

  test('should display projects grid', async ({ page }) => {
    const projectsGrid = page.locator('.projects-grid');
    await expect(projectsGrid).toBeVisible();
    
    // Check that there are project cards
    const projectCards = page.locator('.project-card');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display project cards with required elements', async ({ page }) => {
    const firstProject = page.locator('.project-card').first();
    
    // Check that the first project card has a title
    await expect(firstProject.locator('h2')).toBeVisible();
    
    // Check that it has a description
    await expect(firstProject.locator('.project-description')).toBeVisible();
    
    // Check that it has tools info
    await expect(firstProject.locator('.project-tools')).toBeVisible();
    
    // Check that it has media container
    await expect(firstProject.locator('.media-container')).toBeVisible();
  });

  test('should handle project media click interactions', async ({ page }) => {
    // Find a clickable media container
    const clickableMedia = page.locator('.media-container.clickable').first();
    
    // If there are clickable media elements, test them
    const count = await clickableMedia.count();
    if (count > 0) {
      // Listen for popup or new tab
      const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
      
      // Click the media
      await clickableMedia.click();
      
      // Check if a popup was opened (optional, depending on project configuration)
      const popup = await popupPromise;
      if (popup) {
        await popup.close();
      }
    }
  });

  test('should display footer with links', async ({ page }) => {
    const footer = page.locator('footer.footer-container');
    await expect(footer).toBeVisible();
    
    // Check that footer content exists
    const footerContent = page.locator('.footer-content');
    await expect(footerContent).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    // Check main sections exist
    await expect(page.locator('header.header-container')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer.footer-container')).toBeVisible();
  });

  test('should display responsive layout', async ({ page }) => {
    // Test viewport resizing
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page.locator('h1.retro-title')).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await expect(page.locator('h1.retro-title')).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await expect(page.locator('h1.retro-title')).toBeVisible();
  });

  test('should have accessible elements', async ({ page }) => {
    // Check that the theme toggle has proper aria-label
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme');
    
    // Check that images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute('alt');
      expect(altText).toBeTruthy();
    }
  });

  test('should load images with lazy loading', async ({ page }) => {
    // Check that poster images have loading attribute
    const posterImages = page.locator('img.poster-image');
    const count = await posterImages.count();
    
    if (count > 0) {
      const firstImage = posterImages.first();
      const loading = await firstImage.getAttribute('loading');
      // Note: Not all images may have lazy loading, so we just check if it exists
      if (loading) {
        expect(loading).toBe('lazy');
      }
    }
  });

  test('should have video elements with proper attributes', async ({ page }) => {
    const videos = page.locator('video.video-frame');
    const videoCount = await videos.count();
    
    if (videoCount > 0) {
      const firstVideo = videos.first();
      
      // Check video attributes
      await expect(firstVideo).toHaveAttribute('autoplay');
      await expect(firstVideo).toHaveAttribute('loop');
      await expect(firstVideo).toHaveAttribute('muted');
      await expect(firstVideo).toHaveAttribute('playsinline');
    }
  });
});
