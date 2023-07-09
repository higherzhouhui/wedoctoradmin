import { Button, Card, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';

import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import { wingsOpen } from './service';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/progress/list">
      <Button size="large">查看结果</Button>
    </Link>
    <Link to="/">
      <Button size="large">返回首页</Button>
    </Link>
  </div>
);

const WingsOpen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openSuccess, setSuccess] = useState(false);
  const [time, setTime] = useState('');

  const openWings = () => {
    setLoading(true);
    wingsOpen().then((res: any) => {
      setLoading(false);
      if (res.errno === 200) {
        setSuccess(true);
      }
      console.log(res);
    });
  };
  const getTime = () => {
    const date = new Date();
    const year = date.getFullYear(); //  返回的是年份
    const month = date.getMonth() + 1; //  返回的月份上个月的月份，记得+1才是当月
    const dates = date.getDate(); //  返回的是几号
    const day = date.getDay(); //  周一返回的是1，周六是6，但是周日是0
    const arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    let hour: any = date.getHours();
    let min: any = date.getMinutes();
    let sed: any = date.getSeconds();
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (sed < 10) {
      sed = '0' + sed;
    }
    const ct = `${year}-${month}-${dates}(${arr[day]}) ${hour}:${min}:${sed}`;
    return ct;
  };

  const showTime = () => {
    const timer = setInterval(() => {
      const t = getTime();
      setTime(t);
    }, 1000);
    return timer;
  };
  useEffect(() => {
    const timer = showTime();
    return () => clearInterval(timer);
  }, []);

  return (
    <PageContainer>
      <Card bordered={false}>
        <div className={styles.main}>
          {openSuccess ? (
            <Result
              className={styles.registerResult}
              status="success"
              title={
                <div className={styles.title}>
                  <span> 操作成功</span>
                </div>
              }
              subTitle="宝箱已经全部打开！"
              extra={actions}
            />
          ) : (
            <>
              {time ? (
                <>
                  <p>当前时间：{time}</p>
                  <Button size="large" type="primary" onClick={openWings} loading={loading}>
                    立即打开宝箱
                  </Button>
                </>
              ) : (
                <PageLoading />
              )}
            </>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default WingsOpen;
