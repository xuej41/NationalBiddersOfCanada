import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}
const max = (a: number, b: number) => {
  return a > b ? a : b;
};


const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  // State to hold the formatted time left (HH:MM:SS)
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    if (!targetDate) {
      return;
    }
    // A function that calculates the difference and formats it
    const updateTimer = () => {
      const now = new Date();

      let diff = max(targetDate.getTime() - now.getTime(), 0);

      // If the target date is in the past, show 00:00:00
      if (diff < 0) {
        diff = 0;
      }

      // Convert the difference from ms to total seconds
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Format each unit to be at least two digits, e.g. 00:07:09
      const hh = String(hours).padStart(2, '0');
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');

      setTimeLeft(`${hh}:${mm}:${ss}`);
    };

    // Run once immediately so it shows the correct time on mount
    updateTimer();

    // Update every second
    const intervalId = setInterval(updateTimer, 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return <div>{timeLeft}</div>;
};

export default CountdownTimer;
