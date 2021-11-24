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
// mongodb+srv://sathya:<password>@cluster0.ltkub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

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

    // response.send(movies.filter((mv) => mv.language === language));

    // let filteredMovies = movies;

    // if(language) {
    //     filteredMovies = filteredMovies.filter((mv) => mv.language === language);
    // }
    // if(rating) {
    //     filteredMovies = filteredMovies.filter((mv) => mv.rating === +rating);
    // }

    if(filter.rating){
      filter.rating = parseInt(filter.rating)
    }

    // db.movies.find({})
    const client = await createConnection();
    const movies = await client
      .db("b27rwd")
      .collection("movies")
      .find(filter)
      .toArray();
    response.send(movies);
});

app.get("/movies/:id", async (request,response) => {
    const {id} = request.params;
    // const movie = movies.find((mv) => mv.id === id);
    const client = await createConnection();

    const movie = await client
        .db("b27rwd")
        .collection("movies")
        .findOne({ id : id });
    // movie ? response.send(movie) : response.send({messaage : "No matching movies"});
    // OR
    // response.send (movie ? movie : {messaage : "No matching movies"});
    // OR
    response.send (movie || {messaage : "No matching movies"});
});

app.delete("/movies/:id", async (request,response) => {
  const {id} = request.params;

  const client = await createConnection();

  const movie = await client
      .db("b27rwd")
      .collection("movies")
      .deleteOne({ id : id });
  response.send (movie || {messaage : "No matching movies"});
});

app.put("/movies", async (request, response) => {
  const {name} = request.query;

  console.log(request.query,request.body);

   const client = await createConnection();

   const result = await client
    .db("b27rwd")
    .collection("movies")
    .updateOne({ name : name }, { $set : request.body });

    // response.send(result);

  const movie = await client
    .db("b27rwd")
    .collection("movies")
    .findOne({ name : name });

    response.send(movie);
});

app.post("/movies", async (request,response) => {
  const data = request.body;
  const client = await createConnection();
  //db.movies.insertMany()
  const result = await client
    .db("b27rwd")
    .collection("movies")
    .insertMany(data);

    response.send(result);

});

app.listen(PORT, () => console.log("The server is started in ", PORT));
