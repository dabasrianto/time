import React, { useEffect, useState } from "react";

interface AnalogClockProps {
  currentTime: Date;
  theme: string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ currentTime, theme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = (((hours % 12) + minutes / 60) / 12) * 360;

  const getThemeColors = () => {
    switch (theme) {
      case "emerald":
        return {
          face: "border-emerald-200/20 bg-emerald-900/30",
          hour: "bg-emerald-100",
          minute: "bg-emerald-200",
          second: "bg-emerald-400",
          center: "bg-emerald-100",
          marker: "bg-emerald-100/50",
        };
      case "rose":
        return {
          face: "border-rose-200/20 bg-rose-900/30",
          hour: "bg-rose-100",
          minute: "bg-rose-200",
          second: "bg-rose-400",
          center: "bg-rose-100",
          marker: "bg-rose-100/50",
        };
      default: // blue
        return {
          face: "border-blue-200/20 bg-blue-900/30",
          hour: "bg-blue-100",
          minute: "bg-blue-200",
          second: "bg-blue-400",
          center: "bg-blue-100",
          marker: "bg-blue-100/50",
        };
    }
  };

  const colors = getThemeColors();

  if (!mounted) return null;

  return (
    <div
      className={`relative w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full border-4 ${colors.face} backdrop-blur-sm shadow-2xl flex items-center justify-center transition-colors duration-1000`}
    >
      {/* Clock Face Markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`absolute top-1/2 left-1/2 origin-bottom flex justify-center`}
          style={{
            transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
            height: "40%",
            width: i % 3 === 0 ? "4px" : "2px",
          }}
        >
          <div
            className={`w-full ${colors.marker} rounded-full`}
            style={{
              height: i % 3 === 0 ? "15%" : "10%",
              opacity: i % 3 === 0 ? 1 : 0.5,
            }}
          />
        </div>
      ))}

      {/* Hour Hand */}
      <div
        className={`absolute w-2 h-[25%] ${colors.hour} rounded-full origin-bottom shadow-lg transition-transform duration-75 ease-out`}
        style={{
          transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
          top: "50%",
          left: "50%",
        }}
      />

      {/* Minute Hand */}
      <div
        className={`absolute w-1.5 h-[35%] ${colors.minute} rounded-full origin-bottom shadow-lg transition-transform duration-75 ease-out`}
        style={{
          transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
          top: "50%",
          left: "50%",
        }}
      />

      {/* Second Hand */}
      <div
        className={`absolute w-1 h-[40%] ${colors.second} rounded-full origin-bottom shadow-md transition-transform duration-75 ease-out`}
        style={{
          transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
          top: "50%",
          left: "50%",
        }}
      />

      {/* Center Dot */}
      <div
        className={`absolute w-4 h-4 ${colors.center} rounded-full shadow-lg z-10`}
      />
    </div>
  );
};

export default AnalogClock;
