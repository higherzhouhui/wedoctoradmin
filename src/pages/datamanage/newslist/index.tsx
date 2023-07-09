import { PlusOutlined } from '@ant-design/icons';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, Image, Input, message, Modal, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem, TableListPagination } from './data';
import { addRule, removeRule, rule, updateRule } from './service';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import WangEditor from '@/components/Editor';
import { request } from 'umi';
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在配置', 50);
  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[], actionRef?: any) => {
  const hide = message.loading('正在删除', 50);
  if (!selectedRows) return true;
  selectedRows.forEach(async (row) => {
    try {
      const res = await removeRule({
        id: row.id || '',
      });
      hide();
      if (res.code === 200) {
        message.success('删除成功，即将刷新');
        if (actionRef) {
          actionRef.current?.reloadAndRest?.();
        }
      }
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  });
  return true;
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>({});
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const formRef = useRef<any>()
  const handleUpdateRecord = (record: TableListItem) => {
    setCurrentRow(record);
    handleModalVisible(true);
    formRef?.current?.resetFields();
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      hideInTable: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      className: 'fullClass',
    },
    {
      title: '封面',
      dataIndex: 'image',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Image src={record.image} width={120} height={120} style={{ objectFit: 'contain' }} />
        );
      },
    },
    {
      title: '内容',
      dataIndex: 'removeTagContent',
      className: 'textAreaClass'
    },
    {
      title: '发布方',
      dataIndex: 'publisher',
      className: 'fullClass'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      className: 'fullClass'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      className: 'fullClass',
      hideInDescriptions: true,
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            handleUpdateRecord(record)
          }}
        >
          修改
        </a>,
        // eslint-disable-next-line react/jsx-key
        <Popconfirm
          title="确认删除？"
          onConfirm={async () => {
            await handleRemove([record], actionRef);
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
  const addNewNotice = () => {
    setCurrentRow({});
    handleModalVisible(true);
    formRef?.current?.resetFields();
  };
  const handleOk = async () => {
    const hide = message.loading(`正在${currentRow?.id ? '更新' : '新增'}`, 50);
    try {
      const res = await addRule(currentRow);
      handleModalVisible(false);
      hide();
      if (res.code === 200) {
        message.success('操作成功，即将刷新');
        if (actionRef) {
          actionRef.current?.reloadAndRest?.();
        }
      }
      return true;
    } catch (error) {
      hide();
      message.error('操作失败，请重试');
      return false;
    }
  };
  const handleChange = (value: any, attar: string) => {
    const newRow = currentRow || {}
    newRow[attar] = value
    setCurrentRow(Object.assign({}, newRow))
  }
  const removeHtmlTag = (content?: string) => {
    if (typeof content === 'string') {
      const reg = new RegExp('<[^>]*>', 'g');
      let tStr = content.replace(reg, '');
      tStr = tStr?.replace('&nbsp;', ''); // 过滤空格
      return tStr;
    }
    return '';
  };
  const Upload = {
    //数量
    maxCount: 1,
    accept: 'image/*',
    customRequest: (options: any) => {
      const { onSuccess, onError, file } = options;
      const formData = new FormData();
      formData.append('file', file);
      // /upload为图片上传的地址，后台只需要一个图片的path
      // name，path，status是组件上传需要的格式需要自己去拼接
      request('/upload-service/upload/uploadImage', { method: 'POST', data: formData })
        .then((data: any) => {
          const _response = { name: file.name, status: 'done', path: data.data };
          handleChange(data.data, 'image')
          //请求成功后把file赋值上去
          onSuccess(_response, file);
        })
        .catch(onError);
    },
  };

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        dateFormatter="string"
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          x: 1500,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => addNewNotice()}>
            <PlusOutlined />
            新增
          </Button>,
        ]}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
          (res?.data?.list || []).map((item: any) => {
            item.removeTagContent = removeHtmlTag(item.content)
          })
          return {
            data: res?.data?.list || [],
            page: res?.data?.pageNum,
            success: true,
            total: res?.data?.totalSize,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Popconfirm
            title="确认删除？"
            onConfirm={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            onCancel={() => {
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <Button style={{ width: '100px' }}>
              {selectedRowsState.length > 1 ? '批量删除' : '删除'}
            </Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <Modal
        title={currentRow?.id ? '修改' : '新增'}
        visible={createModalVisible}
        onOk={() => handleOk()}
        width={'80%'}
        onCancel={() => handleModalVisible(false)}
      >
        <ProForm formRef={formRef} style={{height: '650px', overflow: 'auto'}} submitter={false}>
          <ProFormUploadButton
            label="选择封面"
            max={1}
            name="image"
            fieldProps={{
              ...Upload,
            }}
          />
          <Form.Item label=''>
            <Input value={currentRow.image} onChange={(e) => handleChange(e.target.value, 'image')} placeholder='请选择封面'/>
          </Form.Item> 
          <Form.Item label='标题'>
            <Input value={currentRow?.title} onChange={(e) => handleChange(e.target.value, 'title')} placeholder='请输入标题'/>
          </Form.Item>
          <Form.Item label='来源'>
          <Input value={currentRow?.publisher} onChange={(e) => handleChange(e.target.value, 'publisher')} placeholder='请输入来源'/>
          </Form.Item>
          <Form.Item label='内容'>
            <WangEditor onChange={(e) => handleChange(e, 'content')} description={currentRow?.content}/>
          </Form.Item>
        </ProForm>
      </Modal>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>

    </PageContainer>
  );
};

export default TableList;
