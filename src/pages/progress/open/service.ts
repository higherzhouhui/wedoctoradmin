// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 开宝箱*/
export async function wingsOpen() {
  return request('/wings/open', {
    method: 'POST',
  });
}
