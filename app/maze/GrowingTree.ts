import { randomInt } from '@kaynooo/utils'
import { Maze } from './Maze'
import { reverseWall } from './utils'

export class GrowingTreeMaze extends Maze {
  generate(getCell: (cells: number[]) => number) {
    const start = randomInt(this.w * this.h)
    const queue: number[] = [start]

    let order = 0

    while (queue.length) {
      const i = getCell(queue)
      const pos = queue[i]

      const [newPos, dir] = this.randomNonVisitedNeighbour(pos)
      if (newPos === -1 || dir === -1) {
        queue.splice(i, 1)
        continue
      }

      this.blocks[pos].wall |= dir

      this.blocks[newPos].wall |= reverseWall(dir)
      this.blocks[newPos].order = order

      order++

      queue.unshift(newPos)
    }
  }
}

if (typeof window !== "undefined") {
  // @ts-ignore
  window.GrowingTreeMaze = GrowingTreeMaze;
}