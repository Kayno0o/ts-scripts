export type Dir = 1 | 2 | 4 | 8

export function reverseWall(wall: Dir): Dir {
  switch (wall) {
    case 1:
      return 4
    case 4:
      return 1
    case 2:
      return 8
    case 8:
      return 2
  }
}

export const DIRS: Dir[] = [1, 2, 4, 8]
