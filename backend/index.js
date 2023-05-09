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

app.post("/start-cancel-workout", async (req, resp) => {
  try {
    await Workout.findByIdAndUpdate(req.body.id, { is_live: req.body.is_live });
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({ status: 500, message: "Error updating workout!" });
  }
});

app.post("/finalize-workout", async (req, resp) => {
  try {
    let workout = await Workout.findById(req.body.id);
    workout.is_live = false;
    workout.workout_sessions.push({
      session_datetime: req.body.start_time,
      session_duration: req.body.duration,
    });
    workout.exercises.forEach((exercise) => {
      req.body.altered_loads.forEach((alteredLoad) => {
        if (exercise._id == alteredLoad.exercise_id) {
          exercise.load = alteredLoad.new_load;
        }
      });
      if (!exercise.is_paused) {
        exercise.sessions.push({
          session_datetime: req.body.start_time,
          session_load: exercise.load,
        });
      }
    });
    // console.log(JSON.stringify(workout));
    await workout.save();
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({ status: 500, message: "Error finalizing workout!" });
  }
});

app.post("/add-workout", async (req, resp) => {
  try {
    if (req.body.name == null || req.body.is_active == null)
      throw Error("Error: Unexpected null value");
    var workout = new Workout({
      name: req.body.name,
      description: req.body.description,
      is_active: req.body.is_active,
      exercises: JSON.parse(req.body.exercises),
    });
    workout.save();
    resp.json({ name: req.body.name });
  } catch (error) {
    resp.json({ status: 500, message: "Error adding workout!" });
  }
});

app.post("/edit-workout", async (req, resp) => {
  try {
    if (req.body.name == null || req.body.is_active == null)
      throw Error("Error: Unexpected null value");
    let workout = await Workout.findById(req.body.id);
    workout.name = req.body.name;
    workout.description = req.body.description;
    workout.is_active = req.body.is_active;
    let editedExercises = JSON.parse(req.body.exercises);

    //TODO remover, adicionar, editar exercicios
    workout.exercises.forEach((exercise) => {
      editedExercises.forEach((editedExercise) => {
        if (exercise._id == editedExercise._id) {
          //TODO
        }
      });
    });
    // console.log(JSON.stringify(workout));
    await workout.save();
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({ status: 500, message: "Error editing workout!" });
  }
});

app.post("/delete-workout", async (req, resp) => {
  try {
    if (req.body.id == null)
      throw Error("Error: Unexpected null value");
    await Workout.deleteOne({_id: req.body.id});
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({ status: 500, message: "Error deleting workout!" });
  }
});

app.listen(5000);
