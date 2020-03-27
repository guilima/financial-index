import echarts from 'echarts/dist/echarts.common.js';

export default function CreateChart(financialIndexes, dates, numberAddPercentage) {
  const getColorBySerie = (serie) => ({
    'CDI': '#A75A4C',
    'IPCA': '#E6B8D5',
    'IGP-M': '#E8875F',
    'INCC': '#BC9440',
    'Ibovespa': '#5A87A5',
    'Ouro': '#FEE08B',
    'Poupança': '#4C9D6E',
    'SELIC': '#FFFFBF'
  }[serie] || '#8E7298');
  const chartSeries = financialIndexes.map(financialIndex => {
    return {
      name: financialIndex.name,
      icon: 'circle',
      type: 'line',
      "itemStyle": {
        "normal": {
          "color": getColorBySerie(financialIndex.name)
        }
      },
      data: financialIndex.series
    }
  });
  // based on prepared DOM, initialize echarts instance
  const myChart = echarts.init((document.getElementById('chart')));
  window.onresize = function () {
    myChart.resize();
  };
  // specify chart configuration item and data
  const option = {
    series: chartSeries,
    legend: {
      data: chartSeries
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params, ticket, callback) {
        let formattedText = params.sort((a, b) => {
          const { value: aValue } = a.data;
          const { value: bValue } = b.data;
          return (aValue === null) - (bValue === null) || -(aValue > bValue) || +(aValue < bValue);
        })
          .map(param =>
            `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${param.color};"></span>${param.seriesName}: ${numberAddPercentage(param.data.value)}`
          );
        return `${params[0].name}<br>${formattedText.join('<br>')}`;
      }
    },
    title: {
      text: ''
    },
    grid: {
      height: '70%',
      show: true,
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    xAxis: [{
      type: 'category',
      name: 'Datas',
      nameLocation: 'middle',
      nameGap: 30,
      boundaryGap: false,
      inverse: true,
      data: dates
    }],
    yAxis: [{
      type: 'value',
      name: 'Variações dos Índices',
      nameGap: 45,
      nameLocation: 'middle',
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        formatter: '{value}%'
      }
    }],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }
    ]
  };

  // use configuration item and data specified to show chart
  myChart.setOption(option, true);
};