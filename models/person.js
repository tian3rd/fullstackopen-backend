const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log(`Connecting to MongoDB ${url}...`);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        if (v.match(/\-/g).length > 1) return false;
        return /\d{2,3}\-\d{5,}$/.test(v);
      },
      message: "Number must be in format: 040-1234567",
    },
    minLength: 8,
    required: [true, "User phone number required"],
  },
});

// convert _id and __v to id (it's not changed in the cloud database)
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
