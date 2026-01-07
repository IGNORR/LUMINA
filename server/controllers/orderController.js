import { db } from '../config/firebase.js';
import admin from '../config/firebase.js';

export const getAllOrders = async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customer, payment, items, total } = req.body;

    if (!customer || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderData = {
      customer: {
        fullName: customer.fullName || '',
        address: customer.address || '',
        phone: customer.phone || '',
      },
      payment: {
        cardLast4: payment?.cardLast4 || '',
        expiry: payment?.expiry || '',
      },
      items: items.map((item) => ({
        id: item.id || '',
        title: item.title || 'Untitled',
        artist: item.artist || 'Unknown',
        price: Number(item.price) || 0,
        category: item.category || '',
        imageUrl: item.imageUrl || '',
        sold: item.sold || false,
      })),
      total: Number(total) || 0,
      status: 'New',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('orders').add(orderData);

    for (const item of items) {
      if (item.id) {
        try {
          await db.collection('artworks').doc(item.id).update({ sold: true });
        } catch (error) {
          console.error(`Error marking artwork ${item.id} as sold:`, error);
        }
      }
    }

    res.status(201).json({ id: docRef.id, ...orderData });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data();

    await orderRef.update({ status });

    if (status === 'Cancelled' && order.items && order.items.length > 0) {
      const artworkUpdates = order.items
        .filter((item) => item.id)
        .map((item) => {
          return db.collection('artworks').doc(item.id).update({ sold: false });
        });

      await Promise.all(artworkUpdates);
    }

    res.json({ message: 'Order status updated', status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

