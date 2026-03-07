import xss from 'xss';

export const sanitize = (value: string): string => xss(value, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
});

export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === 'string' ? sanitize(v) : v,
    ])
  ) as T;
};