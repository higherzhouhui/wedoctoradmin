import { PageContainer } from '@ant-design/pro-layout';
import { Table } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ITongji, TableListItem } from './data';
import { rule} from './service';
import { Line } from '@ant-design/charts';
import style from './style.less'
import * as XLSX from 'xlsx';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { formatTime } from '@/utils';
import moment from 'moment';

const TableList: React.FC = () => {
  const [day, setDay] = useState(7)
  const [dataSource, setDataSource] = useState<TableListItem | any>({
    count: 0,
    avgTime: 0,
    dateNumberArray: [],
    qudao: [],
    age: [],
    sex: [],
    weizi: [],
  })
  const [loading, setLoading] = useState(true)
  const itemRef = useRef<any>()
  const barRef = useRef<any>()

  const config = {
    height: 400,
    xField: 'date',
    yField: '数量',
    xAxis: {
      visible: true,
      position: 'bottom',
      label: {
        style: {
          fontSize: 12,
          fill: '#999',
        },
        formatter: (text: string) => text.replace('2023-', ''), // 使用 formatter 函数自定义刻度文本格式
      },
      line: {
        style: {
          stroke: '#EEE',
          lineWidth: 2,
        },
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  const data = [
    {
      type: '渠道1',
      value: 27,
    },
    {
      type: '渠道二',
      value: 25,
    },
    {
      type: '渠道三',
      value: 18,
    },
    {
      type: '渠道四',
      value: 15,
    },
    {
      type: '渠道五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ];
  const data2 = [
    {
      type: '20以下',
      value: 7,
    },
    {
      type: '20-30',
      value: 25,
    },
    {
      type: '30-40',
      value: 18,
    },
    {
      type: '40-50',
      value: 15,
    },
    {
      type: '50-60',
      value: 30,
    },
    {
      type: '60以上',
      value: 5,
    },
  ];

  const data3 = [
    {
      type: '男',
      value: 47,
    },
    {
      type: '女',
      value: 53,
    }
  ];

  const data4 = [
    {
      type: '未完成',
      value: 5,
    },
    {
      type: '已完成',
      value: 95,
    }
  ];


  const renderStatistic = (containerWidth: any, text: string, styles: any) => {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, styles);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
  }

  const pieconfig = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (v) => `${v} ¥`,
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: (container: any, view: any, datum: any) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : '总计';
          return renderStatistic(d, text, {
            fontSize: 22,
          });
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px',
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const total = data.reduce((r, d) => r + d.value, 0)
          const text = datum ? `${Math.round(datum.value / total * 100)} %` : `${total}`;
          return renderStatistic(width, text, {
            fontSize: 28,
          });
        },
      },
    },
    // 添加 中心统计文本 交互
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  }
  const getSummaryRow = (data: any[]) => {
    const ctotal = data.reduce((total, current) => {
      return total + Number(current.num);
    }, 0);
    // 自定义表格汇总行的内容
    const totalRow = (
      <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
        <Table.Summary.Cell index={1} className={style.ctotal}>{ctotal}</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
    );
  
    return totalRow;
  };
  const userListRow = useMemo(() => getSummaryRow(dataSource?.userList || []), [dataSource]);
  const buyProjectPriceListRow = useMemo(() => getSummaryRow(dataSource?.buyProjectPriceList || []), [dataSource]);
  const buyProjectNumListRow = useMemo(() => getSummaryRow(dataSource?.buyProjectNumList || []), [dataSource]);
  const withdrawPriceListRow = useMemo(() => getSummaryRow(dataSource?.withdrawPriceList || []), [dataSource]);

  const export2Excel = (id: string, name: string) => {
    const exportFileContent = document.getElementById(id)!.cloneNode(true);
    const wb = XLSX.utils.table_to_book(exportFileContent, { sheet: 'sheet1' });
    XLSX.writeFile(wb, `${name}.xlsx`);
  };


  const initData = () => {
    setLoading(true)
    rule({day: day}).then((res: any) => {
      if (res.code === 200) {
        res.data.dateNumberArray.map((item: any) => {
          item.date = moment(new Date(item.date)).format('MM-DD')
          item['数量'] = item.count
        })
        res.data.dateNumberArray.reverse()
        setDataSource(res.data)
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const contentDom = <div className={style.pageContent}>
    <span className={style.descibe}>回收量：</span>
    <span className={style.theNumber}>{dataSource?.count}</span>
    <span className={style.descibe}>平均完成时间：</span>
    <span className={style.theNumber}>{formatTime(dataSource?.avgTime / 1000) || '0'}</span>
  </div>
  useEffect(() => {
    initData()
  }, [day])
  return (
    <PageContainer content={contentDom}>
      <div className={style.main}>
        <div className={style.item} ref={itemRef}>
          <div className={style.topContent}>
            <div className={style.title}>每日回收数量</div>
          </div>
          {
            itemRef?.current ? <Line {...config} smooth {...{data: dataSource?.dateNumberArray, width: itemRef?.current?.clientWidth || 500}} /> : null
          }
        </div>
        <div className={style.bottom}>
          <div className={style.barChart} ref={barRef}>
            <div className={style.title}>渠道来源</div>
            {
              barRef?.current ? <Pie {...pieconfig} {...{data: dataSource?.qudao}}/> : null
            }
          </div>
          <div className={style.barChart} ref={barRef}>
            <div className={style.title}>所在城市</div>
            {
              barRef?.current ? <Pie {...pieconfig} {...{data: dataSource?.weizi}} /> : null
            }
          </div>
          <div className={style.barChart} ref={barRef}>
            <div className={style.title}>年龄分布</div>
            {
              barRef?.current ? <Pie {...pieconfig} {...{data: dataSource?.age}} /> : null
            }
          </div>
          <div className={style.barChart} ref={barRef}>
            <div className={style.title}>性别比例</div>
            {
              barRef?.current ? <Pie {...pieconfig} {...{data: dataSource?.sex}} /> : null
            }
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default TableList;
