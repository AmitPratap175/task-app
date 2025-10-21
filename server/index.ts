import { spawn } from "child_process";

const port = parseInt(process.env.PORT || "5000", 10);
const isProduction = process.env.NODE_ENV === "production";

console.log(`Starting FastAPI server on port ${port}...`);

const pythonProcess = spawn("uvicorn", [
  "api.main:app",
  "--host",
  "0.0.0.0",
  "--port",
  port.toString(),
  ...(isProduction ? [] : ["--reload"]),
], {
  stdio: "inherit",
  env: { ...process.env },
});

pythonProcess.on("error", (error) => {
  console.error("Failed to start Python server:", error);
  process.exit(1);
});

pythonProcess.on("exit", (code) => {
  console.log(`Python server exited with code ${code}`);
  process.exit(code || 0);
});

process.on("SIGINT", () => {
  pythonProcess.kill("SIGINT");
});

process.on("SIGTERM", () => {
  pythonProcess.kill("SIGTERM");
});
