import express from "express";
import hotelRouter from "./hotel";

function useRoutes(app: express.Application) {
  app.use("/hotels", hotelRouter);
}

export default useRoutes;
