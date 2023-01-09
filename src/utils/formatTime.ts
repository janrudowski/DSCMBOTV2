const formatTime = (sec: string | number): string => {
  if (typeof sec === "string") sec = parseInt(sec, 10);
  const minutes = String(~~(sec / 60)).padStart(2, "0");
  const seconds = String(~~(sec % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default formatTime;
