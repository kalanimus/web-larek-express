import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import { Error as MongooseError } from "mongoose";

export const getProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Product.find({})
    .select("-__v")
    .then((products) => res.send({ items: products, total: products.length }))
    .catch((error) => next(error));
};

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { description, image, title, category, price } = req.body;

  return Product.create({ description, image, title, category, price })
    .then((product) => res.send({ data: product }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError("Переданы некорректные данные"));
      }
      if (error instanceof Error && error.message.includes("E11000")) {
        return next(
          new ConflictError("Товар с таким названием уже существует")
        );
      }
      return next(error);
    });
};
