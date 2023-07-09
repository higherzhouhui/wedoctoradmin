export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs =  Math.floor(seconds % 60);

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += hours + '小时 ';
  }
  if (minutes > 0) {
    formattedTime += minutes + '分钟 ';
  }
  if (secs > 0) {
    formattedTime += secs + '秒';
  }

  return formattedTime;
}