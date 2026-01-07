import express from 'express';
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllOrders);
router.post('/', createOrder);
router.patch('/:id/status', verifyToken, updateOrderStatus);

export default router;

