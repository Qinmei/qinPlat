import React, { ReactChildren } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

interface PropsType {}

const Auth: React.FC<PropsType> = props => {
  const { children } = props;

  const { pathname } = useLocation();
  const history = useHistory();

  const token = sessionStorage.getItem('token');

  if (!token && pathname !== '/login') {
    history.push('/login');
  }

  return <>{children}</>;
};

export default Auth;
