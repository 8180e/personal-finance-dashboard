import { connectDB, disconnectDB } from "./config/db.config.js";
import app from "./app.js";

connectDB();

app.listen(3000, () => console.log("Server is running on port 3000"));

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
