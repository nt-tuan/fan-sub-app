export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

export const formatTime = (miliseconds: number) =>
  `${zeroPad(Math.floor(miliseconds / 1000 / 60), 2)}:${zeroPad(
    Math.floor(miliseconds / 1000) % 60,
    2
  )}`;

export const replaceText = (
  regex: string,
  alternativeText: string,
  originalStr: string
) => {
  if (!originalStr) return "";
  const reg = new RegExp(regex);
  const newStr = originalStr.replace(reg, alternativeText);
  return newStr;
};
