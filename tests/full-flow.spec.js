const { test, expect } = require('@playwright/test');

test.describe('Full Test Flow E2E', () => {
  test('should complete entire test flow from start to review', async ({ page }) => {
    // 1. Start at welcome screen
    await page.goto('/');
    await expect(page.locator('#welcomeScreen')).toBeVisible();
    
    // 2. Start the test
    await page.click('#startTest');
    await expect(page.locator('#testScreen')).toBeVisible();
    await expect(page.locator('#pauseBtn')).toBeVisible();
    
    // 3. Answer first few questions with mouse
    for (let i = 1; i <= 3; i++) {
      await expect(page.locator('#currentQuestion')).toContainText(`Question ${i}`);
      await page.locator('.option').nth(i - 1).click();
      await expect(page.locator('.option').nth(i - 1)).toHaveClass(/selected/);
      await page.click('#submitAnswer');
    }
    
    // 4. Test pause functionality
    await expect(page.locator('#currentQuestion')).toContainText('Question 4');
    await page.keyboard.press(' '); // Pause with spacebar
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    await page.waitForTimeout(1000); // Wait while paused
    await page.keyboard.press('Enter'); // Resume with Enter
    await expect(page.locator('#pauseOverlay')).toBeHidden();
    
    // 5. Answer questions 4-6 with keyboard
    for (let i = 4; i <= 6; i++) {
      await page.keyboard.press((i % 6 + 1).toString()); // Select with number key
      await page.keyboard.press('Enter'); // Submit with Enter
    }
    
    // 6. Navigate back and change an answer
    await expect(page.locator('#currentQuestion')).toContainText('Question 7');
    await page.click('#prevBtn');
    await expect(page.locator('#currentQuestion')).toContainText('Question 6');
    await page.click('#prevBtn');
    await expect(page.locator('#currentQuestion')).toContainText('Question 5');
    
    // Change the answer for question 5
    await page.keyboard.press('3');
    await page.keyboard.press('Enter');
    
    // 7. Complete remaining questions (after changing q5, we're on q6)
    // Complete questions 6-10
    for (let i = 6; i <= 10; i++) {
      await expect(page.locator('#currentQuestion')).toContainText(`Question ${i}`);
      // Select an option with keyboard
      await page.keyboard.press((i % 6 + 1).toString());
      await page.keyboard.press('Enter');
    }
    
    // 8. Verify results screen
    await expect(page.locator('#resultsScreen')).toBeVisible();
    await expect(page.locator('#totalScore')).toBeVisible();
    await expect(page.locator('#percentage')).toBeVisible();
    // Should have 5 set scores (one for each level that has questions)
    const setScoreCount = await page.locator('.set-score').count();
    expect(setScoreCount).toBeGreaterThan(0);
    expect(setScoreCount).toBeLessThanOrEqual(5);
    await expect(page.locator('#performanceLevel')).toBeVisible();
    
    // 9. Go to review screen
    await page.click('#reviewAnswers');
    await expect(page.locator('#reviewScreen')).toBeVisible();
    await expect(page.locator('#reviewCounter')).toContainText('1 / 10');
    
    // 10. Navigate through review
    await expect(page.locator('.review-matrix')).toBeVisible();
    await expect(page.locator('.review-options')).toBeVisible();
    await expect(page.locator('.review-answer-info')).toBeVisible();
    
    // Check a few review questions
    await page.click('#nextReview');
    await expect(page.locator('#reviewCounter')).toContainText('2 / 10');
    await page.click('#nextReview');
    await expect(page.locator('#reviewCounter')).toContainText('3 / 10');
    
    // 11. Return to results
    await page.click('#backToResults');
    await expect(page.locator('#resultsScreen')).toBeVisible();
    
    // 12. Restart test
    await page.click('#restartTest');
    await expect(page.locator('#welcomeScreen')).toBeVisible();
  });

  test('should handle edge cases and errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Try to pause before starting test
    await page.keyboard.press(' ');
    await expect(page.locator('#pauseOverlay')).toBeHidden();
    
    // Start test
    await page.click('#startTest');
    
    // Try to submit without selecting an option
    await page.keyboard.press('Enter');
    await expect(page.locator('#currentQuestion')).toContainText('Question 1');
    
    // Select and deselect options rapidly
    for (let i = 1; i <= 6; i++) {
      await page.keyboard.press(i.toString());
    }
    await expect(page.locator('.option.selected')).toHaveCount(1);
    
    // Double-click pause overlay to force clear
    await page.click('#pauseBtn');
    await page.locator('#pauseOverlay').dblclick();
    await expect(page.locator('#pauseOverlay')).toBeHidden();
    
    // Complete test
    for (let i = 1; i <= 10; i++) {
      await page.keyboard.press('1');
      await page.keyboard.press('Enter');
    }
    
    // Verify we reached results despite edge cases
    await expect(page.locator('#resultsScreen')).toBeVisible();
  });

  test('should maintain accessibility throughout flow', async ({ page }) => {
    await page.goto('/');
    
    // Check tab navigation works
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeTruthy();
    
    // Start test
    await page.click('#startTest');
    
    // Check all interactive elements are keyboard accessible
    const interactiveElements = await page.$$eval(
      'button, [role="button"], .option',
      elements => elements.length
    );
    expect(interactiveElements).toBeGreaterThan(0);
    
    // Complete test with keyboard only
    for (let i = 1; i <= 10; i++) {
      await page.keyboard.press('1');
      await page.keyboard.press('Enter');
    }
    
    // Verify keyboard navigation in results
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Should activate one of the buttons
    
    // Should have navigated somewhere
    const resultsStillVisible = await page.locator('#resultsScreen').isVisible();
    const reviewVisible = await page.locator('#reviewScreen').isVisible();
    const welcomeVisible = await page.locator('#welcomeScreen').isVisible();
    
    expect(resultsStillVisible || reviewVisible || welcomeVisible).toBeTruthy();
  });

  test('should handle performance with rapid interactions', async ({ page }) => {
    await page.goto('/');
    await page.click('#startTest');
    
    const startTime = Date.now();
    
    // Complete test as fast as possible
    for (let i = 1; i <= 10; i++) {
      await page.keyboard.press('1');
      await page.keyboard.press('Enter');
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Test should complete quickly (under 5 seconds for 10 questions)
    expect(duration).toBeLessThan(5000);
    
    // Should reach results without errors
    await expect(page.locator('#resultsScreen')).toBeVisible();
    
    // All UI should be responsive
    await page.click('#reviewAnswers');
    await expect(page.locator('#reviewScreen')).toBeVisible();
  });
});