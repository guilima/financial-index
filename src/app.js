import AppFilter from 'components/filter/app-filter.vue';
import valuesService from 'services/valueSeries';
import Vue from 'vue';
import echarts from 'echarts/dist/echarts.common.js';

var vm = new Vue({
  el: '#app-4',
  data: {
    names: [],
    series: [],
    loading: true
  },
  components: {
    AppFilter
  },
  methods: {
    getValues(dateInitial, dateEnd) {
      this.loading = true;
      valuesService.getValuesSeriesService(dateInitial, dateEnd)
        .then(function (values) {
          valore(values);
          console.log('Success');
        }).catch(function (err) {
          console.error('Augh, there was an error!', err);
        }).then(function () {
          vm.loading = false;
        });
    }
  },
  mounted: function () { this.getValues(); },
});

function ibovespaToPercentage(val, valNext) {
  var percentage = (- ((valNext * 100) / val) + 100).toFixed(2);
  return percentage;
}

function numberFormatter (value) {
  if(!isFinite(value) || value == 0) return '-';
  return `${value}%`;
}

function seriesByDate(series, ibovespaLastMonth) {
  var reOrders = [],
      allDates = series[0].item.map((item, index) => item.data);

  allDates.forEach((date, index) => {
    reOrders[index] = [];
    reOrders[index].push(date);
    series.forEach(serie => {
      let itemValue = Number(serie.item[index].valor);
      if (serie.ID == 7845) {
        let valNext = serie.item[index + 1] ? Number(serie.item[index + 1].valor) : Number(ibovespaLastMonth);
        let ibovespaPercentageValue = ibovespaToPercentage(itemValue, valNext);
        itemValue = numberFormatter(ibovespaPercentageValue);
      } else {
        itemValue = numberFormatter(itemValue);
      }
      reOrders[index].push(itemValue);
    });
  });
  return reOrders;
}

function createChart(series, names) {
  var dates = series.map(serie => serie[0]);
  var chartSeries = [];
  var copyNames = Vue.util.extend([], names); //ignore dates
  copyNames.unshift('dates');
  console.log(names);
  series[0].forEach((serie, i) => {
      console.log(chartSeries);
    chartSeries[i] = {
      name: copyNames[i],
      areaStyle: {normal: {}},
      type: 'line',
      data: []
    };
  });
  series.forEach((serie, i) => {
    serie.forEach((value,index) => {
      if(serie[index] === '-') {
        chartSeries[index].data.push( null );
      } else {
        chartSeries[index].data.push( Number( serie[index].replace('%','') ) );
      }
    });
  });
  chartSeries.shift();
  // based on prepared DOM, initialize echarts instance
  var myChart = echarts.init(document.getElementById('chart'));
  window.onresize = function() {
    myChart.resize();
  };
  // specify chart configuration item and data
  var option = {
    title: {
      text: ''
    },
    tooltip: {},
    legend: {
      data: chartSeries
    },
    xAxis: [{
      type : 'category',
      boundaryGap : false,
      data : dates
    }],
    yAxis : [{
      type : 'value',
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
        end: 10
      },
      {
        start: 0,
        end: 10,
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
      ibovespaLastMonth = dataService[1],
      series = dataService[0].serie;

  console.log(dataService, series);

  vm.names = series.map(serie => {
    switch (serie.ID) {
      case 4391: return 'CDI';
      case 433: return 'IPCA';
      case 189: return 'IGP-M';
      case 192: return 'INCC';
      case 7845: return 'Ibovespa';
      default: return '';
    }
  });
  vm.series = seriesByDate(series, ibovespaLastMonth);
  createChart(vm.series, vm.names);
}
