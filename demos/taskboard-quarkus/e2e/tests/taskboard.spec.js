// @ts-check
const { test, expect } = require('@playwright/test');

// ── Helper: login before tests that need authentication ──
async function login(page) {
  await page.goto('/login');
  await page.fill('#email', 'test@example.de');
  await page.fill('#password', 'geheim');
  await page.click('button[type="submit"]');
  // Wait for redirect to complete (either /tasks or wherever returnUrl points)
  await page.waitForURL(url => !url.pathname.includes('/login'));
}

// ── Helper: reset db.json mock data via API ──
async function resetTask(page, id, data) {
  await page.request.put(`/api/tasks/${id}`, { data });
}

// ═══════════════════════════════════════════════════════════
// Group 1: Navigation and Layout
// ═══════════════════════════════════════════════════════════

test.describe('Group 1: Navigation and Layout', () => {

  test('1.1 — navbar is present with brand, links, and auth area', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav.navbar');
    await expect(nav).toBeVisible();
    await expect(nav.locator('.navbar-brand')).toHaveText('TaskBoard');
    await expect(nav.locator('.nav-links a')).toHaveCount(3);
    await expect(nav.locator('.nav-auth')).toBeVisible();
  });

  test('1.2 — navbar shows Login link when not authenticated', async ({ page }) => {
    // Clear any stored token
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.reload();
    const authArea = page.locator('.nav-auth');
    await expect(authArea.locator('a[href="/login"]')).toBeVisible();
  });

  test('1.3 — navbar shows user email and Logout after login', async ({ page }) => {
    await login(page);
    await page.goto('/');
    const authArea = page.locator('.nav-auth');
    await expect(authArea.locator('.nav-user')).toHaveText('test@example.de');
    await expect(authArea.locator('button', { hasText: 'Logout' })).toBeVisible();
  });

  test('1.4 — brand link navigates to home', async ({ page }) => {
    await page.goto('/tasks');
    await login(page);
    await page.click('.navbar-brand');
    await expect(page).toHaveURL('/');
  });

});

// ═══════════════════════════════════════════════════════════
// Group 2: Home Page
// ═══════════════════════════════════════════════════════════

test.describe('Group 2: Home Page', () => {

  test('2.1 — home page renders hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero h1')).toHaveText('Willkommen bei TaskBoard');
    await expect(page.locator('.hero p')).toContainText('Angular-Anwendung');
  });

  test('2.2 — home page has action buttons', async ({ page }) => {
    await page.goto('/');
    const actions = page.locator('.hero-actions');
    await expect(actions.locator('a', { hasText: 'Aufgaben anzeigen' })).toHaveAttribute('href', '/tasks');
    await expect(actions.locator('a', { hasText: 'Neue Aufgabe' })).toHaveAttribute('href', '/tasks/new');
  });

  test('2.3 — home page shows 3 feature cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.feature-card')).toHaveCount(3);
    await expect(page.locator('.feature-card h3').nth(0)).toHaveText('Aufgaben verwalten');
    await expect(page.locator('.feature-card h3').nth(1)).toHaveText('Detail-Ansicht');
    await expect(page.locator('.feature-card h3').nth(2)).toHaveText('Authentifizierung');
  });

  test('2.4 — feature cards are clickable links', async ({ page }) => {
    await page.goto('/');
    // All three feature cards should be <a> elements with href
    const cards = page.locator('a.feature-card');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toHaveAttribute('href', '/tasks');
    await expect(cards.nth(1)).toHaveAttribute('href', '/tasks');
    await expect(cards.nth(2)).toHaveAttribute('href', '/login');
  });

});

// ═══════════════════════════════════════════════════════════
// Group 3: Authentication
// ═══════════════════════════════════════════════════════════

