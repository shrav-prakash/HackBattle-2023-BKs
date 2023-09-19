import express from "express";
import envHandler from "./helpers/envHandler.js";
import connectToDB from "./initializers/db.js";
import expressMongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import doctorRouter from "./routes/doctor.js";
import patientRouter from "./routes/patient.js";

const app = express();
const port = envHandler('PORT');

app.use(cors());
app.use(express.json());
app.use(expressMongoSanitize());

app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);

connectToDB();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});