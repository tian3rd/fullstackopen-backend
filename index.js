require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

// after json parser? not necessary? because app uses json parser?
morgan.token("postContent", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());

// use cors to resolve cross origin resource sharing problem (CORS) from different ports
app.use(cors());

// make express show static content, index.html and js files
app.use(express.static("build"));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postContent"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  //   res.json(persons);
  Person.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/info", (req, res) => {
  //   let numPersons = persons.length;
  //   const date = new Date();

  //   res.send(`<p>Phonebook has info for ${numPersons} people</p><p>${date}</p>`);
  Person.find({}).then((result) => {
    res.send(
      `<h1>Phonebook has info for ${
        result.length
      } people</h1><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  //   convert id string to number
  //   const id = Number(req.params.id);
  //   const person = persons.find((p) => p.id === id);
  //   //   console.log(person);
  //   if (person) {
  //     res.json(person);
  //   } else {
  //     res.status(404).end();
  //   }
  Person.findById(req.params.id)
    .then((person) => {
      // if not found deal with undefined as 404 not found
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      //   res.status(400).send({ error: "malformatted id" });
      //   move error handling into middleware
      return next(error);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  //   const id = Number(req.params.id);
  //   persons = persons.filter((p) => p.id != id);

  //   //  status code 204: no content
  //   res.status(204).end();
  Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      if (person) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      return next(error);
    });
});

app.put("/api/persons/:id", (req, res) => {
  const person = req.body;
  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });
  // add {new: true} to return the updated document
  Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      console.log(error);
      return next(error);
    });
});

app.post("/api/persons", (req, res) => {
  const person = req.body;
  console.log(person);
  // if name is missing or it already exists, deny the request (bad request)
  if (!person.name) {
    return res.status(400).json({ error: "name missing" });
  } else {
    Person.findOne({ name: person.name })
      .then((p) => {
        if (p) {
          //   make a post request to update the existed person
          return res.redirect("/api/persons/" + p.id);
        } else {
          const newPerson = new Person({
            name: person.name,
            number: person.number,
          });

          newPerson.save().then((result) => {
            res.json(result);
          });
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
  //   } else if (persons.find((p) => p.name === person.name)) {
  //     return res.status(400).json({ error: "name already exists" });
  //   }
  //   // option1. find the max id among persons and assign it to new id
  //   // let maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  //   // option2. assign a random number
  //   let randomId = Math.floor(Math.random() * 1000000);
  //   person.id = randomId + 1;
  //   persons = persons.concat(person);
  //   res.json(person);
});

// the order of unknownEndpoint and errorHandler is important
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