test.describe('Group 3: Authentication', () => {

  test('3.1 — /login renders login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toHaveText('Anmelden');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('.login-hint')).toContainText('Simulierter Login');
  });

  test('3.2 — submit button is disabled when form is empty', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('3.3 — submit button is enabled with valid input', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'user@test.de');
    await page.fill('#password', 'abc');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('3.4 — successful login redirects to /tasks', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/login');
    await page.fill('#email', 'trainer@cdi.de');
    await page.fill('#password', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/tasks');
    await expect(page).toHaveURL('/tasks');
  });

  test('3.5 — login stores token in localStorage', async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    // Token is base64 JSON with email
    const payload = JSON.parse(atob(token));
    expect(payload.email).toBe('test@example.de');
  });

  test('3.6 — logout clears token and shows Login link', async ({ page }) => {
    await login(page);
    await page.goto('/');
    await page.click('button:has-text("Logout")');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
    await expect(page.locator('.nav-auth a[href="/login"]')).toBeVisible();
  });

});

// ═══════════════════════════════════════════════════════════
// Group 4: Auth Guard
// ═══════════════════════════════════════════════════════════

test.describe('Group 4: Auth Guard', () => {

  test('4.1 — /tasks redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login/);
  });

  test('4.2 — /tasks/new redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/tasks/new');
    await expect(page).toHaveURL(/\/login/);
  });

  test('4.3 — redirect preserves returnUrl query parameter', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/tasks/new');
    await expect(page).toHaveURL(/\/login\?returnUrl=/);
  });

  test('4.4 — /tasks is accessible after login', async ({ page }) => {
    await login(page);
    await page.goto('/tasks');
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('h1')).toHaveText('Aufgaben');
  });

});

// ═══════════════════════════════════════════════════════════
// Group 5: Task List
// ═══════════════════════════════════════════════════════════

test.describe('Group 5: Task List', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('5.1 — task list page shows heading and counters', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('h1')).toHaveText('Aufgaben');
    await expect(page.locator('.badge-open')).toContainText('offen');
    await expect(page.locator('.badge-completed')).toContainText('erledigt');
  });

  test('5.2 — task list loads and displays task cards from API', async ({ page }) => {
    await page.goto('/tasks');
    // Wait for tasks to load (loading state disappears)
    await page.waitForSelector('.task-card', { timeout: 5000 });
    const cards = page.locator('.task-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('5.3 — each task card shows title, category badge, and date', async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForSelector('.task-card');
    const firstCard = page.locator('.task-card').first();
    await expect(firstCard.locator('.task-title')).not.toBeEmpty();
    await expect(firstCard.locator('.badge')).toBeVisible();
    await expect(firstCard.locator('.task-meta')).toContainText('.');
  });

  test('5.4 — completed tasks have completed CSS class', async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForSelector('.task-card');
    // db.json has task 1 and 6 as completed
    const completedCards = page.locator('.task-card.completed');
    const count = await completedCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('5.5 — clicking a task card navigates to detail view', async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForSelector('.task-card');
    const firstCard = page.locator('.task-card').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/tasks\/\d+/);
  });

  test('5.6 — open/completed counters match the displayed tasks', async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForSelector('.task-card');
    const openText = await page.locator('.badge-open').textContent();
    const completedText = await page.locator('.badge-completed').textContent();
    const openCount = parseInt(openText);
    const completedCount = parseInt(completedText);
    const totalCards = await page.locator('.task-card').count();
    const completedCards = await page.locator('.task-card.completed').count();
    expect(completedCards).toBe(completedCount);
    expect(totalCards - completedCards).toBe(openCount);
  });

});

// ═══════════════════════════════════════════════════════════
// Group 6: Task Detail
// ═══════════════════════════════════════════════════════════

