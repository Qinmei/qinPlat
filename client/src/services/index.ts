import { message } from 'antd';
import intl from 'react-intl-universal';
import { stringify } from 'qs';

enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum HttpUrl {
  login = '/setting/login',
  setting = '/setting',
  logs = '/history',
  files = '/file',
  filesWithParams = '/file/:path',
}

export class Api {
  static readonly apiPrefix: string = 'http://localhost:7000/api/v1';
  static async request(methods: HttpMethods, url: HttpUrl, options?: any) {
    const { params, query, data, formData } = options;

    let defaultHeader: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    };

    let link: string = url;
    if (params) {
      link = link.replace(
        /\/:(\w+)/gm,
        index => `/${params[`${index.replace(/\/:/g, '')}`]}`,
      );
    }

    if (query) {
      Object.keys(query).map(item => {
        if (!query[item] && query[item] !== 0) delete query[item];
      });

      link += `?${stringify(query)}`;
    }

    if (formData) {
      defaultHeader = {};
    }

    return fetch(this.apiPrefix + link, {
      body: formData ? formData : data ? JSON.stringify(data) : null,
      headers: {
        ...defaultHeader,
        Authorization: sessionStorage.getItem('token') || '',
      },
      method: methods,
    })
      .then(res => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
        } else if (res.status === 401) {
          sessionStorage.clear();
          message.error(intl.get('request.error.401'));
          window.location.href = '/login';
        } else {
          message.error(intl.get('request.error.unknown'));
        }
        return res;
      })
      .then(res => res.json())
      .then(res => {
        if (res.code) {
          message.error(res.msg);
        } else {
          return res.data;
        }
      });
  }

  static login(data: any) {
    return this.request(HttpMethods.POST, HttpUrl.login, data);
  }

  static postSetting(data: any) {
    return this.request(HttpMethods.POST, HttpUrl.setting, data);
  }

  static getLogs(data: any) {
    return this.request(HttpMethods.GET, HttpUrl.logs, data);
  }

  static getFileList(data: any) {
    return this.request(HttpMethods.GET, HttpUrl.filesWithParams, data);
  }

  static getAllFileList() {
    return this.request(HttpMethods.GET, HttpUrl.files, {});
  }

  static createFile(data: any) {
    return this.request(HttpMethods.POST, HttpUrl.filesWithParams, data);
  }

  static copyOrMoveFile(data: any) {
    return this.request(HttpMethods.POST, HttpUrl.files, data);
  }

  static deleteFile(data: any) {
    return this.request(HttpMethods.DELETE, HttpUrl.files, data);
  }
}
