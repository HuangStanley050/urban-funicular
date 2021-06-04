import React, { useEffect, useRef, useState } from "react";
import { getStartRange, findPercentageToStop, render } from "./Helpers";

const LivingTicket = () => {
  const wrapper = {
    border: "1px red solid",
  };
  const timeSlots = {
    startTime: 0.0,
    endTime: 600,
    events: [
      {
        eventName: "cinema open",
        startTime: 0.0,
        color: "#e699ff",
      },
      {
        eventName: "preshow",
        startTime: 70.0,
        color: "#ffc266",
      },
      {
        eventName: "showTime",
        startTime: 150.0,
        color: "#80ffcc",
      },
      {
        eventName: "movieInProgress",
        startTime: 300.0,
        color: "blue",
      },
    ],
  };

  const [percentage, setPercentage] = useState({
    value: 0,
    min: timeSlots.startTime,
    max: timeSlots.endTime,
  });

  const fps = 60 / 30;

  const canvas = useRef(null);
  const stopTime = 229;
  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    let interval = setInterval(() => {
      if (percentage.value < stopTime) {
        // this condition above is the key to stop the animation
        // 70 is when cinema opens
        // 150 is when pre show starts
        // 300 is movie starts
        // 600 is the full way, when movie finishes
        //percentage.value += (1.0 / 30.0);
        setPercentage((percentage) => {
          // original was 1.0 / 30.0 for the percentage.value
          return { ...percentage, value: (percentage.value += 1) };
        });
        render(ctx, percentage, timeSlots);
      } else {
        clearInterval(interval);
      }
      //render(ctx, percentage);
    }, fps);
    return () => {
      clearInterval(interval);
    };
  }, [percentage.value]);

  return (
    <div>
      <canvas ref={canvas} height="450" />
    </div>
  );
};

export default LivingTicket;
