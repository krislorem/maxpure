import { Spin } from 'antd';

// 自定义全屏加载蒙版组件
const GlobalLoading = () => (
  <Spin
    size="large"
    fullscreen
    tip="Loading..."
  />
);

export default GlobalLoading;
