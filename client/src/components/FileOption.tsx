import React from 'react';
import intl from 'react-intl-universal';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Api } from '../services';

export const useFileOption = () => {
  const methods = {
    init: async (fn: (data: any) => Promise<any>, data: any) => {
      message.loading(intl.get('files.table.option.loading'), 0);
      const res = await fn(data);
      message.destroy();
      if (res) {
        message.success('files.table.option.success');
      } else {
        message.error('files.table.option.error');
      }
      return res;
    },
    list: (path: string) => {
      return Api.getFileList({
        params: {
          path,
        },
      });
    },
    rename: (files: { oldPath: string; newPath: string }[]) => {
      return methods.init(Api.renameFileList, {
        data: {
          files,
        },
      });
    },
    delete: (files: React.ReactText[], callback?: () => void) => {
      Modal.confirm({
        title: intl.get('files.table.option.delete.title'),
        icon: <ExclamationCircleOutlined />,
        content: intl.get('files.table.option.delete.tips'),
        async onOk() {
          await Api.deleteFileList({
            data: {
              files,
            },
          });
          callback && callback();
        },
      });
    },
    copyOrMove: (
      type: string,
      files: { oldPath: string; newPath: string }[],
    ) => {
      return methods.init(Api.copyOrMoveFile, {
        data: {
          type,
          files,
        },
      });
    },
  };

  return methods;
};
