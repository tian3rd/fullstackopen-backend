const mongoose = require("mongoose");

if (
  process.argv.length < 3 ||
  process.argv.length === 4 ||
  process.argv.length > 5
) {
  console.log(
    "1. Please provide the password as an argument: node mongo.js <password>"
  );
  console.log(
    "2. Please provide the password and data as arguments: node mongo.js <password> name phone-number"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.npvuq.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  // use find to retrieve all persons
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name}: ${person.number}`);
    });
    mongoose.connection.close();
  });
}
