import type { GrowingTreeMaze } from './GrowingTree'

declare global {
  interface GlobalThis {
    GrowingTreeMaze: typeof GrowingTreeMaze
  }
}
