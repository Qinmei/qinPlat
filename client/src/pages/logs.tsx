import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { PaginationConfig } from 'antd/es/pagination';
import styled from 'styled-components';
import { Api } from '../services';
import { SorterResult } from 'antd/lib/table/interface';

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
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onTableChange = (
    pagination: PaginationConfig,
    filters: Record<string, React.ReactText[] | null>,
    sorter: SorterResult<List> | SorterResult<List>[],
  ) => {
    const { current = 1, pageSize } = pagination;
    setPage(current);
    pageSize && setSize(pageSize);

    const sortColumn = Array.isArray(sorter) ? sorter[0] : sorter;
    if (sortColumn?.field === 'time') {
      setSort(!sort);
    }
  };

  useEffect(() => {
    setLoading(true);
    Api.getLogs({
      query: {
        page,
        size,
        sortOrder: sort ? 'DESC' : null,
        sortBy: sort ? 'time' : null,
      },
    }).then(res => {
      if (res) {
        setList(res.list);
        setTotal(res.total);
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
        onChange={onTableChange}
        pagination={{
          pageSize: size,
          current: page,
          total: total,
          showTotal: (total: number) => intl.get('common.total', { total }),
        }}
      ></Table>
    </Wrapper>
  );
};

export default Logs;
