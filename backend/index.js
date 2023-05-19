const mongoose = require("mongoose");
const port = 5000;

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
var expressWs = require("express-ws")(app);
const cors = require("cors");
const { getWorkoutModel } = require("./models");
console.log("App listen at port " + port);
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
    if (req.body.is_live) {
      let liveCountQueryResult = await Workout.aggregate([
        {
          $match: {
            is_live: {
              $eq: true,
            },
          },
        },
        {
          $count: "live_count",
        },
      ]);
      if (
        liveCountQueryResult.length > 0 &&
        liveCountQueryResult[0].live_count > 0
      )
        throw "User already has live workout";
    }
    await Workout.findByIdAndUpdate(req.body.id, { is_live: req.body.is_live });
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({
      status: 500,
      message:
        error === "User already has live workout"
          ? "User already has live workout"
          : "Error updating workout!",
    });
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
    //removes the exercises that have been removed by the user and
    //updates the exercises that have been updated by the user
    let index = 0;
    while (index < workout.exercises.length) {
      if (
        editedExercises.some(
          (editedExercise) => workout.exercises[index]._id == editedExercise._id
        )
      ) {
        editedExercises.forEach((editedExercise) => {
          if (workout.exercises[index]._id == editedExercise._id) {
            workout.exercises[index].name = editedExercise.name;
            workout.exercises[index].observation = editedExercise.observation;
            workout.exercises[index].sets = editedExercise.sets;
            workout.exercises[index].reps = editedExercise.reps;
            workout.exercises[index].load = editedExercise.load;
            workout.exercises[index].is_paused = editedExercise.is_paused;
          }
        });
        index++;
      } else {
        workout.exercises.splice(index, 1);
      }
    }
    //adds the exercises that have been added by the user
    editedExercises
      .filter((editedExercise) => editedExercise._id == null)
      .forEach((addedExercise) => {
        workout.exercises.push(addedExercise);
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
    if (req.body.id == null) throw Error("Error: Unexpected null value");
    await Workout.deleteOne({ _id: req.body.id });
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({ status: 500, message: "Error deleting workout!" });
  }
});

// let clients = {};

// // This code generates unique userid for everyuser.
// const getUniqueID = () => {
//   const s4 = () =>
//     Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   return s4() + s4() + "-" + s4();
// };

app.ws("/", function (ws, req) {
  ws.on("message", async function (msg) {
    msg = JSON.parse(msg);
    let timer;

    if (msg.type == "connect") {
      function sendKeepAlive() {
        ws.send(
          JSON.stringify({
            type: "ka",
          })
        );
        setTimeout(() => sendKeepAlive(), 5000);
      }
      setTimeout(() => sendKeepAlive(), 5000);
      // timer = setTimeout(() => ws.close(), 10 * 60000); //TODO 10min
    }

    if (msg.type == "disconnect") {
      timer?.clearTimeout();
      ws.close();
    }

    if (msg.type == "start" && msg.payload == "live_workout") {
      // Performs a query and sends the result to the client
      let doc = await Workout.findOne({ is_live: true }).exec();
      ws.send(
        JSON.stringify({
          type: "data",
          payload: "live_workout",
          data: doc,
        })
      );
      // Sets up the change stream
      const pipeline = [
        {
          $match: {
            "updateDescription.updatedFields.is_live": { $exists: true },
          },
        },
      ];
      let stream = Workout.watch(pipeline, { fullDocument: "updateLookup" });
      stream.on("change", (data) => {
        // console.log(JSON.stringify(data));
        ws.send(
          JSON.stringify({
            type: "data",
            payload: "live_workout",
            data: data.fullDocument,
          })
        );
      });
    }
  });
});

app.listen(port);

// WEBSOCKET TUTORIAL ---------------------
// https://www.youtube.com/watch?v=LenNpb5zqGE
