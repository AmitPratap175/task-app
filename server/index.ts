import { spawn } from "child_process";
import express from "express";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";

const port = parseInt(process.env.PORT || "5000", 10);
const isProduction = process.env.NODE_ENV === "production";
const apiPort = 8000;

if (isProduction) {
  console.log(`Starting FastAPI server on port ${port}...`);
  const pythonProcess = spawn("uvicorn", [
    "api.main:app",
    "--host",
    "0.0.0.0",
    "--port",
    port.toString(),
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
} else {
  (async () => {
    console.log(`Starting development server on port ${port}...`);
    console.log(`Starting FastAPI backend on port ${apiPort}...`);
    
    const pythonProcess = spawn("uv", [
      "run",
      "uvicorn",
      "api.main:app",
      "--host",
      "127.0.0.1",
      "--port",
      apiPort.toString(),
      "--reload"
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

    const app = express();
    const server = createServer(app);

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server },
        host: "0.0.0.0",
        allowedHosts: true,
      },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("/api", async (req, res) => {
      const targetUrl = `http://127.0.0.1:${apiPort}/api${req.url}`;
      try {
        const response = await fetch(targetUrl, {
          method: req.method,
          headers: req.headers as HeadersInit,
          body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
        });
        
        const data = await response.text();
        res.status(response.status);
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        res.send(data);
      } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Failed to proxy request" });
      }
    });

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const template = await vite.transformIndexHtml(url, `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>StudyFlow - Exam Preparation Task Manager</title>
    <meta name="description" content="A comprehensive productivity companion for students preparing for exams. Manage tasks, track goals, use Pomodoro timer, and analyze your study patterns." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
        `);
        
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

    server.listen(port, "0.0.0.0", () => {
      console.log(`Dev server listening on http://0.0.0.0:${port}`);
    });

    process.on("SIGINT", () => {
      pythonProcess.kill("SIGINT");
      server.close();
    });

    process.on("SIGTERM", () => {
      pythonProcess.kill("SIGTERM");
      server.close();
    });
  })();
}
