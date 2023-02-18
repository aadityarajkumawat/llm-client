export const __is_prod__ = process.env.NODE_ENV === "production";
export const CLIENT_URL = __is_prod__
  ? "https://klu.vercel.app"
  : "http://localhost:3000";
export const API_URL = __is_prod__
  ? "https://klu.up.railway.app"
  : "http://localhost:4001";
