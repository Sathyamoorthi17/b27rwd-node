import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { movieRouter } from "./routes/movie.js";



const app = express();

//process.env
dotenv.config();

//Need middleware - all requests - apply the function
app.use(express.json());

const PORT = process.env.PORT || 9000;

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

app.use('/movies',movieRouter);

app.listen(PORT, () => console.log("The server is started in ", PORT));

export { client };

