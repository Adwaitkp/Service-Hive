import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket.io connected');
      // Authenticate the socket with user ID to join their personal room
      socket.emit('authenticate', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
