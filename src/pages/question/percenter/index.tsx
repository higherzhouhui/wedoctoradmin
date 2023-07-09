import { UserOutlined } from '@ant-design/icons';
import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import { Avatar, Button, Card, Form, Input, message, Select } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { UserInfo } from './service';
import { updateUserInfo } from './service';
import styles from './style.less';

const PersonalCenter: FC = () => {
  const { initialState } = useModel('@@initialState');
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  useEffect(() => {
    const { currentUser } = initialState;
    if (currentUser) {
      setUserInfo(currentUser);
    }
  }, []);
  const onFinish = (values: any) => {
    const hide = message.loading('正在修改中...', 50);
    updateUserInfo({ ...userInfo, ...values, ...{ status: values.status * 1 } }).then(
      (res: any) => {
        hide();
        if (res.errno === 200) {
          message.success('修改成功！');
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
                  initialValues={{ ...userInfo, ...{ status: userInfo.status.toString() } }}
                  onFinish={onFinish}
                >
                  <p>账号</p>
                  <FormItem
                    name="user_name"
                    rules={[
                      {
                        required: true,
                        message: '请输入账号！',
                      },
                    ]}
                  >
                    <Input type="text" placeholder="请输入账号" />
                  </FormItem>
                  <p>用户名</p>
                  <FormItem
                    name="nick_name"
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名！',
                      },
                    ]}
                  >
                    <Input type="text" placeholder="请输入名称" />
                  </FormItem>
                  <p>状态</p>
                  <FormItem
                    name="status"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select placeholder="启用">
                      <Select.Option value="0">启用</Select.Option>
                      <Select.Option value="1">禁用</Select.Option>
                    </Select>
                  </FormItem>
                  <FormItem>
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
                size="large"
                icon={<UserOutlined />}
                src="https://joeschmoe.io/api/v1/random"
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
