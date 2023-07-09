import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterData {
  account: string;
  password: string;
}

export async function fakeChangePwd(params: UserRegisterData) {
  return request('/admin/user/create', {
    method: 'POST',
    data: params,
  });
}
