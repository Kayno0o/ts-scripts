class PuzzlePriorityQueue<T> {
  private data: Array<{ item: T; priority: number }> = [];

  enqueue(item: T, priority: number): void {
    this.data.push({ item, priority });
    this.data.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.data.shift()?.item;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }
}

type BoardState = {
  board: number[][];
  emptyPos: { col: number; row: number };
  manhattanDistance: number;
  moves: string[];
};

class Puzzle {
  private board: number[][];
  private size: number;
  private emptyPos: { col: number; row: number };

  constructor(size: number) {
    this.size = size;
    this.board = [];
    this.emptyPos = { col: size - 1, row: size - 1 };
    this.initializeBoard();
  }

  private static moves = [
    { col: 0, name: 'down', row: -1 },
    { col: 0, name: 'up', row: 1 },
    { col: -1, name: 'right', row: 0 },
    { col: 1, name: 'left', row: 0 },
  ];

  private initializeBoard(): void {
    let counter = 1;
    for (let i = 0; i < this.size; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.board[i][j] = counter;
        counter++;
      }
    }
    this.board[this.size - 1][this.size - 1] = 0;
  }

  public shuffle(iterations: number): void {
    for (let i = 0; i < iterations; i++) {
      const move = Puzzle.moves[Math.floor(Math.random() * Puzzle.moves.length)];

      const newRow = this.emptyPos.row + move.row;
      const newCol = this.emptyPos.col + move.col;

      if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
        this.swapTiles(this.board, newRow, newCol, this.emptyPos.row, this.emptyPos.col);
        this.emptyPos = { col: newCol, row: newRow };
      }
    }
  }

  private swapTiles(board: number[][], row1: number, col1: number, row2: number, col2: number): void {
    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;
  }
  public sort(): void {
    let counter = 1;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (counter === this.size * this.size) {
          this.board[i][j] = 0;
          break;
        }

        this.board[i][j] = counter;
        counter++;
      }
    }
  }

  private calculateManhattanDistance(board: number[][]): number {
    let distance = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const value = board[i][j];
        if (value !== 0) {
          const targetRow = Math.floor((value - 1) / this.size);
          const targetCol = (value - 1) % this.size;
          distance += Math.abs(targetRow - i) + Math.abs(targetCol - j);
        }
      }
    }
    return distance;
  }
  private copyBoard(board?: number[][]): number[][] {
    return JSON.parse(JSON.stringify(board || this.board));
  }

  private boardToString(board: number[][]): string {
    return board.map((row) => row.join(',')).join('|');
  }

  private isSolved(board: number[][]): boolean {
    let counter = 1;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (counter === this.size * this.size) {
          return board[i][j] === 0;
        }
        if (board[i][j] !== counter) {
          return false;
        }
        counter++;
      }
    }
    return true;
  }

  public solve(): string[] {
    const start: BoardState = {
      board: this.copyBoard(),
      emptyPos: { ...this.emptyPos },
      manhattanDistance: this.calculateManhattanDistance(this.board),
      moves: [],
    };

    const visited = new Set<string>();
    const queue = new PuzzlePriorityQueue<BoardState>();

    queue.enqueue(start, start.manhattanDistance);

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      const boardStr = this.boardToString(current.board);

      if (visited.has(boardStr)) continue;
      visited.add(boardStr);

      if (this.isSolved(current.board)) {
        return current.moves;
      }

      for (const move of Puzzle.moves) {
        const newRow = current.emptyPos.row + move.row;
        const newCol = current.emptyPos.col + move.col;

        if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
          const newBoard = JSON.parse(JSON.stringify(current.board));
          this.swapTiles(newBoard, newRow, newCol, current.emptyPos.row, current.emptyPos.col);
          const newEmptyPos = { col: newCol, row: newRow };

          const newState: BoardState = {
            board: newBoard,
            emptyPos: newEmptyPos,
            manhattanDistance: this.calculateManhattanDistance(newBoard),
            moves: [...current.moves, move.name],
          };

          queue.enqueue(newState, newState.manhattanDistance + newState.moves.length);
        }
      }
    }

    return [];
  }

  public printBoard(): void {
    console.table(this.board);
  }

  public executeMoves(moves: string[]): void {
    for (const move of moves) {
      const moveObj = Puzzle.moves.find((m) => m.name === move);
      if (moveObj) {
        const newRow = this.emptyPos.row + moveObj.row;
        const newCol = this.emptyPos.col + moveObj.col;

        if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
          this.swapTiles(this.board, newRow, newCol, this.emptyPos.row, this.emptyPos.col);
          this.emptyPos = { col: newCol, row: newRow };
        }
      }
    }
  }

  public setBoard(board: number[][]): void {
    this.board = board;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          this.emptyPos = { col: j, row: i };
        }
      }
    }
  }
}

(() => {
  const puzzleSize = 4;
  const puzzle = new Puzzle(puzzleSize);
  console.log('Initial puzzle:');
  puzzle.printBoard();

  console.log('\nShuffled puzzle:');
  puzzle.shuffle(100);
  puzzle.printBoard();

  const board = [
    [6, 10, 9, 2],
    [7, 0, 12, 5],
    [1, 15, 4, 11],
    [3, 14, 13, 8],
  ];
  console.log('\nCustom puzzle:');
  puzzle.setBoard(board);
  puzzle.printBoard();

  console.log('\nSolution:');
  const solution = puzzle.solve();
  console.log(solution);

  console.log('\nSolved puzzle:');
  puzzle.executeMoves(solution);
  puzzle.printBoard();
})();
