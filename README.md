[deployment](https://habit-tracker-pwa-lac.vercel.app/)
[github](https://github.com/justtimi/habit-tracker-pwa)

# Habitify

Habitify is a mobile-first Progressive Web App (PWA) built for tracking daily habits.  
It is designed to work fully offline using localStorage and service workers, with deterministic behavior and testable architecture.

This project was built as part of a structured engineering exercise focused on frontend architecture, state persistence, testing discipline, and PWA implementation.

---

## 🚀 Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- localStorage (persistence layer)
- Playwright (E2E tests)
- Vitest (unit tests)
- React Testing Library (integration tests)
- Service Worker (PWA offline support)

---

## 📦 Features

### Authentication
- Email + password signup
- Login / logout system
- Session stored in localStorage
- Duplicate email prevention
- Invalid login handling

### Habit Management
- Create habits
- Edit habits
- Delete habits (with confirmation)
- Toggle daily completion
- View current streak per habit

### PWA Support
- Installable web app
- Offline-first app shell caching
- Service worker caching strategy
- Manifest configuration for installability

---

## 📁 Project Structure

```

src/
app/
login/
signup/
dashboard/
components/
lib/
auth.ts
habitsUI.ts
habits.ts
streaks.ts
storage.ts
dates.ts
validators.ts
slug.ts
types/
tests/
public/
manifest.json
sw.js
icons/

````

---

## 💾 Persistence Layer

All data is stored using localStorage.

### Keys used:

- `habit-tracker-users` → list of users
- `habit-tracker-session` → active session
- `habit-tracker-habits` → all habits

### Data Shapes

#### User
```ts
{
  id: string;
  email: string;
  password: string;
  createdAt: string;
}
````

#### Session

```ts
{
  userId: string;
  email: string;
}
```

#### Habit

```ts
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
}
```

---

## 🔐 Auth Flow

### Signup

* Validates email + password
* Rejects duplicate emails
* Creates user + session
* Redirects to `/dashboard`

### Login

* Validates credentials
* Creates session
* Redirects to `/dashboard`

### Logout

* Clears session
* Redirects to `/login`

---

## 📊 Habit Logic

### Create Habit

* Name required
* Description optional
* Frequency defaults to `daily`
* Assigned to current user

### Edit Habit

* Updates name and description only
* Preserves:

  * id
  * userId
  * createdAt
  * completions

### Delete Habit

* Removes habit from storage
* Immediately reflects in UI

### Completion

* Toggles today’s date (`YYYY-MM-DD`)
* No duplicate completions allowed
* Updates streak instantly

---

## 🔥 Streak Logic

Streak is calculated based on consecutive completed days.

Rules:

* Completions are deduplicated
* Dates are sorted
* Streak counts backward from today
* If today is not completed → streak is 0

---

## 🌐 PWA Implementation

### Manifest

Located in:

```
public/manifest.json
```

Includes:

* name + short_name
* start_url: `/`
* scope: `/`
* display: standalone
* theme + background color
* icons (192px, 512px)

### Service Worker

Located in:

```
public/sw.js
```

Responsibilities:

* Cache app shell on install
* Serve cached assets when offline
* Prevent hard crashes when offline

### Registration

Handled in:

```
components/shared/PWARegister.tsx
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

* slug generation
* streak calculation
* habit toggle logic
* input validation

### Integration Tests

* auth flows
* habit form behavior
* UI interaction logic

### E2E Tests (Playwright)

* full user journey
* signup → login → create habit → complete habit
* persistence across reload
* logout behavior
* offline app shell loading

---

## 🧠 Key Design Decisions

### 1. Local-first architecture

No backend is used. Everything is deterministic via localStorage.

### 2. Service separation

* `lib/` handles pure logic
* `components/` handles UI only
* `tests/` mirrors behavior, not implementation

### 3. Testability-first design

Every feature is structured so it can be tested without mocking external systems.

---

## ⚠️ Limitations

* No backend persistence (intentional for stage requirement)
* No real-time sync across devices
* Auth is not secure (localStorage-based only)
* PWA offline scope is limited to cached shell

---

## 📦 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test:unit": "vitest run --coverage",
  "test:integration": "vitest run",
  "test:e2e": "playwright test",
  "test": "npm run test:unit && npm run test:integration && npm run test:e2e"
}
```

---

## 🧭 How to Run

```bash
npm install
npm run dev
```

Run tests:

```bash
npm run test
```

---

## 📌 Summary

Habitify is a deterministic, offline-first habit tracker built with strict adherence to frontend engineering principles.
It prioritizes predictable state, testability, and PWA compliance over backend complexity.
