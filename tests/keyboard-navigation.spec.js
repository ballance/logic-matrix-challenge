const { test, expect } = require('@playwright/test');

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('#startTest');
  });

  test('should select options with number keys 1-6', async ({ page }) => {
    // Press 1 to select first option
    await page.keyboard.press('1');
    await expect(page.locator('.option').first()).toHaveClass(/selected/);
    
    // Press 3 to select third option
    await page.keyboard.press('3');
    await expect(page.locator('.option').first()).not.toHaveClass(/selected/);
    await expect(page.locator('.option').nth(2)).toHaveClass(/selected/);
    
    // Press 6 to select sixth option
    await page.keyboard.press('6');
    await expect(page.locator('.option').nth(5)).toHaveClass(/selected/);
  });

  test('should navigate options with arrow keys', async ({ page }) => {
    // Start by selecting first option
    await page.keyboard.press('1');
    await expect(page.locator('.option').first()).toHaveClass(/selected/);
    
    // Press right arrow to go to second option
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.option').nth(1)).toHaveClass(/selected/);
    
    // Press down arrow to go to third option
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.option').nth(2)).toHaveClass(/selected/);
    
    // Press left arrow to go back to second option
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.option').nth(1)).toHaveClass(/selected/);
    
    // Press up arrow to go back to first option
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('.option').first()).toHaveClass(/selected/);
  });

  test('should wrap around when navigating with arrows', async ({ page }) => {
    // Select first option
    await page.keyboard.press('1');
    
    // Press left arrow - should wrap to last option (6)
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.option').nth(5)).toHaveClass(/selected/);
    
    // Press right arrow - should wrap back to first option
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.option').first()).toHaveClass(/selected/);
  });

  test('should submit answer with Enter key', async ({ page }) => {
    // Select an option
    await page.keyboard.press('2');
    await expect(page.locator('.option').nth(1)).toHaveClass(/selected/);
    
    // Submit with Enter
    await page.keyboard.press('Enter');
    
    // Should move to next question
    await expect(page.locator('#currentQuestion')).toContainText('Question 2');
  });

  test('should not submit with Enter if no option selected', async ({ page }) => {
    // Press Enter without selecting an option
    await page.keyboard.press('Enter');
    
    // Should still be on question 1
    await expect(page.locator('#currentQuestion')).toContainText('Question 1');
  });

  test('should complete full test with keyboard only', async ({ page }) => {
    for (let i = 1; i <= 10; i++) {
      // Select option using number key (cycling through 1-6)
      const optionKey = ((i - 1) % 6) + 1;
      await page.keyboard.press(optionKey.toString());
      
      // Submit with Enter
      await page.keyboard.press('Enter');
      
      // Check progress
      if (i < 10) {
        await expect(page.locator('#currentQuestion')).toContainText(`Question ${i + 1}`);
      } else {
        // Should show results after last question
        await expect(page.locator('#resultsScreen')).toBeVisible();
      }
    }
  });

  test('should navigate and pause with keyboard', async ({ page }) => {
    // Select option with arrow keys (starts at -1, so 2 presses gets to index 1)
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.option').nth(1)).toHaveClass(/selected/);
    
    // Pause with spacebar
    await page.keyboard.press(' ');
    await expect(page.locator('#pauseOverlay')).toBeVisible();
    
    // Resume with Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('#pauseOverlay')).toBeHidden();
    
    // Selection should be maintained
    await expect(page.locator('.option').nth(1)).toHaveClass(/selected/);
    
    // Submit with Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('#currentQuestion')).toContainText('Question 2');
  });

  test('should handle rapid keyboard input', async ({ page }) => {
    // Rapidly press multiple number keys
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    await page.keyboard.press('4');
    await page.keyboard.press('5');
    await page.keyboard.press('6');
    
    // Final selection should be option 6
    await expect(page.locator('.option').nth(5)).toHaveClass(/selected/);
    
    // Rapidly navigate with arrows
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowRight');
    }
    
    // Should have wrapped around properly
    const selectedIndex = await page.locator('.option.selected').evaluate(el => {
      return Array.from(el.parentElement.children).indexOf(el);
    });
    expect(selectedIndex).toBe(3); // (5 + 10) % 6 = 3
  });

  test('should not respond to keyboard on welcome screen', async ({ page }) => {
    // Go back to welcome screen
    await page.goto('/');
    
    // Try to use keyboard navigation
    await page.keyboard.press('1');
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowRight');
    
    // Should still be on welcome screen
    await expect(page.locator('#welcomeScreen')).toBeVisible();
    await expect(page.locator('#testScreen')).toBeHidden();
  });
});