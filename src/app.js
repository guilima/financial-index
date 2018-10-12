
import Vue from 'vue';
const EventBus = new Vue();
export default EventBus;
import AppFilter from 'components/filter/app-filter.vue';
import FilterSeries from 'components/filter/filter-series.vue';
import valuesService from 'services/valueSeries';

import echarts from 'echarts/dist/echarts.common.js';

var vm = new Vue({
  el: '#app-4',
  data: {
    names: [],
    series: [],
    loading: true
  },
  components: {
    AppFilter,
    FilterSeries
  },
  methods: {
    getValues2(dateInitial, dateEnd, series) {
      const componentTable = document.querySelector('.table-component');
      const elemTable = componentTable.children.item(1);
      componentTable.style.height = elemTable > 100 ? `${elemTable.offsetHeight}px` : '366px';
      this.loading = true;
      valuesService.getValuesSeriesService(dateInitial, dateEnd, JSON.stringify(series))
        .then(function (values) {
          valore(values);
          console.log('Success');
        }).catch(function (err) {
          console.error('Augh, there was an error!', err);
        }).then(function () {
          componentTable.removeAttribute("style");
          vm.loading = false;
        });
    }
  },
  mounted: function () { this.getValues2(); },
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
  var dates = series.map(serie => serie[0]);
  var chartSeries = [];
  var copyNames = Object.assign([], names); //ignore dates
  copyNames.unshift('dates');
  series[0].forEach((_, i) => {
    chartSeries[i] = {
      name: copyNames[i],
      icon: 'circle',
      type: 'line',
      data: []
    };
  });
  series.forEach((serie, i) => {
    serie.forEach((value,index) => {
      if(serie[index] === '-') {
        chartSeries[index].data.push( null );
      } else {
        chartSeries[index].data.push( Number( serie[index].replace('%','') ).toFixed(2) );
      }
    });
  });
  chartSeries.shift();
  chartSeries.push(
    {
      name: null,
      icon: 'circle',
      type: 'line',
      data: []
    },
    {
      name: null,
      icon: 'circle',
      type: 'line',
      data: []
    },
    {
      name: null,
      icon: 'circle',
      type: 'line',
      data: []
    },
    {
      name: null,
      icon: 'circle',
      type: 'line',
      data: []
    }
  );
  console.log(chartSeries);
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
    color: ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'],
    grid: {
      height: '70%',
      show: true,
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          let formattedText = params.map(param => {
            if(param.value === undefined) param.value = '-';
            return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${param.color};"></span>${param.seriesName}: ${param.value}%`;
          });
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
  myChart.setOption(option);
}

function valore(values) {
  var dataService = JSON.parse(values),
      series = dataService[0].serie;

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
}
