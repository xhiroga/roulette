const drawRoulette = (): void => {
    const canvas = <HTMLCanvasElement>document.getElementById("roulette");
    Edge(canvas);
    Roulette(canvas);
}

const Edge = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const path = new Path2D();
    path.arc(400, 400, 400, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill(path);
}

const Roulette = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const path = new Path2D();
    path.arc(400, 400, 380, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill(path);
}

document.addEventListener("DOMContentLoaded", drawRoulette);
