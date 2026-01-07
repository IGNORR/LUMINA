import express from 'express';
import artworkRoutes from './artworkRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

router.use('/artworks', artworkRoutes);
router.use('/orders', orderRoutes);

export default router;

