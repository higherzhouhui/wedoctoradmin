import { Button, Card, Result } from 'antd';
import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import { Link } from 'umi';

import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    {/* <Link to="/admins/center">
      <Button size="large">个人中心</Button>
    </Link> */}
    <Link to="/">
      <Button size="large">返回首页</Button>
    </Link>
  </div>
);

export type LocationState = Record<string, unknown>;

const ChangePwdResult: React.FC<RouteChildrenProps> = ({ location }) => {
  const info = location.state ? (location.state as LocationState).username : '消化疾病数据采集';
  return (
    <PageContainer>
      <Card bordered={false}>
        <Result
          className={styles.registerResult}
          status="success"
          style={{ height: 'calc(100vh - 250px)' }}
          title={
            <div className={styles.title}>
              <span>你的账户：{info} 操作成功</span>
            </div>
          }
          subTitle="请保护好你的密码，避免被他人使用！"
          extra={actions}
        />
      </Card>
    </PageContainer>
  );
};

export default ChangePwdResult;
