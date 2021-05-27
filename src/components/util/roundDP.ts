export function roundDP(dp: number) {
  return (val: number) => {
    return val.toFixed(dp);
  };
}
