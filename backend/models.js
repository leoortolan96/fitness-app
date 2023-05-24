module.exports = {
  getWorkoutModel: (mongoose) => {
    var WorkoutSchema = new mongoose.Schema(
      {
        name: String,
        user_id: String,
        description: String, //nullable
        is_active: { type: Boolean, default: true },
        is_live: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        workout_sessions: [
          {
            session_datetime: Date,
            session_duration: Number,
          },
        ],
        exercises: [
          {
            id: String,
            name: String,
            observation: String,
            sets: String,
            reps: String,
            load: String,
            is_paused: { type: Boolean, default: false },
            created_at: { type: Date, default: Date.now },
            updated_at: { type: Date, default: Date.now },
            sessions: [
              {
                session_datetime: Date,
                session_load: String,
              },
            ],
          },
        ],
      }
      // { collection: "workouts" }
    );
    var WorkoutModel = mongoose.model("Workout", WorkoutSchema);
    return WorkoutModel;
  },
};
