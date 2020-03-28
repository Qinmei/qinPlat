import React from 'react';
import intl from 'react-intl-universal';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Api } from '../services';

export const useFileOption = () => {
  const methods = {
    async init(fn: () => Promise<any>) {
      message.loading(intl.get('files.table.option.loading'), 0);
      const res = await fn();
      message.destroy();
      if (res) {
        message.success(intl.get('files.table.option.success'));
      } else {
        message.error(intl.get('files.table.option.error'));
      }
      return res;
    },
    create: (path: string) => {
      return Api.createFile({
        params: {
          path,
        },
      });
    },
    list: (path: string) => {
      return Api.getFileList({
        params: {
          path,
        },
      });
    },
    delete: (files: React.ReactText[], callback?: () => void) => {
      Modal.confirm({
        title: intl.get('files.table.option.delete.title'),
        icon: <ExclamationCircleOutlined />,
        content: intl.get('files.table.option.delete.tips'),
        async onOk() {
          await Api.deleteFile({
            data: {
              files,
            },
          });
          callback && callback();
        },
      });
    },
    copyOrMove: (type: string, files: { oldPath: string; newPath: string }[]) =>
      methods.init(() =>
        Api.copyOrMoveFile({
          data: {
            type: type === 'copy' ? type : 'move',
            files,
          },
        }),
      ),
  };

  return methods;
};
