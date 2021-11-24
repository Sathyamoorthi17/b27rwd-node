import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import {
  updateMoviesByName,
  getAllMovies,
  getMoviesByName,
  getMoviesById,
  createMovies,
  deleteMovies
 } from "./helper.js";

const app = express();

//process.env
dotenv.config();

//Need middleware - all requests - apply the function
app.use(express.json());

const PORT = 9000;

// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

export async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb Connected!!!");

    return client;
};

const client = await createConnection();

app.get("/", (request, response) => {
  response.send("Hello World !!!!");
});

app.get("/movies" ,async (request, response) => {
    let filter = request.query;

    if(filter.rating){
      filter.rating = parseInt(filter.rating)
    }

    const movies = await getAllMovies(filter);
    response.send(movies);
});

app.get("/movies/:id", async (request,response) => {
    const {id} = request.params;
    const movie = await getMoviesById(id);
    response.send (movie || {messaage : "No matching movies"});
});

app.delete("/movies/:id", async (request,response) => {
  const {id} = request.params;
  const movie = await deleteMovies(id);
  response.send (movie || {messaage : "No matching movies"});
});

app.put("/movies", async (request, response) => {
  const {name} = request.query;
  await updateMoviesByName(name, request);
  const movie = await getMoviesByName(name);
    response.send(movie);
});

app.post("/movies", async (request,response) => {
  const data = request.body;
  const result = await createMovies(data);
    response.send(result);
});

app.listen(PORT, () => console.log("The server is started in ", PORT));

export { client }

