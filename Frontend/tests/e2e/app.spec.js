import { test, expect } from '@playwright/test'

test.describe('TemplateCraft E2E', () => {
  test('dashboard loads and shows projects', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText('TemplateCraft')).toBeVisible()
    await expect(page.getByText('Your Projects')).toBeVisible()
  })

  test('navigates to templates page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByText('Explore Templates').click()
    await expect(page.getByText('Template Library')).toBeVisible()
  })

  test('unknown route redirects to dashboard', async ({ page }) => {
    await page.goto('/unknown-route')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
