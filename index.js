import express from "express";
import router from "./controller/route.js";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./mongodb/config.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = 1300;

app.listen(port, async () => {
  console.log(
    `app is listening to request on port ${port}`,
    await connection()
  );
});

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(router);
