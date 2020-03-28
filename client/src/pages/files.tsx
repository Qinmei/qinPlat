import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { Button, Table } from 'antd';
import {
  UploadOutlined,
  FolderAddOutlined,
  CopyOutlined,
  ScissorOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';
import { BreadTabs, Filename, useFileOption } from '../components';
import { sizeTransfer } from '../utils';

interface PropType {}

interface List {
  name: string;
  type: 'fiile' | 'folder';
  size: number;
  mtimeMs: number;
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

  const enterChildren = (name: string, type: string) => {
    if (type === 'folder' && name) {
      setDir((dir ? dir + '/' : '') + name);
    }
  };

  const getFileList = async () => {
    setSelect([]);
    setLoading(true);
    const res = await methods.list(dir);
    if (res) {
      setData(res);
    }
    setLoading(false);
  };

  const singleChange = (
    dir: string,
    type: string,
    newPath: string | undefined,
  ) => {
    if (type === 'folder') {
      enterChildren(dir, type);
    } else if (type === 'delete') {
      methods.delete([dir], getFileList);
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
        <Button>
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
