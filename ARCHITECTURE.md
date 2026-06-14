# CareerForge AI Architecture

## Recommended Folder Structure

```text
client/
  src/
    components/
      ui/                 # reusable presentational components
      AIAssistant.jsx
      JobTracker.jsx
      ResumeAnalyzer.jsx
      ProtectedRoute.jsx
      Sidebar.jsx
    context/              # app-wide auth and toast state
    layouts/              # authenticated SaaS shell
    pages/                # route-level screens
    services/             # axios client and API helpers
server/server/
  config/
  controllers/
  middleware/
  models/
  routes/
  index.js
```

## Architecture

- React Router owns route composition. Protected pages are nested under `ProtectedRoute` and `MainLayout`.
- Axios is centralized in `src/services/api.js`, which attaches JWTs and handles expired sessions.
- Auth state is isolated in `AuthContext`; notifications are isolated in `ToastContext`.
- Backend routes are controller-driven and protected with JWT middleware where user data is involved.
- Job and chat records are scoped by `userId` to prevent users reading each other's data.

## Deployment Guide

### Vercel Frontend

1. Set root directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add environment variable:
   - `VITE_API_URL=https://your-render-service.onrender.com/api`

### Render Backend

1. Set root directory to `server/server`.
2. Build command: `npm install`.
3. Start command: `npm start`.
4. Add environment variables from `server/server/.env.example`.
5. Set `CLIENT_URL` to your Vercel URL.

### MongoDB Atlas

1. Create an Atlas cluster and database user.
2. Add Render outbound access or allow required IP access.
3. Copy the connection string into `MONGO_URI`.
4. Keep database credentials out of source control.

## Production Environment

- Use long random `JWT_SECRET` values.
- Keep frontend and backend env files separate.
- Configure CORS with exact origins, not `*`.
- Use HTTPS URLs in production environment variables.
- Rotate OpenRouter and MongoDB secrets if they are ever exposed.

## Security Recommendations

- Prefer httpOnly refresh cookies for long-lived production sessions.
- Add rate limiting to auth and AI endpoints.
- Add request validation with a schema library such as Zod or Joi.
- Add Helmet for common HTTP security headers.
- Add centralized logging and monitoring on Render.
- Store only necessary AI chat history and offer deletion/export controls.

## Future AI Features

- Role-specific resume tailoring with downloadable bullet rewrites.
- Interview answer scoring with STAR feedback.
- Job description keyword extraction and skill-gap roadmap.
- Cover letter generator tied to saved jobs.
- Weekly job-search coach that reviews funnel progress.
- Semantic search across prior chats, resumes, and applications.
