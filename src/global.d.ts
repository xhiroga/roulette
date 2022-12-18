export type CanvasProps = {
  ctx: CanvasRenderingContext2D;
  centerX: number;
  centerY: number;
}

export type ComponentProps = {
  rotate: number;
  initSpin: () => void
}

export type Point = {
  x: number;
  y: number;
}
