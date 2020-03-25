export interface CodeMsg {
  code: number;
  msg: string;
}

export class ErrorCode {
  static readonly NameError: CodeMsg = { code: 10001, msg: '用户不存在' };
  static readonly PassError: CodeMsg = { code: 10002, msg: '密码错误' };
}
