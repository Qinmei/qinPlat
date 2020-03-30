import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as intl from 'react-intl-universal';
import { Api } from '../services';
import { RcFile } from 'antd/lib/upload/interface';

interface PropsType {
  confirm: () => void;
  dir: string;
}

export const UploadButton: React.FC<PropsType> = props => {
  const { confirm, dir } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const beforeUpload = (file: RcFile, fileList: RcFile[]) => {
    beforeUploadHandler(fileList);
    return false;
  };

  const beforeUploadHandler = async (fileList: RcFile[]): Promise<void> => {
    setLoading(true);
    for (const file of fileList) {
      const size = file.size / 1024 / 1024;
      if (size < 10) {
        await uploadSmall(file);
      } else {
        uploadBig(file);
      }
      confirm();
    }
    setLoading(false);
  };

  const uploadSmall = async (file: RcFile) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', dir);
    await Api.uploadSmall({
      formData,
    });
  };

  const uploadBig = async (file: RcFile) => {
    const fileChunkList = createFileChunk(file);
    const fileHash = await calculateHash(fileChunkList);
    const start = await Api.uploadBigStart({
      data: {
        name: file.name,
        hash: fileHash,
        directory: dir,
        size: file.size,
      },
    });
    if (start) {
      uploadBigUpdate(start.uuid, fileChunkList);
    }
  };

  const uploadBigUpdate = async (
    uuid: string,
    fileChunkList: { file: any }[],
  ) => {
    for (const ele of fileChunkList) {
    }
  };

  const createFileChunk = (file: any) => {
    const size = 1024 * 1024 * 10;
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  };

  const calculateHash = (fileChunkList: any[]) => {
    return new Promise(resolve => {
      const worker = new Worker('/hash.js');
      worker.postMessage({ fileChunkList });
      worker.onmessage = e => {
        const { hash } = e.data;
        if (hash) {
          resolve(hash);
        }
      };
    });
  };

  return (
    <Upload
      multiple
      beforeUpload={beforeUpload}
      showUploadList={false}
      disabled={loading}
    >
      <Button type="primary" loading={loading}>
        <UploadOutlined />
        {intl.get('files.btn.upload')}
      </Button>
    </Upload>
  );
};
