## 说明

本项目基于 nest, 暂定为图片字幕等上传存储, 当作一个图床啥的来用吧

进度

- [x] middleware
- [x] exceptions // 业务的错误抛出已经处理
- [x] filters //目前完成了业务以及兜底的 filters, 但是路由错误等需要再 http 这一层面再做处理
- [x] interceptors // 完成了访问记录
- [x] pipes // 主要是将内部的 validation 重新实现了一遍, 提取错误信息然后重组成字符串
- [x] guards
- [x] decorators

初始的框架已经搭建完成, 需要慢慢的调整目录结构以及数据库等, 最后考虑前端使用的框架, 最好能将二者结合在一起
