import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Popconfirm, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import { Link } from 'umi';
import type { TableListItem, TableListPagination } from './data';
import { rule, updateRule, removeRule, administerUpdate } from './service';

/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: any, currentRow?: TableListItem) => {
  const hide = message.loading('正在修改...', 50);
  try {
    await administerUpdate({
      id: currentRow?.id,
      ...fields,
    });
    hide();
    message.success('修改成功!')
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const AccountList: React.FC = () => {
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const FormItem = Form.Item;
  const formRef = useRef<any>();
  const onchangeSwitch = async (e: any, id: string) => {
    const hide = message.loading('操作中...', 50);
    const res = await updateRule({
      id: id,
      disable: e
    })
    hide()
    if (res.code === 200) {
        message.success('操作成功!');
        actionRef?.current?.reload();
    }
  }
  const handleRemove = async (id: string) => {
    const hide = message.loading('正在删除...', 50);
    try {
      const res = await removeRule({id: id});
      hide();
      if (res.code === 200) {
        message.success('删除成功!');
        actionRef?.current?.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('修改失败请重试！');
      return false;
    }
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      width: 60
    },
    {
      title: '序号',
      dataIndex: 'sort',
      width: 60
    },
    {
      title: '分类',
      dataIndex: 'fenlei',
      width: 200
    },
    {
      title: '问题',
      dataIndex: 'qs',
      width: 200
    },
    {
      title: '题型',
      dataIndex: 'typeStr',
      width: 100
    },
    {
      title: '选项',
      dataIndex: 'opstr',
      width: 500,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      hideInDescriptions: true,
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalVisible(true);
          }}
        >
          修改
        </a>,
        <Popconfirm
          title="确认删除？"
          onConfirm={async () => {
            await handleRemove(record.id);
          }}
          key="delete"
        >
          <a style={{ color: 'red' }} key="delete">
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
  const listStyle = ['A','B','C','D','E','F','G','H','I','J','K','L']

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        dateFormatter="string"
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <PlusOutlined />
            <Link
              to={{
                pathname: '/question/add',
              }}
              style={{ color: '#fff' }}
            >
              新增问题
            </Link>
          </Button>,
        ]}
        pagination={{
          current: 1
        }}
        scroll={{
          x: 1200
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
          const list = res?.data?.list || []
          list.map((item: any) => {
            let opstr = ''
            item.options.split('||').forEach((t: string, index: number) => {
              opstr += listStyle[index] + '.' + t
            })
            item.opstr = opstr
            item.typeStr = item.type === 'single' ? '单选' : '多选'
          })
          return {
            data: list,
            page: res?.data?.pageNum,
            success: true,
            total: res?.data?.totalSize,
          };
        }}
        columns={columns}
      />
      <Modal
        width={'80%'}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        title="修改问题"
        visible={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        onOk={async () => {
          if (formRef && formRef.current) {
            const sort = formRef?.current?.getFieldValue('sort');
            const qs = formRef?.current?.getFieldValue('qs');
            const type = formRef?.current?.getFieldValue('type');
            const options = formRef?.current?.getFieldValue('options');
            const fenlei = formRef?.current?.getFieldValue('fenlei');
            const oplength = options.split('||').length;
            const value = { sort: sort * 1, qs, type, options, fenlei, oplength };

            const success = await handleUpdate(value, currentRow);

            if (success) {
              handleUpdateModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
        getContainer={false}
      >
        <Form
          ref={formRef}
          name="updateuserinfo"
          initialValues={{ ...currentRow  }}
        >
           <FormItem
            name="sort"
            label="序号"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" placeholder="请输入序号" />
          </FormItem>
          <FormItem
            name="fenlei"
            label="所属分类"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" placeholder="请输入问题" />
          </FormItem>
          <FormItem
            name="qs"
            label="问题"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" placeholder="请输入问题" />
          </FormItem>
          <FormItem
            name="type"
            label="题型(single,multiple,judge)"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" placeholder="请输入题型" />
          </FormItem>
          <FormItem
            name="options"
            label="选项(以||分问题)"
            labelCol={{ span: 6 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea rows={5} placeholder="请输入选项，以||分问题" />
          </FormItem>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AccountList;
