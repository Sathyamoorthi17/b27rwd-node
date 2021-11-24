// const express = require("express");
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const app = express();

//process.env
dotenv.config();

//Need middleware - all requests - apply the function
app.use(express.json());

const PORT = 9000;

// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb Connected!!!");

    return client;
}

createConnection();

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

async function updateMoviesByName(name, request) {
  const client = await createConnection();

  const result = await client
    .db("b27rwd")
    .collection("movies")
    .updateOne({ name: name }, { $set: request.body });
  return client;
}

async function getMoviesByName(name) {
  const client = await createConnection();
  return await client
    .db("b27rwd")
    .collection("movies")
    .findOne({ name: name });
}

async function getAllMovies(filter) {
  const client = await createConnection();
  const movies = await client
    .db("b27rwd")
    .collection("movies")
    .find(filter)
    .toArray();
  return movies;
}

async function getMoviesById(id) {
  const client = await createConnection();

  const movie = await client
    .db("b27rwd")
    .collection("movies")
    .findOne({ id: id });
  return movie;
}

async function deleteMovies(id) {
  const client = await createConnection();

  const movie = await client
    .db("b27rwd")
    .collection("movies")
    .deleteOne({ id: id });
  return movie;
}

async function createMovies(data) {
  const client = await createConnection();
  const result = await client
    .db("b27rwd")
    .collection("movies")
    .insertMany(data);
  return result;
}

