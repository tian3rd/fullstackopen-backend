const express = require("express");
const app = express();

app.use(express.json());

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
  res.json(persons);
});

app.get("/info", (req, res) => {
  let numPersons = persons.length;
  const date = new Date();

  res.send(`<p>Phonebook has info for ${numPersons} people</p><p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  //   convert id string to number
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  //   console.log(person);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id != id);

  //  status code 204: no content
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;
  console.log(person);
  // if name is missing or it already exists, deny the request (bad request)
  if (!person.name) {
    return res.status(400).json({ error: "name missing" });
  } else if (persons.find((p) => p.name === person.name)) {
    return res.status(400).json({ error: "name already exists" });
  }

  // option1. find the max id among persons and assign it to new id
  // let maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  // option2. assign a random number
  let randomId = Math.floor(Math.random() * 1000000);
  person.id = randomId + 1;

  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
