import { Api } from '../services';
import { DataType, File } from './config';

export class UploadMethods {
  constructor(private state: DataType, private dispatch: (data: any) => void) {}

  sleep = async (time: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  };

  uploadProgress = async (
    id: number,
    fileChunkList: File[],
    signal: AbortSignal,
    size: number,
  ) => {
    let { task } = this.state;
    for (const index in fileChunkList) {
      const ele = fileChunkList[index];
      if (!ele) continue;

      const formData = new FormData();
      formData.append('file', ele.file);
      formData.append('start', ele.start.toString());
      formData.append('end', ele.end.toString());
      formData.append('size', size.toString());
      const result = await Api.uploadBigUpdate({
        params: {
          id,
        },
        formData,
        signal,
      }).catch((err) => {
        return;
      });

      if (result) {
        fileChunkList[index] = null;
      } else {
        return;
      }

      const uploaded = fileChunkList.every((item) => !item);

      if (uploaded) {
        task = task.filter((item) => item.id !== id);
      }

      this.dispatch({
        task,
      });
    }
  };

  createUpload = async (id: number, fileChunkList: File[], size: number) => {
    const { task } = this.state;

    const controller = new AbortController();
    const signal = controller.signal;

    task.push({
      id,
      file: fileChunkList,
      controller,
      size,
      upload: true,
    });

    this.uploadProgress(id, fileChunkList, signal, size);
  };

  toggleUpload = async (id: number) => {
    let { task } = this.state;
    const ele = task.find((item) => item.id === id);
    if (ele) {
      if (ele.upload) {
        ele.controller.abort();
        ele.upload = false;
      } else {
        const controller = new AbortController();
        const signal = controller.signal;

        ele.upload = true;
        ele.controller = controller;
        this.uploadProgress(ele.id, ele.file, signal, ele.size);
      }
      this.dispatch({
        task,
      });
    }
  };

  getFileStatus = (id: number) => {
    const { task } = this.state;
    const ele = task.find((item) => item.id === id);

    return {
      exist: !!ele,
      upload: ele?.upload,
    };
  };
}
