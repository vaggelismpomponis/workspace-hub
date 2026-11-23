import net from "node:net";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { type Plugin, defineConfig } from "vite";

function checkPort(port: number, timeout = 400): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let hasResolved = false;

    const cleanup = () => {
      if (!socket.destroyed) {
        socket.destroy();
      }
    };

    socket.setTimeout(timeout);

    socket.once("connect", () => {
      hasResolved = true;
      cleanup();
      resolve(true);
    });

    socket.once("timeout", () => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        resolve(false);
      }
    });

    socket.once("error", () => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        resolve(false);
      }
    });

    try {
      socket.connect(port, "127.0.0.1");
    } catch {
      resolve(false);
    }
  });
}

function localPortPingPlugin(): Plugin {
  return {
    name: "local-port-ping-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/ping")) {
          return next();
        }

        try {
          const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
          const portsParam = url.searchParams.get("ports");

          if (!portsParam) {
            const portParam = url.searchParams.get("port");
            if (!portParam) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              return res.end(JSON.stringify({ error: "Missing port or ports parameter" }));
            }
            const portNum = Number.parseInt(portParam, 10);
            if (Number.isNaN(portNum) || portNum <= 0 || portNum > 65535) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              return res.end(JSON.stringify({ error: "Invalid port number" }));
            }
            const isOpen = await checkPort(portNum);
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ port: portNum, active: isOpen }));
          }

          const ports = portsParam
            .split(",")
            .map((p) => Number.parseInt(p.trim(), 10))
            .filter((p) => !Number.isNaN(p) && p > 0 && p <= 65535);

          const results: Record<number, boolean> = {};
          await Promise.all(
            ports.map(async (port) => {
              results[port] = await checkPort(port);
            }),
          );

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ statuses: results }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Internal error checking ports" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localPortPingPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