test.describe('Group 6: Task Detail', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('6.1 — task detail page shows task title', async ({ page }) => {
    await page.goto('/tasks/2');
    await page.waitForSelector('.detail-card');
    await expect(page.locator('.detail-card h1')).toHaveText('REST-API mit Quarkus erstellen');
  });

  test('6.2 — task detail shows category, status, and creation date', async ({ page }) => {
    await page.goto('/tasks/2');
    await page.waitForSelector('.detail-card');
    await expect(page.locator('.detail-meta')).toContainText('Kategorie');
    await expect(page.locator('.detail-meta')).toContainText('Status');
    await expect(page.locator('.detail-meta')).toContainText('Erstellt');
  });

  test('6.3 — task detail shows description', async ({ page }) => {
    await page.goto('/tasks/2');
    await page.waitForSelector('.detail-card');
    await expect(page.locator('.detail-description')).toContainText('JAX-RS Endpoints');
  });

  test('6.4 — open task shows "Als erledigt markieren" button', async ({ page }) => {
    await page.goto('/tasks/2');
    await page.waitForSelector('.detail-card');
    await expect(page.locator('button', { hasText: 'Als erledigt markieren' })).toBeVisible();
  });

  test('6.5 — completed task shows "Als offen markieren" button', async ({ page }) => {
    await page.goto('/tasks/1');
    await page.waitForSelector('.detail-card');
    await expect(page.locator('button', { hasText: 'Als offen markieren' })).toBeVisible();
  });

  test('6.6 — back link navigates to task list', async ({ page }) => {
    await page.goto('/tasks/2');
    await page.waitForSelector('.detail-card');
    await page.click('.back-link');
    await expect(page).toHaveURL('/tasks');
  });

  test('6.7 — toggle complete button changes task status', async ({ page }) => {
    // Task 2 is open — mark as completed
    await page.goto('/tasks/2');
    await page.waitForSelector('.detail-card');
    await page.click('button:has-text("Als erledigt markieren")');
    await expect(page.locator('button', { hasText: 'Als offen markieren' })).toBeVisible({ timeout: 3000 });

    // Restore: mark as open again
    await page.click('button:has-text("Als offen markieren")');
    await expect(page.locator('button', { hasText: 'Als erledigt markieren' })).toBeVisible({ timeout: 3000 });
  });

});

// ═══════════════════════════════════════════════════════════
// Group 7: Create Task (Reactive Forms)
// ═══════════════════════════════════════════════════════════

test.describe('Group 7: Create Task', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('7.1 — create task page renders form', async ({ page }) => {
    await page.goto('/tasks/new');
    await expect(page.locator('h1')).toHaveText('Neue Aufgabe erstellen');
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#category')).toBeVisible();
    await expect(page.locator('#description')).toBeVisible();
  });

  test('7.2 — submit button is disabled when form is empty', async ({ page }) => {
    await page.goto('/tasks/new');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('7.3 — shows validation error for title too short', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.fill('#title', 'ab');
    await page.locator('#category').click(); // blur title
    await expect(page.locator('.error-text')).toContainText('Mindestens 3 Zeichen');
  });

  test('7.4 — shows validation error for missing category', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.fill('#title', 'Test Aufgabe');
    await page.locator('#category').focus();
    await page.locator('#title').focus(); // blur category
    await expect(page.locator('.error-text')).toContainText('Bitte wählen Sie eine Kategorie');
  });

  test('7.5 — submit button becomes enabled with valid input', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.fill('#title', 'E2E Test Aufgabe');
    await page.selectOption('#category', 'work');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('7.6 — submitting a valid form creates task and redirects to /tasks', async ({ page }) => {
    const uniqueTitle = `E2E Form Test ${Date.now()}`;
    await page.goto('/tasks/new');
    await page.fill('#title', uniqueTitle);
    await page.selectOption('#category', 'learning');
    await page.fill('#description', 'Erstellt durch automatisierten Test');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/tasks', { timeout: 5000 });
    await expect(page).toHaveURL('/tasks');
    // Verify new task appears in the list
    await page.waitForSelector('.task-card');
    await expect(page.locator('.task-title', { hasText: uniqueTitle })).toBeVisible();

    // Clean up via API
    const res = await page.request.get('/api/tasks');
    const tasks = await res.json();
    const created = tasks.find(t => t.title === uniqueTitle);
    if (created) await page.request.delete(`/api/tasks/${created.id}`);
  });

  test('7.7 — cancel link navigates back to task list', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.click('a:has-text("Abbrechen")');
    await expect(page).toHaveURL('/tasks');
  });

});

