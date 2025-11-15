import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    payment, email, phone, address, total, items,
  } = req.body;

  try {
    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Некоторые товары не найдены'));
    }

    const unavailableProducts = products.filter(
      (product) => product.price === null,
    );
    if (unavailableProducts.length > 0) {
      return next(
        new BadRequestError('Некоторые товары недоступны для покупки'),
      );
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );
    if (calculatedTotal !== total) {
      return next(new BadRequestError('Неверная общая сумма заказа'));
    }

    const orderId = faker.string.uuid();
    return res.send({ id: orderId, total });
  } catch (error) {
    return next(error);
  }
};
