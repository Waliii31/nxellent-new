// src/utils/notificationsStream.ts
import { API_BASE } from "../services/api";

export function createNotificationsStream(
  token: string,
  onMessage: (data: unknown) => void
) {
  const url = new URL("/notifications/stream", API_BASE);
  url.searchParams.set("token", token);

  const es = new EventSource(url.toString());

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      // ignore malformed
    }
  };

  return es;
}
