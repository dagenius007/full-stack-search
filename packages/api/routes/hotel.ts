import express from "express";
import { search } from "services/hotel";

const hotelRouter = express.Router();

hotelRouter.get("/", search);

export default hotelRouter;
