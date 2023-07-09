import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterParams {
  password: string;
  account: string;
}

export async function fakeChangePwd(params: UserRegisterParams) {
  return request('/admin/administer/update', {
    method: 'POST',
    data: params,
  });
}
