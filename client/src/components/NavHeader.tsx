import React, { useContext, useMemo } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { LoginOutlined } from '@ant-design/icons';
import { ConfigContext } from '../contexts/config';

interface PropType {}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    display: inline-block;
    width: 160px;
    height: 100%;
    color: white;
    font-size: 40px;
    letter-spacing: 3px;
  }

  .main {
    height: 100%;
    box-sizing: inherit;

    .list {
      display: inline-block;
      height: 100%;
      font-size: 17px;
      padding: 0 30px;
      color: rgba(255, 255, 255, 0.9);
      border-bottom: solid 3px transparent;

      &:hover {
        color: ${props => props.color};
      }

      &.active {
        color: ${props => props.color};
        border-bottom-color: ${props => props.color};
      }
    }
  }

  .logout {
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    padding: 0 30px;
    text-align: right;
    margin-left: 120px;

    &:hover {
      color: ${props => props.color};
    }
  }
`;

export const NavHeader: React.FC<PropType> = props => {
  const { state } = useContext(ConfigContext);
  const { pathname } = useLocation();
  const history = useHistory();

  const color = useMemo(() => state.color, [state.color]);

  const logout = () => {
    sessionStorage.clear();
    history.push('/login');
  };

  return (
    <Wrapper color={color}>
      <div className="logo">QinPlat</div>
      {pathname !== '/login' && [
        <div className="main">
          <NavLink to="/images" activeClassName="active" className="list">
            {intl.get('header.images')}
          </NavLink>
          <NavLink to="/videos" activeClassName="active" className="list">
            {intl.get('header.videos')}
          </NavLink>
          <NavLink to="/subtitles" activeClassName="active" className="list">
            {intl.get('header.subtitles')}
          </NavLink>
          <NavLink to="/files" activeClassName="active" className="list">
            {intl.get('header.files')}
          </NavLink>
          <NavLink to="/setting" activeClassName="active" className="list">
            {intl.get('header.setting')}
          </NavLink>
          <NavLink to="/logs" activeClassName="active" className="list">
            {intl.get('header.logs')}
          </NavLink>
        </div>,
        <div className="logout" onClick={logout}>
          <LoginOutlined style={{ marginRight: '10px' }} />
          {intl.get('header.logout')}
        </div>,
      ]}
    </Wrapper>
  );
};
