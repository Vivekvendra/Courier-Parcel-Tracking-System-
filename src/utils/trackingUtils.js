// Standard Delivery Statuses per Module 6
export const DELIVERY_STATUSES = [
  'Pending',
  'Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Failed Delivery'
];

export const STATUS_CONFIG = {
  'Pending': {
    label: 'Pending',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    cardBorder: 'border-amber-200',
    accentBg: 'bg-amber-50',
    stepIndex: 0,
    description: 'Booking manifest registered. Awaiting pickup dispatch.'
  },
  'Picked Up': {
    label: 'Picked Up',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dotClass: 'bg-cyan-500',
    cardBorder: 'border-cyan-200',
    accentBg: 'bg-cyan-50',
    stepIndex: 1,
    description: 'Parcel collected from shipper and arrived at origin depot.'
  },
  'In Transit': {
    label: 'In Transit',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500 animate-pulse',
    cardBorder: 'border-blue-200',
    accentBg: 'bg-blue-50',
    stepIndex: 2,
    description: 'Parcel is en route between regional sorting distribution centers.'
  },
  'Out for Delivery': {
    label: 'Out for Delivery',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500 animate-pulse',
    cardBorder: 'border-purple-200',
    accentBg: 'bg-purple-50',
    stepIndex: 3,
    description: 'Assigned to courier delivery executive for final mile handoff.'
  },
  'Delivered': {
    label: 'Delivered',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    cardBorder: 'border-emerald-200',
    accentBg: 'bg-emerald-50',
    stepIndex: 4,
    description: 'Successfully handed over to recipient and signature verified.'
  },
  'Cancelled': {
    label: 'Cancelled',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    cardBorder: 'border-rose-200',
    accentBg: 'bg-rose-50',
    stepIndex: -1,
    description: 'Shipment has been cancelled by consignor or administrative desk.'
  },
  'Failed Delivery': {
    label: 'Failed Delivery',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
    cardBorder: 'border-red-200',
    accentBg: 'bg-red-50',
    stepIndex: -2,
    description: 'Delivery attempt unsuccessful (consignee unavailable or location issue).'
  }
};

// Common reasons for status updates (Module 6)
export const STATUS_UPDATE_REASONS = {
  'Pending': [
    'Order manifest verified',
    'Awaiting courier slot assignment',
    'Customer scheduled delayed pickup'
  ],
  'Picked Up': [
    'Package collected by courier agent',
    'Loaded onto initial transfer van',
    'Verified weight and parcel barcodes'
  ],
  'In Transit': [
    'Departed origin sorting center',
    'Air cargo transfer in progress',
    'Linehaul truck en route on expressway',
    'Customs / hub scan complete'
  ],
  'Out for Delivery': [
    'Dispatched for final mile delivery',
    'Assigned to field executive',
    'Recipient notified via SMS/WhatsApp'
  ],
  'Delivered': [
    'Handed directly to recipient',
    'Received by security / reception',
    'Delivered with OTP verification',
    'Left in safe deposit locker'
  ],
  'Failed Delivery': [
    'Recipient not available at address',
    'Incorrect or incomplete delivery address',
    'Recipient requested delivery rescheduling',
    'Customer contact unreachable',
    'Access code / gated society entry restricted'
  ],
  'Cancelled': [
    'Cancelled by sender before dispatch',
    'Duplicate booking created',
    'Prohibited item detected during scan',
    'Return to merchant requested'
  ]
};

// Dummy coordinates for Indian cities
const CITY_COORDS = {
  'Bengaluru': { lat: 12.9716, lng: 77.5946, hub: 'South Regional Gateway Hub #4, Koramangala' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, hub: 'Deccan Sorting & Fulfillment Center, Hitec City' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, hub: 'Western Air Cargo Logistics Hub, Andheri' },
  'Delhi': { lat: 28.7041, lng: 77.1025, hub: 'Northern Expressway Gateway, Dwarka' },
  'Chennai': { lat: 13.0827, lng: 80.2707, hub: 'Coromandel Central Sorting Hub, Guindy' },
  'Pune': { lat: 18.5204, lng: 73.8567, hub: 'Cyber City Hub, Hadapsar' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, hub: 'Eastern Freight Terminal, Salt Lake' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, hub: 'Gujarat Commercial Express Depot, SG Highway' }
};

export const getCityInfo = (addressString = '') => {
  for (const [cityName, info] of Object.entries(CITY_COORDS)) {
    if (addressString.toLowerCase().includes(cityName.toLowerCase())) {
      return { cityName, ...info };
    }
  }
  return {
    cityName: 'Bengaluru',
    lat: 12.9716,
    lng: 77.5946,
    hub: 'Central National Freight Hub, Sector 14'
  };
};

