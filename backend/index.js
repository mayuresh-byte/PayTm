const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const User = require("./db");

const rootRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRouter);

mongoose.connect('').then(() => {
    console.log('App Connected to DB');
    app.listen(11000, () => {
        console.log(`App is listening to port: 11000`);
    })
}).catch((err) => {
    console.log(err);
})
