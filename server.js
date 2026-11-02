import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`[Blackwood Scout Server] Running on ws://localhost:${PORT}`);

const scouts = new Map();
const sockets = new Map();

function broadcast(msg, exceptId) {
  const data = JSON.stringify(msg);
  for (const [id, ws] of sockets) {
    if (id !== exceptId && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

wss.on('connection', (ws) => {
  const scoutId = `scout_${Math.random().toString(36).substring(2, 8)}`;
  sockets.set(scoutId, ws);

  console.log(`[Scout Connected] ID: ${scoutId} (Total: ${sockets.size})`);

  // Send initial welcome
  ws.send(
    JSON.stringify({
      type: 'welcome',
      id: scoutId,
      message: 'Connected to Blackwood Expedition Network',
    })
  );

  // Send existing scouts
  for (const [id, s] of scouts) {
    ws.send(
      JSON.stringify({
        type: 'scout_join',
        id,
        name: s.name,
        color: s.color,
        x: s.x,
        y: s.y,
        z: s.z,
        yaw: s.yaw,
      })
    );
  }

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      if (msg.type === 'player_update') {
        scouts.set(scoutId, {
          id: scoutId,
          name: msg.name || 'Fellow Scout',
          color: msg.color || '#f97316',
          x: msg.x,
          y: msg.y,
          z: msg.z,
          yaw: msg.yaw,
          lastSeen: Date.now(),
        });

        // Broadcast to other hikers
        broadcast(
          {
            type: 'player_update',
            id: scoutId,
            name: msg.name,
            x: msg.x,
            y: msg.y,
            z: msg.z,
            yaw: msg.yaw,
          },
          scoutId
        );
      } else if (msg.type === 'ping_beacon') {
        broadcast(
          {
            type: 'ping_beacon',
            id: scoutId,
            senderName: msg.senderName || 'Scout',
            x: msg.x,
            y: msg.y,
            z: msg.z,
          },
          scoutId
        );
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  });

  ws.on('close', () => {
    console.log(`[Scout Disconnected] ID: ${scoutId}`);
    sockets.delete(scoutId);
    scouts.delete(scoutId);
    broadcast({ type: 'scout_leave', id: scoutId });
  });
});
