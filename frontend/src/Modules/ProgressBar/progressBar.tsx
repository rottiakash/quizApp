import React, { FC } from "react";

interface ProgressBarProps {
  completed: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ completed }) => {
  return (
    <div
      style={{
        height: "30rem",
        width: "1rem",
        backgroundColor: "teal",
        display: "flex",
        flexDirection: "column-reverse",
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: `${completed}%`,
          backgroundImage: "linear-gradient(45deg, #f3ec78, #af4261)",
          backgroundSize: "100%",
          backgroundRepeat: "repeat",
          backgroundClip: "text",
          color: "transparent",
          borderRadius: "20px",
          transition: "height 1s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
