import React, { useState, useContext } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as intl from 'react-intl-universal';
import { Api } from '../services';
import { RcFile } from 'antd/lib/upload/interface';
import { ConfigContext } from '../contexts/config';

interface PropsType {
  confirm: () => void;
  dir: string;
}

type File = { start: number; end: number; file: Blob } | null;

export const UploadButton: React.FC<PropsType> = (props) => {
  const { confirm, dir } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const { state, methods } = useContext(ConfigContext);

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
    const fileChunkList = await createFileChunk(file);
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
      const receive: [number, number][] = JSON.parse(start.receive);
      const newFileChunkList = fileChunkList.filter(
        (item) =>
          !receive.some(
            (ele) => item && item.start >= ele[0] && item.end <= ele[1],
          ),
      );
      methods.createUpload(start.id, newFileChunkList, file.size);
    }
  };

  const createFileChunk = (file: RcFile) => {
    const size = 1024 * 1024 * state.uploadSize;
    const fileChunkList: File[] = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({
        start: cur,
        end: Math.min(cur + size, file.size),
        file: file.slice(cur, cur + size),
      });
      cur += size;
    }

    return fileChunkList;
  };

  const calculateHash = (fileChunkList: any[]) => {
    return new Promise((resolve) => {
      const worker = new Worker('/hash.js');
      worker.postMessage({ fileChunkList });
      worker.onmessage = (e) => {
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
