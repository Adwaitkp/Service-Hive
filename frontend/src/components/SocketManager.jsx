import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initializeSocket, getSocket, disconnectSocket } from '../utils/socket';

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000); // Auto-dismiss after 8 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">🎉 Congratulations!</h3>
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

const SocketManager = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Initialize socket connection
      const socket = initializeSocket(user._id);

      // Listen for hire notifications
      socket.on('hired', (data) => {
        console.log('Received hire notification:', data);
        setNotification(data);
        
        // Play notification sound (optional)
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch((e) => console.log('Could not play sound:', e));
        } catch (error) {
          console.log('Notification sound not available');
        }
      });

      return () => {
        // Clean up socket listeners
        const socket = getSocket();
        if (socket) {
          socket.off('hired');
        }
      };
    } else {
      // Disconnect socket when user logs out
      disconnectSocket();
    }
  }, [isAuthenticated, user]);

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <>
      {notification && (
        <NotificationToast 
          notification={notification} 
          onClose={closeNotification} 
        />
      )}
    </>
  );
};

export default SocketManager;
