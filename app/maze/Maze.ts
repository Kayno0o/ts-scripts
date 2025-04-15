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

  printHTML(withStyle = true): string {
    let html = `<table class="maze">`

    const start = randomInt(this.w * this.h)
    const end = randomInt(this.w * this.h)

    for (let y = 0; y < this.h; y++) {
      html += '<tr>'
      for (let x = 0; x < this.w; x++) {
        const i = y * this.w + x
        const wall = this.blocks[i].wall

        const classes = [
          wall & 1 || 'top',
          wall & 2 || 'right',
          wall & 4 || 'bottom',
          wall & 8 || 'left',
          start === i && 'start',
          end === i && 'end',
        ].filter(Boolean).join(' ')

        html += `<td class="${classes}"></td>`
      }
      html += '</tr>'
    }

    html += '</table>'

    if (withStyle) {
      html += `<style>
      .maze {
        border-collapse:collapse;
        td {
          width:15px;height:15px;border-style:solid;border-color:#000
        }
        td.start {
          background-color:#0a5;
        }
        td.end {
          background-color:#a0f
        }
        td.top {
          border-top-width: 2px;
        }
        td.right {
          border-right-width: 2px;
        }
        td.bottom {
          border-bottom-width: 2px;
        }
        td.left {
          border-left-width: 2px;
        }
      }
      </style>`.replace(/\s+/g, '')
    }

    return html
  }
}
