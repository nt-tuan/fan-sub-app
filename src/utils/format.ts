export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

export const formatTime = (miliseconds: number) =>
  `${zeroPad(Math.floor(miliseconds / 1000 / 60), 2)}:${zeroPad(
    Math.floor(miliseconds / 1000) % 60,
    2
  )}`;
