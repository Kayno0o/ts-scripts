import { GrowingTreeMaze } from './GrowingTree'

function main() {
  const w = 16
  const h = 9

  const backtracking = new GrowingTreeMaze(w, h)
  backtracking.generate(() => 0)
  console.log(backtracking.printHTML())

  const prims = new GrowingTreeMaze(w, h)
  prims.generate(queue => Math.floor(Math.random() * queue.length))
  console.log(prims.printHTML())
}

main()
