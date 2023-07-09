import { request } from 'umi';

export async function fakeSubmitForm(data: any) {
  return request('/upload-service/upload/uploadImage', {
    method: 'POST',
    data,
  });
}
