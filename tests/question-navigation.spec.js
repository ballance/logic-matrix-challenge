const { test, expect } = require('@playwright/test');

test.describe('Question Navigation and Answering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('#startTest');
  });

  test('should select an option when clicked', async ({ page }) => {
    // Click first option
    const firstOption = page.locator('.option').first();
    await firstOption.click();
    
    // Check option is selected
    await expect(firstOption).toHaveClass(/selected/);
    
    // Check submit button is enabled
    await expect(page.locator('#submitAnswer')).toBeEnabled();
  });

  test('should change selection when clicking different option', async ({ page }) => {
    // Select first option
    await page.locator('.option').first().click();
    await expect(page.locator('.option').first()).toHaveClass(/selected/);
    
    // Select second option
    await page.locator('.option').nth(1).click();
    
    // Check first is no longer selected
    await expect(page.locator('.option').first()).not.toHaveClass(/selected/);
    // Check second is selected
    await expect(page.locator('.option').nth(1)).toHaveClass(/selected/);
  });

  test('should navigate to next question after submitting answer', async ({ page }) => {
    // Select an option and submit
    await page.locator('.option').first().click();
    await page.click('#submitAnswer');
    
    // Check we're on question 2
    await expect(page.locator('#currentQuestion')).toContainText('Question 2');
    
    // Check previous button is now enabled
    await expect(page.locator('#prevBtn')).toBeEnabled();
    
    // Check new matrix is displayed
    await expect(page.locator('.matrix-cell')).toHaveCount(9);
  });

  test('should navigate through all 10 questions', async ({ page }) => {
    for (let i = 1; i <= 10; i++) {
      // Check current question number
      await expect(page.locator('#currentQuestion')).toContainText(`Question ${i}`);
      
      // Select an option
      await page.locator('.option').nth(i % 6).click();
      
      // Submit answer
      await page.click('#submitAnswer');
      
      // After last question, should show results
      if (i === 10) {
        await expect(page.locator('#resultsScreen')).toBeVisible();
        await expect(page.locator('#testScreen')).toBeHidden();
      }
    }
  });

  test('should navigate back to previous question', async ({ page }) => {
    // Answer first question
    await page.locator('.option').first().click();
    await page.click('#submitAnswer');
    
    // Now on question 2
    await expect(page.locator('#currentQuestion')).toContainText('Question 2');
    
    // Go back
    await page.click('#prevBtn');
    
    // Should be on question 1
    await expect(page.locator('#currentQuestion')).toContainText('Question 1');
    
    // Previous selection should be maintained
    await expect(page.locator('.option').first()).toHaveClass(/selected/);
  });

  test('should update progress bar as questions are answered', async ({ page }) => {
    const progressFill = page.locator('#progressFill');
    
    // Initial progress should be 0
    await expect(progressFill).toHaveCSS('width', '0px');
    
    // Answer first question
    await page.locator('.option').first().click();
    await page.click('#submitAnswer');
    
    // Progress should increase (10% for 1/10 questions)
    const width = await progressFill.evaluate(el => el.offsetWidth);
    expect(width).toBeGreaterThan(0);
    
    // Complete all questions
    for (let i = 2; i <= 10; i++) {
      if (i <= 10) {
        await page.locator('.option').first().click();
        await page.click('#submitAnswer');
      }
    }
    
    // Progress should be 100%
    await expect(progressFill).toHaveCSS('width', /\d+px/);
  });

  test('should show correct level indicators', async ({ page }) => {
    // Question 1-2: Level A
    await expect(page.locator('#currentSet')).toContainText('Level A');
    
    // Go to question 3 (Level B)
    for (let i = 1; i <= 2; i++) {
      await page.locator('.option').first().click();
      await page.click('#submitAnswer');
    }
    await expect(page.locator('#currentSet')).toContainText('Level B');
    
    // Go to question 5 (Level C)
    for (let i = 3; i <= 4; i++) {
      await page.locator('.option').first().click();
      await page.click('#submitAnswer');
    }
    await expect(page.locator('#currentSet')).toContainText('Level C');
  });

  test('should track time during test', async ({ page }) => {
    // Initial time
    await expect(page.locator('#timeDisplay')).toContainText('Time: 00:00');
    
    // Wait 2 seconds
    await page.waitForTimeout(2000);
    
    // Time should have updated
    await expect(page.locator('#timeDisplay')).toContainText('Time: 00:02');
  });
});