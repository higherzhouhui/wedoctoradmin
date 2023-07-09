import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input, message} from 'antd';
import React, { useEffect, useState } from 'react';
import { updateRule, rule } from './service';
import styles from './style.less'


const TableList: React.FC = () => {
  const [baseInfo, setBaseInfo] = useState([
    {title: '昵称', key: 'name', vlaue: ''},
    {title: '头像', key: 'photo', vlaue: ''},
    {title: '问候语', key: 'remark', vlaue: '', texeArea: true},
    {title: 'id', key: 'id', hide: true, value: ''},
  ])
  const [loading, setLoading] = useState(false)

  const initData = () => {
    setLoading(true)
    rule().then(res => {
      setLoading(false)
      if (res.code === 200) {
        const data = res.data || {}
        const newBase = baseInfo
        newBase.forEach(item => {
          item.value = data[item.key]
        })
        setBaseInfo([...newBase])
      } else {
        message.error(res.msg || res.message)
      }
    })
  }

  const handleOk = async () => {
    const hide = message.loading(`正在更新`);
    const data = {}
    baseInfo.forEach(item => {
      data[item.key] = item.value
    })
    try {
      const res = await updateRule(data);
      hide();
      if (res.code === 200) {
        message.success('操作成功，即将刷新');
      } else {
        message.error(res.msg);
      }
      return true;
    } catch (error) {
      hide();
      message.error('操作失败，请重试');
      return false;
    }
  };
  const handleChange = (value: any, attar: string) => {
    const newBase = baseInfo
    newBase.forEach(item => {
      if (item.key === attar) {
        item.value = value
      }
    })
    setBaseInfo([...newBase])
  }

  useEffect(() => {
    initData()
  }, [])

  return (
    <PageContainer subTitle='图片文件请上传文件后将链接填入'>
      <div className={styles.form}>
        {
          baseInfo.map(item => {
            return !item.hide ? <div className={styles.formItem} key={item.key}>
            <div className={styles.label}>{item.title} {item.key === 'photo' ? <img src={item.value} width={30}/> : null}</div>
              {
                item?.texeArea ? <Input.TextArea rows={3} value={item.value} onChange={(e) => handleChange(e.target.value, item.key)} placeholder={`请输入${item.title}`}/>
                : <Input value={item.value} onChange={(e) => handleChange(e.target.value, item.key)} placeholder={`请输入${item.title}`}/>
              }
              
          </div> : null
          })
        }
      </div>
      <div className={styles.submit}>
        <Button type='primary' size='large' loading={loading} onClick={() => handleOk()} style={{marginRight: '12px'}}>确定</Button>
        <Button type='default' size='large' loading={loading} onClick={() => initData()}>重置</Button>
      </div>
    </PageContainer>
  );
};

export default TableList;