// ═══════════════════════════════════════════════════════════
// Group 8: Task List Interaction
// ═══════════════════════════════════════════════════════════

test.describe('Group 8: Task List Interaction', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('8.1 — "Erledigt" button toggles task to completed', async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForSelector('.task-card');

    // Find an open task card and click its "Erledigt" button
    const openCard = page.locator('.task-card:not(.completed)').first();
    const title = await openCard.locator('.task-title').textContent();
    await openCard.locator('button', { hasText: 'Erledigt' }).click();

    // Wait for the card to get completed class
    await expect(page.locator(`.task-card.completed .task-title:has-text("${title}")`)).toBeVisible({ timeout: 3000 });

    // Restore: click "Wiederherstellen"
    const completedCard = page.locator(`.task-card.completed:has(.task-title:has-text("${title}"))`);
    await completedCard.locator('button', { hasText: 'Wiederherstellen' }).click();
    await expect(page.locator(`.task-card:not(.completed) .task-title:has-text("${title}")`)).toBeVisible({ timeout: 3000 });
  });

  test('8.2 — "Wiederherstellen" button toggles task back to open', async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForSelector('.task-card');

    const completedCard = page.locator('.task-card.completed').first();
    const title = await completedCard.locator('.task-title').textContent();
    await completedCard.locator('button', { hasText: 'Wiederherstellen' }).click();

    // Task should now be open
    await expect(page.locator(`.task-card:not(.completed) .task-title:has-text("${title}")`)).toBeVisible({ timeout: 3000 });

    // Restore original state
    const openCard = page.locator(`.task-card:not(.completed):has(.task-title:has-text("${title}"))`);
    await openCard.locator('button', { hasText: 'Erledigt' }).click();
    await expect(page.locator(`.task-card.completed .task-title:has-text("${title}")`)).toBeVisible({ timeout: 3000 });
  });

});

// ═══════════════════════════════════════════════════════════
// Group 9: Mock API
// ═══════════════════════════════════════════════════════════

test.describe('Group 9: Mock API', () => {

  test('9.1 — GET /api/tasks returns JSON array', async ({ page }) => {
    const response = await page.request.get('/api/tasks');
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(6);
  });

  test('9.2 — GET /api/tasks/:id returns single task', async ({ page }) => {
    const response = await page.request.get('/api/tasks/1');
    expect(response.ok()).toBe(true);
    const task = await response.json();
    expect(task.id).toBeDefined();
    expect(task.title).toBeDefined();
    expect(task.category).toBeDefined();
  });

  test('9.3 — each task has required fields', async ({ page }) => {
    const response = await page.request.get('/api/tasks');
    const tasks = await response.json();
    for (const task of tasks.slice(0, 6)) {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('category');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('createdAt');
    }
  });

  test('9.4 — POST /api/tasks creates a new task', async ({ page }) => {
    const response = await page.request.post('/api/tasks', {
      data: {
        title: 'API Test Task',
        category: 'work',
        description: 'Created by API test',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    });
    expect(response.ok()).toBe(true);
    const created = await response.json();
    expect(created.title).toBe('API Test Task');
    expect(created.id).toBeDefined();

    // Clean up
    await page.request.delete(`/api/tasks/${created.id}`);
  });

  test('9.5 — PATCH /api/tasks/:id updates task', async ({ page }) => {
    const response = await page.request.patch('/api/tasks/3', {
      data: { completed: true },
    });
    expect(response.ok()).toBe(true);
    const updated = await response.json();
    expect(updated.completed).toBe(true);

    // Restore
    await page.request.patch('/api/tasks/3', {
      data: { completed: false },
    });
  });

});

// ═══════════════════════════════════════════════════════════
// Group 10: Routing
// ═══════════════════════════════════════════════════════════

test.describe('Group 10: Routing', () => {

  test('10.1 — unknown routes redirect to home', async ({ page }) => {
    await page.goto('/nonexistent');
    await expect(page).toHaveURL('/');
  });

  test('10.2 — /login is accessible without authentication', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toHaveText('Anmelden');
  });

  test('10.3 — / (home) is accessible without authentication', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('.hero h1')).toHaveText('Willkommen bei TaskBoard');
  });

  test('10.4 — navbar links navigate correctly', async ({ page }) => {
    await login(page);

    // Navigate to tasks via navbar
    await page.click('.nav-links a:has-text("Aufgaben")');
    await expect(page).toHaveURL('/tasks');

    // Navigate to new task via navbar
    await page.click('.nav-links a:has-text("Neue Aufgabe")');
    await expect(page).toHaveURL('/tasks/new');

    // Navigate to home via navbar
    await page.click('.nav-links a:has-text("Home")');
    await expect(page).toHaveURL('/');
  });

});

