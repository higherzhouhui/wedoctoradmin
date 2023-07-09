import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserCenterParams {
  id: number;
}

export interface UserInfo {
  id: number;
  role: string;
  name: string;
  account: string;
  avatar: string;
}

export async function getUserInfo(params: UserCenterParams) {
  return request(`/sys_user/${params.id}`, {
    method: 'GET',
  });
}

export async function updateUserInfo(params: UserInfo) {
  return request('/admin/user/update', {
    method: 'POST',
    data: params,
  });
}
export async function uploadFile(data: any) {
  return request(`/admin/upload`, {
    method: 'POST',
    data,
  });
}

