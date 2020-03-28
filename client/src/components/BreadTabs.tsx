import React from 'react';
import { Breadcrumb, Button } from 'antd';
import intl from 'react-intl-universal';

type PropsType = {
  dir: string;
  setDir: (dir: string) => void;
};

export const BreadTabs = (props: PropsType) => {
  const { dir, setDir } = props;
  const newDir = dir.split('/').filter(item => item);
  return (
    <Breadcrumb>
      <Breadcrumb.Item key="home">
        <Button onClick={() => setDir('')} type="link">
          {intl.get('files.header.home')}
        </Button>
      </Breadcrumb.Item>
      {newDir.map(
        (item, index) =>
          item && (
            <Breadcrumb.Item key={item + index}>
              <Button
                onClick={() => setDir(newDir.slice(0, index + 1).join('/'))}
                type="link"
              >
                {item}
              </Button>
            </Breadcrumb.Item>
          ),
      )}
    </Breadcrumb>
  );
};
