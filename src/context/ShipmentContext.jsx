import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchThirdPartyShipments } from '../services/api';
import { initialRecentShipments } from '../data/mockData';

const ShipmentContext = createContext(null);

const STORAGE_KEY = 'trackease_shipments_data';

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load shipments on mount: LocalStorage first, otherwise Third-Party API
  useEffect(() => {
    const loadShipments = async () => {
      setLoading(true);
      setError(null);
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setShipments(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Fetch from third-party API
        const apiData = await fetchThirdPartyShipments();
        if (apiData && apiData.length > 0) {
          setShipments(apiData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } else {
          // Fallback initial data
          const fallback = initialRecentShipments.map((s, idx) => ({
            id: s.id,
            trackingNumber: s.trackingNumber,
            senderName: s.sender,
            receiverName: s.recipient,
            pickupAddress: s.origin,
            deliveryAddress: s.destination,
            parcelWeight: s.weight,
            parcelType: s.parcelType,
            shippingDate: '2026-09-14',
            expectedDeliveryDate: '2026-09-17',
            deliveryStatus: s.status,
            notes: 'Primary freight assignment'
          }));
          setShipments(fallback);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
        }
      } catch (err) {
        setError('Failed to load shipment records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadShipments();
  }, []);

  // Sync to LocalStorage on state change
  const saveShipments = (newShipments) => {
    setShipments(newShipments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newShipments));
  };

  // Helper to generate unique tracking number
  const generateTrackingNumber = (originCity = 'IN') => {
    const prefix = 'TRK';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const suffix = originCity.slice(0, 3).toUpperCase() || 'IN';
    return `${prefix}-${randNum}-${suffix}`;
  };

  // Create Shipment
  const createShipment = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trackingNumber = data.trackingNumber || generateTrackingNumber(data.pickupAddress || 'BLR');
        const newShipment = {
          id: 'shp-' + Date.now(),
          trackingNumber,
          senderName: data.senderName.trim(),
          receiverName: data.receiverName.trim(),
          pickupAddress: data.pickupAddress.trim(),
          deliveryAddress: data.deliveryAddress.trim(),
          parcelWeight: data.parcelWeight ? `${parseFloat(data.parcelWeight)} kg` : '1.5 kg',
          parcelType: data.parcelType || 'Standard Box',
          shippingDate: data.shippingDate || new Date().toISOString().split('T')[0],
          expectedDeliveryDate: data.expectedDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          deliveryStatus: data.deliveryStatus || 'In Transit',
          notes: data.notes || ''
        };

        const updated = [newShipment, ...shipments];
        saveShipments(updated);
        resolve(newShipment);
      }, 400);
    });
  };

  // Update Shipment
  const updateShipment = async (id, updatedFields) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = shipments.findIndex((s) => s.id === id);
        if (index === -1) {
          reject(new Error('Shipment not found'));
          return;
        }

        const updatedShipment = {
          ...shipments[index],
          ...updatedFields,
          parcelWeight: updatedFields.parcelWeight?.includes('kg')
            ? updatedFields.parcelWeight
            : `${parseFloat(updatedFields.parcelWeight || 1.5)} kg`
        };

        const updated = [...shipments];
        updated[index] = updatedShipment;
        saveShipments(updated);
        resolve(updatedShipment);
      }, 350);
    });
  };

  // Delete Shipment
  const deleteShipment = async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = shipments.filter((s) => s.id !== id);
        saveShipments(filtered);
        resolve(true);
      }, 300);
    });
  };

  // Find shipment by ID or tracking number
  const getShipment = (identifier) => {
    return shipments.find(
      (s) =>
        s.id === identifier ||
        s.trackingNumber.toLowerCase() === identifier.toLowerCase()
    );
  };

  const value = {
    shipments,
    loading,
    error,
    createShipment,
    updateShipment,
    deleteShipment,
    getShipment,
    generateTrackingNumber,
    reload: () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>;
};

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};
