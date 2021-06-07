import React, { useState } from "react";
import "./styles.css";
import Tracker from "./Tracker";
import PreLivingTicketTracker from "./PreLivingTicketTracker";

export default function App() {
  const [showTracker, setshowTracker] = useState(true);
  return (
    <div className="App">
      {showTracker ? <Tracker /> : null}
      {showTracker ? null : (
        <PreLivingTicketTracker
          movieTitle={"Fast and Furious 9"}
          timeBeforeMovieStart={"2 days and 5 hours"}
        />
      )}
    </div>
  );
}
