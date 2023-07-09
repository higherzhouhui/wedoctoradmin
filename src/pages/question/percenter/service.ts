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
  nick_name: string;
  status: 0;
  user_name: string;
}

export async function getUserInfo(params: UserCenterParams) {
  return request(`/sys_user/${params.id}`, {
    method: 'GET',
  });
}

export async function updateUserInfo(params: UserInfo) {
  return request('/sys_user', {
    method: 'POST',
    data: params,
  });
}
