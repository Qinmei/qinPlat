import React, { useState, useEffect, useRef } from 'react';
import intl from 'react-intl-universal';
import { Button, Table, Input, Spin, Checkbox } from 'antd';
import {
  UploadOutlined,
  FolderAddOutlined,
  CopyOutlined,
  ScissorOutlined,
  DeleteOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import {
  BreadTabs,
  Filename,
  useFileOption,
  FileDirAll,
  RefAll,
  UploadButton,
} from '../components';
import { sizeTransfer } from '../utils';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

interface PropType {}

interface List {
  name: string;
  type: string;
  size: number;
  mtimeMs: number;
  add?: boolean;
}

type FilesData = { oldPath: string; newPath: string }[];

const Wrapper = styled.div`
  height: 100%;
  user-select: none;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .option {
      display: flex;
    }
    .ant-btn {
      margin-right: 15px;
    }
    .divider {
      margin-left: 15px;
    }
  }

  .content {
    height: calc(100% - 40px);
    .tableInfo {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ant-btn-link {
        padding: 0;
      }
      .ant-breadcrumb {
        line-height: 1;
      }
    }

    .tableMain {
      height: calc(100vh - 270px);
      position: relative;
      margin: 0 -24px;

      .ant-table.ant-table-small thead > tr > th {
        background-color: transparent;
      }

      .tableBody {
        height: calc(100% - 40px);
        overflow-y: auto;

        .ant-checkbox-group {
          width: 100%;
        }
      }

      .list {
        height: 40px;
        line-height: 40px;
        width: calc(100%);
        display: grid;
        grid-template-columns: 60px 2fr 1fr 1fr;
        border-bottom: solid 1px rgba(0, 0, 0, 0.03);

        &.body:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }

        &.dragover {
          background-color: rgba(29, 165, 122, 0.2);
          border: solid 1px rgba(29, 165, 122, 0.7);
        }

        .check {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .name {
        }

        .size {
          text-align: center;
        }

        .time {
          text-align: center;
        }
      }
    }
  }
`;

const Files: React.FC<PropType> = (props) => {
  const [dir, setDir] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [data, setData] = useState<List[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [select, setSelect] = useState<CheckboxValueType[]>([]);
  const [dragOver, setDragOver] = useState<string>('');

  const allDirRef = useRef<RefAll>(null);

  const methods = useFileOption();

  const addNew = () => {
    const newItem = {
      name: '新建文件夹' + data.length,
      type: 'folder',
      size: 0,
      mtimeMs: 0,
      add: true,
    };
    setData([newItem, ...data]);
  };

  const singleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: string,
  ) => {
    if (select.includes(value)) {
      const newSelect = select.filter((item) => item !== value);
      setSelect(newSelect);
    } else {
      setSelect([...select, value]);
    }
  };

  const getFileList = async () => {
    setSelect([]);
    setLoading(true);
    const res: List[] = await methods.list(dir);
    if (res) {
      setData(res.sort((a, b) => b.type.localeCompare(a.type)));
    }
    setLoading(false);
  };

  const singleChange = async (
    name: string,
    type: string,
    newName: string = '',
  ) => {
    const oldPath = (dir ? dir + '/' : '') + name;
    const newPath = (dir ? dir + '/' : '') + newName;
    if (type === 'folder') {
      setDir(oldPath);
    } else if (type === 'delete') {
      methods.delete([oldPath], getFileList);
    } else if (type === 'copy' || type === 'move') {
      allDirRef.current && allDirRef.current.show({ type, files: [oldPath] });
    } else if (type === 'rename') {
      await methods.copyOrMove(type, [{ oldPath, newPath }]);
      getFileList();
    } else if (type === 'add') {
      await methods.create(oldPath);
      getFileList();
    } else if (type === 'fail') {
      getFileList();
    }
  };

  const batchChange = (type: string) => {
    const newFiles = select.map((item) => (dir ? dir + '/' : '') + item);
    if (type === 'delete') {
      methods.delete(newFiles, getFileList);
    } else if (type === 'move' || type === 'copy') {
      allDirRef.current && allDirRef.current.show({ type, files: newFiles });
    }
  };

  const submit = async (type: string, files: FilesData) => {
    await methods.copyOrMove(type, files);
    getFileList();
  };

  const checkAll = () => {
    setSelect(
      select.length === data.length ? [] : data.map((item) => item.name),
    );
  };

  const dragEvent = {
    start: (e: React.DragEvent<HTMLDivElement>, value: string) => {},
    over: (e: React.DragEvent<HTMLDivElement>, value: string) => {
      setDragOver(value);
    },
    end: async (e: React.DragEvent<HTMLDivElement>, value: string) => {
      if (dragOver) {
        const oldPath = (dir ? dir + '/' : '') + value;
        const newPath = (dir ? dir + '/' : '') + dragOver + '/' + value;
        await methods.copyOrMove('move', [
          {
            oldPath,
            newPath,
          },
        ]);
        getFileList();
      }
      setDragOver('');
    },
  };

  useEffect(() => {
    getFileList();
    setTitle('');
  }, [dir]);

  const filterFile = (data: List[]): List[] => {
    const pattern = new RegExp(title);
    return data.filter((item) => pattern.test(item.name));
  };

  return (
    <Wrapper>
      <div className="header">
        <div className="option">
          <UploadButton dir={dir} confirm={getFileList}></UploadButton>

          <Button onClick={addNew}>
            <FolderAddOutlined />
            {intl.get('files.btn.new.folder')}
          </Button>

          <Button onClick={getFileList}>
            <RedoOutlined />
            {intl.get('files.btn.refresh.folder')}
          </Button>

          {select.length > 0 && (
            <span className="divider">
              <Button onClick={() => batchChange('copy')}>
                <CopyOutlined />
                {intl.get('files.btn.copy.folder')}
              </Button>
              <Button onClick={() => batchChange('move')}>
                <ScissorOutlined />
                {intl.get('files.btn.move.folder')}
              </Button>
              <Button danger onClick={() => batchChange('delete')}>
                <DeleteOutlined />
                {intl.get('files.btn.delete.folder')}
              </Button>
            </span>
          )}
        </div>

        <Input.Search
          placeholder={intl.get('files.table.search.tips')}
          style={{ width: '280px', float: 'right' }}
          onSearch={(value) => setTitle(value)}
        />
      </div>
      <div className="content">
        <div className="tableInfo">
          <BreadTabs dir={dir} setDir={setDir}></BreadTabs>
          <span>{intl.get('common.total', { total: data.length })}</span>
        </div>

        <Spin spinning={loading}>
          <div className="tableMain">
            <div className="tableHeader">
              <div className="list header">
                <div className="check">
                  <Checkbox
                    indeterminate={
                      !!select.length && select.length < data.length
                    }
                    onChange={checkAll}
                    checked={!!select.length && select.length === data.length}
                  ></Checkbox>
                </div>
                <div className="name">{intl.get('files.table.name')}</div>
                <div className="size">{intl.get('files.table.size')}</div>
                <div className="time">{intl.get('files.table.time')}</div>
              </div>
            </div>

            <div className="tableBody">
              <Checkbox.Group
                value={select}
                onChange={(value: CheckboxValueType[]) => setSelect(value)}
              >
                {filterFile(data).map((item) => (
                  <div
                    key={item.name}
                    className={`list body ${
                      item.type === 'folder' && dragOver === item.name
                        ? 'dragover'
                        : ''
                    }`}
                    onClick={(e) => singleClick(e, item.name)}
                    draggable
                    onDragStart={(e) => dragEvent.start(e, item.name)}
                    onDragOver={(e) =>
                      dragEvent.over(e, item.type === 'folder' ? item.name : '')
                    }
                    onDragEnd={(e) => dragEvent.end(e, item.name)}
                  >
                    <div className="check">
                      <Checkbox value={item.name}></Checkbox>
                    </div>
                    <div className="name">
                      <Filename
                        type={item.type}
                        name={item.name}
                        onChange={singleChange}
                        add={item.add}
                      ></Filename>
                    </div>
                    <div className="size">
                      {sizeTransfer(item.type === 'folder' ? 0 : item.size)}
                    </div>
                    <div className="time">
                      {moment(item.mtimeMs).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </div>
                ))}
              </Checkbox.Group>
            </div>

            {/* <Table
            rowKey="name"
            size="small"
            dataSource={filterFile(data)}
            columns={columns}
            pagination={false}
            loading={loading}
            rowSelection={{
              columnWidth: 68,
              selectedRowKeys: select,
              onChange: (value: string[]) => setSelect(value),
            }}
            onRow={record => {
              return {
                onClick: event => singleClick(record.name),
              };
            }}
          ></Table> */}
          </div>
        </Spin>
      </div>
      <FileDirAll ref={allDirRef} submit={submit}></FileDirAll>
    </Wrapper>
  );
};

export default Files;
