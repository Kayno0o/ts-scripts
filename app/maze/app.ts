import { GrowingTreeMaze } from './src/GrowingTree'

const widthInput = document.getElementById('width') as HTMLInputElement
const heightInput = document.getElementById('height') as HTMLInputElement
const mazeEl = document.getElementById('maze')!
const algoInputs = document.querySelectorAll<HTMLInputElement>('input[name="algo"]')

function generateMaze() {
  const w = Number.parseInt(widthInput.value)
  const h = Number.parseInt(heightInput.value)
  const algo = document.querySelector<HTMLInputElement>('input[name="algo"]:checked')!.value

  performance.mark('start')

  const maze = new GrowingTreeMaze(w, h)

  const selector = (<Record<string, (queue: number[]) => number>>{
    backtracking: () => 0,
    prims: q => Math.floor(Math.random() * q.length),
    oldest: q => q.length - 1,
    middle: q => Math.floor(q.length / 2),
    alternating: q => (q.length % 2 === 0 ? q.length - 1 : 0),
  })[algo as any]

  performance.mark('gen-start')
  maze.generate(selector)
  performance.mark('gen-end')

  mazeEl.innerHTML = ''

  performance.mark('render-start')
  mazeEl.appendChild(maze.printHTML())
  performance.mark('render-end')

  performance.mark('end')

  performance.measure('Total', 'start', 'end')
  performance.measure('Generate', 'gen-start', 'gen-end')
  performance.measure('Render', 'render-start', 'render-end')

  const measures = performance.getEntriesByType('measure')
  for (const entry of measures) {
    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`)
  }
  performance.clearMarks()
  performance.clearMeasures()
}

widthInput.addEventListener('input', generateMaze)
heightInput.addEventListener('input', generateMaze)

for (const input of algoInputs)
  input.addEventListener('change', generateMaze)

generateMaze()
