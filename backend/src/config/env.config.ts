import "dotenv/config";

const {
  PORT = 3000,
  TOKEN_SECRET,
  MONGODB_URI,
  FRONTEND_URLS,
} = process.env as Record<string, string>;

export { PORT, TOKEN_SECRET, MONGODB_URI, FRONTEND_URLS };
