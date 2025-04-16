import type { Dir } from './utils'
import { randomInt, shuffleArray } from '@kaynooo/utils'
import { DIRS } from './utils'

export class Maze {
  w: number
  h: number
  start: number
  end: number
  startSide: Dir
  endSide: Dir
  blocks: number[]

  constructor(
    w: number,
    h: number,
    data?: {
      blocks?: number[]
      start?: number
      end?: number
      startSide?: Dir
      endSide?: Dir
    },
  ) {
    this.w = w
    this.h = h

    this.blocks = data?.blocks || new Array(w * h).fill(0)

    const sides: Dir[] = [1, 2, 4, 8]
    const startSideIndex = randomInt(4)
    this.startSide = data?.startSide ?? sides[startSideIndex]
    this.start = data?.start || this.getEdgeIndex(this.startSide)

    sides.splice(startSideIndex, 1)
    const endSideIndex = randomInt(3)
    this.endSide = data?.endSide ?? sides[endSideIndex]
    this.end = data?.end || this.getEdgeIndex(this.endSide)
  }

  // eslint-disable-next-line ts/no-empty-function
  generate(..._args: any): void {}

  getBlock(pos: number, dir: Dir): number {
    if (dir === 1 && pos >= this.w)
      return pos - this.w
    if (dir === 2 && (pos + 1) % this.w !== 0)
      return pos + 1
    if (dir === 4 && pos < this.w * (this.h - 1))
      return pos + this.w
    if (dir === 8 && pos % this.w !== 0)
      return pos - 1

    return -1
  }

  canMoveToBlock(pos: number, dir: Dir): boolean {
    return (this.blocks[pos] & dir) !== 0
  }

  getNeighbours(pos: number): number[] {
    return DIRS.reduce((acc, dir) => {
      const p = this.getBlock(pos, dir)
      if (p !== -1)
        acc.push(p)
      return acc
    }, [] as number[])
  }

  getNonVisitedNeighbours(pos: number): number[] {
    return DIRS.reduce((acc, dir) => {
      const p = this.getBlock(pos, dir)
      if (p !== -1 && this.blocks[p] === 0)
        acc.push(p)
      return acc
    }, [] as number[])
  }

  randomNonVisitedNeighbour(pos: number): [newPos: number, dir: Dir | -1] {
    shuffleArray(DIRS)

    for (const dir of DIRS) {
      const newPos = this.getBlock(pos, dir)
      if (newPos !== -1 && this.blocks[newPos] === 0)
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

  getExploredPosFromPath(path: string): Set<number> {
    let pos = this.start
    const positions = new Set<number>([pos])

    for (const char of path) {
      const dir = Number(char) as Dir
      if (!this.canMoveToBlock(pos, dir))
        continue

      const nextPos = this.getBlock(pos, dir)
      if (nextPos === -1)
        continue

      pos = nextPos
      positions.add(pos)
    }

    return positions
  }

  printHTML(path?: string): HTMLElement {
    const table = document.createElement('table')
    table.className = 'maze'

    let positions = new Set<number>()
    if (path)
      positions = this.getExploredPosFromPath(path)

    for (let y = 0; y < this.h; y++) {
      const row = document.createElement('tr')

      for (let x = 0; x < this.w; x++) {
        const i = y * this.w + x
        let wall = this.blocks[i]
        if (i === this.start)
          wall |= this.startSide
        if (i === this.end)
          wall |= this.endSide

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
        if (i === this.start)
          cls.push(`s side-${this.startSide}`)
        if (i === this.end)
          cls.push(`e side-${this.endSide}`)
        if (positions.has(i))
          cls.push('explored')

        cell.className = cls.join(' ')
        row.appendChild(cell)
      }

      table.appendChild(row)
    }

    return table
  }

  static loadFromString<T extends typeof Maze>(this: T, maze: string): InstanceType<T> {
    const [w, start, end, startSide, endSide, path] = maze.split('_')

    const blocks = Array.from(path, dir => Number.parseInt(dir, 16))

    return new this(
      Number(w),
      Math.floor(path.length / Number(w)),
      {
        blocks,
        start: Number(start),
        end: Number(end),
        startSide: Number(startSide) as Dir,
        endSide: Number(endSide) as Dir,
      },
    ) as InstanceType<T>
  }

  toString(): string {
    return [
      this.w,
      this.start,
      this.end,
      this.startSide,
      this.endSide,
      this.blocks.map(block => block.toString(16)).join(''),
    ].join('_')
  }
}
