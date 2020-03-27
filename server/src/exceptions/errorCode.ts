export interface CodeMsg {
  code: number;
  msg: string;
}

export class ErrorCode {
  static readonly NameError: CodeMsg = { code: 10001, msg: '用户不存在' };
  static readonly PassError: CodeMsg = { code: 10002, msg: '密码错误' };

  static readonly FileListError: CodeMsg = {
    code: 20001,
    msg: '获取文件列表错误',
  };
  static readonly FileCreateError: CodeMsg = {
    code: 20002,
    msg: '文件创建错误',
  };
  static readonly FileRenameError: CodeMsg = {
    code: 20003,
    msg: '文件重命名错误',
  };
  static readonly FileDeleteError: CodeMsg = {
    code: 20004,
    msg: '文件删除错误',
  };
  static readonly FileMoveError: CodeMsg = {
    code: 20005,
    msg: '文件移动错误',
  };
  static readonly FileCopyError: CodeMsg = {
    code: 20006,
    msg: '文件复制错误',
  };
}