// ═══════════════════════════════════════════════════════════
// Group 11: String-ID Regression (json-server v1 generates
//           hex string IDs like "a3f2" for new tasks)
// ═══════════════════════════════════════════════════════════

test.describe('Group 11: String-ID Regression', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('11.1 — detail page loads for API-created task (string ID)', async ({ page }) => {
    // Create a task via API — json-server v1 assigns a string ID
    const response = await page.request.post('/api/tasks', {
      data: {
        title: 'String-ID Regression Test',
        category: 'learning',
        description: 'Verifies that API-created IDs work in the detail view',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    });
    const created = await response.json();
    const id = String(created.id);

    // Navigate to detail page — this was the bug: Number("a3f2") => NaN => 404
    await page.goto(`/tasks/${id}`);
    await page.waitForSelector('.detail-card', { timeout: 5000 });
    await expect(page.locator('.detail-card h1')).toHaveText('String-ID Regression Test');
    await expect(page.locator('.error-box')).not.toBeVisible();

    // Clean up
    await page.request.delete(`/api/tasks/${id}`);
  });

  test('11.2 — clicking a newly created task navigates to its detail page', async ({ page }) => {
    // Create task via the UI form (gets a hex string ID)
    await page.goto('/tasks/new');
    await page.fill('#title', 'Click-Through Regression');
    await page.selectOption('#category', 'work');
    await page.fill('#description', 'Created to test list-to-detail navigation with string IDs');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/tasks', { timeout: 5000 });
    await page.waitForSelector('.task-card');

    // Click the newly created task in the list
    const card = page.locator('.task-card', { has: page.locator('.task-title', { hasText: 'Click-Through Regression' }) });
    await card.click();

    // Must show detail page, NOT the error message
    await page.waitForSelector('.detail-card', { timeout: 5000 });
    await expect(page.locator('.detail-card h1')).toHaveText('Click-Through Regression');
    await expect(page.locator('.error-box')).not.toBeVisible();

    // Clean up: get the ID from the URL and delete via API
    const url = page.url();
    const taskId = url.split('/tasks/')[1];
    await page.request.delete(`/api/tasks/${taskId}`);
  });

  test('11.3 — toggle complete works for task with non-numeric string ID', async ({ page }) => {
    // Create a task via API
    const response = await page.request.post('/api/tasks', {
      data: {
        title: 'Toggle String-ID Test',
        category: 'personal',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    });
    const created = await response.json();
    const id = created.id;

    // Open detail page and toggle status
    await page.goto(`/tasks/${id}`);
    await page.waitForSelector('.detail-card', { timeout: 5000 });
    await page.click('button:has-text("Als erledigt markieren")');
    await expect(page.locator('button', { hasText: 'Als offen markieren' })).toBeVisible({ timeout: 3000 });

    // Verify the API reflects the change
    const check = await page.request.get(`/api/tasks/${id}`);
    const updated = await check.json();
    expect(updated.completed).toBe(true);

    // Clean up
    await page.request.delete(`/api/tasks/${id}`);
  });

});
