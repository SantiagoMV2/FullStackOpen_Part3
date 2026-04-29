require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    res.send(`
        <p>Phonebook has info of ${count} people</p>
        <p>${new Date()}</p>
        `);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
