/**
 * @module utils
 */

const { toString } = Object.prototype;

/**
 * @type {isBrowser}
 * @description 是否为浏览器环境
 */
export const isBrowser = typeof window !== 'undefined' && !!window.document;

/**
 * @function isString
 * @description 是否为字符串
 * @param value 需要验证的值
 */
export function isString(value: any): value is string {
  return toString.call(value) === '[object String]';
}

/**
 * @function isFunction
 * @description 是否为函数
 * @param value 需要验证的值
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * @function formatThousands
 * @description 格式化数字
 * @param number 需要格式话的数字
 * @param precision 小数位保留个数
 */
export function formatThousands(number: number | string | undefined = 0, precision: number = 2): string {
  number = Number(number);

  const { Intl } = globalThis;

  if (Intl) {
    return new Intl.NumberFormat('en-us', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(number);
  }

  const parts = number.toFixed(precision).split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}

/**
 * @function createMarkup
 * @description 生成 React HTML 字符串
 * @param html HTML 字符串
 */
export function createMarkup(html: string): { __html: string } {
  return { __html: html };
}
