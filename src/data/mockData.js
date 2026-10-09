export const initialUsers = [
  {
    id: 'usr-1',
    name: 'Admin Manager',
    username: 'admin',
    email: 'admin@trackease.com',
    password: 'password123',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15'
  },
  {
    id: 'usr-2',
    name: 'Courier Agent Alex',
    username: 'agent_alex',
    email: 'agent@trackease.com',
    password: 'password123',
    role: 'Courier Agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01'
  },
  {
    id: 'usr-3',
    name: 'Demo User',
    username: 'demouser',
    email: 'demo@trackease.com',
    password: 'password123',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-10'
  }
];

export const initialDashboardStats = {
  totalShipments: 1482,
  inTransit: 342,
  delivered: 1024,
  pending: 116,
  totalCustomers: 890,
  todayShipments: 64,
  deliverySuccessRate: 98.4,
  avgDeliveryHours: 28.5,
  growthRate: 14.2
};

export const initialRecentActivities = [
  {
    id: 'act-1',
    type: 'DELIVERED',
    trackingNumber: 'TRK-9821-BLR',
    description: 'Parcel safely delivered to recipient in Koramangala, Bengaluru',
    recipient: 'Priya Sharma',
    sender: 'TechMart Electronics',
    timestamp: '10 minutes ago',
    location: 'Bengaluru, KA',
    status: 'Delivered'
  },
  {
    id: 'act-2',
    type: 'OUT_FOR_DELIVERY',
    trackingNumber: 'TRK-9820-MUM',
    description: 'Out for delivery with Courier Agent Rahul (Vehicle MH-02-AX-4821)',
    recipient: 'Vikram Mehta',
    sender: 'Mumbai Apparel Hub',
    timestamp: '25 minutes ago',
    location: 'Andheri West, Mumbai',
    status: 'Out for Delivery'
  },
  {
    id: 'act-3',
    type: 'IN_TRANSIT',
    trackingNumber: 'TRK-9819-DEL',
    description: 'Departed Central Sorting Hub, en route to Indira Gandhi Airport hub',
    recipient: 'Ananya Gupta',
    sender: 'Craftsvilla India',
    timestamp: '1 hour ago',
    location: 'New Delhi, DL',
    status: 'In Transit'
  },
  {
    id: 'act-4',
    type: 'PICKED_UP',
    trackingNumber: 'TRK-9818-HYD',
    description: 'Package picked up from warehouse in Hitec City',
    recipient: 'Karthik Reddy',
    sender: 'Zenith Logistics Hub',
    timestamp: '2 hours ago',
    location: 'Hyderabad, TS',
    status: 'Picked Up'
  },
  {
    id: 'act-5',
    type: 'PENDING',
    trackingNumber: 'TRK-9817-CHE',
    description: 'Shipment manifest generated. Awaiting pickup dispatch',
    recipient: 'Sunita Ramesh',
    sender: 'Coastal Exporters',
    timestamp: '3 hours ago',
    location: 'Chennai, TN',
    status: 'Pending'
  }
];

export const initialRecentShipments = [
  {
    id: 'sh-1',
    trackingNumber: 'TRK-9821-BLR',
    sender: 'TechMart Electronics',
    recipient: 'Priya Sharma',
    origin: 'Electronic City, Bengaluru',
    destination: 'Koramangala, Bengaluru',
    parcelType: 'Express Document',
    weight: '1.2 kg',
    status: 'Delivered',
    date: 'Today, 02:45 PM',
    eta: 'Today'
  },
  {
    id: 'sh-2',
    trackingNumber: 'TRK-9820-MUM',
    sender: 'Mumbai Apparel Hub',
    recipient: 'Vikram Mehta',
    origin: 'Bandra, Mumbai',
    destination: 'Andheri West, Mumbai',
    parcelType: 'Standard Box',
    weight: '3.5 kg',
    status: 'Out for Delivery',
    date: 'Today, 11:20 AM',
    eta: 'Today by 6:00 PM'
  },
  {
    id: 'sh-3',
    trackingNumber: 'TRK-9819-DEL',
    sender: 'Craftsvilla India',
    recipient: 'Ananya Gupta',
    origin: 'Connaught Place, Delhi',
    destination: 'Sector 62, Noida',
    parcelType: 'Fragile Glassware',
    weight: '2.8 kg',
    status: 'In Transit',
    date: 'Today, 09:15 AM',
    eta: 'Tomorrow, 12:00 PM'
  },
  {
    id: 'sh-4',
    trackingNumber: 'TRK-9818-HYD',
    sender: 'Zenith Logistics Hub',
    recipient: 'Karthik Reddy',
    origin: 'Hitec City, Hyderabad',
    destination: 'Banjara Hills, Hyderabad',
    parcelType: 'Heavy Freight',
    weight: '12.0 kg',
    status: 'Picked Up',
    date: 'Yesterday, 06:30 PM',
    eta: 'Tomorrow'
  },
  {
    id: 'sh-5',
    trackingNumber: 'TRK-9817-CHE',
    sender: 'Coastal Exporters',
    recipient: 'Sunita Ramesh',
    origin: 'T Nagar, Chennai',
    destination: 'Anna Nagar, Chennai',
    parcelType: 'Standard Parcel',
    weight: '0.8 kg',
    status: 'Pending',
    date: 'Yesterday, 04:10 PM',
    eta: 'Oct 07, 2026'
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    type: 'DELIVERY_COMPLETED',
    title: 'Delivery Completed',
    message: 'Parcel TRK-9821-BLR was successfully handed over to Priya Sharma in Koramangala, Bengaluru.',
    trackingNumber: 'TRK-9821-BLR',
    timestamp: '12m ago',
    read: false,
    severity: 'success'
  },
  {
    id: 'notif-2',
    type: 'STATUS_UPDATE',
    title: 'Delivery Status Updated',
    message: 'Shipment TRK-9820-MUM is now Out for Delivery with courier agent Rahul Verma in Mumbai.',
    trackingNumber: 'TRK-9820-MUM',
    timestamp: '35m ago',
    read: false,
    severity: 'info'
  },
  {
    id: 'notif-3',
    type: 'FAILED_ALERT',
    title: 'Failed Delivery Alert',
    message: 'Consignee unavailable at Koramangala delivery address for TRK-9818-HYD. Re-attempt scheduled for next morning.',
    trackingNumber: 'TRK-9818-HYD',
    timestamp: '1h ago',
    read: false,
    severity: 'error'
  },
  {
    id: 'notif-4',
    type: 'SHIPMENT_CREATED',
    title: 'Shipment Created',
    message: 'New consignment TRK-9819-DEL manifest registered for Ananya Gupta (Delhi to Sector 62, Noida).',
    trackingNumber: 'TRK-9819-DEL',
    timestamp: '2h ago',
    read: true,
    severity: 'info'
  },
  {
    id: 'notif-5',
    type: 'STATUS_UPDATE',
    title: 'Delivery Status Updated',
    message: 'Freight TRK-9817-CHE has been picked up from origin facility in Chennai and reached central depot.',
    trackingNumber: 'TRK-9817-CHE',
    timestamp: '4h ago',
    read: true,
    severity: 'info'
  },
  {
    id: 'notif-6',
    type: 'DELIVERY_COMPLETED',
    title: 'Delivery Completed',
    message: 'Consignment TRK-7715-HYD signature confirmed. Handed over to recipient Sneha Reddy in Hitec City.',
    trackingNumber: 'TRK-7715-HYD',
    timestamp: 'Yesterday',
    read: true,
    severity: 'success'
  }
];
