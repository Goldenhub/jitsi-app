import { useEffect, useState } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
const APP_ID = import.meta.env.VITE_JAAS_APP_ID
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const mentorName = "John Doe"
  const mentorEmail = "Example@gmail.com"

  useEffect(() => {
    fetch(
      `${BACKEND_URL}/api/jitsi-token?room=Test&name=${mentorName}&email=${mentorEmail}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(APP_ID)
        setJwtToken(data.token)
      })
      .catch((error) => console.error("Error fetching token:", error));
  }, []);

  return (
    <JaaSMeeting
      useStaging={true}
      domain="8x8.vc"
      roomName={`${APP_ID}/Test`}
      jwt={jwtToken} // Mentor gets JWT for moderator access
      configOverwrite={{
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      }}
      userInfo={{
        displayName: mentorName,
        email: mentorEmail,
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = "600px";
      }}
    />
  );
}

export default App;



