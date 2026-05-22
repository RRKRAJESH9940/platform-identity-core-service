// express, dotenv, cors, mongoose
import express, { json } from "express";
import cors from "cors";
import rotationalLogger from "./data/middlewares/winston.middleware.js";
import authRouter from "./data/routers/auth.router.js";
import { errorHandler } from "./data/helpers/errors/central_error_handler.js";
import cookieParser from "cookie-parser";

const app = express();
const version = "v6";

app.use(cors({ origin: "*" }));

app.use(json({ limit: "1mb" }));

app.use(cookieParser());
// // TODO: rate-limiter

app.use(rotationalLogger);

app.use(`/api/${version}/auth`, authRouter);

app.use(errorHandler);

export default app;
