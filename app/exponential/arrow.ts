export type Tile = 1 | 2 | 3 | 4

class ArrowPuzzle {
  board: Tile[][]
  size: number

  constructor(size: number) {
    this.size = size
    this.board = this.createBoard(size)
    this.shuffleBoard()
  }

  createBoard(size: number, num: Tile = 1): Tile[][] {
    const board: Tile[][] = []

    for (let i = 0; i < size; i++) {
      const row: Tile[] = []
      for (let j = 0; j < size; j++)
        row.push(num)

      board.push(row)
    }

    return board
  }

  shuffleBoard(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const randomClicks = Math.floor(Math.random() * 4)
        for (let k = 0; k < randomClicks; k++)
          this.clickTile(i, j)
      }
    }
  }

  clickTile(row: number, col: number): void {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 0],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc

      if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size)
        this.board[newRow][newCol] = ((this.board[newRow][newCol] % 4) + 1) as Tile
    }
  }

  printBoard(): void {
    console.table(this.board)
  }

  boardKey(): string {
    return this.board.map(row => row.join('')).join('/')
  }

  solve(): void {
    const visited = new Set<string>()
    const queue: { board: Tile[][]; moves: [number, number][] }[] = []

    visited.add(this.boardKey())
    queue.push({ board: this.copyBoard(this.board), moves: [] })

    while (queue.length > 0) {
      const { board, moves } = queue.shift()!

      if (this.isBoardSolved(board)) {
        console.log(`Solved in ${moves.length} moves:`)
        const moveBoard = this.createBoard(this.size, 0 as Tile)
        for (const [row, col] of moves)
          moveBoard[row][col]++

        console.table(moveBoard)
        return
      }

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const newBoard = this.copyBoard(board)
          this.clickTileOnBoard(newBoard, row, col)
          const newKey = this.boardKeyFromBoard(newBoard)

          if (!visited.has(newKey)) {
            visited.add(newKey)
            queue.push({ board: newBoard, moves: moves.concat([[row, col]]) })
          }
        }
      }
    }
  }

  copyBoard(board: Tile[][]): Tile[][] {
    return board.map(row => row.slice())
  }

  clickTileOnBoard(board: Tile[][], row: number, col: number): void {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 0],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc

      if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size)
        board[newRow][newCol] = ((board[newRow][newCol] % 4) + 1) as Tile
    }
  }

  isBoardSolved(board: Tile[][]): boolean {
    for (const row of board) {
      for (const tile of row) {
        if (tile !== 1)
          return false
      }
    }
    return true
  }

  boardKeyFromBoard(board: Tile[][]): string {
    return board.map(row => row.join('')).join('/')
  }
}

export function splitArray(arr: any[], size: number): any[][] {
  const result = []
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size))

  return result
}

(() => {
  const size = 4
  const arrowPuzzle = new ArrowPuzzle(size)
  console.log('Initial board:')
  arrowPuzzle.printBoard()

  const customBoard: Array<Tile> = [4, 2, 4, 4, 4, 4, 3, 2, 4, 2, 2, 4, 4, 3, 3, 4]
  arrowPuzzle.board = splitArray(customBoard, size)
  console.log('Custom board:')
  arrowPuzzle.printBoard()

  console.log('Solving the board...')
  arrowPuzzle.solve()
})()
