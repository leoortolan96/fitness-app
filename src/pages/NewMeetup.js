import { useNavigate } from "react-router-dom";
import NewMeetupForm from "../components/meetups/NewMeetupForm";

function NewMeetupPage() {

const navigate = useNavigate();

function addMeetupHandler(meetupData) {
  // Poderia usar uma biblioteca de terceiros, como AXIOS, para fazer requisicoes HTTP
  fetch("https://react-course-43389-default-rtdb.firebaseio.com/meetups.json", 
  {
    method: 'POST',
    body: JSON.stringify(meetupData),
    headers: {
      'Content-Type': 'application/json'
    },
  }  
  ).then(() => { //Poderia usar await
    navigate('/', {replace: true});
  });
}

    return (
        <section>
          <h2>New meetup page</h2>
          <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </section>
      );
}
export default NewMeetupPage;
