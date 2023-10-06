import { deepEqual } from '../utils';
const smaller = (nums) => {
  const dic: { [key: number]: number } = {};
  const arr = [];

  for (let i = nums.length - 1; i >= 0; i--) {
    const n: number = nums[i];

    if (!dic[n]) dic[n] = 0;

    const v = Object.keys(dic).reduce((acc, curr) => (Number(curr) < n ? (acc += dic[curr]) : acc), 0);

    arr.unshift(v);

    dic[n]++;
  }

  return arr;
};

export const testSmaller = () => {
  const arr = [];

  for (let i = 0; i < 10000; i++) {
    arr.push(Math.floor(Math.random() * 1000));
  }

  console.time('time');

  smaller(arr);

  console.timeEnd('time');

  console.log(deepEqual(smaller([5, 4, 3, 2, 1]), [4, 3, 2, 1, 0]));
  console.log(deepEqual(smaller([1, 2, 3]), [0, 0, 0]));
  console.log(deepEqual(smaller([1, 2, 0]), [1, 1, 0]));
  console.log(deepEqual(smaller([1, 2, 1]), [0, 1, 0]));
  console.log(deepEqual(smaller([1, 1, -1, 0, 0]), [3, 3, 0, 0, 0]));
};
