import React from "react";

const PreLivingTicketTracker = (props) => {
  return (
    <div>
      <div>
        <h2>Your movie will start in {props.timeBeforeMovieStart}</h2>
      </div>
      <p>
        {" "}
        You will receive an sms when your live ticket becomes active, which is 2
        hours before the start of {props.movieTitle}. You will be able to view
        when the cinema opens, when the pre-show starts and when{" "}
        {props.movieTitle} movie starts.
      </p>
    </div>
  );
};

export default PreLivingTicketTracker;
