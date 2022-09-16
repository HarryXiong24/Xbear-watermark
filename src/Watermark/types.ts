// 图片配置类型定义
export type ImgOptions = {
  // 宽度
  width: number;
  // 高度
  height: number;
  // 水印内容
  content: string;
  // 水印字体
  font: string;
  // 水印颜色
  color: string;
  // 偏转角度（deg）
  rotateDegree: number;
  // X轴偏移量
  x: number;
  // Y轴偏移量
  y: number;
};

export type WatermarkOptions = {
  // 挂载的位置
  element?: HTMLElement;
  // 自定义类名
  className?: string;
  // 宽度
  width?: number;
  // 高度
  height?: number;
  // 文案内容
  content?: string;
  // 字体
  font?: string;
  // 颜色
  color?: string;
  // 偏转角度
  rotate?: number;
  // 定位方式
  position?: string;
  // 顶部距离
  top?: number;
  // 左侧距离
  left?: number;
  // 层级
  zIndex?: number;
};
