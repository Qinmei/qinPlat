import React, { useState, useEffect, useRef } from 'react';
import intl from 'react-intl-universal';
import { Button, Table, Input } from 'antd';
import {
  UploadOutlined,
  FolderAddOutlined,
  CopyOutlined,
  ScissorOutlined,
  DeleteOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { ColumnProps } from 'antd/es/table';
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
      margin-left: -24px;
      margin-right: -24px;
      .ant-table.ant-table-small thead > tr > th {
        background-color: transparent;
      }
    }
  }
`;

const Files: React.FC<PropType> = props => {
  const [dir, setDir] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [data, setData] = useState<List[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [select, setSelect] = useState<React.ReactText[]>([]);

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

  const singleClick = (value: string) => {
    if (select.includes(value)) {
      const newSelect = select.filter(item => item !== value);
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
    const newFiles = select.map(item => (dir ? dir + '/' : '') + item);
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

  useEffect(() => {
    getFileList();
    setTitle('');
  }, [dir]);

  const columns: ColumnProps<List>[] = [
    {
      title: intl.get('files.table.name'),
      dataIndex: 'name',
      width: 1000,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (val, record) => (
        <Filename
          type={record.type}
          name={val}
          onChange={singleChange}
          add={record.add}
        ></Filename>
      ),
    },
    {
      title: intl.get('files.table.size'),
      dataIndex: 'size',
      width: 300,
      sorter: (a, b) => a.size - b.size,
      render: (val, record) => sizeTransfer(record.type === 'folder' ? 0 : val),
    },
    {
      title: intl.get('files.table.time'),
      dataIndex: 'mtimeMs',
      width: 400,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => a.mtimeMs - b.mtimeMs,
    },
  ];

  const filterFile = (data: List[]) => {
    const pattern = new RegExp(title);
    return data.filter(item => pattern.test(item.name));
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
          onSearch={value => setTitle(value)}
        />
      </div>
      <div className="content">
        <div className="tableInfo">
          <BreadTabs dir={dir} setDir={setDir}></BreadTabs>
          <span>{intl.get('common.total', { total: data.length })}</span>
        </div>
        <div className="tableMain">
          <Table
            rowKey="name"
            size="small"
            dataSource={filterFile(data)}
            columns={columns}
            pagination={false}
            loading={loading}
            rowSelection={{
              columnWidth: 68,
              selectedRowKeys: select,
              onChange: (value: React.ReactText[]) => setSelect(value),
            }}
            onRow={record => {
              return {
                onClick: event => singleClick(record.name),
              };
            }}
          ></Table>
        </div>
      </div>
      <FileDirAll ref={allDirRef} submit={submit}></FileDirAll>
    </Wrapper>
  );
};

export default Files;
