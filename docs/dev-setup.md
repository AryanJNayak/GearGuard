# Dev Setup & Notes

## Backend

1. Install dependencies:
   cd backend && npm install

2. Start server:
   npm run dev

3. Reset DB (drop & recreate tables):
   - Programmatic (protected endpoint): POST /api/admin/reset (requires an admin JWT)
   - CLI tool: node tools/reset-db.js

4. Create an admin user (initial setup):
   - Option A (quick): Sign up a user via POST /api/auth/signup, then open your MySQL client and run:
     UPDATE users SET is_admin = 1 WHERE email = 'your@email.com';
   - Option B (if you already have an admin): use POST /api/admin/promote with admin token.


## Frontend

1. Install dependencies:
   cd frontend && npm install
   (this will install `react-router-dom`, and tailwind/postcss dependencies added to package.json)

2. Tailwind setup (already added):
   - `tailwind.config.cjs` and `postcss.config.cjs` are added.
   - The `src/index.css` includes Tailwind directives and some utility classes.

3. Start dev server:
   npm run dev

4. Pages added:
   - /login
   - /signup
   - /admin (Admin dashboard)
   - /teams (Create/list teams)
   - /team-members (Add members, manage manager role)
   - /categories (Create/list equipment categories)
   - /equipment (Add/list equipment)
   - /requests (Create and view maintenance requests)

Note: Run `npm install` in the frontend to fetch Tailwind packages before running the dev server.

## Notes
- Ensure `.env` in `backend` has DB credentials and `JWT_SECRET`.
- Admin-only endpoints require JWT with `isAdmin: true`.
- The frontend uses localStorage token + `user` object to manage session and to show admin UI.
