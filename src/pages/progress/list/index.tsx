import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Image } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { rule } from './service';
const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Wings序号',
      dataIndex: 'no',
    },
    {
      title: '图片',
      dataIndex: 'path',
      hideInSearch: true,
      render: (_, record) => {
        return <Image src={record.path} width={120} />;
      },
    },
    {
      title: '提交日期',
      dataIndex: 'mint_time',
      valueType: 'dateTime',
    },
    {
      title: '用户地址',
      dataIndex: 'address',
    },
    {
      title: '翅膀NFT',
      dataIndex: 'wings_name',
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle={progress ? `已经mint翅膀数量 ${progress.current}/${progress.total}` : ''}
        actionRef={actionRef}
        rowKey="no"
        search={false}
        pagination={{
          pageSize: 10,
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
          setProgress({
            current: res?.data?.current,
            total: res?.data?.total,
          });
          res?.data?.rows.map((row: any) => {
            row.mint_time = row.mint_time * 1000;
          });
          return {
            data: res?.data?.rows || [],
            page: res?.data?.page?.pageNum,
            success: true,
            total: res?.data?.page?.total,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
