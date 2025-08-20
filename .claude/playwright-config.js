/**
 * Playwright MCP Configuration for Full Court Control Pro
 * This file contains browser configuration settings for automatic maximize
 */

// Standard screen resolutions for maximize
const SCREEN_SIZES = {
  macbook: { width: 1440, height: 900 },
  desktop: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1440 }
};

// Default maximize size (can be adjusted based on system)
const DEFAULT_MAXIMIZE_SIZE = SCREEN_SIZES.desktop;

/**
 * Browser maximize helper function
 * This should be called after any browser navigation
 */
async function maximizeBrowser() {
  return {
    width: DEFAULT_MAXIMIZE_SIZE.width,
    height: DEFAULT_MAXIMIZE_SIZE.height,
    note: "Browser akan dimaksimalkan ke ukuran desktop standar"
  };
}

/**
 * Recommended usage pattern:
 * 1. Navigate to URL
 * 2. Immediately call browser_resize with these dimensions
 * 
 * Example:
 * await mcp__playwright__browser_navigate("http://localhost:3000")
 * await mcp__playwright__browser_resize(1920, 1080)
 */

module.exports = {
  SCREEN_SIZES,
  DEFAULT_MAXIMIZE_SIZE,
  maximizeBrowser
};