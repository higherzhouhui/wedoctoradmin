import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterData {
  qs: string;
  type: string;
  options: string;
  oplength: number;
}

export async function fakeChangePwd(params: UserRegisterData) {
  return request('/admin/question/create', {
    method: 'POST',
    data: params,
  });
}
