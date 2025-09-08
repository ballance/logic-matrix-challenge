// Helper functions for tests

async function clearPauseOverlay(page) {
  // Force clear any stuck pause overlay
  const pauseOverlay = page.locator('#pauseOverlay');
  if (await pauseOverlay.isVisible()) {
    // Try multiple methods to clear it
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    
    if (await pauseOverlay.isVisible()) {
      // Force hide with JavaScript if still visible
      await page.evaluate(() => {
        const overlay = document.getElementById('pauseOverlay');
        if (overlay) {
          overlay.classList.add('hidden');
          overlay.style.display = 'none';
        }
      });
    }
  }
}

async function ensureTestReady(page) {
  await clearPauseOverlay(page);
  // Wait for any animations to complete
  await page.waitForTimeout(500);
}

module.exports = {
  clearPauseOverlay,
  ensureTestReady
};