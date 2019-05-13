function padTime(time: number): string {
  return String(time).padStart(2, '0');
}

export = padTime;
