import express from 'express';
import {
  getAllArtworks,
  getArtworkById,
  getLatestArtworks,
  createArtwork,
  deleteArtwork,
} from '../controllers/artworkController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllArtworks);
router.get('/latest/:limit', getLatestArtworks);
router.get('/:id', getArtworkById);
router.post('/', verifyToken, createArtwork);
router.delete('/:id', verifyToken, deleteArtwork);

export default router;

