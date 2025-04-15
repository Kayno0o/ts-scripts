import type { Dir } from './utils'
import { randomInt, shuffleArray } from '@kaynooo/utils'
import { Block } from './Block'
import { DIRS } from './utils'

export class Maze {
  w: number
  h: number
  blocks: Block[]

  constructor(w: number, h: number) {
    this.w = w
    this.h = h

    this.blocks = []
    for (let i = 0; i < w * h; i++) {
      this.blocks[i] = new Block(i, 0, 0)
    }
  }

  getBlock(pos: number, dir: number): number {
    let newPos = -1

    switch (dir) {
      case 1:
        if (pos >= this.w) {
          newPos = (pos - this.w)
        }
        break
      case 2:
        if ((pos + 1) % this.w !== 0) {
          newPos = (pos + 1)
        }
        break
      case 4:
        if (pos < this.w * (this.h - 1)) {
          newPos = (pos + this.w)
        }
        break
      case 8:
        if (pos % this.w !== 0) {
          newPos = (pos - 1)
        }
        break
    }

    if (newPos < 0 || newPos >= this.w * this.h) {
      return -1
    }

    return newPos
  }

  getNeighbours(pos: number): number[] {
    const neighbours: number[] = []

    for (const dir of DIRS) {
      const newPos = this.getBlock(pos, dir)

      if (newPos === -1)
        continue

      neighbours.push(newPos)
    }

    return neighbours
  }

  getNonVisitedNeighbours(pos: number): number[] {
    const nonVisitedNeighbours: number[] = []
    const neighbours = this.getNeighbours(pos)

    for (const neighbour of neighbours) {
      if (this.blocks[neighbour].wall !== 0)
        continue

      nonVisitedNeighbours.push(neighbour)
    }

    return nonVisitedNeighbours
  }

  randomNonVisitedNeighbour(pos: number): [newPos: number, dir: Dir | -1] {
    const clonedDirs = [...DIRS]
    shuffleArray(clonedDirs)

    for (const dir of clonedDirs) {
      const newPos = this.getBlock(pos, dir)
      if (newPos === -1)
        continue

      if (this.blocks[newPos].wall === 0)
        return [newPos, dir]
    }

    return [-1, -1]
  }

  getEdgeIndex(side: Dir): number {
    switch (side) {
      case 1:
        return randomInt(this.w)
      case 2:
        return randomInt(this.h) * this.w + (this.w - 1)
      case 4:
        return (this.h - 1) * this.w + randomInt(this.w)
      case 8:
        return randomInt(this.h) * this.w
      default:
        return 0
    }
  }

  printHTML(): HTMLElement {
    const table = document.createElement('table')
    table.className = 'maze'

    const sides: Dir[] = [1, 2, 4, 8]
    const startSideIndex = randomInt(4)
    const startSide = sides[startSideIndex]
    const start = this.getEdgeIndex(startSide)
    this.blocks[start].wall |= startSide

    sides.splice(startSideIndex, 1)
    const endSideIndex = randomInt(3)
    const endSide = sides[endSideIndex]
    const end = this.getEdgeIndex(endSide)
    this.blocks[end].wall |= endSide

    for (let y = 0; y < this.h; y++) {
      const row = document.createElement('tr')

      for (let x = 0; x < this.w; x++) {
        const i = y * this.w + x
        const wall = this.blocks[i].wall

        const cell = document.createElement('td')
        const cls: string[] = []

        if (!(wall & 1))
          cls.push('t')
        if (!(wall & 2))
          cls.push('r')
        if (!(wall & 4))
          cls.push('b')
        if (!(wall & 8))
          cls.push('l')
        if (i === start)
          cls.push(`s side-${startSide}`)
        if (i === end)
          cls.push(`e side-${endSide}`)

        cell.className = cls.join(' ')
        row.appendChild(cell)
      }

      table.appendChild(row)
    }

    return table
  }
}
