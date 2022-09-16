import { ImgOptions, WatermarkOptions } from './types';

function createImgBase(options: ImgOptions): string {
  const canvas = document.createElement('canvas');
  const text = options.content;
  // 因为要实现文字交错效果，所以这里生成两倍宽度的图片
  canvas.width = options.width * 2;
  canvas.height = options.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // X轴阴影距离，负值表示往上，正值表示往下
    ctx.shadowOffsetX = 2;
    // Y轴阴影距离，负值表示往左，正值表示往右
    ctx.shadowOffsetY = 2;
    // 阴影的模糊程度
    ctx.shadowBlur = 2;
    ctx.font = options.font;
    ctx.fillStyle = options.color;
    ctx.rotate(options.rotateDegree);
    ctx.textAlign = 'left';
    ctx.fillText(text, options.x, options.y);
  }
  return canvas.toDataURL('image/png');
}

/*
 * 生成水印
 * @param {String} className 水印类名
 * @param {Number} width 宽度
 * @param {Number} height 高度
 * @param {String} content 内容
 * @param {String} font 字体
 * @param {String} color 自定义样式: 如字体颜色(使用RGBA)
 * @param {Number} rotate 翻转角度
 * @param {String} position 水印定位方式
 * @param {Number} top 距离顶部位置
 * @param {Number} left 距离左部位置
 * @param {Number} zIndex 水印层级
 */

export function WaterMark({
  element = document.getElementsByTagName('body')[0],
  className = 'watermark',
  width = 340,
  height = 240,
  content = '水印',
  font = '14px PingFang SC, sans-serif',
  color = 'rgba(156, 162, 169, 0.3)',
  rotate = -14,
  position = 'absolute',
  top = 0,
  left = 0,
  zIndex = 1000,
}: WatermarkOptions): void {
  const option = {
    width,
    height,
    content,
    font,
    color,
    rotateDegree: (rotate * Math.PI) / 180,
  };

  // 为了实现交错水印的效果，此处生成两张位置不同的水印 固定相对位置
  const dataUri1 = createImgBase({
    ...option,
    x: 100,
    y: 140,
  });

  const dataUri2 = createImgBase({
    ...option,
    x: 400,
    y: 340,
  });

  const defaultStyle = document.createElement('style');
  defaultStyle.innerHTML = `.${className}:after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      ${top || top === 0 ? `top: ${top}px;` : ''}
      ${left || left === 0 ? `left: ${left}px;` : ''}
      background-repeat: repeat;
      pointer-events: none;
    }`;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = `.${className}:after {
      ${position ? `position: ${position}` : ''};
      ${zIndex ? `z-index:${zIndex}` : ''};
      background-image: url(${dataUri1}), url(${dataUri2});
      background-size: ${option.width * 2}px ${option.height}px;
    }`;

  document.head.appendChild(defaultStyle);
  document.head.appendChild(styleEl);

  element.setAttribute('class', className);
}
