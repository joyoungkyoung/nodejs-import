export function UnixTimestampToDate(timestamp: number) {
  return new Date(timestamp * 1000);
}
