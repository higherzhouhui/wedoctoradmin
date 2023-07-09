import { Button, Card, Form, Input, message } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { fakeChangePwd } from './service';

import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
const FormItem = Form.Item;

const AddAccount: FC = () => {
  const [options, setOptions] = useState<string[]>(['options0'])
  const [oppro, setOppro] = useState<string[]>(['pro0'])
  const [submitting, setsubmitting]: [boolean, any] = useState(false);
  let interval: number | undefined;
  const [form] = Form.useForm();
  const handlePlus = () => {
    const theName = `options${(Math.random() * 10000000) / 100}`
    const thepro = `options${(Math.random() * 10000000) / 100}`
    options.push(theName)
    oppro.push(thepro)
    setOppro([...oppro])
    setOptions([...options])
  }
  const handleMinux = (name: string) => {
    const newOs = options.filter(item => item !== name)
    setOptions([...newOs])
  }


  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const onFinish = (values: any) => {
    let currentoptions = ''
    options.forEach((item, index) => {
      if (values[item]) {
        currentoptions += values[item]
        if (index !== options.length - 1) {
          currentoptions += '||'
        }
      }
    })
    let pingjun = 0
    let shengyu = 100
    const opproArray: any[] = []
    oppro.forEach((item, index) => {
      opproArray[index] = values[item]
      if (values[item]) {
        opproArray[index] = values[item]
        shengyu -= values[item]
      } else {
        pingjun += 1
      }
    })
    if (pingjun) {
      pingjun = Math.floor(shengyu / pingjun)
      opproArray.map((item, index) => {
        if (!item) {
          opproArray[index] = pingjun
        }
      })
    }
    const param = {
      sort: values.sort * 1,
      qs: values.question,
      type: values.type,
      oplength: options.length,
      options: currentoptions,
      relateId: values.relateId,
      fenlei: values.fenlei,
      pro: opproArray.join(','),
    };
    const hide = message.loading('正在新增问卷问题...', 50);
    setsubmitting(true);
    fakeChangePwd(param)
      .then((res: any) => {
        hide();
        setsubmitting(false);
        if (res.code === 200) {
          message.success('增加成功！')
          setOppro(['op0'])
          setOptions(['op0'])
        }
      })
      .catch(() => {
        hide();
        setsubmitting(false);
      });
  };

  return (
    <PageContainer>
      <Card bordered={false}>
        <div className={styles.main}>
          <Form form={form} name="addaccount" onFinish={onFinish}>
            <div className={styles.formContent}>
            <div><p>
              排序<i>*</i>
            </p>
            <FormItem
              name="sort"
            >
              <Input type="number" placeholder="请输入序号" />
            </FormItem></div>
           <div>
           <p>
              所属分类<i>*</i>
            </p>
            <FormItem
              name="fenlei"
            >
              <Input type="text" placeholder="请输入所属分类" />
            </FormItem>
           </div>
           <div> 
            <p>
              问题<i>*</i>
            </p>
            <FormItem
              name="question"
            >
              <Input type="text" placeholder="请输入问题" />
            </FormItem></div>
            <div>
            <p>
              题型(single,multiple,judge)<i>*</i>
            </p>
            <FormItem
              name="type"
            >
              <Input type="text" placeholder="请输入题型" />
            </FormItem>
            </div>
            <div>
            <p>
              依赖问题ID及选项
            </p>
            <FormItem
              name="relateId"
            >
              <Input type="number" placeholder="依赖问题ID及选项" />
            </FormItem>
            </div>
           {
            options.map((item, index) => {
              return <div key={item}>
               <p>
                选项{index + 1}<i>*</i>
                <Button type='primary' size='small' onClick={() => handlePlus()}><PlusCircleOutlined />增加</Button>
                {
                  options.length > 1 ? <Button type='ghost' size='small' onClick={() => handleMinux(item)}><MinusCircleOutlined />减少</Button> : null
                }
              </p>
              <FormItem
                name={item}
              >
                <Input type="text" placeholder="请输入选项" />
                
              </FormItem>

              <p>
                占比(如果所有选项都是相同概率出现，可不输入)
              </p>
            <FormItem
              name={oppro[index]}
            >
              <Input type="number" placeholder="请输入占比" />
            </FormItem>
              </div>
            })
           }
            </div>
            <FormItem style={{textAlign: 'center'}}>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
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
export default AddAccount;
