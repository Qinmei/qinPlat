import React from 'react';
import intl from 'react-intl-universal';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Api } from '../services';

interface PropType {}

const Wrapper = styled.div`
  .header {
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
      </div>
      <div className="content"></div>
    </Wrapper>
  );
};

export default Login;
