import { Button, Card, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import type { IMintInfo } from './service';
import { putWingsInfo, getWingsInfo } from './service';

import styles from './style.less';

const WingsBaseInfo: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<IMintInfo>({
    mint_limit: 0,
    mint_price: 0,
  });
  const handleChangeLimit = (e: any) => {
    const value = parseInt(e.target.value);
    setInfo({
      mint_limit: value,
      mint_price: info.mint_price,
    });
  };
  const handleChangePrice = (e: any) => {
    const value = e.target.value;
    setInfo({
      mint_price: value,
      mint_limit: info.mint_limit,
    });
  };
  const handleSubmit = () => {
    setLoading(true);
    putWingsInfo({
      mint_limit: info.mint_limit,
      mint_price: info.mint_price * 1,
    }).then((res: any) => {
      setLoading(false);
      if (res?.code === 200) {
        message.success('修改成功！');
      }
    });
  };
  useEffect(() => {
    getWingsInfo().then((res: any) => {
      if (res.code === 200) {
        setInfo(res?.data);
        setInitLoading(false);
      }
    });
  }, []);

  return (
    <PageContainer>
      <Card
        bordered={false}
        title={
          '参考：1、空投，2、FREE（1个-0ETH）3、WhiteList（2个-0.05ETH）4、Public SALE(2个-0.1ETH)'
        }
      >
        <div className={styles.main}>
          {initLoading ? (
            <PageLoading />
          ) : (
            <>
              <div className={styles.inputWrapper}>
                <div className={styles.label}>最大mint数量：</div>
                <Input
                  type="number"
                  suffix="个"
                  value={info.mint_limit}
                  onChange={handleChangeLimit}
                  min={1}
                />
              </div>
              <div className={styles.inputWrapper}>
                <div className={styles.label}>价格：</div>
                <Input
                  type="number"
                  prefix="￥"
                  suffix="ETH"
                  value={info.mint_price}
                  onChange={handleChangePrice}
                  min={0}
                  step={0.001}
                />
              </div>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                立即修改
              </Button>
            </>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default WingsBaseInfo;
