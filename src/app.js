
import Vue from 'vue';
const EventBus = new Vue();
export default EventBus;
import FilterDates from 'components/filter/filter-dates.vue';
import FilterSeries from 'components/filter/filter-series.vue';
import valuesService from 'services/valueSeries';

import echarts from 'echarts/dist/echarts.common.js';

var vm = new Vue({
  el: '#app',
  data: {
    names: [],
    series: [],
    loading: true
  },
  components: {
    FilterDates,
    FilterSeries
  },
  methods: {
    getValuesSeries(dateInitial, dateEnd, series) {
      const componentTable = document.querySelector('.table-component');
      const elemTable = componentTable.children.item(1);
      componentTable.style.height = elemTable > 100 ? `${elemTable.offsetHeight}px` : '366px';
      this.loading = true;
      valuesService.getValuesSeriesService(dateInitial, dateEnd, JSON.stringify(series))
        .then(function (values) {
          const series = JSON.parse(values)[0].serie;

          vm.names = series.map(serie => {
            switch (serie.ID) {
              case 4391: return 'CDI';
              case 433: return 'IPCA';
              case 189: return 'IGP-M';
              case 192: return 'INCC';
              case 7832: return 'Ibovespa';
              case 7830: return 'Ouro';
              case 196: return 'Poupança';
              case 4390: return 'SELIC';
              default: return '';
            }
          });
          vm.series = seriesByDate(series);
          createChart(vm.series, vm.names);
          console.log('Success');
        }).catch(function (err) {
          console.error('Augh, there was an error!', err);
        }).then(function () {
          componentTable.removeAttribute("style");
          vm.loading = false;
        });
    }
  },
  mounted: function () { 
    const [lmonth, lday, lyear] = new Date(new Date().setMonth(new Date().getMonth() - 6)).toLocaleString('en-US', {"year":"numeric",'month':"2-digit",'day': "2-digit"}).split("/");
    const [month, day, year] = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('en-US', {"year":"numeric",'month':"2-digit",'day': "2-digit"}).split("/");
    this.getValuesSeries(`${lyear}-${lmonth}-${lday}`, `${year}-${month}-${day}`, [4391,433,189,192,7832]);
  },
});

function numberAddPercentage (value) {
  return value ? `${value}%` : '-';
}

function seriesByDate(series) {
  var allDates = series[0].item.map(item => item.data);
  return allDates.map((date, index) =>
    [date, ...series.map( serie => numberAddPercentage(serie.item[index].valor) )]
  );
}

function createChart(series, names) {
  const dates = series.map(serie => serie[0]);
  const colors = {
    'CDI': '#A75A4C',
    'IPCA': '#E6B8D5',
    'IGP-M': '#E8875F',
    'INCC': '#BC9440',
    'Ibovespa': '#5A87A5',
    'Ouro': '#FEE08B',
    'Poupança': '#4C9D6E',
    'SELIC': '#FFFFBF',
    'default': '#8E7298'
  };
  const chartSeries = names.map((name, i) => {
    return {
      name: name,
      icon: 'circle',
      type: 'line',
      "itemStyle": {
        "normal": {
            "color": colors[name] || colors.default
        }
      },
      data: series.map(serie => serie[i + 1] === '-' ?
        null
        : Number( serie[i + 1].replace('%','') ).toFixed(2))
    }
  });

  // based on prepared DOM, initialize echarts instance
  const myChart = echarts.init( ( document.getElementById('chart') ) );
  window.onresize = function() {
    myChart.resize();
  };
  // specify chart configuration item and data
  let option = {
    title: {
      text: ''
    },
    grid: {
      height: '70%',
      show: true,
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          let formattedText = params.sort((a, b) => b.data - a.data).map(param =>
            `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${param.color};"></span>${param.seriesName}: ${numberAddPercentage(param.data)}`
          );
          return `${params[0].name}<br>${formattedText.join('<br>')}`;
        }
    },
    legend: {
      data: chartSeries
    },
    xAxis: [{
      type : 'category',
      name: 'Datas',
      nameLocation: 'middle',
      nameGap: 30,
      boundaryGap : false,
      inverse:  true,
      data : dates
    }],
    yAxis : [{
      type : 'value',
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
    ],
    series: chartSeries
  };

  // use configuration item and data specified to show chart
  myChart.setOption(option, true);
}
