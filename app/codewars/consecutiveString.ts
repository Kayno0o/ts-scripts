const longestConsec = (arr: Array<string>, k: number): string => {
  if (k <= 0 || k > arr.length) return '';

  let longuest = '';

  for (let i = 0; i < arr.length - k + 1; i++) {
    const w = arr.slice(i, i + k).join('');

    if (w.length > longuest.length) longuest = w;
  }

  return longuest;
};

export const testConsecutiveString = () => {
  console.log(longestConsec(['zone', 'abigail', 'theta', 'form', 'libe', 'zas', 'theta', 'abigail'], 2));
  console.log(longestConsec(['ejjjjmmtthh', 'zxxuueeg', 'aanlljrrrxx', 'dqqqaaabbb', 'oocccffuucccjjjkkkjyyyeehh'], 1));
  console.log(longestConsec(['it', 'wkppv', 'ixoyx', '3452', 'zzzzzzzzzzzz'], 4));
};
