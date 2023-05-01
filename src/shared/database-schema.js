var workouts = {
  name: string,
  description: string | null,
  is_active: boolean, //default true
  is_live: boolean, //default false ("em andamento")
  created_at: DateTime,
  updated_at: DateTime,
  workout_sessions: [
    //contador de sessoes, primeira e ultima sessoes
    {
      session_datetime: DateTime,
      session_duration: int, //minutes
    },
  ],
  exercises: [
    {
      id: string,
      name: string,
      observation: string | null,
      sets: string,
      reps: string,
      load: string | null,
      is_paused: boolean, //default false
      created_at: DateTime,
      updated_at: DateTime,
      sessions: [
        {
          session_datetime: DateTime,
          session_load: string | null,
        },
      ],
    },
  ],
};
