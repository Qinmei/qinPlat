import React, { createContext, useReducer } from 'react';

interface PropsType {
  children?: React.ReactNode;
}

interface DataType {
  color: string;
  isLogin: boolean;
}

const reducer = (state: DataType, action: DataType) => {
  return {
    ...state,
    ...action,
  };
};

const initData: DataType = {
  color: '#1DA57A',
  isLogin: false,
};

interface ContextProps {
  state: DataType;
  dispatch: React.Dispatch<DataType>;
}

const contextValue: ContextProps = {
  state: initData,
  dispatch: () => {},
};

const ConfigContext = createContext(contextValue);

const CustomConfigProvider = (props: PropsType) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initData);

  const contextValue = {
    state,
    dispatch,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigContext, CustomConfigProvider };
