import React from "react";
import { SketchPicker } from "react-color";
import { useSnapshot } from "valtio";
import state from "../store";

const ColorPicker = () => {
  const snap = useSnapshot(state);
  return (
    <div className="absolute left-full ml-3">
      <SketchPicker
        color={snap.color}
        disableAlpha
        presetColors={[
          "#FF5733", // Vibrant Orange
          "#33FF57", // Bright Green
          "#3357FF", // Strong Blue
          "#FFC300", // Golden Yellow
          "#FF33A6", // Hot Pink
          "#8E44AD", // Purple
          "#34495E", // Dark Blue-Grey
          "#E74C3C", // Red
          "#27AE60", // Green
          "#2980B9", // Light Blue
          "#F39C12", // Orange
          "#D35400", // Burnt Orange
          "#2C3E50", // Navy
          "#1ABC9C", // Aqua
          "#C0392B", // Crimson Red
          "#16A085", // Teal
          "#FFF", // Light Grey
          "#7F8C8D", // Grey
        ]}
        onChange={(color) => (state.color = color.hex)}
      />
    </div>
  );
};

export default ColorPicker;
