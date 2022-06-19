import { ComponentParam } from "./@types/global"

const Edge = ({ ctx, centerX, centerY }: ComponentParam) => {
  const path = new Path2D()
  path.arc(centerX, centerY, 400, 0, 2 * Math.PI)
  ctx.fillStyle = 'green'
  ctx.fill(path)
}

type Entry = {
  label: string
}
type PieceParam = Entry & {
  angle: number,
  arcLength: number,
}
const Piece = ({ ctx, centerX, centerY, angle, arcLength, label }: PieceParam & ComponentParam) => {
  const path = new Path2D()
  path.moveTo(centerX, centerY)
  path.arc(centerX, centerY, 380, angle - arcLength / 2, angle + arcLength / 2)
  path.lineTo(centerX, centerY)
  ctx.strokeStyle = 'white'
  ctx.stroke(path)
  ctx.fillStyle = `HSLA(${angle / Math.PI * 180}, 100%, 66%, 1)`
  ctx.fill(path)
}

type PiecesParam = {
  entries: Entry[];
}
const Pieces = ({ entries, ...rest }: PiecesParam & ComponentParam) => {
  entriesToPieceParams(entries).forEach((entry) => {
    Piece({ ...entry, ...rest })
  })
}

const entriesToPieceParams = (entries: Entry[]): PieceParam[] => {
  const total = entries.length
  return entries.map((entry, index) => ({
    ...entry,
    angle: index / total * Math.PI * 2,
    arcLength: Math.PI * 2 / total
  }))
}

const PlaySign = ({ ctx, centerX, centerY }: ComponentParam) => {
  const side = 30
  const path = new Path2D()
  path.moveTo(centerX - side / Math.sqrt(3), centerY - side)
  path.lineTo(centerX + side * 2 / Math.sqrt(3), centerY)
  path.lineTo(centerX - side / Math.sqrt(3), centerY + side)
  path.closePath()
  ctx.fillStyle = 'white'
  ctx.fill(path)
}

const ShaftBody = ({ ctx, centerX, centerY }: ComponentParam) => {
  const path = new Path2D()
  path.arc(centerX, centerY, 40, 0, 2 * Math.PI)
  ctx.lineWidth = 20
  ctx.strokeStyle = 'marin'
  ctx.stroke(path)
  ctx.fillStyle = 'royalblue'
  ctx.fill(path)
}

const Shaft = (param: ComponentParam) => {
  ShaftBody(param)
  PlaySign(param)
}

const draw = (rotate: number): void => {
  const canvas = <HTMLCanvasElement>document.getElementById('spinner')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const param: ComponentParam = {
    rotate, ctx, centerX, centerY
  }
  const entries = [{
    label: 'カステラ',
  }, {
    label: 'ようかん',
  }, {
    label: 'みかん',
  }, {
    label: 'りんご',
  }]
  Edge(param)
  Pieces({ ...param, entries })
  Shaft(param)
}

const spin = (rotate: number, delta: number): void => {
  const newRotate = rotate + delta
  draw(newRotate)

  const newDelta = delta * 0.99
  if (newDelta < 0.1) {
    return
  }
  window.requestAnimationFrame(() => spin(newRotate, delta * 0.99));
}

document.addEventListener('DOMContentLoaded', () => draw(0))
