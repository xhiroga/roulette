import { ComponentParam, Point } from "./@types/global"

type Hook = {
  onHit?: () => void,
  testHit?: (point: Point) => boolean,
}
type Component = (param: ComponentParam) => Hook

let hooks: Hook[]

const Edge: Component = ({ ctx, centerX, centerY }: ComponentParam) => {
  const path = new Path2D()
  path.arc(centerX, centerY, 400, 0, 2 * Math.PI)
  ctx.save()
  ctx.fillStyle = 'green'
  ctx.fill(path)
  ctx.restore()
  return {}
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
  return {}
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

const Shaft: Component = (param: ComponentParam) => {
  ShaftBody(param)
  PlaySign(param)

  const testHit = (point: Point) => (point.x - param.centerX) ** 2 + (point.y - param.centerY) ** 2 < 50 ** 2
  return { onHit: param.initSpin, testHit }
}

const draw = (canvas: HTMLCanvasElement, rotate: number): Hook[] => {

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const spin = (r: number, delta: number): void => {
    if (delta < 0.01) {
      return
    }
    hooks = draw(canvas, r)
    window.requestAnimationFrame(() => spin(r + delta, delta * 0.97));
  }
  const initSpin = () => spin(rotate, Math.PI / 6)

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const param: ComponentParam = {
    rotate, ctx, centerX, centerY, initSpin
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
  return [
    Edge(param),
    Pieces({ ...param, entries }),
    Shaft(param)
  ]
}

const main = () => {
  const canvas = <HTMLCanvasElement>document.getElementById('spinner')

  hooks = draw(canvas, 0)
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    hooks.forEach(hook => {
      if (hook?.testHit?.(point)) {
        hook?.onHit?.()
      }
    })
  });
}

document.addEventListener('DOMContentLoaded', main)
