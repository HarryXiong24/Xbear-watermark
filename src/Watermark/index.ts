import { ImgOptions, WatermarkOptions } from './types';

/**
 * 创建图片
 * @param {String} options ImgOptions
 */
function createImgBase(options: ImgOptions): string {
  const canvas = document.createElement('canvas');
  const text = options.content;
  // 因为要实现文字交错效果，所以这里生成两倍宽度的图片
  canvas.width = options.width * 2.5;
  canvas.height = options.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // X 轴阴影距离，负值表示往上，正值表示往下
    ctx.shadowOffsetX = 2;
    // Y 轴阴影距离，负值表示往左，正值表示往右
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

/**
 * 防止删除类名
 * @param {String} className 类名
 */
function addListener(className: string) {
  const MutationObserver =
    window.MutationObserver || (window as any).WebKitMutationObserver;
  const containerList = document.querySelectorAll(`.${className}`);
  if (MutationObserver) {
    // PS domTreeList是不可以直接遍历的
    [...containerList].forEach((container) => {
      const mutation = new MutationObserver(function () {
        // 防止删除水印类名
        const classList = container.classList;
        if (![classList].includes(className as unknown as DOMTokenList)) {
          // 如果classList中不存在水印的类名，就重新add进去
          container.classList.add(className);
          // 防止重复触发
          mutation.disconnect();
          // 重新开始观察
          mutation.observe(container, {
            // 这里只需要监听属性
            attributes: true,
          });
        }
      });
      mutation.observe(container, {
        // 这里只需要监听属性
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
        attributeOldValue: true,
      });
    });
  }
}

/**
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
export function Watermark({
  element = document.getElementsByTagName('body')[0],
  className = 'watermark',
  width = 120,
  height = 120,
  content = '水印',
  font = '16px PingFang SC, sans-serif',
  color = 'rgba(156, 162, 169, 0.3)',
  rotate = -10,
  position = 'absolute',
  top = 0,
  left = 0,
  zIndex = 1000,
}: WatermarkOptions): void {
  // 生成图片的配置
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
    x: 200,
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

  // 根据 element 进行挂载
  element.setAttribute('class', className);

  // 防止删除水印
  addListener(className);
}
