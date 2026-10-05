import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/mockData';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  CURRENT_USER: 'trackease_current_user',
  USERS_LIST: 'trackease_registered_users',
  REMEMBERED_EMAIL: 'trackease_remembered_email'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(initialUsers));
      return initialUsers;
    } catch (e) {
      console.error('Failed to load users list', e);
      return initialUsers;
    }
  });

  const [rememberedEmail, setRememberedEmail] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) || '';
  });

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist users list', e);
    }
  }, [users]);

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to persist current user', e);
    }
  }, [currentUser]);

  // Login handler
  const login = async (identifier, password, rememberMe = false) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmed = identifier.trim().toLowerCase();
        const user = users.find(
          (u) =>
            (u.email.toLowerCase() === trimmed || u.username.toLowerCase() === trimmed) &&
            u.password === password
        );

        if (user) {
          const authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            loginTime: new Date().toISOString()
          };

          setCurrentUser(authUser);

          if (rememberMe) {
            localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, identifier);
            setRememberedEmail(identifier);
          } else {
            localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
            setRememberedEmail('');
          }

          resolve({ success: true, user: authUser });
        } else {
          reject(new Error('Invalid email/username or password. Try demo credentials.'));
        }
      }, 500); // Simulate network latency
    });
  };

  // Google Login mock handler
  const loginWithGoogle = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const googleUser = {
          id: 'usr-google-' + Date.now(),
          name: 'Google Verified User',
          email: 'user.verified@gmail.com',
          username: 'google_user',
          role: 'Customer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          loginTime: new Date().toISOString()
        };
        setCurrentUser(googleUser);
        resolve({ success: true, user: googleUser });
      }, 600);
    });
  };

  // Register handler
  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = users.some(
          (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
        );
        const usernameExists = users.some(
          (u) => u.username.toLowerCase() === userData.username.trim().toLowerCase()
        );

        if (emailExists) {
          reject(new Error('An account with this email address already exists.'));
          return;
        }

        if (usernameExists) {
          reject(new Error('This username is already taken. Please choose another.'));
          return;
        }

        const newUser = {
          id: 'usr-' + Date.now(),
          name: userData.name.trim(),
          username: userData.username.trim(),
          email: userData.email.trim(),
          password: userData.password,
          role: userData.role || 'Customer',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
          createdAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        // Auto-login registered user
        const authUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          avatar: newUser.avatar,
          loginTime: new Date().toISOString()
        };
        setCurrentUser(authUser);

        resolve({ success: true, user: authUser });
      }, 600);
    });
  };

  // Forgot password handler
  const forgotPassword = async (identifier) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmed = identifier.trim().toLowerCase();
        const found = users.find(
          (u) => u.email.toLowerCase() === trimmed || u.username.toLowerCase() === trimmed
        );

        if (found) {
          resolve({
            success: true,
            email: found.email,
            message: `A password reset token has been dispatched to ${found.email}.`
          });
        } else {
          // For security, can still confirm or simulate
          resolve({
            success: true,
            email: identifier,
            message: `If an account with that email exists, password reset instructions have been sent.`
          });
        }
      }, 500);
    });
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    users,
    rememberedEmail,
    login,
    loginWithGoogle,
    register,
    forgotPassword,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
