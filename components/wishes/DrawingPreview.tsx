"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  DrawingStroke,
} from "@/types/birthday";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

interface DrawingPreviewProps {
  drawing: DrawingStroke[];
  name: string;
}

export default function DrawingPreview({
  drawing,
  name,
}: DrawingPreviewProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
    );

    context.fillStyle = "#FFFFFF";

    context.fillRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
    );

    context.lineCap = "round";
    context.lineJoin = "round";

    drawing.forEach((stroke) => {
      if (
        !Array.isArray(stroke.points) ||
        stroke.points.length === 0
      ) {
        return;
      }

      const strokeColor =
        stroke.tool === "eraser"
          ? "#FFFFFF"
          : stroke.color;

      const strokeSize =
        stroke.tool === "eraser"
          ? stroke.size * 2
          : stroke.size;

      context.strokeStyle = strokeColor;
      context.fillStyle = strokeColor;
      context.lineWidth = strokeSize;

      if (stroke.points.length === 1) {
        const point = stroke.points[0];

        context.beginPath();

        context.arc(
          point.x,
          point.y,
          strokeSize / 2,
          0,
          Math.PI * 2,
        );

        context.fill();

        return;
      }

      context.beginPath();

      context.moveTo(
        stroke.points[0].x,
        stroke.points[0].y,
      );

      for (
        let index = 1;
        index < stroke.points.length;
        index += 1
      ) {
        const point = stroke.points[index];

        context.lineTo(point.x, point.y);
      }

      context.stroke();
    });
  }, [drawing]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="block aspect-[9/5] w-full bg-white"
      aria-label={`Birthday drawing submitted by ${name}`}
    />
  );
}