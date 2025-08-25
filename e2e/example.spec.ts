import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page title contains expected text
    await expect(page).toHaveTitle(/Full-Court Control Pro/)
    
    // Check if main navigation or content is visible
    await expect(page.locator('main')).toBeVisible()
  })
  
  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/')
    
    // Look for dashboard link/button and click it
    const dashboardLink = page.locator('a[href*="dashboard"], button:has-text("Dashboard")')
    if (await dashboardLink.count() > 0) {
      await dashboardLink.first().click()
      await expect(page).toHaveURL(/.*dashboard/)
    }
  })
})

test.describe('Dashboard', () => {
  test('should display dashboard content', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check if dashboard content is visible
    await expect(page.locator('main, [data-testid="dashboard"]')).toBeVisible()
  })
})

test.describe('Projects Page', () => {
  test('should display projects page', async ({ page }) => {
    await page.goto('/projects')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check if projects content is visible
    await expect(page.locator('main, [data-testid="projects"]')).toBeVisible()
  })
})