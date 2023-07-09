import { ApartmentOutlined, CloudDownloadOutlined, CloudUploadOutlined, FileAddOutlined, FileExcelOutlined } from '@ant-design/icons';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem, TableListPagination } from './data';
import {
  addRule,
  removeRule,
  rule,
  updateRule,
  autoCreateResult,
  getQuestionList,
  uploadExcelFile,
  getQudaoCode,
  updateQudao,
  getQudaoList
} from './service';
import moment from 'moment';
import { formatTime } from '@/utils';
import styles from './style.less';
import * as XLSX from 'xlsx';
import ProForm, { ProFormDateRangePicker, ProFormText, ProFormUploadDragger } from '@ant-design/pro-form';
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
  const ids: number[] = [];
  selectedRows.forEach((item) => {
    ids.push(item.id);
  });
  const res = await removeRule({ ids: ids });
  hide();
  if (res.code === 200) {
    message.success('删除成功，即将刷新');
    if (actionRef) {
      actionRef.current?.reloadAndRest?.();
    }
  }
  return true;
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem | any>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const formRef = useRef<any>();
  const autoformRef = useRef<any>();
  const [awardRuleVisible, setAwardRuleVisible] = useState(false);
  const [qudaoVisible, setQudaoVisible] = useState(false)
  const [qudao, setQudao] = useState('')
  const [loading, setLoading] = useState(false)
  const export2Excel = (id: string, name: string) => {
    const exportFileContent = document.getElementById(id)!.cloneNode(true);
    const wb = XLSX.utils.table_to_book(exportFileContent, { sheet: 'sheet1' });
    XLSX.writeFile(wb, `${name}.xlsx`);
  };
  const [allResult, setAllResult] = useState<any>([]);
  const [mubanColumns, setMubanColumns] = useState<any>([

    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '结束答题时间（格式:2023-1-1)',
      dataIndex: 'endDate',
      width: 120,
    },
  ]);
  const [columns, setColumns] = useState<any>([
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      width: 120,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '渠道号',
      dataIndex: 'qudao',
      width: 120,
    },
    {
      title: '是否完成',
      dataIndex: 'iscomplete',
      width: 120,
      valueEnum: {
        2: {
          text: '未完成',
          status: 'Processing',
        },
        1: {
          text: '已完成',
          status: 'Success',
        }
      },
    },
    {
      title: '开始答题时间',
      dataIndex: 'startDate',
      width: 140,
      hideInSearch: true,
      sorter: (a: any, b: any) => a.startTime * 1 - b.startTime * 1,
    },
    {
      title: '结束答题时间',
      dataIndex: 'endDate',
      width: 140,
      hideInSearch: true,
      sorter: (a: any, b: any) => a.endTime * 1 - b.endTime * 1,
    },
    {
      title: '答题时长',
      dataIndex: 'useDate',
      width: 120,
      hideInSearch: true,
      sorter: (a: any, b: any) => a.useTime * 1 - b.useTime * 1,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      hideInDescriptions: true,
      render: (_, record: any) => [
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
  ]);
  const addNewNotice = () => {
    setCurrentRow(Object.assign({}, {}));
    handleModalVisible(true);
    formRef?.current?.resetFields();
    setLoading(false)
  };

  const onFinish = async (values: any) => {
    if (loading) {
      return
    }
    setLoading(true)
    console.log(values)
    const hide = message.loading(`正在${currentRow?.id ? '更新' : '新增'}`, 50);
    try {
      const res = await addRule(currentRow);
      setLoading(false)
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
    const newRow = Object.assign({}, currentRow);
    newRow[attar] = value;
    setCurrentRow(newRow);
  };
  // 上传Excel文件
  const uploadExcel = () => {
    const inputChoose = document.createElement('input');
    inputChoose.type = 'file';
    inputChoose.accept = '*';
    inputChoose.click();
    inputChoose.addEventListener('change', (event) => {
      const hide = message.loading('上传中...', 50);
      const selectedFile = (event?.target as any)?.files[0];
      // 处理选择的文件，可以进行上传操作等
      const formData = new FormData();
      formData.append('file', selectedFile);
      uploadExcelFile(formData).then((res) => {
        hide();
        if (res.code === 200) {
        } else {
          message.error(res.msg);
        }
      });
      // 在此处执行需要对文件进行处理的逻辑
    });
  };

  const autoCreate = () => {
    setAwardRuleVisible(true);
    autoformRef?.current?.resetFields();
    setLoading(false)
  };

  const onAutoFinish = async (values: any) => {
    if (loading) {
      return
    }
    const result: any[] = []
    allResult.forEach((item: any) => {
      result.push({
        id: item.id,
        oplength: item.oplength,
        type: item.type,
        pro: item.pro,
        relateId: item.relateId,
      })
    })
    setLoading(true)
    const hide = message.loading('正在生成中', 50);
    autoCreateResult({...values, result: result}).then((res) => {
      hide();
      setLoading(false)
      if (res.code === 200) {
        message.success(`已自动生成${values.amount}条数据！`);
        setAwardRuleVisible(false);
        actionRef.current?.reloadAndRest?.();
      } else {
        message.error(res.msg)
      }
    }).catch((error) => {
      hide();
      setLoading(false)
      console.error(error)
    })
  };
  const listStyle = ['A','B','C','D','E','F','G','H','I','J','K','L']
  const showQudaoModal = () => {
    setQudaoVisible(true)
    getQudaoCode({}).then(res => {
      if (res.code === 200) {
        setQudao(res.data?.name)
      } else {
        message.error(res.msg)
      }
    })
  }
  const updateQudaoCode  = () => {
    if (loading) {
      return
    }
    const hide = message.loading('正在修改中', 50)
    setLoading(true)
    updateQudao({qudao}).then(res => {
      hide()
      setLoading(false)
      if (res.code === 200) {
        setQudaoVisible(false)
      } else {
        message.error(res.msg)
      }
    }).catch(() => {
      hide()
    })
  }

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        dateFormatter="string"
        pagination={{
          current: 1,
        }}
        scroll={{
          x: 1500,
          y: document?.body?.clientHeight - 470
        }}
        toolBarRender={() => [
          <Button type="primary" key="pilang" onClick={() => autoCreate()}>
            <FileAddOutlined />
            自动生成
          </Button>,
          // <Button type="link" key="addnew" onClick={() => addNewNotice()}>
          //   <CloudUploadOutlined />
          //   导入数据
          // </Button>,
          <Button
            type="ghost"
            key="daochu"
            onClick={() => export2Excel('dataMangeList', '数据详情')}
          >
            <FileExcelOutlined />
            导出Excel
          </Button>,
          <Button
          type="default"
          key="qudao"
          onClick={() => showQudaoModal()}
        >
          <ApartmentOutlined />
          指定H5填写渠道号
        </Button>
        ]}
        request={async (params: TableListPagination) => {
          let questionList: any[] = [];
          let front: any[] = [];
          let end: any = '';
          if (!allResult.length) {
            const result: any = await getQuestionList({ pageNum: 1, pageSize: 50 });
            questionList = result?.data?.list;
            setAllResult(questionList);
          }
          const obj = {}
          const qdlst = await getQudaoList({})
          if (qdlst.code === 200) {
            const list = qdlst.data.list
            list.forEach((item: any) => {
              if (item.title) {
                obj[item.title] = {
                  text: item.title
                }
              }
            })
          }
          front = columns.splice(0, columns.length - 1);
          end = columns[columns.length - 1];

          const res: any = await rule({
            ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
          });
          const list = res?.data?.list || [];
          try {
            list.map((clist: any, cindex: number) => {
              const chooselist = clist.choose.split('||');
              const qslist = clist.qs.split('||');
              qslist.forEach((q: any, cqindex: number) => {
                const cqlist = (questionList.length ? questionList : allResult).find(
                  (element: any) => element.id == q,
                );
                const title: string = cqlist?.qs;
                const dataArray = cqlist?.options?.split('||') || [''];
                const choose: string[] = [];
                if (chooselist[cqindex]) {
                  chooselist[cqindex].split(',').forEach((cchoose: any) => {
                    choose.push(`${listStyle[cchoose * 1]}.${dataArray[Number(cchoose)]}`);
                  });
                }
                const dataIndex = choose.join(',');
                clist[title] = dataIndex;
                clist.startDate = moment(new Date(clist.startTime)).format(
                  'YYYY-MM-DD HH:mm:ss',
                );
                clist.endDate = moment(new Date(clist.endTime)).format('YYYY-MM-DD HH:mm:ss');
                clist.useTime = (clist.endTime - clist.startTime) / 1000
                clist.useDate = formatTime((clist.endTime - clist.startTime) / 1000);

                if (cindex === 0 && !allResult.length) {
                  front.push({
                    title: title,
                    dataIndex: title,
                    width: 250,
                    hideInSearch: true,
                  });
                }
              });
            });
            const column = front.concat(end);
            column.map((item, cindex) => {
              if (item.dataIndex == 'qudao') {
                column[cindex] =  {
                  title: '渠道号',
                  dataIndex: 'qudao',
                  width: 120,
                  valueEnum: obj,
                }
              }
            })
            setColumns(column);
          } catch (error) {
            console.error(error);
          }
          return {
            data: list,
            page: res?.data?.pageNum,
            success: true,
            total: res?.data?.totalSize,
          };
        }}
        id="dataMangeList"
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
      <ProTable
        locale={{ emptyText: '请填入基本信息数据' }}
        columns={mubanColumns}
        search={false}
        id="datamanageListMuban"
        style={{ display: 'none' }}
      />

      <Modal
        title={'Excel数据上传'}
        visible={createModalVisible}
        width={800}
        onCancel={() => handleModalVisible(false)}
        footer={null}
      >
        <div className={styles.inPortContainer}>
          <div className={styles.title}>1、请按照模版格式填写需要导入的数据</div>
          <Button
            type="primary"
            size="middle"
            onClick={() => export2Excel('datamanageListMuban', '导入模板')}
          >
            <CloudDownloadOutlined />
            下载Excel模板
          </Button>
          <div className={styles.title}>2、上传Excel文件</div>

          <ProForm
            style={{ margin: 'auto', marginTop: 12 }}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            formRef={formRef}
            submitter={{
              // 自定义提交按钮
              render: (_, dom) => {
                return (
                  <div style={{textAlign: 'center'}}>
                    <Button type="primary" htmlType="submit" style={{marginRight: '12px'}}>
                      立即上传
                    </Button>
                    <Button type="default" htmlType="reset">
                      重置
                    </Button>
                  </div>
                );
              },
            }}
            encType="application/json; charset=UTF-8"
          >
            <ProFormDateRangePicker
              width="md"
              name={['time']}
              label="问卷开始结束时间"
              dataFormat="YYYY-MM-DD HH:mm:ss"
            />

            <div className={styles.upContent}>
              <div className={styles.left}>
                <ProFormUploadDragger
                  name="file"
                  title="单击或拖动文件到此区域进行上传"
                  description={'请选择xls、xlsx、csv格式文件'}
                  max={1}
                  fieldProps={{
                    accept: '.xlsx,.csv,.xls',
                    multiple: false,
                    beforeUpload: () => {
                      return false;
                    },
                  }}
                />
              </div>
              <div className={styles.rule}>
                <p>文件导入规范：</p>
                <p>1. 支持xls、xlsx、csv格式</p>
                <p>2. 数据请勿放在合并的单元格中</p>
                <p>3. 文件大小不超过4MB</p>
                <p>4. 文件所含数据行数不超过10000，若超过可拆分多次上传</p>
                <p>5. 文件所含数据列数不超过50</p>
                <p>6. 只需要填入基本信息，若为空则随机填充数据</p>
                <p>7. 需填写问卷起始时间，生成的数据将在这个范围之内</p>
              </div>
            </div>
          </ProForm>
          {/* <div className={styles.upContent}>
              <div className={styles.left} onClick={() => uploadExcel()}>
                点击添加文件
              </div>
              <div className={styles.rule}>
                <p>文件导入规范：</p>
                <p>1. 支持xls、xlsx格式</p>
                <p>2. 数据请勿放在合并的单元格中</p>
                <p>3. 文件大小不超过4MB</p>
                <p>4. 文件所含数据行数不超过10000，若超过可拆分多次上传</p>
                <p>5. 文件所含数据列数不超过50</p>
                <p>6. 只需要填入基本信息，若为空则随机填充数据</p>
                <p>7. 需填写问卷起始时间，生成的数据将在这个范围之内</p>
              </div>
            </div> */}
        </div>
      </Modal>
      <Modal 
        title='设置H5填写问卷所属渠道号' 
        width={600} 
        visible={qudaoVisible}
        onOk={() => updateQudaoCode()}
        onCancel={() => setQudaoVisible(false)}>
         <ProForm formRef={formRef} submitter={false}>
          <Form.Item label="渠道号">
            <Input value={qudao} onChange={(e) => setQudao(e.target.value)} placeholder='请输入渠道号'/>
          </Form.Item>
        </ProForm>
        
      </Modal>
      <Modal
        title="自动生成"
        width={600}
        visible={awardRuleVisible}
        onCancel={() => setAwardRuleVisible(false)}
        footer={null}
      >
          <ProForm
            style={{ margin: 'auto', marginTop: 12 }}
            name="basic"
            layout="vertical"
            onFinish={onAutoFinish}
            formRef={autoformRef}
            submitter={{
              // 自定义提交按钮
              render: (_, dom) => {
                return (
                  <div style={{textAlign: 'center'}}>
                    <Button type="primary" htmlType="submit" style={{marginRight: '12px'}}>
                      立即生成
                    </Button>
                    <Button type="default" htmlType="reset">
                      重置
                    </Button>
                  </div>
                );
              },
            }}
            encType="application/json; charset=UTF-8"
          >
          
          <ProForm.Group>
          <ProFormDateRangePicker
              width="xl"
              name={['time']}
              label="问卷开始结束时间"
              dataFormat="YYYY-MM-DD HH:mm:ss"
              rules={[{ required: true, message: '请输入问卷开始结束时间' }]}
            />
            <ProFormText
              width="xl"
              name="qudao"
              label="渠道号"
              placeholder="请输入渠道号"
              rules={[{ required: true, message: '请输入渠道号' }]}
            />
            <ProFormText
              width="xl"
              name="amount"
              label="生成数量"
              placeholder="请输入数量"
              rules={[{ required: true, message: '请输入数量' }]}
            />
          </ProForm.Group>
          </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default TableList;
