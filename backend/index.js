const jwtDecode = require("jwt-decode");
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
const { getWorkoutSchema } = require("./schema");
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

// const Workout = getWorkoutModel(mongoose);
const Workout = mongoose.model("Workout", getWorkoutSchema());

async function setupClient(req) {
  let token = req.headers.authorization.split(" ")[1];
  let userId = jwtDecode(token).user_id;
  if (!userId) throw "Error: unauthorized!";
  let connection = await mongoose.createConnection(
    // "mongodb+srv://leonardoortolan96:pIGAUpg85wcsPWvf@mongofitnessapp.73xpn5j.mongodb.net/?retryWrites=true&w=majority",
    `mongodb://_:${token}@us-east-1.aws.realm.mongodb.com:27020/?authMechanism=PLAIN&authSource=%24external&ssl=true&appName=fitness-app-odbao:Fitness-App-Service:custom-token`,
    {
      dbName: "MongoFitnessApp",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  let Workout = connection.model("Workout", getWorkoutSchema());
  return { connection, Workout, userId };
}

app.get("/workouts", async (req, resp) => {
  let conn;
  try {
    let { connection, Workout, userId } = await setupClient(req);
    conn = connection;
    var docs = await Workout.find({ user_id: userId });
    // console.log("docs:\n" + docs);
    resp.json({ workouts: docs });
  } catch (e) {
    resp.send("Error fetching workouts!");
  } finally {
    conn?.close();
  }
});

app.get("/workout/:id", async (req, resp) => {
  let conn;
  try {
    let { connection, Workout } = await setupClient(req);
    conn = connection;
    var docs = await Workout.find({ _id: req.params.id }).exec();
    // console.log("doc:\n" + doc);
    resp.json({ workout: docs[0] });
  } catch (e) {
    resp.send("Error fetching workout!");
  } finally {
    conn?.close();
  }
});

// app.get("/live-workout", async (req, resp) => {
//   try {
//     var doc = await Workout.findOne({ is_live: true }).exec();
//     // console.log("doc:\n" + doc);
//     resp.json({ workout: doc });
//   } catch (e) {
//     resp.send("Error fetching workout!");
//   }
// });

app.post("/start-cancel-workout", async (req, resp) => {
  let conn;
  try {
    let { connection, Workout, userId } = await setupClient(req);
    conn = connection;
    if (req.body.is_live) {
      let liveCountQueryResult = await Workout.aggregate([
        {
          $match: {
            is_live: {
              $eq: true,
            },
            user_id: {
              $eq: userId,
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
    await Workout.updateOne(
      { _id: req.body.id },
      { is_live: req.body.is_live }
    );
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({
      status: 500,
      message:
        error === "User already has live workout"
          ? "User already has live workout"
          : "Error updating workout!",
    });
  } finally {
    conn?.close();
  }
});

app.post("/finalize-workout", async (req, resp) => {
  let conn;
  try {
    let { connection, Workout } = await setupClient(req);
    conn = connection;
    let workout = (await Workout.find({ _id: req.body.id }))[0];
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
  } finally {
    conn?.close();
  }
});

app.post("/add-workout", async (req, resp) => {
  let conn;
  try {
    let { connection, Workout, userId } = await setupClient(req);
    conn = connection;
    if (req.body.name == null || req.body.is_active == null)
      throw Error("Error: Unexpected null value");
    var workout = new Workout({
      name: req.body.name,
      user_id: userId,
      description: req.body.description,
      is_active: req.body.is_active,
      exercises: JSON.parse(req.body.exercises),
    });
    await workout.save();
    resp.json({ name: req.body.name });
  } catch (error) {
    resp.json({ status: 500, message: "Error adding workout!" });
  } finally {
    conn?.close();
  }
});

app.post("/edit-workout", async (req, resp) => {
  let conn;
  try {
    let { connection, Workout } = await setupClient(req);
    conn = connection;
    if (req.body.name == null || req.body.is_active == null)
      throw Error("Error: Unexpected null value");
    let workout = (await Workout.find({ _id: req.body.id }))[0];
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
  } finally {
    conn?.close();
  }
});

app.post("/delete-workout", async (req, resp) => {
  let conn;
  try {
    let { connection, Workout } = await setupClient(req);
    conn = connection;
    if (req.body.id == null) throw Error("Error: Unexpected null value");
    await Workout.deleteOne({ _id: req.body.id });
    resp.json({ id: req.body.id });
  } catch (error) {
    resp.json({ status: 500, message: "Error deleting workout!" });
  } finally {
    conn?.close();
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
  let timer;
  let liveWorkoutStream;
  let userId;

  function closeConnection() {
    if (timer) clearTimeout(timer);
    liveWorkoutStream?.close();
    ws.close();
  }

  ws.on("message", async function (msg) {
    try {
      msg = JSON.parse(msg);

      if (msg.type == "connect") {
        function sendKeepAlive() {
          ws.send(
            JSON.stringify({
              type: "ka",
            })
          );
          setTimeout(() => sendKeepAlive(), 5000);
        }
        function validateToken() {
          try {
            userId = jwtDecode(msg.token).user_id;
            if (!userId) throw "Error: unauthorized!";
          } catch (error) {
            ws.send(
              JSON.stringify({
                type: "error",
                payload: "Unauthorized user",
              })
            );
            timer = setTimeout(() => closeConnection(), 0.5 * 60000); //30s
            throw "Error: unauthorized!";
          }
        }
        validateToken();
        setTimeout(() => sendKeepAlive(), 5000);
        timer = setTimeout(() => closeConnection(), 10 * 60000); //10min
      }

      if (msg.type == "disconnect") {
        closeConnection();
      }

      if (msg.type == "start" && msg.payload == "live_workout") {
        if (!userId) throw "Error: no user detected";
        // Performs a query and sends the result to the client
        let doc = await Workout.findOne({
          is_live: true,
          user_id: userId,
        }).exec();
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
              "fullDocument.user_id": { $eq: userId },
            },
          },
        ];
        liveWorkoutStream = Workout.watch(pipeline, {
          fullDocument: "updateLookup",
        });
        liveWorkoutStream.on("change", (data) => {
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
    } catch (error) {
      console.log(error);
    }
  });
});

app.listen(port);

// WEBSOCKET TUTORIAL ---------------------
// https://www.youtube.com/watch?v=LenNpb5zqGE
