import { ComponentParam, Point } from "./@types/global"

const Edge = ({ ctx, centerX, centerY }: ComponentParam) => {
  const path = new Path2D()
  path.arc(centerX, centerY, 400, 0, 2 * Math.PI)
  ctx.save()
  ctx.fillStyle = 'green'
  ctx.fill(path)
  ctx.restore()
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
  path.moveTo(0, 0)
  path.arc(0, 0, 380, - arcLength / 2, + arcLength / 2)
  path.lineTo(0, 0)
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(angle)
  ctx.lineWidth = 20
  ctx.strokeStyle = 'white'
  ctx.stroke(path)
  ctx.fillStyle = `HSLA(${angle / Math.PI * 180}, 100%, 66%, 1)`
  ctx.fill(path)
  ctx.fillStyle = 'white'
  ctx.font = '50px Arial'
  ctx.fillText(label, 100, 0, 250);
  ctx.restore()
}

type PiecesParam = {
  entries: Entry[];
}
const Pieces = ({ entries, rotate, ...rest }: PiecesParam & ComponentParam) => {
  entriesToPieceParams(entries).forEach(({ angle, ...restParam }) => {
    Piece({ angle: angle + rotate, ...restParam, rotate, ...rest })
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
  ctx.save()
  ctx.fillStyle = 'white'
  ctx.fill(path)
  ctx.restore()
}

const ShaftBody = ({ ctx, centerX, centerY }: ComponentParam) => {
  const path = new Path2D()
  path.arc(centerX, centerY, 50, 0, 2 * Math.PI)
  ctx.save()
  ctx.lineWidth = 30
  ctx.strokeStyle = 'white'
  ctx.stroke(path)
  ctx.fillStyle = 'royalblue'
  ctx.fill(path)
  ctx.restore()
}

const Shaft = (param: ComponentParam) => {
  ShaftBody(param)
  PlaySign(param)

  const testHit = (point: Point) => (point.x - param.centerX) ** 2 + (point.y - param.centerY) ** 2 < 50 ** 2
  return { testHit }
}

const draw = (rotate: number): void => {
  const canvas = <HTMLCanvasElement>document.getElementById('spinner')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  const { testHit } = Shaft(param)

  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    if (testHit(point)) {
      spin(rotate, Math.PI / 2)
    }
  });
}

const spin = (rotate: number, delta: number): void => {
  if (delta < 0.005) {
    return
  }
  draw(rotate)
  window.requestAnimationFrame(() => spin(rotate + delta, delta * 0.96));
}

document.addEventListener('DOMContentLoaded', () => draw(0))
