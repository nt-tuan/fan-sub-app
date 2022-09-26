import { PIXEL_PER_SECOND } from "@/timebar-screen/components/ruler/ruler.enum";

export const milisecondsToSeconds = (time: number) => {
  return time / 1000;
};

const getTimeNumberLabel = (time: number) => {
  if (time > 9) return `${time}`;
  return `0${time}`;
};

// in miliseconds
export const getTimeLabel = (time: number) => {
  let seconds = milisecondsToSeconds(time);
  if (seconds >= 60) {
    return `${getTimeNumberLabel(
      Math.floor(seconds / 60)
    )}:${getTimeNumberLabel(seconds % 60)}`;
  }
  return `00:${getTimeNumberLabel(seconds % 60)}`;
};

export const getPxFromMilisecond = (time: number) => {
  return (time * PIXEL_PER_SECOND) / 1000;
};

export const getMilisecondFromPx = (pixel: number) => {
  return (pixel * 1000) / PIXEL_PER_SECOND;
};
