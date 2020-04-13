import React, { createContext, useReducer } from 'react';
import { Api } from '../services';
import { UploadMethods } from './uploadMethods';

interface PropsType {
  children?: React.ReactNode;
}

export type File = { start: number; end: number; file: Blob } | null;

type Task = {
  id: number;
  controller: AbortController;
  file: File[];
  upload: boolean;
  size: number;
};

export interface DataType {
  color: string;
  uploadSize: number;
  task: Task[];
}

const reducer = (state: DataType, action: DataType) => {
  return {
    ...state,
    ...action,
  };
};

const initData: DataType = {
  color: '#1DA57A',
  uploadSize: 1,
  task: [],
};

interface ContextProps {
  state: DataType;
  methods: UploadMethods;
}

const ConfigContext = createContext({} as ContextProps);

const CustomConfigProvider = (props: PropsType) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initData);

  const contextValue = {
    state,
    methods: new UploadMethods(state, dispatch),
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigContext, CustomConfigProvider };
