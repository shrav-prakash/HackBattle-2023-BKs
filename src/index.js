import express from "express";
import envHandler from "./helpers/envHandler.js";
import connectToDB from "./initializers/db.js";
import expressMongoSanitize from "express-mongo-sanitize";
import cors from "cors";

const app = express();
const port = envHandler('PORT');

app.use(cors());
app.use(express.json());
app.use(expressMongoSanitize());

connectToDB();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});