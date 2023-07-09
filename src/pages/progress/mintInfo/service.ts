// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取mint基本信息*/
export async function getWingsInfo() {
  return request('/wings/setting', {
    method: 'GET',
  });
}

export interface IMintInfo {
  mint_limit: number;
  mint_price: number;
}

/** 获取mint基本信息*/
export async function putWingsInfo(data: IMintInfo) {
  return request('/wings/setting', {
    method: 'PUT',
    data,
  });
}
