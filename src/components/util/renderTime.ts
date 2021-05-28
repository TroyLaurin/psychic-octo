const renderTime = (sec_num: number): string => {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num % 3600) / 60);
  const seconds = Math.floor(sec_num) % 60;

  return (
    ("0" + hours).substr(-2) +
    ":" +
    ("0" + minutes).substr(-2) +
    ":" +
    ("0" + seconds).substr(-2)
  );
};

export default renderTime;
