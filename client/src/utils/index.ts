export const sizeTransfer = (size: number) => {
  if (size === 0) return '-';

  const sizeKB = size / 1024;

  if (sizeKB <= 1024) {
    return `${sizeKB.toFixed(1)}K`;
  } else if (sizeKB < 1024 * 1024) {
    return `${(sizeKB / 1024).toFixed(1)}M`;
  } else if (sizeKB < 1024 * 1024 * 1024) {
    return `${(sizeKB / 1024 / 1024).toFixed(1)}G`;
  }
};
