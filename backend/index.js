// To connect with your mongoDB database
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://leonardoortolan96:pIGAUpg85wcsPWvf@mongofitnessapp.73xpn5j.mongodb.net/?retryWrites=true&w=majority",
    {
      dbName: "MongoFitnessApp",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((_) => {
    console.log("Connected to MongoDB!");
  });

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
const { getWorkoutModel } = require("./models");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
  // You can check backend is working or not by
  // entering http://loacalhost:5000

  // If you see App is working means
  // backend working properly
});

const Workout = getWorkoutModel(mongoose);

app.get("/workouts", async (req, resp) => {
  try {
    var docs = await Workout.find();
    // console.log("docs:\n" + docs);
    resp.json({ workouts: docs });
  } catch (e) {
    resp.send("Error fetching workouts!");
  }
});

app.get("/workout/:id", async (req, resp) => {
  try {
    var doc = await Workout.findById(req.params.id).exec();
    // console.log("doc:\n" + doc);
    resp.json({ workout: doc });
  } catch (e) {
    resp.send("Error fetching workout!");
  }
});

app.get("/live-workout", async (req, resp) => {
  try {
    var doc = await Workout.findOne({ is_live: true }).exec();
    // console.log("doc:\n" + doc);
    resp.json({ workout: doc });
  } catch (e) {
    resp.send("Error fetching workout!");
  }
});

app.listen(5000);
