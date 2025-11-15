import { Router, Request, Response } from 'express';
import { getProducts, createProduct } from '../controllers/products';
import { validateCreateProduct } from '../middlewares/validation';

const router = Router();
router.get('/', getProducts);

router.post('/', validateCreateProduct, createProduct);

export default router;
