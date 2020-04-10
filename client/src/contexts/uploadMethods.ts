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

  createUpload = async (id: string, fileChunkList: File[], size: number) => {
    const { task } = this.state;

    const controller = new AbortController();
    const signal = controller.signal;

    task.push({
      id,
      file: fileChunkList,
      controller,
    });

    for (const index in fileChunkList) {
      const ele = fileChunkList[index];
      if (!ele) return;

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
      });

      if (result) {
        fileChunkList[index] = null;
      }

      this.dispatch({
        task,
      });

      await this.sleep(10000);
    }
  };

  stopUpload = async (id: string) => {
    const { task } = this.state;
    const ele = task.find((item) => item.id === id);
    ele && ele.controller.abort();
  };
}
