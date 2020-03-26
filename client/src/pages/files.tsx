import React from 'react';
import intl from 'react-intl-universal';
import { Button } from 'antd';
import { UploadOutlined, FolderAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Api } from '../services';

interface PropType {}

const Wrapper = styled.div`
  .header {
    .ant-btn {
      margin-right: 15px;
    }
  }
`;

const Login: React.FC<PropType> = props => {
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
      </div>
      <div className="content">
        <div className="tableInfo"></div>
      </div>
    </Wrapper>
  );
};

export default Login;
