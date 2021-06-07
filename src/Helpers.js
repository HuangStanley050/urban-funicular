export const sectionDegrees = {
  beforeCinema: { label: "before cinema", start: 0, end: 70, range: 70 },
  cinemaOpen: { label: "cinema opens", start: 70, end: 150, range: 80 },
  preshow: { label: "preshow starts", start: 150, end: 300, range: 150 },
  movie: { label: "movie starts", start: 300, end: 600, range: 300 },
};

const eventTimes = {
  cinemaOpen: new Date("2021/06/04 10:00"),
  preShow: new Date("2021/06/04 10:30"),
  movieStart: new Date("2021/06/04 10:50"),
  movieEnd: new Date("2021/06/04 12:00"),
};

export const fakeAPI = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve(eventTimes), 200);
  });
};

export const getStartRange = (eventTimes, currentTime, sectionDegrees) => {
  // get which section we should start from

  const { cinemaOpen, preShow, movieStart, movieEnd } = eventTimes;
  const beforeCinemaOpen = new Date(eventTimes.movieStart.getTime());
  beforeCinemaOpen.setHours(beforeCinemaOpen.getHours() - 2); //assume time before cinema open is 2 hours before

  if (currentTime < cinemaOpen)
    return {
      ...sectionDegrees.beforeCinema,
      startSection: beforeCinemaOpen,
      endSection: eventTimes.cinemaOpen,
    };
  if (currentTime >= cinemaOpen && currentTime <= preShow) {
    return {
      ...sectionDegrees.cinemaOpen,
      startSection: eventTimes.cinemaOpen,
      endSection: eventTimes.preShow,
    };
  }
  if (currentTime >= preShow && currentTime <= movieStart)
    return {
      ...sectionDegrees.preshow,
      startSection: eventTimes.preShow,
      endSection: eventTimes.movieStart,
    };
  return {
    ...sectionDegrees.movie,
    startSection: eventTimes.movieStart,
    endSection: eventTimes.movieEnd,
  };
};

let timeNow = new Date("2021/06/04 10:57");

let timeData = getStartRange(eventTimes, timeNow, sectionDegrees);

console.log(timeData);

export const findPercentageToStop = (timeNow, timeData) => {
  const lapsed = Math.floor(
    Math.abs(timeNow - timeData.startSection) / 1000 / 60
  );
  const totalDifference = Math.floor(
    Math.abs(timeData.endSection - timeData.startSection) / 1000 / 60
  );
  console.log(`time now is ${timeNow}`);
  console.log(
    `how many minutes have lapsed between now and the start section ${lapsed} mins`
  );
  console.log(
    `the time difference between start and end section is ${totalDifference} mins`
  );
  const result = (lapsed / totalDifference) * timeData.range;
  const roundedResult = parseInt((timeData.start + result).toFixed(0));

  return roundedResult;
  //   let lapsed = timeNow - start;
  //   let totalDifference = end - start;
  //   let result = (lapsed / totalDifference) * startRange.range;
  //   return (startRange.range + result).toFixed(0);
};

let test = findPercentageToStop(timeNow, timeData);
console.log(test);
// 1000 ----> cinema opens
// 1030 ----> preshow starts
// 1010 ----> time NOW
// 70 ----> start angle/section of the progress
// 80 ----> total units from start of the progress to end

// need to convert time to 24hours
// need to make sure the time difference are in minutes
// let result = parseInt(findPercentageToStop(1000, 1020, 1010, 70, 80));

// var diff = Math.abs(
//   new Date("2011/10/10 08:00") - new Date("2011/10/10 11:00")
// );
// var minutes = Math.floor(diff / 1000 / 60);
// console.log(minutes);

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

export const render = (ctx, percentage, timeSlots) => {
  const radius = 140;
  const circum = 2 * Math.PI * radius;
  const lineWidth = 12;
  const gap = 0;
  const START_RADIAN = parseFloat(-0.2);
  const END_RADIAN = parseFloat(1.2);

  let progress = normalizeValueToRange(
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
  //console.log("current progress", progress);
  timeSlots.events.forEach((value, index) => {
    const startSection = normalizeValueToRange(
      value.startTime,
      percentage.min,
      percentage.max,
      START_RADIAN,
      END_RADIAN
    );
    //console.log(`start section: ${value.eventName}`, startSection);
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
      //console.log(`end section: ${value.eventName}`, sectionEndNorm);
      if (progress >= sectionEndNorm) {
        ctx.arc(0, 0, radius, Math.PI * startSection, Math.PI * sectionEndNorm);
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
