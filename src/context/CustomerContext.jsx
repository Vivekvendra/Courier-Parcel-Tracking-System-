import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchThirdPartyCustomers } from '../services/api';

const CustomerContext = createContext(null);

const STORAGE_KEY = 'trackease_customers_data';

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setCustomers(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Fetch from third-party API
        const apiData = await fetchThirdPartyCustomers();
        if (apiData && apiData.length > 0) {
          setCustomers(apiData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } else {
          // Fallback initial customer directory
          const fallback = [
            {
              id: 'cust-1',
              name: 'Ramesh Kumar',
              email: 'ramesh.kumar@techmart.in',
              phone: '+91 98450 12345',
              address: 'Plot 42, Electronic City Phase 1',
              city: 'Bengaluru',
              postalCode: '560100',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
              totalShipments: 14,
              status: 'Active'
            },
            {
              id: 'cust-2',
              name: 'Sneha Reddy',
              email: 'sneha.reddy@gmail.com',
              phone: '+91 98840 56789',
              address: 'Survey 115, Hitec City',
              city: 'Hyderabad',
              postalCode: '500081',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
              totalShipments: 22,
              status: 'Active'
            },
            {
              id: 'cust-3',
              name: 'Arjun Mehta',
              email: 'arjun.mehta@delhicorp.com',
              phone: '+91 99110 98765',
              address: '15 Barakhamba Road, Connaught Place',
              city: 'Delhi',
              postalCode: '110001',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
              totalShipments: 8,
              status: 'Active'
            },
            {
              id: 'cust-4',
              name: 'Priya Sharma',
              email: 'priya.sharma@mumbaidesign.in',
              phone: '+91 98200 45678',
              address: 'BKC Commercial Tower, Bandra',
              city: 'Mumbai',
              postalCode: '400051',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              totalShipments: 19,
              status: 'Active'
            },
            {
              id: 'cust-5',
              name: 'Vikram Sundaram',
              email: 'vikram.sundaram@chennaiexports.com',
              phone: '+91 94440 32109',
              address: '12 Anna Salai, T Nagar',
              city: 'Chennai',
              postalCode: '600017',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              totalShipments: 11,
              status: 'Active'
            }
          ];
          setCustomers(fallback);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
        }
      } catch (err) {
        setError('Failed to load customers directory.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const saveCustomers = (newCustomers) => {
    setCustomers(newCustomers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCustomers));
  };

  // Add Customer
  const addCustomer = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer = {
          id: 'cust-' + Date.now(),
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          address: data.address.trim(),
          city: data.city.trim(),
          postalCode: data.postalCode.trim(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
          totalShipments: 0,
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0]
        };

        const updated = [newCustomer, ...customers];
        saveCustomers(updated);
        resolve(newCustomer);
      }, 350);
    });
  };

  // Update Customer
  const updateCustomer = async (id, updatedFields) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = customers.findIndex((c) => c.id === id);
        if (idx === -1) {
          reject(new Error('Customer not found'));
          return;
        }

        const updatedCustomer = {
          ...customers[idx],
          ...updatedFields
        };

        const updated = [...customers];
        updated[idx] = updatedCustomer;
        saveCustomers(updated);
        resolve(updatedCustomer);
      }, 300);
    });
  };

  // Delete Customer
  const deleteCustomer = async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = customers.filter((c) => c.id !== id);
        saveCustomers(filtered);
        resolve(true);
      }, 300);
    });
  };

  const getCustomerById = (id) => {
    return customers.find((c) => c.id === id);
  };

  const value = {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
