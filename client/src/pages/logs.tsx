import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import styled from 'styled-components';
import { Api } from '../services';

interface PropType {}

interface List {
  id: number;
  methods: string;
  url: string;
  userAgent: string;
  ip: string;
  time: number;
  createdAt: number;
}

const Wrapper = styled.div``;

const Logs: React.FC<PropType> = props => {
  const [list, setList] = useState<List[]>([]);
  const [total, setTotal] = useState<number>(100);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const pageChange = (page: number, pageSize?: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  useEffect(() => {
    setLoading(true);
    const query = sort
      ? {
          page,
          size,
          sortOrder: 'DESC',
          sortBy: 'time',
        }
      : {
          page,
          size,
        };
    Api.getLogs({
      query,
    }).then(res => {
      if (res) {
        setList(res);
      }
      setLoading(false);
    });
  }, [page, sort]);

  const columns: ColumnProps<List>[] = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: intl.get('logs.title.methods'),
      dataIndex: 'methods',
    },
    {
      title: intl.get('logs.title.url'),
      dataIndex: 'url',
    },
    {
      title: intl.get('logs.title.userAgent'),
      dataIndex: 'userAgent',
    },
    {
      title: intl.get('logs.title.ip'),
      dataIndex: 'ip',
    },
    {
      title: intl.get('logs.title.time'),
      dataIndex: 'time',
      sorter: true,
      sortOrder: sort ? 'descend' : undefined,
      sortDirections: ['descend'],
    },
    {
      title: intl.get('logs.title.createdAt'),
      dataIndex: 'createdAt',
    },
  ];

  return (
    <Wrapper>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        onHeaderRow={column => {
          return {
            onClick: () => setSort(!sort),
          };
        }}
        pagination={{
          pageSize: size,
          current: page,
          total: total,
          showTotal: (total: number) => intl.get('common.total', { total }),
          onChange: pageChange,
        }}
      ></Table>
    </Wrapper>
  );
};

export default Logs;
