import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productsRouter from "./routes/products";
import orderRoutes from "./routes/orders";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/not-found-error";
import { requestLogger, errorLogger } from './middlewares/logger';

dotenv.config();

import { PORT, DB_ADDRESS } from './config';

const app = express();

mongoose.connect(DB_ADDRESS as string);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(requestLogger);

app.use("/product", productsRouter);
app.use("/order", orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("*", (req, res, next) => {
  next(new NotFoundError("Маршрут не найден"));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
