import express from "express";
import {
    updateMoviesByName,
    getAllMovies,
    getMoviesByName,
    getMoviesById,
    createMovies,
    deleteMovies
   } from "../helper.js";

const router = express.Router();

router
.route("/")
.get(async (request, response) => {
    let filter = request.query;

    if(filter.rating){
      filter.rating = parseInt(filter.rating)
    }

    const movies = await getAllMovies(filter);
    response.send(movies);
})
.put(async (request, response) => {
    const {name} = request.query;
    await updateMoviesByName(name, request);
    const movie = await getMoviesByName(name);
      response.send(movie);
})
  .post(async (request,response) => {
    const data = request.body;
    const result = await createMovies(data);
      response.send(result);
});

router.get("/:id", async (request,response) => {
    const {id} = request.params;
    const movie = await getMoviesById(id);
    response.send (movie || {messaage : "No matching movies"});
});

router.delete("/:id", async (request,response) => {
  const {id} = request.params;
  const movie = await deleteMovies(id);
  response.send (movie || {messaage : "No matching movies"});
});



export const movieRouter = router;