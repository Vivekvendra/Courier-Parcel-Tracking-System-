import axios from 'axios';

// Third-Party API client
const apiClient = axios.create({
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Seed Initial Shipments (integrating DummyJSON products to simulate third-party packages)
export const fetchThirdPartyShipments = async () => {
  try {
    const response = await apiClient.get('https://dummyjson.com/products?limit=8');
    const products = response.data.products || [];

    const indianCities = [
      { city: 'Bengaluru, KA', address: 'Plot 42, Electronic City Phase 1' },
      { city: 'Hyderabad, TS', address: 'Survey 115, Hitec City' },
      { city: 'Mumbai, MH', address: 'BKC Commercial Complex, Bandra' },
      { city: 'Delhi, DL', address: 'Barakhamba Road, Connaught Place' },
      { city: 'Chennai, TN', address: '12 Anna Salai, T Nagar' },
      { city: 'Pune, MH', address: 'Magarpatta Cybercity, Hadapsar' },
      { city: 'Kolkata, WB', address: 'Salt Lake Sector V, Bidhannagar' },
      { city: 'Ahmedabad, GJ', address: 'SG Highway, Bodakdev' }
    ];

    const statuses = ['In Transit', 'Delivered', 'Pending', 'Out for Delivery', 'Picked Up'];
    const types = ['Standard Box', 'Express Document', 'Fragile Cargo', 'Heavy Freight'];

    return products.map((item, idx) => {
      const origin = indianCities[idx % indianCities.length];
      const dest = indianCities[(idx + 3) % indianCities.length];
      const status = statuses[idx % statuses.length];
      const parcelType = types[idx % types.length];

      return {
        id: `shp-ext-${item.id}`,
        trackingNumber: `TRK-${item.id + 9820}-${origin.city.slice(0, 3).toUpperCase()}`,
        senderName: `${item.brand || 'Apex Logistics'} India`,
        receiverName: ['Priya Sharma', 'Rahul Verma', 'Sneha Reddy', 'Vikram Mehta', 'Ananya Gupta', 'Karthik Raja', 'Sunita Rao', 'Arjun Kapoor'][idx] || 'Consignee Recipient',
        pickupAddress: `${origin.address}, ${origin.city}`,
        deliveryAddress: `${dest.address}, ${dest.city}`,
        parcelWeight: `${item.weight || (1.2 + idx * 0.7).toFixed(1)} kg`,
        parcelType: parcelType,
        shippingDate: `2026-09-${10 + (idx % 5)}`,
        expectedDeliveryDate: `2026-09-${15 + (idx % 5)}`,
        deliveryStatus: status,
        notes: item.description || 'Standard high-priority shipment'
      };
    });
  } catch (err) {
    console.warn('Third-party API fetch fallback to local seed data:', err.message);
    return null;
  }
};

// Seed Initial Customers (integrating DummyJSON users API)
export const fetchThirdPartyCustomers = async () => {
  try {
    const response = await apiClient.get('https://dummyjson.com/users?limit=8');
    const users = response.data.users || [];

    const indianCities = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

    return users.map((u, idx) => ({
      id: `cust-ext-${u.id}`,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      phone: u.phone || `+91 98${idx}12 345${idx}`,
      address: `${u.address?.address || '142 Ring Road'}, ${u.address?.city || indianCities[idx % indianCities.length]}`,
      city: indianCities[idx % indianCities.length],
      postalCode: `${560001 + idx * 11}`,
      avatar: u.image,
      createdAt: '2026-08-15',
      totalShipments: 12 + idx * 3,
      status: 'Active'
    }));
  } catch (err) {
    console.warn('Third-party API users fallback to local seed data:', err.message);
    return null;
  }
};
