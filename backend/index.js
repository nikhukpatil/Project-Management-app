const { app } = require('./app');
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

const connection = () => {
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      console.log();
      console.log(`Error connection failed to db ${err}`);
    });
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connection();
  console.log(`Server running on port ${PORT}`);
});
