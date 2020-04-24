import React, { useEffect } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { BrowserRouter, Route } from 'react-router-dom';
import intl from 'react-intl-universal';
import { CustomConfigProvider } from './contexts/config';
import * as locales from './locales';
import { NavHeader } from './components';
import { Login, Logs, Setting, Files, UploadPage } from './pages';
import { Auth } from './layouts';
import './assets/common.less';

const { Header, Content } = Layout;

intl.init({
  currentLocale: 'zh_CN',
  locales,
});

const App: React.FC<{}> = (props) => {
  return (
    <CustomConfigProvider>
      <ConfigProvider locale={locales.antd_zh_CN}>
        <BrowserRouter>
          <Layout style={{ minWidth: '900px' }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
              <NavHeader></NavHeader>
            </Header>
            <Content
              style={{ marginTop: '64px', padding: '40px 50px 40px 50px' }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  minHeight: 'calc(100vh - 144px)',
                  padding: '24px',
                }}
              >
                <Auth>
                  <Route path="/login" component={Login}></Route>
                  <Route path="/setting" component={Setting}></Route>
                  <Route path="/logs" component={Logs}></Route>
                  <Route path="/files" component={Files}></Route>
                  <Route path="/upload" component={UploadPage}></Route>
                </Auth>
              </div>
            </Content>
          </Layout>
        </BrowserRouter>
      </ConfigProvider>
    </CustomConfigProvider>
  );
};

export default App;
