import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { Button, Table } from 'antd';
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
import { BreadTabs, Filename, useFileOption } from '../components';
import { sizeTransfer } from '../utils';

interface PropType {}

interface List {
  name: string;
  type: string;
  size: number;
  mtimeMs: number;
  add?: boolean;
}

const Wrapper = styled.div`
  user-select: none;
  .header {
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
  const [data, setData] = useState<List[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [select, setSelect] = useState<React.ReactText[]>([]);

  const methods = useFileOption();

  const addNew = () => {
    const newItem = {
      name: '新建文件夹',
      type: 'folder',
      size: 0,
      mtimeMs: 0,
      add: true,
    };
    setData([newItem, ...data]);
  };

  const enterChildren = (name: string, type: string) => {
    if (type === 'folder' && name) {
      setDir((dir ? dir + '/' : '') + name);
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
    console.log(name, type, newName);
    const oldPath = dir + '/' + name;
    const newPath = dir + '/' + newName;
    if (type === 'folder') {
      setDir(oldPath);
    } else if (type === 'delete') {
      methods.delete([oldPath], getFileList);
      getFileList();
    } else if (type === 'rename' || type === 'move' || type === 'copy') {
      await methods.copyOrMove(type, [{ oldPath, newPath }]);
      getFileList();
    } else if (type === 'add') {
      await methods.create(oldPath);
      getFileList();
    } else if (type === 'fail') {
      getFileList();
    }
  };

  useEffect(() => {
    getFileList();
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
      render: val => sizeTransfer(val),
    },
    {
      title: intl.get('files.table.time'),
      dataIndex: 'mtimeMs',
      width: 400,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => a.mtimeMs - b.mtimeMs,
    },
  ];

  return (
    <Wrapper>
      <div className="header">
        <Button type="primary">
          <UploadOutlined />
          {intl.get('files.btn.upload')}
        </Button>
        <Button onClick={addNew}>
          <FolderAddOutlined />
          {intl.get('files.btn.new.folder')}
        </Button>

        {select.length > 0 && (
          <span className="divider">
            <Button>
              <CopyOutlined />
              {intl.get('files.btn.copy.folder')}
            </Button>
            <Button>
              <ScissorOutlined />
              {intl.get('files.btn.move.folder')}
            </Button>
            <Button danger onClick={() => methods.delete(select)}>
              <DeleteOutlined />
              {intl.get('files.btn.delete.folder')}
            </Button>
          </span>
        )}
        <Button
          style={{ float: 'right', marginRight: '0' }}
          onClick={getFileList}
        >
          <RedoOutlined />
          {intl.get('files.btn.refresh.folder')}
        </Button>
      </div>
      <div className="content">
        <div className="tableInfo">
          <BreadTabs dir={dir} setDir={setDir}></BreadTabs>
        </div>
        <div className="tableMain">
          <Table
            rowKey="name"
            size="small"
            dataSource={data}
            columns={columns}
            pagination={false}
            loading={loading && data.length === 0}
            rowSelection={{
              selectedRowKeys: select,
              onChange: (value: React.ReactText[]) => setSelect(value),
            }}
            onRow={record => {
              return {
                // onClick: () => setSelect([record.name]),
                onDoubleClick: event => enterChildren(record.name, record.type),
              };
            }}
          ></Table>
        </div>
      </div>
    </Wrapper>
  );
};

export default Files;
