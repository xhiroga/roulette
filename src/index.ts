import { ComponentParam } from "./@types/global"

const Edge = ({ canvas, centerX, centerY }: ComponentParam) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const path = new Path2D()
  path.arc(centerX, centerY, 400, 0, 2 * Math.PI)
  ctx.fillStyle = 'green'
  ctx.fill(path)
}

const Wheel = ({ canvas, centerX, centerY }: ComponentParam) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const path = new Path2D()
  path.arc(centerX, centerY, 380, 0, 2 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill(path)
}

type Entry = {
  label: string
}
type PieceParam = Entry & {
  angle: number,
  color: string,
  arcLength: number,
}
const Piece = ({ canvas, centerX, centerY, angle, arcLength, color, label }: PieceParam & ComponentParam) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const path = new Path2D()
  path.moveTo(centerX, centerY)
  path.arc(centerX, centerY, 380, angle - arcLength / 2, angle + arcLength / 2)
  path.lineTo(centerX, centerY)
  ctx.strokeStyle = 'white'
  ctx.stroke(path)
  ctx.fillStyle = color
  ctx.fill(path)
}

type PiecesParam = {
  entries: Entry[];
}
const Pieces = ({ canvas, centerX, centerY, entries }: PiecesParam & ComponentParam) => {
  entriesToPieceParams(entries).forEach((params) => {
    Piece({ ...params, canvas, centerX, centerY })
  })
}

const entriesToPieceParams = (entries: Entry[]): PieceParam[] => {
  const total = entries.length
  return entries.map((entry, index) => ({
    ...entry,
    angle: index / total * Math.PI * 2,
    arcLength: Math.PI * 2 / total,
    color: 'red',
    radius: 1 / total * Math.PI * 2,
  }))
}

const drawRoulette = (): void => {
  const canvas = <HTMLCanvasElement>document.getElementById('roulette')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const entries = [{
    label: 'カステラ',
  }, {
    label: 'ようかん',
  }, {
    label: 'みかん',
  }, {
    label: 'りんご',
  }]

  const params: ComponentParam = {
    canvas, centerX, centerY
  }
  Edge(params)
  Wheel(params)
  Pieces({ ...params, entries })
}


document.addEventListener('DOMContentLoaded', drawRoulette)
