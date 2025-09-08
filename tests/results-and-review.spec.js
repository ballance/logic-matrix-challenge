const { test, expect } = require('@playwright/test');

test.describe('Results and Review Screens', () => {
  // Helper function to complete the test quickly
  async function completeTest(page, correctAnswers = false) {
    await page.goto('/');
    await page.click('#startTest');
    
    for (let i = 1; i <= 10; i++) {
      // If correctAnswers is true, we'd need to know the correct answers
      // For testing, we'll just select first option
      const optionIndex = correctAnswers ? 0 : (i % 6);
      await page.locator('.option').nth(optionIndex).click();
      await page.click('#submitAnswer');
    }
  }

  test('should display results screen after completing test', async ({ page }) => {
    await completeTest(page);
    
    // Check results screen is visible
    await expect(page.locator('#resultsScreen')).toBeVisible();
    await expect(page.locator('#testScreen')).toBeHidden();
    
    // Check results heading
    await expect(page.locator('.results-content h2')).toHaveText('Challenge Complete!');
  });

  test('should display score summary', async ({ page }) => {
    await completeTest(page);
    
    // Check total score is displayed
    await expect(page.locator('#totalScore')).toBeVisible();
    const scoreText = await page.locator('#totalScore').textContent();
    expect(scoreText).toMatch(/\d+/); // Should contain a number
    
    // Check percentage is displayed
    await expect(page.locator('#percentage')).toBeVisible();
    const percentageText = await page.locator('#percentage').textContent();
    expect(percentageText).toMatch(/\d+%/); // Should contain percentage
  });

  test('should display breakdown by level', async ({ page }) => {
    await completeTest(page);
    
    // Check set scores are displayed
    await expect(page.locator('#setScores')).toBeVisible();
    
    // Should have 5 level scores (A through E)
    const setScores = page.locator('.set-score');
    await expect(setScores).toHaveCount(5);
    
    // Check each level is displayed
    await expect(setScores.nth(0)).toContainText('Level A:');
    await expect(setScores.nth(1)).toContainText('Level B:');
    await expect(setScores.nth(2)).toContainText('Level C:');
    await expect(setScores.nth(3)).toContainText('Level D:');
    await expect(setScores.nth(4)).toContainText('Level E:');
  });

  test('should display performance level', async ({ page }) => {
    await completeTest(page);
    
    // Check performance level is displayed
    await expect(page.locator('#performanceLevel')).toBeVisible();
    const performanceText = await page.locator('#performanceLevel').textContent();
    
    // Should contain one of the performance levels
    const validLevels = ['Superior', 'Above Average', 'Average', 'Below Average', 'Poor'];
    const hasValidLevel = validLevels.some(level => performanceText.includes(level));
    expect(hasValidLevel).toBeTruthy();
  });

  test('should have review and restart buttons', async ({ page }) => {
    await completeTest(page);
    
    // Check review button
    await expect(page.locator('#reviewAnswers')).toBeVisible();
    await expect(page.locator('#reviewAnswers')).toHaveText('Review Answers');
    
    // Check restart button
    await expect(page.locator('#restartTest')).toBeVisible();
    await expect(page.locator('#restartTest')).toHaveText('Restart Challenge');
  });

  test('should navigate to review screen', async ({ page }) => {
    await completeTest(page);
    
    // Click review answers
    await page.click('#reviewAnswers');
    
    // Check review screen is visible
    await expect(page.locator('#reviewScreen')).toBeVisible();
    await expect(page.locator('#resultsScreen')).toBeHidden();
    
    // Check review heading
    await expect(page.locator('.review-content h2')).toHaveText('Review Your Answers');
  });

  test('should display review question with matrix and options', async ({ page }) => {
    await completeTest(page);
    await page.click('#reviewAnswers');
    
    // Check review counter
    await expect(page.locator('#reviewCounter')).toHaveText('1 / 10');
    
    // Check review matrix is displayed
    await expect(page.locator('.review-matrix')).toBeVisible();
    await expect(page.locator('.review-matrix .matrix-cell')).toHaveCount(9);
    
    // Check review options are displayed
    await expect(page.locator('.review-options')).toBeVisible();
    await expect(page.locator('.review-options .option')).toHaveCount(6);
    
    // Check answer info is displayed
    await expect(page.locator('.review-answer-info')).toBeVisible();
  });

  test('should show correct/incorrect status in review', async ({ page }) => {
    await completeTest(page);
    await page.click('#reviewAnswers');
    
    // Check answer status is displayed
    const answerStatus = page.locator('.answer-status');
    await expect(answerStatus).toBeVisible();
    
    // Should show either correct or incorrect
    const statusText = await answerStatus.textContent();
    expect(['✓ Correct', '✗ Incorrect'].some(status => statusText.includes(status))).toBeTruthy();
    
    // Check user's answer is shown
    await expect(page.locator('.review-answer-info')).toContainText('Your answer: Option');
    
    // Check correct answer is shown
    await expect(page.locator('.review-answer-info')).toContainText('Correct answer: Option');
    
    // Check response time is shown
    await expect(page.locator('.review-answer-info')).toContainText('Response time:');
    
    // Check explanation is shown
    await expect(page.locator('.explanation')).toBeVisible();
  });

  test('should navigate through review questions', async ({ page }) => {
    await completeTest(page);
    await page.click('#reviewAnswers');
    
    // Start at question 1
    await expect(page.locator('#reviewCounter')).toHaveText('1 / 10');
    
    // Go to next question
    await page.click('#nextReview');
    await expect(page.locator('#reviewCounter')).toHaveText('2 / 10');
    
    // Go to previous question
    await page.click('#prevReview');
    await expect(page.locator('#reviewCounter')).toHaveText('1 / 10');
    
    // Navigate to last question
    for (let i = 1; i < 10; i++) {
      await page.click('#nextReview');
    }
    await expect(page.locator('#reviewCounter')).toHaveText('10 / 10');
  });

  test('should return to results from review', async ({ page }) => {
    await completeTest(page);
    await page.click('#reviewAnswers');
    
    // Click back to results
    await page.click('#backToResults');
    
    // Should be back on results screen
    await expect(page.locator('#resultsScreen')).toBeVisible();
    await expect(page.locator('#reviewScreen')).toBeHidden();
  });

  test('should restart test from results', async ({ page }) => {
    await completeTest(page);
    
    // Click restart
    await page.click('#restartTest');
    
    // Should be back on welcome screen
    await expect(page.locator('#welcomeScreen')).toBeVisible();
    await expect(page.locator('#resultsScreen')).toBeHidden();
    
    // Start test again
    await page.click('#startTest');
    
    // Should be on question 1 with fresh state
    await expect(page.locator('#currentQuestion')).toHaveText('Question 1');
    // Timer should be at or near 00:00 (may be 00:01 due to timing)
    const timeText = await page.locator('#timeDisplay').textContent();
    expect(timeText).toMatch(/Time: 00:0[0-2]/);
    await expect(page.locator('.option.selected')).toHaveCount(0);
  });

  test('should play completion sound when finishing test', async ({ page }) => {
    // Set up console listener for errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await completeTest(page);
    
    // No audio errors should occur
    const audioErrors = consoleErrors.filter(err => 
      err.includes('Audio') || err.includes('playSound')
    );
    expect(audioErrors.length).toBe(0);
  });
});