// Generate realistic dummy tracking timeline based on current status
export const generateTimelineEvents = (shipment) => {
  const status = shipment?.deliveryStatus || 'Pending';
  const shipDate = shipment?.shippingDate || '2026-09-14';
  const etaDate = shipment?.expectedDeliveryDate || '2026-09-17';
  const originInfo = getCityInfo(shipment?.pickupAddress || 'Bengaluru');
  const destInfo = getCityInfo(shipment?.deliveryAddress || 'Mumbai');

  const baseEvents = [
    {
      id: 'step-1',
      title: 'Shipment Manifest Created',
      location: `${originInfo.cityName} Central Booking Desk`,
      date: `${shipDate} • 09:15 AM`,
      description: 'Shipping label generated and electronic manifest shared with carrier.',
      completed: true,
      current: false,
      code: 'MANIFEST_CREATED'
    },
    {
      id: 'step-2',
      title: 'Package Picked Up',
      location: shipment?.pickupAddress || `${originInfo.cityName} Warehouse`,
      date: `${shipDate} • 02:40 PM`,
      description: 'Package picked up by courier executive from sender facility.',
      completed: ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].includes(status),
      current: status === 'Picked Up',
      code: 'PICKED_UP'
    },
    {
      id: 'step-3',
      title: 'Processed at Origin Sorting Facility',
      location: originInfo.hub,
      date: `${shipDate} • 07:20 PM`,
      description: 'Dimensional weight audited and sorted into regional outbound container.',
      completed: ['In Transit', 'Out for Delivery', 'Delivered'].includes(status),
      current: false,
      code: 'HUB_SORTED'
    },
    {
      id: 'step-4',
      title: 'In Transit to Destination Hub',
      location: `En route ${originInfo.cityName} ➔ ${destInfo.cityName}`,
      date: `${etaDate} • 04:30 AM`,
      description: 'Freight departed central terminal on scheduled express transport.',
      completed: ['In Transit', 'Out for Delivery', 'Delivered'].includes(status),
      current: status === 'In Transit',
      code: 'IN_TRANSIT'
    },
    {
      id: 'step-5',
      title: 'Arrived at Destination Distribution Hub',
      location: destInfo.hub,
      date: `${etaDate} • 08:15 AM`,
      description: 'Consignment verified and routed to final-mile dispatch zone.',
      completed: ['Out for Delivery', 'Delivered'].includes(status),
      current: false,
      code: 'DEST_HUB'
    },
    {
      id: 'step-6',
      title: 'Out for Delivery',
      location: `${destInfo.cityName} Local Sector Hub`,
      date: `${etaDate} • 10:45 AM`,
      description: 'Package loaded into delivery van. Agent is en route to recipient.',
      completed: status === 'Delivered',
      current: status === 'Out for Delivery',
      code: 'OUT_FOR_DELIVERY'
    },
    {
      id: 'step-7',
      title: 'Delivered to Recipient',
      location: shipment?.deliveryAddress || `${destInfo.cityName} Recipient Address`,
      date: `${etaDate} • 02:15 PM`,
      description: 'Parcel safely delivered. E-signature and OTP verified by recipient.',
      completed: status === 'Delivered',
      current: status === 'Delivered',
      code: 'DELIVERED'
    }
  ];

  if (status === 'Failed Delivery') {
    return [
      ...baseEvents.slice(0, 6).map((e) => ({ ...e, current: false })),
      {
        id: 'step-failed',
        title: 'Delivery Attempt Failed',
        location: shipment?.deliveryAddress || `${destInfo.cityName} Recipient Area`,
        date: `${etaDate} • 04:20 PM`,
        description: 'Delivery attempt unsuccessful (Recipient unavailable). Will re-attempt next business morning.',
        completed: true,
        current: true,
        isFailed: true,
        code: 'FAILED_DELIVERY'
      }
    ];
  }

  if (status === 'Cancelled') {
    return [
      baseEvents[0],
      {
        id: 'step-cancelled',
        title: 'Shipment Cancelled',
        location: `${originInfo.cityName} Dispatch Desk`,
        date: `${shipDate} • 11:30 AM`,
        description: 'Shipment process halted per consignor request. Package flagged for merchant return.',
        completed: true,
        current: true,
        isCancelled: true,
        code: 'CANCELLED'
      }
    ];
  }

  return baseEvents;
};

