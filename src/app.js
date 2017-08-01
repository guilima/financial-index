import AppFilter from 'components/filter/app-filter.vue';
import Chartist from 'chartist';
import valuesService from 'services/valueSeries';
import Vue from 'vue';

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

function chartist(series) {
  var dates = series.map(serie => serie[0]);
  // var chartSeries = [];
  // series.forEach((serie, i) => {
  //   chartSeries[i] = [];
  //   serie.forEach((value,index) => {
  //     chartSeries[i].push(serie[index]);
  //   });
  // });
  // console.log(chartSeries);
  var data = {
    // A labels array that can contain any sort of values
    labels: dates,
    // Our series array that contains series objects or in this case series data arrays
    series: [
      [12, 9, 7, 8, 5, 5],
      [2, 1, 3.5, 7, 3, 7],
      [1, 3, 4, 5, 6, 2]
    ]
  };
  new Chartist.Line('.ct-chart', data);
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
  chartist(vm.series);
}
