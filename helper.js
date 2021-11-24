import { createConnection } from "./index.js";
import { client } from "./index.js";

async function updateMoviesByName(name, request) {
  const result = await client
    .db("b27rwd")
    .collection("movies")
    .updateOne({ name: name }, { $set: request.body });
  return client;
}

async function getMoviesByName(name) {
  return await client
    .db("b27rwd")
    .collection("movies")
    .findOne({ name: name });
}

async function getAllMovies(filter) {
  const movies = await client
    .db("b27rwd")
    .collection("movies")
    .find(filter)
    .toArray();
  return movies;
}

async function getMoviesById(id) {
  const movie = await client
    .db("b27rwd")
    .collection("movies")
    .findOne({ id: id });
  return movie;
}

async function deleteMovies(id) {
  const movie = await client
    .db("b27rwd")
    .collection("movies")
    .deleteOne({ id: id });
  return movie;
}

async function createMovies(data) {
  const result = await client
    .db("b27rwd")
    .collection("movies")
    .insertMany(data);
  return result;
}

export {
  updateMoviesByName,
  getAllMovies,
  getMoviesByName,
  getMoviesById,
  createMovies,
  deleteMovies
};
