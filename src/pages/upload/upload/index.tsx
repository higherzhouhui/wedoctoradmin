import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, message } from 'antd';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { fakeSubmitForm } from './service';
import styles from './style.less'
const UploadWings: FC<Record<string, any>> = () => {
  const formRef = useRef<any>();
  const [single, setSingle] = useState('single');
  const [imageUrl, setImageUrl] = useState('')
  const sendRequest = async (data: any) => {
    const hide = message.loading('正在上传...', 50);
    fakeSubmitForm(data)
      .then((res: any) => {
        hide();
        if (res.code === 200) {
          message.success('上传成功！');
          formRef.current.resetFields();
          setImageUrl(res.data)
        }
      })
      .catch((res) => {
        message.error(res);
      });
  };

  const onFinish = async (values: Record<string, any>) => {
    const { files } = values;
    if (!files || files.length === 0) {
      message.warn('请选择文件');
      return;
    }
    // let typeError = false;
    // files.forEach((item: any) => {
    //   if (!item.type.includes('image')) {
    //     typeError = true;
    //   }
    // });
    // if (typeError) {
    //   message.error('文件格式错误，请重新上传');
    //   return;
    // }
    const formData = new FormData();
    files.forEach((file: any) => {
      formData.append('file', file.originFileObj);
    });
    sendRequest(formData);
  };
  return (
    <PageContainer content="该页面用于上传文件，然后将地址复制到需要的地方(操作不便可打开两个窗口)">
      <Card bordered={false}>
        {
          imageUrl ? <div>
            <img src={imageUrl} alt='image' className={styles.image}/>
            <p>{imageUrl}</p>
          </div> : null
        }
        <ProForm
          style={{ margin: 'auto', marginTop: 12, width: '100%', height: 'calc(100vh - 330px)' }}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          formRef={formRef}
          encType="application/json; charset=UTF-8"
        >
          <ProFormUploadDragger
            name="files"
            title="单击或拖动文件到此区域进行上传"
            description={
              single === 'single'
                ? '支持JPG、PNG、JPEG、SVG、WebP、Mp4等文件'
                : '请选择文件夹(自动过滤掉非图片、json文件)'
            }
            fieldProps={{
              directory: single !== 'single',
              accept: 'image/*,video/*',
              multiple: true,
              beforeUpload: () => {
                return false;
              },
            }}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default UploadWings;
