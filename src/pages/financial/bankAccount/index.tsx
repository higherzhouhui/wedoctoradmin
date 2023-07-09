import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Form, Input, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { addRule, removeRule, rule, updateRule } from './service';
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
  const handleUpdateRecord = (record: TableListItem, type: number) => {
    const hide = message.loading('正在操作中...');
    updateRule({
      id: record.id,
      auditStatus: type
    }).then((res: any) => {
      hide();
      if (res.code === 200) {
        message.success('操作完成，即将刷新');
        actionRef.current?.reloadAndRest?.();
      }
    }).catch(() => {
      hide();
    })
    // setCurrentRow(record);
    // handleModalVisible(true);
    // formRef?.current?.resetFields();
  }
  const updateBankAccount = (row: any) => {
    setCurrentRow(Object.assign({}, row));
    handleModalVisible(true);
    formRef?.current?.resetFields();
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      className: 'idClass',
      hideInTable: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      className: 'fullClass',
    },
    {
      title: '银行名称',
      dataIndex: 'bankName',
      className: 'fullClass',
    }, {
      title: '银行卡号',
      dataIndex: 'bankCode',
      className: 'fullClass',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      className: 'fullClass',
      hideInDescriptions: true,
      render: (_, record) => [
        <a key="access" onClick={() => updateBankAccount(record)}>
           修改
        </a>
      ],
    },
  ];


  const handleOk = async () => {
    const hide = message.loading(`正在${currentRow?.id ? '更新' : '新增'}`);
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
        request={async () => {
          const res: any = await rule();
          return {
            data:[res?.data],
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
      <Modal
        title={currentRow?.id ? '修改' : '新增'}
        visible={createModalVisible}
        onOk={() => handleOk()}
        onCancel={() => handleModalVisible(false)}
      >
        <ProForm formRef={formRef} submitter={false}>
          <Form.Item label="姓名">
            <Input value={currentRow?.name} onChange={(e) => handleChange(e.target.value, 'name')}/>
          </Form.Item>
          <Form.Item label="银行名称">
            <Input value={currentRow?.bankName} onChange={(e) => handleChange(e.target.value, 'bankName')}/>
          </Form.Item>
          <Form.Item label="银行卡号">
            <Input value={currentRow?.bankCode} onChange={(e) => handleChange(e.target.value, 'bankCode')}/>
          </Form.Item>
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default TableList;
