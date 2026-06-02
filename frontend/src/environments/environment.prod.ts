// ─────────────────────────────────────────────────────────────────────────────
// Environment — Production
// When you run: ng build --configuration production
// Angular uses THIS file instead. API calls go to your Render.com backend.
// ─────────────────────────────────────────────────────────────────────────────
export const environment = {
  production: true,
  // 🔧 Replace this URL with your actual Render.com backend service URL
  apiUrl: 'https://bus-timetable-api.onrender.com/api'
};
