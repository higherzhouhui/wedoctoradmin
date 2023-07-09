import { Button, Card, Form, Input, message, Popover, Progress } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { fakeChangePwd } from './service';

import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const ChangePwd: FC = () => {
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const [submitting, setsubmitting]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const onFinish = (values: any) => {
    const param = {
      account: values.accountName,
      password: values.password,
    };
    const hide = message.loading('正在新增...', 50);
    setsubmitting(true);
    fakeChangePwd(param)
      .then((res: any) => {
        hide();
        setsubmitting(false);
        if (res.code === 200) {
          history.push({
            pathname: '/admins/addaccount-result',
            state: {
              username: values.accountName,
            },
          });
        }
      })
      .catch(() => {
        hide();
        setsubmitting(false);
      });
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['new_password']);
    }
    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('new_password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <PageContainer content="新增管理员账号">
      <Card bordered={false}>
        <div className={styles.main}>
          <Form form={form} name="UserRegister" onFinish={onFinish}>
            <FormItem
              name="accountName"
              label="账号"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="large" type="text" placeholder="请输入账号" />
            </FormItem>
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                visible && (
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                    </div>
                  </div>
                )
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              <FormItem
                name="password"
                label="密码"
                className={
                  form.getFieldValue('password') &&
                  form.getFieldValue('password').length > 0 &&
                  styles.password
                }
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: checkPassword,
                  },
                ]}
              >
                <Input size="large" type="password" placeholder="至少6位密码,区分大小写" />
              </FormItem>
            </Popover>
            <FormItem style={{textAlign: 'center'}}>
              <Button
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
                style={{ width: '100px' }}
              >
                <span>立即新增</span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </PageContainer>
  );
};
export default ChangePwd;
