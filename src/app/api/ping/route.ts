import net from "node:net";
import { type NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const portsParam = searchParams.get("ports");

  if (!portsParam) {
    const portParam = searchParams.get("port");
    if (!portParam) {
      return NextResponse.json({ error: "Missing port or ports parameter" }, { status: 400 });
    }
    const portNum = Number.parseInt(portParam, 10);
    if (Number.isNaN(portNum) || portNum <= 0 || portNum > 65535) {
      return NextResponse.json({ error: "Invalid port number" }, { status: 400 });
    }
    const isOpen = await checkPort(portNum);
    return NextResponse.json({ port: portNum, active: isOpen });
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

  return NextResponse.json({ statuses: results });
}
