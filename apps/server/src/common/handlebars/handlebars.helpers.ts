export function lookup(obj: any, prop: string) {
  return obj ? obj[prop] : null;
}

export function concat(...args: any[]) {
  return args.slice(0, -1).join('');
}

export function times(n, block) {
  let accum = '';
  for (let i = 0; i < n; ++i) {
    block.data.index = i;
    block.data.first = i === 0;
    block.data.last = i === (n - 1);
    accum += block.fn(this);
  }
  return accum;
}

export function increment(value) {
  return parseInt(value) + 1;
};
