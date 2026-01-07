import { db } from '../config/firebase.js';
import admin from '../config/firebase.js';

export const getAllArtworks = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = db.collection('artworks');

    if (category && category !== 'All') {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    let artworks = [];

    snapshot.forEach((doc) => {
      artworks.push({ id: doc.id, ...doc.data() });
    });

    if (search) {
      const searchLower = search.toLowerCase();
      artworks = artworks.filter((art) => {
        const title = (art.title || '').toLowerCase();
        const artist = (art.artist || '').toLowerCase();
        return title.includes(searchLower) || artist.includes(searchLower);
      });
    }

    if (sort === 'priceLowHigh') {
      artworks.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'priceHighLow') {
      artworks.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'newest') {
      artworks.sort((a, b) => {
        const aTime = a.createdAt?.seconds || a.createdAt?._seconds || 0;
        const bTime = b.createdAt?.seconds || b.createdAt?._seconds || 0;
        return bTime - aTime;
      });
    }

    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
};

export const getArtworkById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('artworks').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({ error: 'Failed to fetch artwork' });
  }
};

export const getLatestArtworks = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const snapshot = await db
      .collection('artworks')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const artworks = [];
    snapshot.forEach((doc) => {
      artworks.push({ id: doc.id, ...doc.data() });
    });

    res.json(artworks);
  } catch (error) {
    console.error('Error fetching latest artworks:', error);
    res.status(500).json({ error: 'Failed to fetch latest artworks' });
  }
};

export const createArtwork = async (req, res) => {
  try {
    const { title, artist, price, category, imageUrl } = req.body;

    if (!title || !artist || !price || !category || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const artworkData = {
      title,
      artist,
      price: parseFloat(price),
      category,
      imageUrl,
      sold: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('artworks').add(artworkData);

    res.status(201).json({ id: docRef.id, ...artworkData });
  } catch (error) {
    console.error('Error creating artwork:', error);
    res.status(500).json({ error: 'Failed to create artwork' });
  }
};

export const deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('artworks').doc(id).delete();

    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
};

