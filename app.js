const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

//подклчюение к mongoDB
mongoose.connect(
  "mongodb://127.0.0.1:27017/mestodb",
  {
    useNewUrlParser: true,
  },
  () => console.log("App is connected to mongoDB")
);

//мидлвэр временного решения авторизации, согласно 13го ТЗ
app.use((req, res, next) => {
  req.user = {
    _id: "63f6889ab055656c593c4a8a",
  };

  next();
});

app.use("/cards", cardRouter);

app.use("/users", userRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(404).send({ message: "Запрошен несуществующий роут" });
});

app.listen(PORT, () => {
  console.log(`Now listening on port: ${PORT}`);
});
