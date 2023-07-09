import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { getQuestionAndResult } from './service';
import { Pie, measureTextWidth, Column, Line } from '@ant-design/plots';
import styles from './style.less';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Radio } from 'antd';

const TableList: React.FC = () => {
  const [questionAndResult, setQuestionAndResult] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chartList = [
    {title: '饼图', icon: <PieChartOutlined />},
    {title: '柱状图', icon: <BarChartOutlined />},
    {title: '折线图', icon: <LineChartOutlined />},
  ]
  const [chartIndex, setChartIndex] = useState(0)
  useEffect(() => {
    getQuestionAndResult().then((res) => {
      if (res.code === 200) {
        const { questionList, resultList } = res.data;
        questionList.map((item: any, index: number) => {
          item.total = resultList.length;
          const peiObj: any = [];
          item.options.split('||').map((option: string) => {
            peiObj.push({
              type: option,
              value: 0,
            });
          });
          resultList.map((result: any) => {
            const chooseArray = result.choose.split('||')[index].split(',');
            chooseArray.map((chooose: any) => {
              const cindex = chooose * 1;
              if (!isNaN(cindex)) {
                if (peiObj[cindex]) {
                  peiObj[cindex].value += 1;
                }
              }
            });
          });
          item.peiObj = peiObj;
        });
        setQuestionAndResult(questionList);
      }
    });
  }, []);
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
  const lineChartConfig = {
    data: [],
    xField: 'type',
    yField: 'value',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };
  const barCharConfig = {
    data: [],
    xField: 'type',
    yField: 'value',
    columnWidthRatio: 0.8,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };
  const pieconfig = {
    appendPadding: 10,
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
            fontSize: 15,
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

  const chartListOption = (data: any) => {
    const list = [
      <Pie {...pieconfig} {...{data: data}}/>,
      <Column {...barCharConfig} {...{data: data}}/>,
      <Line {...lineChartConfig} {...{data: data}}/>,
    ]
    return list[chartIndex]
  }
  return (
    <PageContainer>
      <div className={styles.main}>
        {questionAndResult.length ? (
          <>
            <div className={styles.tabs}>
              {questionAndResult.map((item: any, index: number) => {
                return (
                  <div
                    className={`${styles.tab} 
                ${currentIndex === index ? styles.tabActive : ''}`}
                    key={item.qs}
                    onClick={() => {
                      setCurrentIndex(index);
                    }}
                  >
                    第{index + 1}题
                  </div>
                );
              })}
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{currentIndex + 1}.{questionAndResult[currentIndex].qs}</div>
              <div className={styles.options}>
                {
                  questionAndResult[currentIndex].peiObj.map((item: any) => {
                    return <div className={styles.optioin} key={item.type}>
                    <div className={styles.left}>{item.type}</div>
                    <div className={styles.right}>
                      <span>数量：{item.value}</span>
                      <span>占比：{Math.round(item.value / questionAndResult[currentIndex].total * 100)}%</span>
                    </div>
                    <div className={styles.progress} style={{width: `${Math.round(item.value / questionAndResult[currentIndex].total * 100)}%`}} />
                  </div>
                  })
                }
              </div>
              <div className={styles.chartDom}>
                  <Radio.Group value={chartIndex} buttonStyle="solid" onChange={(e) => setChartIndex(e.target.value)}>
                    {
                      chartList.map((item, index) => {
                        return <Radio.Button value={index}>{item.icon}{item.title}</Radio.Button>
                      })
                    }
                  </Radio.Group>
                  <div className={styles.chart}>
                    {
                      chartListOption(questionAndResult[currentIndex].peiObj)
                    }
                  </div>
              </div>
            </div>
          </>
        ) : (
          <PageLoading></PageLoading>
        )}
      </div>
    </PageContainer>
  );
};

export default TableList;
