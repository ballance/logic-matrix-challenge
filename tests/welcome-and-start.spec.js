const { test, expect } = require('@playwright/test');
const { ensureTestReady } = require('./helpers');

test.describe('Welcome Screen and Test Start', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await ensureTestReady(page);
  });

  test('should display welcome screen on load', async ({ page }) => {
    // Check welcome screen is visible
    await expect(page.locator('#welcomeScreen')).toBeVisible();
    await expect(page.locator('#welcomeScreen h2')).toContainText('Welcome to the Logic Matrix Challenge');
    
    // Check instructions are present
    await expect(page.locator('.instructions')).toBeVisible();
    await expect(page.locator('.instructions ul li')).toHaveCount(5);
    
    // Check start button is present
    await expect(page.locator('#startTest')).toBeVisible();
    await expect(page.locator('#startTest')).toHaveText('Start Challenge');
  });

  test('should start test when clicking start button', async ({ page }) => {
    // Click start button
    await page.click('#startTest');
    
    // Check welcome screen is hidden
    await expect(page.locator('#welcomeScreen')).toBeHidden();
    
    // Check test screen is visible
    await expect(page.locator('#testScreen')).toBeVisible();
    
    // Check progress bar is visible
    await expect(page.locator('.progress-bar')).toBeVisible();
    
    // Check timer is running
    await expect(page.locator('#timeDisplay')).toContainText('Time: 00:00');
    
    // Check first question is displayed
    await expect(page.locator('#currentQuestion')).toContainText('Question 1');
    await expect(page.locator('#currentSet')).toContainText('Level A');
    
    // Check pause button is visible
    await expect(page.locator('#pauseBtn')).toBeVisible();
  });

  test('should display matrix and options for first question', async ({ page }) => {
    await page.click('#startTest');
    
    // Check matrix is displayed
    await expect(page.locator('#matrixPattern')).toBeVisible();
    await expect(page.locator('.matrix-cell')).toHaveCount(9);
    
    // Check one cell is marked as missing
    await expect(page.locator('.matrix-cell.missing')).toHaveCount(1);
    
    // Check answer options are displayed
    await expect(page.locator('#answerOptions')).toBeVisible();
    await expect(page.locator('.option')).toHaveCount(6);
    
    // Check controls are in correct state
    await expect(page.locator('#prevBtn')).toBeDisabled();
    await expect(page.locator('#nextBtn')).toBeDisabled();
    await expect(page.locator('#submitAnswer')).toBeDisabled();
  });

  test('should play sound when clicking start (audio context)', async ({ page }) => {
    // Set up listener for console messages to verify audio context
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.click('#startTest');
    
    // Audio context should be resumed after user interaction
    // Note: We can't directly test audio, but we can ensure no audio errors
    const audioErrors = consoleMessages.filter(msg => 
      msg.includes('Audio not supported') || msg.includes('AudioContext')
    );
    expect(audioErrors.length).toBe(0);
  });
});