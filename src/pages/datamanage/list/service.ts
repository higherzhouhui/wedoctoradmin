// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    pageNum?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/admin/result/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function getQuestionList(
  params: {
    // query
    /** 当前的页码 */
    pageNum?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/admin/question/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/admin/expand/saveOrUpdate', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { ids: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/admin/result/delete`, {
    data,
    method: 'POST',
    ...(options || {}),
  });
}


/** 获取规则列表 GET /api/rule */
export async function getExpandrule() {
  return request<any>('/admin/config/getConfig', {
    method: 'GET',
  });
}

/** 新建规则 PUT /api/rule */
export async function autoCreateResult(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/admin/result/autoCreate', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function uploadExcelFile(data: any) {
  return request(`/admin/uploadExcel`, {
    method: 'POST',
    data,
  });
}

export async function updateQudao(data: any) {
  return request(`/admin/qudao/update`, {
    method: 'POST',
    data,
  });
}
export async function getQudaoCode(data: any) {
  return request(`/admin/qudao/getInfo`, {
    method: 'GET',
    data,
  });
}

export async function getQudaoList(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/admin/result/qudaoList', {
    params,
    method: 'GET',
    ...(options || {}),
  });
}