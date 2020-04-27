import React, { useContext, useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { Tooltip, Input, Menu, Dropdown } from 'antd';
import { ClickParam } from 'antd/lib/menu';

type PropsType = {
  disabled: boolean;
  onChange: (type: string) => void;
};

const DropdownArea: React.FC<PropsType> = (props) => {
  const { children, disabled, onChange } = props;

  const menuClick = ({ key, domEvent }: ClickParam) => {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    onChange(key);
  };

  const menu = (
    <Menu onClick={menuClick}>
      <Menu.Item key="copy">{intl.get('files.table.option.copy')}</Menu.Item>
      <Menu.Item key="move">{intl.get('files.table.option.move')}</Menu.Item>
      <Menu.Item key="delete">
        {intl.get('files.table.option.delete')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']} disabled={disabled}>
      {children}
    </Dropdown>
  );
};

export default DropdownArea;