// Generates initial status history logs if none exist on a shipment
export const buildInitialStatusHistory = (shipment) => {
  const timeline = generateTimelineEvents(shipment);
  const completedOrCurrent = timeline.filter((t) => t.completed || t.current);

  return completedOrCurrent.map((t, idx) => ({
    id: `sth-${shipment.id || 'trk'}-${idx + 1}`,
    status: t.code === 'DELIVERED'
      ? 'Delivered'
      : t.code === 'FAILED_DELIVERY'
      ? 'Failed Delivery'
      : t.code === 'CANCELLED'
      ? 'Cancelled'
      : t.code === 'OUT_FOR_DELIVERY'
      ? 'Out for Delivery'
      : t.code === 'IN_TRANSIT'
      ? 'In Transit'
      : t.code === 'PICKED_UP'
      ? 'Picked Up'
      : 'Pending',
    timestamp: t.date,
    location: t.location,
    updatedBy: idx === 0 ? 'Automated Booking System' : idx === 1 ? 'Courier Agent Suresh' : 'Operations Desk Lead',
    note: t.description
  }));
};

// Current location representation
export const getShipmentCurrentLocation = (shipment) => {
  if (shipment?.currentLocation) {
    return shipment.currentLocation;
  }
  const status = shipment?.deliveryStatus || 'Pending';
  const destInfo = getCityInfo(shipment?.deliveryAddress || 'Bengaluru');
  const originInfo = getCityInfo(shipment?.pickupAddress || 'Mumbai');

  if (status === 'Delivered') {
    return {
      hub: 'Final Destination Address',
      city: destInfo.cityName,
      pincode: '560034',
      coordinates: `${destInfo.lat.toFixed(4)}° N, ${destInfo.lng.toFixed(4)}° E`,
      statusText: 'Safely handed over to consignee',
      lastScanned: 'Today, 02:15 PM'
    };
  }

  if (status === 'Out for Delivery') {
    return {
      hub: `${destInfo.cityName} Delivery Sector Van #12`,
      city: destInfo.cityName,
      pincode: '560034',
      coordinates: `${(destInfo.lat + 0.02).toFixed(4)}° N, ${(destInfo.lng + 0.01).toFixed(4)}° E`,
      statusText: 'Within 3.2 km of destination address',
      lastScanned: 'Today, 11:45 AM'
    };
  }

  if (status === 'In Transit') {
    return {
      hub: 'National Highway Freight Transit Corridor',
      city: `Between ${originInfo.cityName} and ${destInfo.cityName}`,
      pincode: '411001',
      coordinates: `${((originInfo.lat + destInfo.lat) / 2).toFixed(4)}° N, ${((originInfo.lng + destInfo.lng) / 2).toFixed(4)}° E`,
      statusText: 'En route between regional sorting gateways',
      lastScanned: 'Today, 08:30 AM'
    };
  }

  if (status === 'Picked Up') {
    return {
      hub: originInfo.hub,
      city: originInfo.cityName,
      pincode: '560100',
      coordinates: `${originInfo.lat.toFixed(4)}° N, ${originInfo.lng.toFixed(4)}° E`,
      statusText: 'Sorted at origin primary hub',
      lastScanned: 'Yesterday, 07:15 PM'
    };
  }

  if (status === 'Failed Delivery') {
    return {
      hub: `${destInfo.cityName} Return Holding Bay`,
      city: destInfo.cityName,
      pincode: '560034',
      coordinates: `${destInfo.lat.toFixed(4)}° N, ${destInfo.lng.toFixed(4)}° E`,
      statusText: 'Hold at branch depot for next delivery slot',
      lastScanned: 'Today, 04:30 PM'
    };
  }

  return {
    hub: `${originInfo.cityName} Booking Manifest Warehouse`,
    city: originInfo.cityName,
    pincode: '560001',
    coordinates: `${originInfo.lat.toFixed(4)}° N, ${originInfo.lng.toFixed(4)}° E`,
    statusText: 'Scheduled for pickup dispatch',
    lastScanned: 'Booking Confirmed'
  };
};

// Courier & Agent info
export const getCourierAgentDetails = (shipment) => {
  const agents = [
    { name: 'Rahul Verma', phone: '+91 98450 12890', vehicle: 'KA-01-MJ-4920 (Electric Cargo Van)', badge: 'Senior Delivery Pilot' },
    { name: 'Vikram Singh', phone: '+91 98765 43210', vehicle: 'MH-02-AX-8812 (Tata Ace Pro)', badge: 'Express Courier Lead' },
    { name: 'Arun Kumar', phone: '+91 97112 33445', vehicle: 'DL-03-TC-9104 (EV Cargo Scooter)', badge: 'City Delivery Partner' }
  ];
  const charCode = (shipment?.trackingNumber || 'TRK').charCodeAt(4) || 0;
  return agents[charCode % agents.length];
};
