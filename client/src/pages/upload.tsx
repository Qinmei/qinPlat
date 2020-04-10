import React, { useState, useEffect, useRef, useContext } from 'react';
import intl from 'react-intl-universal';
import { Badge, Button, message, Table, Progress } from 'antd';
import {
  RedoOutlined,
  ApiOutlined,
  NodeIndexOutlined,
  CaretRightOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import styled from 'styled-components';
import io from 'socket.io-client';
import moment from 'moment';
import { sizeTransfer, processTransfer } from '../utils';
import { ColumnProps } from 'antd/es/table';
import { ConfigContext } from '../contexts/config';

enum Status {
  Success = 'success',
  Error = 'error',
  Processing = 'processing',
}

type List = {
  id: number;
  name: string;
  directory: string;
  hash: string;
  uuid: string;
  size: number;
  receive: string;
  status: string;
  updatedAt: number;
  createdAt: number;
};

type Source = { list: List[]; total: number };

type Query = {
  page: number;
  size: number;
  sortOrder: string;
  sortBy: string;
};

interface PropType {}

const Wrapper = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      .ant-btn {
        margin-right: 15px;
      }
    }

    .right {
      .title {
        margin-right: 15px;
      }
    }
  }

  .content {
    margin-top: 16px;
    .list {
      display: flex;
      align-items: center;
      height: 45px;

      .name {
        flex: 1;
      }

      .size {
        text-align: center;
        width: 160px;
      }

      .updatedAt {
        text-align: right;
        width: 260px;
      }

      .createdAt {
        text-align: right;
        width: 260px;
      }

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
`;

const UploadPage: React.FC<PropType> = (props) => {
  const socket = useRef<SocketIOClient.Socket>();
  const { state, methods: globalMethods } = useContext(ConfigContext);

  const [status, setStatus] = useState<Status>(Status.Processing);
  const [query, setQuery] = useState<Query>({
    page: 1,
    size: 10,
    sortOrder: 'DESC',
    sortBy: 'updatedAt',
  });
  const [data, setData] = useState<Source>({
    list: [],
    total: 0,
  });

  const methods = {
    getList() {
      socket.current?.emit('upload/list', query);
    },

    connect() {
      socket.current?.connect();
    },

    disconnect() {
      socket.current?.close();
    },

    remove(id: string) {
      socket.current?.emit('upload/delete', [id]);
    },
  };

  useEffect(() => {
    socket.current = io('127.0.0.1:7000', {
      query: {
        token: sessionStorage.getItem('token'),
      },
    });

    socket.current?.on('connect', () => {
      setStatus(Status.Success);
      methods.getList();
    });

    socket.current?.on('list', (data: Source) => {
      console.log(data);
      setData(data);
    });

    socket.current?.on('exception', (data: any) => {
      message.error(data.message);
    });

    socket.current?.on('disconnect', () => {
      setStatus(Status.Error);
    });

    return methods.disconnect;
  }, []);

  const columns: ColumnProps<List>[] = [
    {
      title: intl.get('upload.table.title.name'),
      dataIndex: 'name',
    },
    {
      title: intl.get('upload.table.title.size'),
      dataIndex: 'size',
      align: 'center',
      render: (val) => sizeTransfer(val),
    },
    {
      title: intl.get('upload.table.title.processing'),
      dataIndex: 'receive',
      align: 'center',
      width: 400,
      render: (val, record) => (
        <Progress percent={processTransfer(val, record.size)} status="active" />
      ),
    },
    {
      title: intl.get('upload.table.title.updatedAt'),
      dataIndex: 'updatedAt',
      align: 'center',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.get('upload.table.title.createdAt'),
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.get('upload.table.title.option'),
      key: 'id',
      align: 'center',
      render: (val, record) => (
        <div>
          {record.status === 'uploading' && (
            <Button type="link" onClick={() => globalMethods.stopUpload(val)}>
              <CaretRightOutlined style={{ fontSize: 18 }} />
            </Button>
          )}
          <Button type="link" onClick={() => methods.remove(val)}>
            <DeleteFilled style={{ fontSize: 18 }} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Wrapper>
      <div className="header">
        <div className="left">
          <Button
            onClick={methods.connect}
            type="primary"
            disabled={status !== Status.Error}
          >
            <NodeIndexOutlined />
            {intl.get('upload.header.status.title.connect')}
          </Button>
          <Button
            onClick={methods.disconnect}
            danger
            type="primary"
            disabled={status !== Status.Success}
          >
            <ApiOutlined />
            {intl.get('upload.header.status.title.disconnect')}
          </Button>
          <Button onClick={methods.getList}>
            <RedoOutlined />
            {intl.get('upload.header.status.title.refresh')}
          </Button>
        </div>

        <div className="right">
          <span className="title">
            {intl.get('upload.header.status.title')}
          </span>
          <Badge
            status={status}
            text={intl.get('upload.header.status.title.' + status)}
          />
        </div>
      </div>

      <div className="content">
        <Table dataSource={data.list} columns={columns} size="small"></Table>
      </div>
    </Wrapper>
  );
};

export default UploadPage;
