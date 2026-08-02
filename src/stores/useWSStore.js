import { ref } from "vue";

export const useWebSocketFetch = (machineId, onData) => {
  const socket = ref(null);

  const connect = () => {
    const wsUrl = import.meta.env.VITE_WS_URL
    socket.value = new window.WebSocket(wsUrl);

    socket.value.onopen = () => {
      socket.value.send(
        JSON.stringify({
          machineId,
        })
      );
    };

    socket.value.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      onData(payload);
    };
  };

  const disconnect = () => {
    socket.value?.close();
    socket.value = null;
  };

  return {
    connect,
    disconnect,
    socket,
  };
};
