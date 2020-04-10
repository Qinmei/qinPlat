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

export const treeTransfer = (
  data: any[],
  icon: any,
  parentKey: string = '',
) => {
  let result: any[] = [];
  result = data.map((item) => {
    const key = (parentKey ? parentKey + '/' : '') + item.name;
    if (item.children.length > 0) {
      item.children = treeTransfer(item.children, icon, key);
    }

    return {
      title: item.name,
      key,
      icon,
      ...item,
    };
  });
  return result;
};

export const processTransfer = (data: string, total: number) => {
  const dataArr: [number, number][] = JSON.parse(data);
  const progress = dataArr.reduce((prev, cur) => cur[1] - cur[0] + prev, 0);
  return Math.ceil((progress / total) * 100);
};
