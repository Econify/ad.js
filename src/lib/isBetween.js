// Determine whether number is inbetween a set of numbers
export default (number: number, a: number, b: number): boolean =>
  number >= Math.min(a, b) && number <= Math.max(a, b);

