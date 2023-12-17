import { Router } from 'express';
import ordersRouter from './orders';

const router = Router();

export default router.use('/orders', ordersRouter);
