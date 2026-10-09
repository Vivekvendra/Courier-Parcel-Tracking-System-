import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchThirdPartyShipments } from '../services/api';
import { initialRecentShipments } from '../data/mockData';
import { buildInitialStatusHistory, getShipmentCurrentLocation, getCourierAgentDetails } from '../utils/trackingUtils';
import { useNotifications } from './NotificationContext';

const ShipmentContext = createContext(null);

const STORAGE_KEY = 'trackease_shipments_data';

export const ShipmentProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to ensure each shipment has complete tracking metadata
  const enrichShipment = (s) => {
    const history = (s.statusHistory && s.statusHistory.length > 0)
      ? s.statusHistory
      : buildInitialStatusHistory(s);

    const location = s.currentLocation || getShipmentCurrentLocation(s);
    const carrier = s.carrierInfo || getCourierAgentDetails(s);

    return {
      ...s,
      statusHistory: history,
      currentLocation: location,
      carrierInfo: carrier
    };
  };

  // Load shipments on mount: LocalStorage first, otherwise Third-Party API
  useEffect(() => {
    const loadShipments = async () => {
      setLoading(true);
      setError(null);
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const enriched = parsed.map(enrichShipment);
          setShipments(enriched);
          setLoading(false);
          return;
        }

        // Fetch from third-party API
        const apiData = await fetchThirdPartyShipments();
        if (apiData && apiData.length > 0) {
          const enriched = apiData.map(enrichShipment);
          setShipments(enriched);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
        } else {
          // Fallback initial data
          const fallback = initialRecentShipments.map((s) => ({
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
          const enriched = fallback.map(enrichShipment);
          setShipments(enriched);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
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
        const rawShipment = {
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
          deliveryStatus: data.deliveryStatus || 'Pending',
          notes: data.notes || ''
        };

        const newShipment = enrichShipment(rawShipment);
        const updated = [newShipment, ...shipments];
        saveShipments(updated);

        // Shipment Created Notification
        if (addNotification) {
          addNotification({
            type: 'SHIPMENT_CREATED',
            title: 'Shipment Created',
            message: `New consignment ${newShipment.trackingNumber} registered for ${newShipment.receiverName}.`,
            trackingNumber: newShipment.trackingNumber,
            severity: 'info'
          });
        }

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

        const current = shipments[index];
        const statusChanged = updatedFields.deliveryStatus && updatedFields.deliveryStatus !== current.deliveryStatus;

        let updatedHistory = current.statusHistory || [];
        if (statusChanged) {
          const newEntry = {
            id: `sth-${Date.now()}`,
            status: updatedFields.deliveryStatus,
            timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            location: updatedFields.pickupAddress || 'Regional Logistics Hub',
            updatedBy: 'Operations Desk',
            note: updatedFields.notes || `Status modified to ${updatedFields.deliveryStatus}`
          };
          updatedHistory = [...updatedHistory, newEntry];
        }

        const updatedShipment = {
          ...current,
          ...updatedFields,
          parcelWeight: updatedFields.parcelWeight?.includes('kg')
            ? updatedFields.parcelWeight
            : `${parseFloat(updatedFields.parcelWeight || 1.5)} kg`,
          statusHistory: updatedHistory
        };

        const finalEnriched = enrichShipment(updatedShipment);
        const updated = [...shipments];
        updated[index] = finalEnriched;
        saveShipments(updated);
        resolve(finalEnriched);
      }, 350);
    });
  };

  // Update Delivery Status
  const updateDeliveryStatus = async (identifier, newStatus, details = {}) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = shipments.findIndex(
          (s) => s.id === identifier || s.trackingNumber.toLowerCase() === identifier.toLowerCase()
        );

        if (index === -1) {
          reject(new Error('Shipment record not found'));
          return;
        }

        const current = shipments[index];
        const timestampStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
          ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const historyEntry = {
          id: `sth-${Date.now()}`,
          status: newStatus,
          timestamp: timestampStr,
          location: details.location || current.currentLocation?.hub || 'Regional Cargo Hub',
          updatedBy: details.updatedBy || 'Operations Lead',
          note: details.note || (details.reason ? `${details.reason}: Status updated to ${newStatus}` : `Status updated to ${newStatus}`)
        };

        const updatedHistory = [...(current.statusHistory || []), historyEntry];

        let updatedLocation = current.currentLocation;
        if (details.location) {
          updatedLocation = {
            ...current.currentLocation,
            hub: details.location,
            lastScanned: timestampStr
          };
        }

        const updatedShipment = {
          ...current,
          deliveryStatus: newStatus,
          statusHistory: updatedHistory,
          currentLocation: updatedLocation,
          notes: details.note ? `${current.notes ? current.notes + ' | ' : ''}${details.note}` : current.notes
        };

        const finalEnriched = enrichShipment(updatedShipment);
        const updatedList = [...shipments];
        updatedList[index] = finalEnriched;
        saveShipments(updatedList);

        // Dispatch Live Notifications
        if (addNotification) {
          if (newStatus === 'Delivered') {
            addNotification({
              type: 'DELIVERY_COMPLETED',
              title: 'Delivery Completed',
              message: `Parcel ${current.trackingNumber} successfully delivered to ${current.receiverName}.`,
              trackingNumber: current.trackingNumber,
              severity: 'success'
            });
          } else if (newStatus === 'Failed Delivery') {
            addNotification({
              type: 'FAILED_ALERT',
              title: 'Failed Delivery Alert',
              message: `Delivery attempt failed for ${current.trackingNumber}. Consignee unavailable at ${details.location || 'destination address'}.`,
              trackingNumber: current.trackingNumber,
              severity: 'error'
            });
          } else {
            addNotification({
              type: 'STATUS_UPDATE',
              title: 'Delivery Status Updated',
              message: `Consignment ${current.trackingNumber} updated to "${newStatus}" at ${details.location || 'regional transit hub'}.`,
              trackingNumber: current.trackingNumber,
              severity: 'info'
            });
          }
        }

        resolve(finalEnriched);
      }, 300);
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
    if (!identifier) return null;
    return shipments.find(
      (s) =>
        s.id === identifier ||
        s.trackingNumber.toLowerCase() === identifier.toLowerCase().trim()
    );
  };

  // Find multiple shipments by tracking numbers
  const getMultipleShipments = (trackingNumbers = []) => {
    if (!Array.isArray(trackingNumbers) || trackingNumbers.length === 0) return [];
    const normalized = trackingNumbers.map((t) => t.trim().toLowerCase()).filter(Boolean);
    return shipments.filter((s) =>
      normalized.includes(s.trackingNumber.toLowerCase()) ||
      normalized.includes(s.id.toLowerCase())
    );
  };

  const value = {
    shipments,
    loading,
    error,
    createShipment,
    updateShipment,
    updateDeliveryStatus,
    deleteShipment,
    getShipment,
    getMultipleShipments,
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

export default ShipmentContext;
