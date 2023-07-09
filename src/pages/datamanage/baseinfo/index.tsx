import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input, Switch, message} from 'antd';
import React, { useEffect, useState } from 'react';
import { updateRule, rule } from './service';
import styles from './style.less'
import WangEditor from '@/components/Editor';


const TableList: React.FC = () => {
  const [baseInfo, setBaseInfo] = useState([
    {title: '首页视频地址', key: 'video', vlaue: ''},
    {title: '官方群头像', key: 'groupPhoto', vlaue: ''},
    {title: '官方群名称', key: 'groupName', vlaue: ''},
    {title: '官方群号', key: 'groupNum', vlaue: ''},
    {title: '官方群二维码', key: 'officialGroup', vlaue: ''},
    {title: '人民币转账', key: 'rmbTransfer', vlaue: '', swith: true},
    {title: '每日签到奖励金', key: 'signInMoney', vlaue: '', type: 'number'},
    {title: '推荐赠送金', key: 'recommend', vlaue: '', type: 'number'},
    {title: '注册赠送金', key: 'register', vlaue: '', type: 'number'},
    // {title: '团队冻结天数', key: 'groupFreezeDay', vlaue: ''},
    // {title: '团队冻结比例', key: 'groupFreezeRatio', vlaue: ''},
    {title: '团队第一层奖励', key: 'groupOne', vlaue: '', type: 'number'},
    {title: '团队第二层奖励', key: 'groupTwo', vlaue: '', type: 'number'},
    {title: '团队第三层奖励', key: 'groupThree', vlaue: '', type: 'number'},
    {title: 'id', key: 'id', hide: true, value: ''},
    {title: '分红比例', key: 'equityBonus', value: '', type: 'number'},
    {title: '兑换规则', key: 'exchange', value: ''},
    {title: '教程', key: 'course', vlaue: '', hide: true},
    {title: '推广规则', key: 'expandRule', vlaue: '', hide: true},
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
    const hide = message.loading(`正在更新`, 50);
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
    <PageContainer subTitle='图片或者是视频文件请上传文件后将链接填入'>
      <div className={styles.form}>
        {
          baseInfo.map(item => {
            return !item.hide ? <div className={styles.formItem} key={item.key}>
            <div className={styles.label}>{item.title}</div>
              {
                item.swith ? <Switch checked={item.value} onChange={(value) => handleChange(value, item.key)} /> : <Input value={item.value} type={item.type || 'text'} onChange={(e) => handleChange(e.target.value, item.key)} placeholder={`请输入${item.title}`}/>
              }
          </div> : null
          })
        }
      </div>
      <div className='tuiguang'>
        <h2>教程</h2>
        <WangEditor description={baseInfo[baseInfo.length - 2].value || ''} onChange={(e) => handleChange(e, baseInfo[baseInfo.length - 2].key || '')}/>
      </div>
      {/* <div className='tuiguang'>
        <h2>推广规则</h2>
        <WangEditor description={baseInfo[baseInfo.length - 1].value || ''} onChange={(e) => handleChange(e, baseInfo[baseInfo.length - 1].key || '')}/>
      </div> */}
      <div className={styles.submit}>
        <Button type='primary' size='large' loading={loading} onClick={() => handleOk()} style={{marginRight: '30px'}}>确定</Button>
        <Button type='default' size='large' loading={loading} onClick={() => initData()}>重置</Button>
      </div>
    </PageContainer>
  );
};

export default TableList;
