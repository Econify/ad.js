// Determine whether number is inbetween a set of numbers
export default (value: number, a: number, b: number): boolean =>
  value >= Math.min(a, b) && value <= Math.max(a, b);
