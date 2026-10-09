import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialNotifications } from '../data/mockData';

const NotificationContext = createContext(null);

const STORAGE_KEY = 'trackease_notifications_data';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to parse cached notifications:', e);
    }
    return initialNotifications;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to persist notifications to localStorage:', e);
    }
  }, [notifications]);

  // Unread badge count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Add a new notification
  const addNotification = ({
    type = 'STATUS_UPDATE',
    title,
    message,
    trackingNumber = '',
    severity = 'info'
  }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type,
      title: title || 'Notification',
      message: message || '',
      trackingNumber,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      read: false,
      severity
    };

    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  };

  // Mark single as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark single as unread
  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Clear all
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Reset to default
  const resetNotifications = () => {
    setNotifications(initialNotifications);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    resetNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
