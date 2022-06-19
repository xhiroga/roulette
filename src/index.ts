import { ComponentParams } from "./@types/global"

const drawRoulette = (): void => {
  const canvas = <HTMLCanvasElement>document.getElementById('roulette')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const params: ComponentParams = {
    canvas, centerX, centerY
  }
  Edge(params)
  Wheel(params)
}

const Edge = ({ canvas, centerX, centerY }: ComponentParams) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const path = new Path2D()
  path.arc(centerX, centerY, 400, 0, 2 * Math.PI)
  ctx.fillStyle = 'green'
  ctx.fill(path)
}

const Wheel = ({ canvas, centerX, centerY }: ComponentParams) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const path = new Path2D()
  path.arc(centerX, centerY, 380, 0, 2 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill(path)
}

document.addEventListener('DOMContentLoaded', drawRoulette)
