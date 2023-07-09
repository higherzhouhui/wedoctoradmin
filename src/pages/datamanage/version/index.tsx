import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Form, Input, message, Modal, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { addRule, removeRule, rule } from './service';
import ProForm from '@ant-design/pro-form';

/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[], actionRef?: any) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  selectedRows.forEach(async (row) => {
    try {
      const res = await removeRule({
        id: row.id,
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
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem | any>();
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
      hideInTable: true
    },
    {
      title: '设备',
      dataIndex: 'deviceTypeStr',
    },
    {
      title: '更新描述',
      dataIndex: 'describe',
    },
    {
      title: '下载地址',
      dataIndex: 'downUrl',
    },
    {
      title: '是否强更',
      dataIndex: 'isCompelStr',
    },
    {
      title: '版本号',
      dataIndex: 'version',
    },
    {
      title: '安装地址',
      dataIndex: 'installUrl',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      fixed: 'right',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            handleUpdateRecord(record)
          }}
        >
          修改
        </a>,
      ],
    },
  ];

  const handleOk = async () => {
    const hide = message.loading(`正在更新`);
    try {
      const res = await addRule(currentRow);
      handleModalVisible(false);
      hide();
      if (res.code === 200) {
        message.success('操作成功，即将刷新');
        if (actionRef) {
          actionRef.current?.reloadAndRest?.();
        }
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
    const newRow = currentRow
    newRow[attar] = value
    setCurrentRow(Object.assign({}, newRow))
  }

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
          x: 1400,
          y: document?.body?.clientHeight - 390,
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
          (res?.data || []).map((item: any) => {
            item.isCompelStr = item.isCompel ? '是' : '否'
            item.deviceTypeStr = item.deviceType == 1 ? '安卓' : '苹果'
          })
          return {
            data: res?.data || [],
            success: true,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <Modal
        title={`修改${currentRow?.deviceType == 1 ? '安卓版本' : '苹果版本'}`}
        visible={createModalVisible}
        onOk={() => handleOk()}
        onCancel={() => handleModalVisible(false)}
      >
        <ProForm formRef={formRef} submitter={false}>
          <Form.Item label="更新描述">
            <Input.TextArea rows={3} value={currentRow?.describe} onChange={(e) => handleChange(e.target.value, 'describe')} placeholder='请输入更新描述'/>
          </Form.Item>
          <Form.Item label="下载地址">
            <Input value={currentRow?.downUrl} onChange={(e) => handleChange(e.target.value, 'downUrl')} placeholder='请输入下载地址'/>
          </Form.Item>
          <Form.Item label="版本号">
            <Input value={currentRow?.version} onChange={(e) => handleChange(e.target.value, 'version')} placeholder='请输入版本号'/>
          </Form.Item>
          <Form.Item label="是否强更">
            <Switch checked={currentRow?.isCompel} onChange={(e) => handleChange(e, 'isCompel')} />
            {/* <Input.TextArea rows={3} value={currentRow?.describe} onChange={(e) => handleChange(e.target.value, 'describe')} placeholder='请输入更新描述'/> */}
          </Form.Item>
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default TableList;
