import { Router } from 'express';
import productsRouter from './products';
import categoriesRouter from './categories';

const router = Router();

export default router
  .use('/products', productsRouter)
  .use('/categories', categoriesRouter);
