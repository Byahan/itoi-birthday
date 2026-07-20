"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  Eraser,
  Paintbrush,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
} from "lucide-react";

import type {
  DrawingPoint,
  DrawingStroke,
} from "@/types/birthday";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

const MAX_STROKES = 300;
const MAX_TOTAL_POINTS = 12_000;

const PRESET_COLORS = [
  "#202B50",
  "#FFFFFF",
  "#F493C2",
  "#ED78B2",
  "#48A9F8",
  "#318EE8",
  "#8195BF",
  "#FFE58F",
  "#A8E6CF",
];

type DrawingTool = "brush" | "eraser";

export interface DrawingCanvasHandle {
  getStrokes: () => DrawingStroke[];
  clearCanvas: () => void;
}

function isValidHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function distanceBetweenPoints(
  first: DrawingPoint,
  second: DrawingPoint,
): number {
  return Math.hypot(
    second.x - first.x,
    second.y - first.y,
  );
}

const DrawingCanvas = forwardRef<
  DrawingCanvasHandle
>(function DrawingCanvas(_, ref) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const currentStrokeRef =
    useRef<DrawingStroke | null>(null);

  const isDrawingRef = useRef(false);

  const [strokes, setStrokes] = useState<
    DrawingStroke[]
  >([]);

  const [redoStack, setRedoStack] = useState<
    DrawingStroke[]
  >([]);

  const [selectedColor, setSelectedColor] =
    useState("#48A9F8");

  const [hexInput, setHexInput] =
    useState("#48A9F8");

  const [brushSize, setBrushSize] =
    useState(5);

  const [tool, setTool] =
    useState<DrawingTool>("brush");

  function prepareCanvas(
    canvas: HTMLCanvasElement,
  ) {
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.lineCap = "round";
    context.lineJoin = "round";

    return context;
  }

  function clearCanvasPixels() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = prepareCanvas(canvas);

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
  }

  function drawStroke(
    context: CanvasRenderingContext2D,
    stroke: DrawingStroke,
  ) {
    if (stroke.points.length === 0) {
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
    context.lineCap = "round";
    context.lineJoin = "round";

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
  }

  function redrawCanvas(
    nextStrokes: DrawingStroke[],
  ) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = prepareCanvas(canvas);

    if (!context) {
      return;
    }

    clearCanvasPixels();

    nextStrokes.forEach((stroke) => {
      drawStroke(context, stroke);
    });
  }

  useEffect(() => {
    redrawCanvas(strokes);
  }, [strokes]);

  useImperativeHandle(ref, () => ({
    getStrokes() {
      return strokes;
    },

    clearCanvas() {
      setStrokes([]);
      setRedoStack([]);
      currentStrokeRef.current = null;
      isDrawingRef.current = false;
      clearCanvasPixels();
    },
  }));

  function getCanvasPoint(
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): DrawingPoint {
    const canvas = event.currentTarget;
    const rectangle =
      canvas.getBoundingClientRect();

    const scaleX =
      CANVAS_WIDTH / rectangle.width;

    const scaleY =
      CANVAS_HEIGHT / rectangle.height;

    return {
      x:
        (event.clientX - rectangle.left) *
        scaleX,
      y:
        (event.clientY - rectangle.top) *
        scaleY,
    };
  }

  function beginStroke(
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) {
    if (strokes.length >= MAX_STROKES) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    const point = getCanvasPoint(event);

    const stroke: DrawingStroke = {
      color:
        tool === "eraser"
          ? "#FFFFFF"
          : selectedColor,
      size: brushSize,
      tool,
      points: [point],
    };

    currentStrokeRef.current = stroke;
    isDrawingRef.current = true;

    const canvas = canvasRef.current;
    const context = canvas
      ? prepareCanvas(canvas)
      : null;

    if (context) {
      drawStroke(context, stroke);
    }
  }

  function continueStroke(
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) {
    if (
      !isDrawingRef.current ||
      !currentStrokeRef.current
    ) {
      return;
    }

    const stroke = currentStrokeRef.current;
    const point = getCanvasPoint(event);

    const previousPoint =
      stroke.points[stroke.points.length - 1];

    // Prevents thousands of nearly identical points.
    if (
      distanceBetweenPoints(
        previousPoint,
        point,
      ) < 2.5
    ) {
      return;
    }

    const totalStoredPoints = strokes.reduce(
      (total, savedStroke) =>
        total + savedStroke.points.length,
      0,
    );

    if (
      totalStoredPoints +
        stroke.points.length >=
      MAX_TOTAL_POINTS
    ) {
      finishStroke(event);
      return;
    }

    stroke.points.push(point);

    const canvas = canvasRef.current;
    const context = canvas
      ? prepareCanvas(canvas)
      : null;

    if (!context) {
      return;
    }

    const temporaryStroke: DrawingStroke = {
      ...stroke,
      points: [previousPoint, point],
    };

    drawStroke(context, temporaryStroke);
  }

  function finishStroke(
    event?: ReactPointerEvent<HTMLCanvasElement>,
  ) {
    if (
      !isDrawingRef.current ||
      !currentStrokeRef.current
    ) {
      return;
    }

    if (
      event?.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    const completedStroke =
      currentStrokeRef.current;

    setStrokes((currentStrokes) => [
      ...currentStrokes,
      completedStroke,
    ]);

    setRedoStack([]);

    currentStrokeRef.current = null;
    isDrawingRef.current = false;
  }

  function undo() {
    setStrokes((currentStrokes) => {
      if (currentStrokes.length === 0) {
        return currentStrokes;
      }

      const removedStroke =
        currentStrokes[
          currentStrokes.length - 1
        ];

      setRedoStack((currentRedoStack) => [
        removedStroke,
        ...currentRedoStack,
      ]);

      return currentStrokes.slice(0, -1);
    });
  }

  function redo() {
    setRedoStack((currentRedoStack) => {
      if (currentRedoStack.length === 0) {
        return currentRedoStack;
      }

      const restoredStroke =
        currentRedoStack[0];

      setStrokes((currentStrokes) => [
        ...currentStrokes,
        restoredStroke,
      ]);

      return currentRedoStack.slice(1);
    });
  }

  function clearDrawing() {
    setStrokes([]);
    setRedoStack([]);
    clearCanvasPixels();
  }

  function chooseColor(color: string) {
    setSelectedColor(color);
    setHexInput(color.toUpperCase());
    setTool("brush");
  }

  function handleHexChange(value: string) {
    let normalizedValue = value.trim();

    if (!normalizedValue.startsWith("#")) {
      normalizedValue = `#${normalizedValue}`;
    }

    setHexInput(normalizedValue.toUpperCase());

    if (isValidHexColor(normalizedValue)) {
      setSelectedColor(normalizedValue);
      setTool("brush");
    }
  }

  const totalPoints = strokes.reduce(
    (total, stroke) =>
      total + stroke.points.length,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-[#dceaf5] bg-white">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={beginStroke}
          onPointerMove={continueStroke}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          onPointerLeave={(event) => {
            if (
              event.buttons === 0 &&
              isDrawingRef.current
            ) {
              finishStroke(event);
            }
          }}
          className={`block aspect-[9/5] w-full touch-none bg-white ${
            tool === "eraser"
              ? "cursor-cell"
              : "cursor-crosshair"
          }`}
          aria-label="Birthday drawing canvas"
        />
      </div>

      <div className="grid gap-6 rounded-3xl border border-[#e3edf6] bg-[#f8fbff] p-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-black text-[#202b50]">
            Preset colors
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            {PRESET_COLORS.map((color) => {
              const isActive =
                tool === "brush" &&
                selectedColor.toUpperCase() ===
                  color.toUpperCase();

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    chooseColor(color)
                  }
                  aria-label={`Use color ${color}`}
                  aria-pressed={isActive}
                  className={`relative h-10 w-10 rounded-full border-2 transition hover:scale-105 ${
                    isActive
                      ? "border-[#202b50] ring-4 ring-[#48a9f8]/20"
                      : "border-white shadow-sm"
                  }`}
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {color === "#FFFFFF" && (
                    <span className="absolute inset-1 rounded-full border border-[#d7e2ec]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <label
              htmlFor="custom-drawing-color"
              className="text-sm font-black text-[#202b50]"
            >
              Custom color
            </label>

            <div className="mt-3 flex items-center gap-3">
              <input
                id="custom-drawing-color"
                type="color"
                value={selectedColor}
                onChange={(event) =>
                  chooseColor(
                    event.target.value,
                  )
                }
                className="h-12 w-14 cursor-pointer rounded-xl border border-[#dceaf5] bg-white p-1"
              />

              <div className="flex-1">
                <label
                  htmlFor="custom-drawing-hex"
                  className="sr-only"
                >
                  Custom hexadecimal color
                </label>

                <input
                  id="custom-drawing-hex"
                  type="text"
                  value={hexInput}
                  maxLength={7}
                  onChange={(event) =>
                    handleHexChange(
                      event.target.value,
                    )
                  }
                  placeholder="#48A9F8"
                  className={`h-12 w-full rounded-xl border bg-white px-4 font-mono text-sm uppercase text-[#202b50] outline-none transition focus:ring-4 ${
                    isValidHexColor(hexInput)
                      ? "border-[#dceaf5] focus:border-[#48a9f8] focus:ring-[#48a9f8]/10"
                      : "border-red-300 focus:border-red-400 focus:ring-red-100"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="drawing-brush-size"
              className="text-sm font-black text-[#202b50]"
            >
              Brush size
            </label>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#65708b]">
              {brushSize}px
            </span>
          </div>

          <input
            id="drawing-brush-size"
            type="range"
            min={1}
            max={20}
            value={brushSize}
            onChange={(event) =>
              setBrushSize(
                Number(event.target.value),
              )
            }
            className="mt-4 w-full accent-[#48a9f8]"
          />

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTool("brush")}
              aria-pressed={tool === "brush"}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-black transition ${
                tool === "brush"
                  ? "bg-[#dff1ff] text-[#318ee8]"
                  : "border border-[#dceaf5] bg-white text-[#737d96]"
              }`}
            >
              <Paintbrush size={17} />
              Brush
            </button>

            <button
              type="button"
              onClick={() => setTool("eraser")}
              aria-pressed={tool === "eraser"}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-black transition ${
                tool === "eraser"
                  ? "bg-[#ffe8f3] text-[#e36da7]"
                  : "border border-[#dceaf5] bg-white text-[#737d96]"
              }`}
            >
              <Eraser size={17} />
              Eraser
            </button>

            <button
              type="button"
              onClick={undo}
              disabled={strokes.length === 0}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dceaf5] bg-white text-sm font-black text-[#737d96] transition hover:text-[#318ee8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Undo2 size={17} />
              Undo
            </button>

            <button
              type="button"
              onClick={redo}
              disabled={redoStack.length === 0}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dceaf5] bg-white text-sm font-black text-[#737d96] transition hover:text-[#318ee8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Redo2 size={17} />
              Redo
            </button>

            <button
              type="button"
              onClick={clearDrawing}
              disabled={strokes.length === 0}
              className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white text-sm font-black text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={17} />
              Clear canvas
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#8a91a8]">
        <span>
          {strokes.length}/{MAX_STROKES} strokes
        </span>

        <span>
          {totalPoints.toLocaleString()}/
          {MAX_TOTAL_POINTS.toLocaleString()} points
        </span>
      </div>

      {strokes.length >= MAX_STROKES && (
        <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          The maximum number of strokes has been
          reached.
        </p>
      )}
    </div>
  );
});

export default DrawingCanvas;