import React, { useEffect, useRef, useState } from "react";

function normalizeValueToRange(
  value,
  rangeMin,
  rangeMax,
  newRangeMin,
  newRangeMax
) {
  //if (rangeMax - rangeMin != 0) {
  return parseFloat(
    ((value - rangeMin) / (rangeMax - rangeMin)) * (newRangeMax - newRangeMin) +
      newRangeMin
  );
  //} return parseFloat((newRangeMax - newRangeMin) + newRangeMin);
}

function findEventEndTime(currentIndex, timeSlots) {
  // if we have not hit the last element of the events object
  if (timeSlots.events.length > currentIndex + 1) {
    return timeSlots.events[currentIndex + 1].startTime;
  }
  return parseFloat(timeSlots.endTime);
}

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

  const radius = 140;
  const circum = 2 * Math.PI * radius;
  const lineWidth = 12;
  const gap = 0;
  const START_RADIAN = parseFloat(-0.2);
  const END_RADIAN = parseFloat(1.2);
  const fps = 60 / 30;

  const [percentage, setPercentage] = useState({
    value: 0,
    min: timeSlots.startTime,
    max: timeSlots.endTime,
  });
  const render = (ctx, percentage) => {
    var progress = normalizeValueToRange(
      percentage.value,
      percentage.min,
      percentage.max,
      START_RADIAN,
      END_RADIAN
    );
    ctx.clearRect(0, 0, 300, 300); // clear previous drawn content
    ctx.setTransform(1, 0, 0, 1, 150, 150); // translate to center
    ctx.rotate(-Math.PI); // rotate -90° so 0° is up
    ctx.beginPath();
    ctx.arc(0, 0, radius, START_RADIAN * Math.PI, END_RADIAN * Math.PI); // circle from angle x t
    ctx.lineWidth = lineWidth + 8; // line width
    ctx.strokeStyle = "#9ac"; // base color
    ctx.stroke(); // render it
    ctx.lineWidth = lineWidth;
    console.log("current progress", progress);
    timeSlots.events.forEach((value, index) => {
      const startSection = normalizeValueToRange(
        value.startTime,
        percentage.min,
        percentage.max,
        START_RADIAN,
        END_RADIAN
      );
      console.log(`start section: ${value.eventName}`, startSection);
      // if progress is less than the start of a new section then dont draw it
      if (progress > startSection) {
        ctx.beginPath();
        const sectionEndTime = findEventEndTime(index, timeSlots);
        const sectionEndNorm = normalizeValueToRange(
          sectionEndTime,
          percentage.min,
          percentage.max,
          START_RADIAN,
          END_RADIAN
        );
        console.log(`end section: ${value.eventName}`, sectionEndNorm);
        if (progress >= sectionEndNorm) {
          ctx.arc(
            0,
            0,
            radius,
            Math.PI * startSection,
            Math.PI * sectionEndNorm
          );
        } else {
          ctx.arc(0, 0, radius, Math.PI * startSection, Math.PI * progress);
        }
        ctx.strokeStyle = value.color;
        ctx.stroke();
        ctx.closePath();
      }
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transforms
  };
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
        render(ctx, percentage);
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
