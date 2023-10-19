class Torus {
  size: number
  board: number[][]

  constructor(size: number) {
    this.size = size
    this.board = this.createBoard(size)
    this.shuffleBoard()
  }

  createBoard(size: number): number[][] {
    const board: number[][] = []

    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j < size; j++)
        row.push(i * size + j + 1)

      board.push(row)
    }

    return board
  }

  shuffleBoard(): void {
    const shuffleMoves = this.size * this.size * 10

    for (let i = 0; i < shuffleMoves; i++) {
      const axis = Math.floor(Math.random() * 2) // 0 for row, 1 for column
      const index = Math.floor(Math.random() * this.size)
      const direction = Math.floor(Math.random() * 2) // 0 for left/up, 1 for right/down

      if (axis === 0)
        this.moveRow(index, direction)
      else
        this.moveColumn(index, direction)
    }
  }

  moveRow(row: number, direction: number): void {
    if (direction === 0) {
      const temp = this.board[row][0]
      for (let i = 0; i < this.size - 1; i++)
        this.board[row][i] = this.board[row][i + 1]

      this.board[row][this.size - 1] = temp
    }
    else {
      const temp = this.board[row][this.size - 1]
      for (let i = this.size - 1; i > 0; i--)
        this.board[row][i] = this.board[row][i - 1]

      this.board[row][0] = temp
    }
  }

  moveColumn(column: number, direction: number): void {
    if (direction === 0) {
      const temp = this.board[0][column]
      for (let i = 0; i < this.size - 1; i++)
        this.board[i][column] = this.board[i + 1][column]

      this.board[this.size - 1][column] = temp
    }
    else {
      const temp = this.board[this.size - 1][column]
      for (let i = this.size - 1; i > 0; i--)
        this.board[i][column] = this.board[i - 1][column]

      this.board[0][column] = temp
    }
  }

  printBoard(): void {
    console.table(this.board)
  }

  isSolved(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] !== i * this.size + j + 1)
          return false
      }
    }
    return true
  }

  copyBoard(): number[][] {
    return JSON.parse(JSON.stringify(this.board))
  }

  iddfs(maxDepth: number, depth: number, moveHistory: string[], prevAxis?: number): string[] | null {
    if (this.isSolved())
      return moveHistory

    if (depth >= maxDepth)
      return null

    const directions = ['L', 'R', 'U', 'D']
    const axisNames = ['row', 'col']

    for (let axis = 0; axis < 2; axis++) {
      if (axis === prevAxis)
        continue // Avoid undoing the previous move

      for (let index = 0; index < this.size; index++) {
        for (let direction = 0; direction < 2; direction++) {
          const originalBoard = this.copyBoard()

          if (axis === 0)
            this.moveRow(index, direction)
          else
            this.moveColumn(index, direction)

          const result = this.iddfs(
            maxDepth,
            depth + 1,
            [...moveHistory, `${axisNames[axis]}${index}${directions[direction * 2]}`],
            axis,
          )

          if (result !== null)
            return result

          this.board = originalBoard // Restore the board state
        }
      }
    }

    return null
  }

  manhattanDistance(): number {
    let distance = 0
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const value = this.board[i][j]
        const goalRow = Math.floor((value - 1) / this.size)
        const goalCol = (value - 1) % this.size
        distance += Math.abs(i - goalRow) + Math.abs(j - goalCol)
      }
    }
    return distance
  }

  aStar(): string[] {
    const openSet = new TorusPriorityQueue<{ board: number[][]; cost: number; heuristic: number; moves: string[] }>()
    const closedSet: Set<string> = new Set()

    openSet.enqueue(
      {
        board: this.copyBoard(),
        cost: 0,
        heuristic: this.manhattanDistance(),
        moves: [],
      },
      0,
    )

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue()!
      this.board = current.board

      if (this.isSolved())
        return current.moves

      const currentBoardString = current.board.toString()
      if (closedSet.has(currentBoardString))
        continue

      closedSet.add(currentBoardString)

      const directions = ['L', 'R', 'U', 'D']
      const axisNames = ['row', 'col']

      for (let axis = 0; axis < 2; axis++) {
        for (let index = 0; index < this.size; index++) {
          for (let direction = 0; direction < 2; direction++) {
            const originalBoard = this.copyBoard()

            if (axis === 0)
              this.moveRow(index, direction)
            else
              this.moveColumn(index, direction)

            const newCost = current.cost + 1
            const newHeuristic = this.manhattanDistance()
            const newPriority = newCost + newHeuristic

            openSet.enqueue(
              {
                board: this.copyBoard(),
                cost: newCost,
                heuristic: newHeuristic,
                moves: [...current.moves, `${axisNames[axis]}${index}${directions[direction * 2]}`],
              },
              newPriority,
            )

            this.board = originalBoard
          }
        }
      }
    }

    return []
  }

  solve(): string[] {
    let maxDepth = 0
    let result: string[] | null

    do {
      result = this.iddfs(maxDepth, 0, [])
      maxDepth++
    } while (result === null)

    return result
  }
}

class TorusPriorityQueue<T> {
  private items: { priority: number; value: T }[]

  constructor() {
    this.items = []
  }

  enqueue(value: T, priority: number): void {
    let added = false
    for (let i = 0; i < this.items.length; i++) {
      if (priority < this.items[i].priority) {
        this.items.splice(i, 0, { priority, value })
        added = true
        break
      }
    }

    if (!added)
      this.items.push({ priority, value })
  }

  dequeue(): T | undefined {
    return this.items.shift()?.value
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}

(() => {
  const torusSize = 3
  const torus = new Torus(torusSize)

  console.log(`Torus size: ${torusSize}x${torusSize} (shuffled)`)
  torus.printBoard()

  const startTime = Date.now()
  const solution = torus.aStar()
  const endTime = Date.now()

  console.log(`Solution: ${solution.join(' ')}`)
  console.log(`Time: ${endTime - startTime}ms`)
})()
