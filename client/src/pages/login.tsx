import React from 'react';
import { useHistory } from 'react-router-dom';
import intl from 'react-intl-universal';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';
import md5 from 'md5';
import { Api } from '../services';

interface PropType {}

const Wrapper = styled.div`
  width: 600px;
  margin: 60px auto;
`;

const Login: React.FC<PropType> = props => {
  const history = useHistory();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const onFinish = (values: any) => {
    const { username, password } = values;
    Api.login({
      data: {
        username,
        password: md5(password),
      },
    }).then(res => {
      if (res) {
        const { token } = res;
        sessionStorage.setItem('token', token);
        history.push('/upload');
      }
    });
  };

  return (
    <Wrapper>
      <Form {...layout} name="basic" onFinish={onFinish}>
        <Form.Item
          label={intl.get('login.form.username')}
          name="username"
          rules={[{ required: true, message: intl.get('login.tips.username') }]}
        >
          <Input placeholder={intl.get('login.tips.username')} />
        </Form.Item>

        <Form.Item
          label={intl.get('login.form.password')}
          name="password"
          rules={[{ required: true, message: intl.get('login.tips.password') }]}
        >
          <Input.Password placeholder={intl.get('login.tips.password')} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {intl.get('login.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default Login;
