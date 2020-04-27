import React, { useContext, useMemo, useState } from 'react';
import {
  FolderFilled,
  FileFilled,
  CopyOutlined,
  ScissorOutlined,
  DeleteFilled,
  EditOutlined,
} from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Tooltip, Input, Menu, Dropdown } from 'antd';
import styled from 'styled-components';
import { ConfigContext } from '../contexts/config';
import { ClickParam } from 'antd/lib/menu';

type StyledProps = {
  color: string;
  show: boolean;
};

const Wrapper = styled.div<StyledProps>`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) =>
    props.show ? 'rgba(0,0,0,0.05)' : 'transparent'};

  .left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    span.name {
      user-select: text;
      &.active {
        cursor: pointer;
        user-select: none;
      }

      &.active:hover {
        color: ${(props) => props.color};
      }
    }

    .icon {
      margin-left: 12px;
      font-size: 16px;
      color: ${(props) => props.color};
      cursor: pointer;
    }
  }

  .option {
    width: 160px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .icon {
      display: none;
      margin-right: 12px;
      font-size: 18px;
      color: ${(props) => props.color};
      cursor: pointer;

      &.delete {
        color: #ff4d4f;
      }
    }
  }

  &:hover {
    .option .icon {
      display: inline-block;
    }
  }
`;

type PropsType = {
  type: string;
  name: string;
  add?: boolean;
  onChange: (name: string, type: string, newName?: string) => void;
  disabled: boolean;
};

export const Filename = (props: PropsType) => {
  const { type, name, onChange, add = false, disabled } = props;

  const [edit, setEdit] = useState<boolean>(add);
  const [title, setTitle] = useState<string>(name);
  const [show, setShow] = useState<boolean>(false);

  const { state } = useContext(ConfigContext);

  const color = useMemo(() => state.color, [state.color]);

  const editMode = () => {
    setEdit(true);
    setTitle(name);
  };

  const submit = () => {
    if (add) {
      onChange(title, 'add');
      setEdit(false);
    } else {
      onChange(name, 'rename', title);
    }
  };

  const fail = () => {
    if (add) {
      onChange('', 'fail');
    } else {
      setEdit(false);
    }
  };

  const preventDefault = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const menuClick = ({ key, domEvent }: ClickParam) => {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    setShow(false);
    if (key === 'rename') {
      editMode();
    } else {
      onChange(name, key);
    }
  };

  const menu = (
    <Menu onClick={menuClick}>
      <Menu.Item key="rename">
        {intl.get('files.table.option.rename')}
      </Menu.Item>
      <Menu.Item key="copy">{intl.get('files.table.option.copy')}</Menu.Item>
      <Menu.Item key="move">{intl.get('files.table.option.move')}</Menu.Item>
      <Menu.Item key="delete">
        {intl.get('files.table.option.delete')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['contextMenu']}
      onVisibleChange={(value: boolean) => setShow(value)}
      disabled={disabled}
    >
      <Wrapper color={color} onClick={preventDefault} show={show}>
        <div className="left">
          {type === 'folder' ? (
            <FolderFilled
              style={{
                fontSize: '28px',
                marginRight: '10px',
                color: '#FFD659',
              }}
            />
          ) : (
            <FileFilled
              style={{
                fontSize: '26px',
                marginRight: '10px',
                color: '#8183F1',
              }}
            />
          )}

          {!edit ? (
            <span
              className={type === 'folder' ? 'active name' : 'name'}
              onClick={() => onChange(name, type)}
            >
              {name}
            </span>
          ) : (
            <>
              <Input
                size="small"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                autoFocus
                onPressEnter={submit}
                onBlur={fail}
              ></Input>
            </>
          )}
        </div>

        <div className="option">
          {!edit && (
            <>
              <Tooltip
                placement="top"
                title={intl.get('files.table.option.rename')}
              >
                <EditOutlined className="icon" onClick={editMode} />
              </Tooltip>
              <Tooltip
                placement="top"
                title={intl.get('files.table.option.copy')}
              >
                <CopyOutlined
                  className="icon"
                  onClick={() => onChange(name, 'copy')}
                />
              </Tooltip>
              <Tooltip
                placement="top"
                title={intl.get('files.table.option.move')}
              >
                <ScissorOutlined
                  className="icon"
                  onClick={() => onChange(name, 'move')}
                />
              </Tooltip>
              <Tooltip
                placement="top"
                title={intl.get('files.table.option.delete')}
              >
                <DeleteFilled
                  className="icon"
                  onClick={() => onChange(name, 'delete')}
                />
              </Tooltip>
            </>
          )}
        </div>
      </Wrapper>
    </Dropdown>
  );
};
