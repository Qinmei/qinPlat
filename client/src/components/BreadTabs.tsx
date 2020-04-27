import React from 'react';
import { Breadcrumb, Button } from 'antd';
import intl from 'react-intl-universal';

type PropsType = {
  dir: string;
  dragOver: string;
  setDir: (dir: string) => void;
  onDragEndCallBack: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOverCallBack: (
    e: React.DragEvent<HTMLDivElement>,
    value: string,
    needDir: boolean,
  ) => void;
  onDropCallBack: (e: React.DragEvent<HTMLDivElement>, value: string) => void;
  onDragLeaveCallBack: (e: React.DragEvent<HTMLDivElement>) => void;
};

export const BreadTabs = (props: PropsType) => {
  const {
    dir,
    dragOver,
    setDir,
    onDragEndCallBack,
    onDragOverCallBack,
    onDragLeaveCallBack,
    onDropCallBack,
  } = props;

  const newDir = dir.slice(0, dir.length - 1).split('/');
  const valueArr = newDir.map((item, index) => ({
    label: item || intl.get('files.header.home'),
    value: newDir.slice(0, index + 1).join('/') + '/',
  }));

  const onDropHandler = (event: React.DragEvent<any>, item: string) => {
    if (item !== dir) {
      onDropCallBack(event, item);
    }
  };
  const onDragOverHandler = (event: React.DragEvent<any>, item: string) => {
    if (item !== dir) {
      onDragOverCallBack(event, item, false);
    }
  };

  return (
    <Breadcrumb>
      {valueArr.map((item, index) => (
        <Breadcrumb.Item key={item.value}>
          <Button
            onClick={() => setDir(item.value)}
            type={dragOver === item.value ? 'primary' : 'link'}
            onDragEnd={onDragEndCallBack}
            onDragOver={(e) => onDragOverHandler(e, item.value)}
            onDragLeave={onDragLeaveCallBack}
            onDrop={(e) => onDropHandler(e, item.value)}
          >
            {item.label}
          </Button>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
