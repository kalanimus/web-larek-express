import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isCelebrateError(err)) {
    return res.status(400).send({ message: "Переданы некорректные данные" });
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "На сервере произошла ошибка" : err.message;

  res.status(statusCode).send({ message });
};
