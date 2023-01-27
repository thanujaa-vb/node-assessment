require("dotenv").config();
const mongoose = require('mongoose');
const auth = require('./routers/route');
const express = require('express');
const app = express();
const { MONGO_URI } = process.env;

mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    })
    .then(() => {
      console.log("Connected to database....");
    })
    .catch((error) => {
      console.log("database connection failed....");
      console.error(error);
      process.exit(1);
    });

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', auth);

const port = process.env.API_PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
