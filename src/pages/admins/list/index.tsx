import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Avatar, Button, Form, Input, message, Modal, Popconfirm, Switch } from 'antd';
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
      hideInTable: true,
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '昵称',
      dataIndex: 'name',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (_, record) => {
        return (
          <Avatar src={record.avatar || 'http://127.0.0.1:8888/avatar.png'} size={50} />
        );
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastlogin',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   hideInDescriptions: true,
    //   render: (_, record) => [
    //     <a
    //       key="update"
    //       onClick={() => {
    //         setCurrentRow(record);
    //         handleUpdateModalVisible(true);
    //       }}
    //     >
    //       修改
    //     </a>,
    //     <Popconfirm
    //       title="确认删除？"
    //       onConfirm={async () => {
    //         await handleRemove(record.id);
    //       }}
    //       key="delete"
    //     >
    //       <a style={{ color: 'red' }} key="delete">
    //         删除
    //       </a>
    //     </Popconfirm>,
    //   ],
    // },
  ];

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
                pathname: '/admins/add',
              }}
              style={{ color: '#fff' }}
            >
              新增管理员
            </Link>
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
          (res?.data?.list || []).map((item: any) => {
            
          })
          return {
            data: res?.data?.list || [],
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
            const qs = formRef?.current?.getFieldValue('qs');
            const type = formRef?.current?.getFieldValue('type');
            const options = formRef?.current?.getFieldValue('options');
            const value = { qs, type, options };

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
