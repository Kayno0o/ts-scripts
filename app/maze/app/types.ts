import type Bloc from './entity/Bloc'

export type Wall = 1 | 2 | 4 | 8

export const N: Wall = 1
export const S: Wall = 2
export const E: Wall = 4
export const W: Wall = 8

export type Grid = Bloc[][]

export const OPPOSITES = { [E]: W, [N]: S, [S]: N, [W]: E }

export const walls: Wall[] = [N, S, E, W]

export const directions: Record<Wall, { x: number, y: number }> = {
  [E]: { x: 1, y: 0 },
  [N]: { x: 0, y: -1 },
  [S]: { x: 0, y: 1 },
  [W]: { x: -1, y: 0 },
}

export type Dictionnary<T = any> = Record<string, T>

export type MazeType = 'prims' | 'backtracking'

export const labyrinthTypes: MazeType[] = ['prims', 'backtracking']

export class MazeProps {
  blocSize = 40
  draw = true
  solution = true
  height = -1
  lineWidth = 10
  rainbowGrid = false
  size = 40
  type: MazeType | 'all' = 'backtracking'
  width = -1
  benchmark = false
}
