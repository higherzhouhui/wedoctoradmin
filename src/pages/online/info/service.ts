// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取规则列表 GET /api/rule */
export async function rule() {
  return request<any>('/admin/customer-service/getCustomerService', {
    method: 'GET',
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/admin/customer-service/updateCustomerService', {
    data,
    method: 'POST',
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
export async function removeRule(data: { id: number }, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/admin/expand/delete/${data.id}`, {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
