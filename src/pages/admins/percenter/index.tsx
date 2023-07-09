import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import { Avatar, Button, Card, Form, Input, message } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { UserInfo } from './service';
import { updateUserInfo, uploadFile } from './service';
import styles from './style.less';

const PersonalCenter: FC = () => {
  const { initialState, refresh } = useModel('@@initialState');
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [form] = Form.useForm();
  const FormItem = Form.Item;


// 修改用户头像
const editAvatar = () => {
  const inputChoose = document.createElement("input");
  inputChoose.type = "file";
  inputChoose.accept = 'image/*'
  inputChoose.click();
  inputChoose.addEventListener("change", (event) => {
    const hide = message.loading('上传中...', 50)
    const selectedFile = (event?.target as any)?.files[0];
    // 处理选择的文件，可以进行上传操作等
    const formData = new FormData()
    formData.append('file', selectedFile)
    uploadFile(formData).then(res => {
      hide()
      if (res.code === 200) {
        refresh()
      } else {
        message.error(res.msg)
      }
    })
    // 在此处执行需要对文件进行处理的逻辑
  });
};


  useEffect(() => {
    const { currentUser } = initialState;
    if (currentUser) {
      setUserInfo(currentUser);
    }
  }, [initialState]);
  const onFinish = (values: any) => {
    const hide = message.loading('正在修改中...', 50);
    updateUserInfo(values).then(
      (res: any) => {
        hide();
        if (res.code === 200) {
          message.success('修改成功！');
        } else {
          message.error(res.msg);
        }
      },
    );
  };
  return (
    <PageContainer content="查看个人详情">
      <Card bordered={false}>
        <div className={styles.content}>
          {userInfo ? (
            <div className={styles.main}>
              <div className={styles.form}>
                <Form
                  form={form}
                  name="updateuserinfo"
                  initialValues={{ ...userInfo }}
                  onFinish={onFinish}
                >
                  <p>账号</p>
                  <FormItem
                    name="account"
                    rules={[
                      {
                        required: true,
                        message: '请输入账号！',
                      },
                    ]}
                  >
                    <Input type="text" placeholder="请输入账号" />
                  </FormItem>
                  <p>昵称</p>
                  <FormItem
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: '请输入昵称！',
                      },
                    ]}
                  >
                    <Input type="text" placeholder="请输入昵称！" />
                  </FormItem>
                  <FormItem style={{textAlign: 'center'}}>
                    <Button
                      className={styles.submit}
                      type="primary"
                      htmlType="submit"
                      style={{ width: '100px' }}
                    >
                      <span>立即修改</span>
                    </Button>
                  </FormItem>
                </Form>
              </div>
              <Avatar
                onClick={() => editAvatar()}
                size="large"
                src={userInfo.avatar || "http://127.0.0.1:8888/avatar.png"}
                className={styles.avator}
              />
            </div>
          ) : (
            <PageLoading />
          )}
        </div>
      </Card>
    </PageContainer>
  );
};
export default PersonalCenter;
