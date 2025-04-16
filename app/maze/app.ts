import type { Gene } from '../genetics/StringGenetic'
import GrowingTreeMazeSolver from '../genetics/GrowingTreeMazeSolver'
import { GrowingTreeMaze } from './src/GrowingTree'

const widthInput = document.getElementById('width') as HTMLInputElement
const heightInput = document.getElementById('height') as HTMLInputElement
const mazeEl = document.getElementById('maze')!
const algoInputs = document.querySelectorAll<HTMLInputElement>('input[name="algo"]')
const solveButton = document.getElementById('solve') as HTMLButtonElement
const populationSizeInput = document.getElementById('population-size') as HTMLInputElement
const mutationRateInput = document.getElementById('mutation-rate') as HTMLInputElement
const bestPopulationRateInput = document.getElementById('best-population-rate') as HTMLInputElement
const maxGenerationInput = document.getElementById('max-generation') as HTMLInputElement
const geneticProgress = document.getElementById('genetic-progress') as HTMLProgressElement

let maze: GrowingTreeMaze

function generateMaze() {
  const w = Number.parseInt(widthInput.value)
  const h = Number.parseInt(heightInput.value)
  const algo = document.querySelector<HTMLInputElement>('input[name="algo"]:checked')!.value

  maze = new GrowingTreeMaze(w, h)

  const selector = (<Record<string, (queue: number[]) => number>>{
    backtracking: () => 0,
    prims: q => Math.floor(Math.random() * q.length),
    oldest: q => q.length - 1,
    middle: q => Math.floor(q.length / 2),
    alternating: q => (q.length % 2 === 0 ? q.length - 1 : 0),
  })[algo as any]

  maze.generate(selector)

  mazeEl.innerHTML = ''
  mazeEl.appendChild(maze.printHTML())
}

widthInput.addEventListener('input', generateMaze)
heightInput.addEventListener('input', generateMaze)

for (const input of algoInputs)
  input.addEventListener('change', generateMaze)

generateMaze()

solveButton.addEventListener('click', async () => {
  const mazeSolver = new GrowingTreeMazeSolver({
    maze,
    w: maze.w,
    h: maze.h,
    populationSize: Number(populationSizeInput.value),
    mutationRate: Number(mutationRateInput.value),
    bestPopulationRate: Number(bestPopulationRateInput.value),
    maxGeneration: Number(maxGenerationInput.value),
    verbose: false,
  })

  geneticProgress.hidden = false
  geneticProgress.max = mazeSolver.maxGeneration

  mazeSolver.on('generation', async (nb: number) => {
    if (nb % 10 === 0) {
      geneticProgress.value = nb
      await new Promise(requestAnimationFrame)
    }
  })

  mazeSolver.on('best', async (best: Gene) => {
    mazeEl.innerHTML = ''
    mazeEl.appendChild(maze.printHTML(best.genes))
    await new Promise(requestAnimationFrame)
  })

  const { bestOfAll } = await mazeSolver.solve()
  mazeEl.innerHTML = ''
  mazeEl.appendChild(maze.printHTML(bestOfAll.genes))

  geneticProgress.hidden = true
})
