import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { SearchResult } from "types";

export async function search(
  req: Request,
  res: Response
): Promise<Response<SearchResult>> {
  const DATABASE_URL = process.env.DATABASE_URL as string;
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log("Connecting to MongoDB...");

  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");

    const db = mongoClient.db();

    const { search } = req.query;

    if (!search || (search && (search as string).length < 3)) {
      return res.send({
        hotels: [],
        cities: [],
        countries: [],
      });
    }

    const query = req.query.search as string;

    const regex = new RegExp(query, "i");

    const hotels = db.collection("hotels");
    const cities = db.collection("cities");
    const countries = db.collection("countries");

    const response = await Promise.all([
      hotels
        .find({
          $or: [
            { name: { $regex: regex } },
            { description: { $regex: regex } },
            { city: { $regex: regex } },
            { country: { $regex: regex } },
          ],
        })
        .project({ _id: 1, name: "$hotel_name" })
        .toArray(),
      cities
        .find({
          $or: [{ name: { $regex: regex } }],
        })
        .project({ _id: 1, name: 1 })
        .toArray(),
      countries
        .find({
          country: { $regex: regex },
        })
        .project({ _id: 1, name: "$country" })
        .toArray(),
    ]);

    return res.send({
      hotels: response[0],
      cities: response[1],
      countries: response[2],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send("An error occurred");
  } finally {
    await mongoClient.close();
  }
}
