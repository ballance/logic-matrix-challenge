const { test, expect } = require('@playwright/test');

test.describe('Pause and Resume Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('#startTest');
  });

  test('should show pause button during test', async ({ page }) => {
    await expect(page.locator('#pauseBtn')).toBeVisible();
    await expect(page.locator('#pauseBtn')).toHaveText('Pause');
  });

  test('should pause test when clicking pause button', async ({ page }) => {
    // Click pause button
    await page.click('#pauseBtn');
    
    // Check pause overlay is visible
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    await expect(page.locator('.pause-content h2')).toHaveText('Test Paused');
    await expect(page.locator('#resumeBtn')).toBeVisible();
  });

  test('should resume test when clicking resume button', async ({ page }) => {
    // Pause the test
    await page.click('#pauseBtn');
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    
    // Resume the test
    await page.click('#resumeBtn');
    
    // Check pause overlay is hidden
    await expect(page.locator('#pauseOverlay')).toBeHidden();
    
    // Check test screen is still visible
    await expect(page.locator('#testScreen')).toBeVisible();
  });

  test('should pause with spacebar', async ({ page }) => {
    // Press spacebar
    await page.keyboard.press(' ');
    
    // Check pause overlay is visible
    await expect(page.locator('#pauseOverlay')).toBeVisible();
  });

  test('should resume with spacebar when paused', async ({ page }) => {
    // Pause with spacebar
    await page.keyboard.press(' ');
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    
    // Resume with spacebar
    await page.keyboard.press(' ');
    await expect(page.locator('#pauseOverlay')).toBeHidden();
  });

  test('should resume with Enter key when paused', async ({ page }) => {
    // Pause the test
    await page.click('#pauseBtn');
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    
    // Resume with Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('#pauseOverlay')).toBeHidden();
  });

  test('should clear pause with Escape key', async ({ page }) => {
    // Pause the test
    await page.click('#pauseBtn');
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    
    // Clear with Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('#pauseOverlay')).toBeHidden();
  });

  test('should resume when clicking outside pause dialog', async ({ page }) => {
    // Pause the test
    await page.click('#pauseBtn');
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    
    // Click on the overlay background (not the dialog)
    await page.locator('#pauseOverlay').click({ position: { x: 10, y: 10 } });
    
    // Should resume
    await expect(page.locator('#pauseOverlay')).toBeHidden();
  });

  test('should stop timer when paused', async ({ page }) => {
    // Wait for timer to start
    await page.waitForTimeout(2000);
    const time1 = await page.locator('#timeDisplay').textContent();
    
    // Pause the test
    await page.click('#pauseBtn');
    
    // Wait 2 seconds while paused
    await page.waitForTimeout(2000);
    
    // Resume
    await page.click('#resumeBtn');
    
    // Timer should not have advanced much during pause
    const time2 = await page.locator('#timeDisplay').textContent();
    expect(time1).toBe('Time: 00:02');
    // Allow for small delay in resuming
    expect(['Time: 00:02', 'Time: 00:03']).toContain(time2);
  });

  test('should maintain test state when pausing and resuming', async ({ page }) => {
    // Select an option
    await page.locator('.option').nth(2).click();
    await expect(page.locator('.option').nth(2)).toHaveClass(/selected/);
    
    // Pause
    await page.click('#pauseBtn');
    
    // Resume
    await page.click('#resumeBtn');
    
    // Option should still be selected
    await expect(page.locator('.option').nth(2)).toHaveClass(/selected/);
    
    // Should still be on same question
    await expect(page.locator('#currentQuestion')).toContainText('Question 1');
  });

  test('should not allow pause on welcome screen', async ({ page }) => {
    // Go back to welcome screen
    await page.goto('/');
    
    // Press spacebar (should not pause)
    await page.keyboard.press(' ');
    
    // Pause overlay should not appear
    await expect(page.locator('#pauseOverlay')).toBeHidden();
    
    // Welcome screen should still be visible
    await expect(page.locator('#welcomeScreen')).toBeVisible();
  });

  test('should hide pause button on results screen', async ({ page }) => {
    // Complete the test quickly
    for (let i = 1; i <= 10; i++) {
      await page.locator('.option').first().click();
      await page.click('#submitAnswer');
    }
    
    // Should be on results screen
    await expect(page.locator('#resultsScreen')).toBeVisible();
    
    // Pause button should be hidden
    await expect(page.locator('#pauseBtn')).toBeHidden();
  });
});