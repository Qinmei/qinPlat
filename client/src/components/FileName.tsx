import React, { useContext, useMemo, useState } from 'react';
import {
  FolderFilled,
  FileFilled,
  CopyOutlined,
  ScissorOutlined,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Tooltip, Input } from 'antd';
import styled from 'styled-components';
import { ConfigContext } from '../contexts/config';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -8px 0;
  padding: 8px 0;

  .left {
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
        color: ${props => props.color};
      }
    }

    .icon {
      margin-left: 12px;
      font-size: 18px;
      color: ${props => props.color};
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
      color: ${props => props.color};
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
  onChange: (name: string, type: string, newName?: string) => void;
};

export const Filename = (props: PropsType) => {
  const { type, name, onChange } = props;

  const [edit, setEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(name);
  const { state } = useContext(ConfigContext);

  const color = useMemo(() => state.color, [state.color]);

  const editMode = () => {
    setEdit(true);
    setTitle(name);
  };

  return (
    <Wrapper color={color}>
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
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              autoFocus
              onBlur={() => setEdit(false)}
              onPressEnter={() => onChange(name, 'rename', title)}
            ></Input>
            <CheckOutlined
              className="icon"
              onClick={() => onChange(name, 'rename', title)}
            />
            <CloseOutlined className="icon" onClick={() => setEdit(false)} />
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
                onClick={() => onChange(name, 'delete')}
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
  );
};
