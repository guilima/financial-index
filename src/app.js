import AppFilter from 'components/filter/app-filter.vue';
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

function pctIbovespaCalc(val, valNext, ibovespaLast) {
  val = Number(val),
  valNext = (typeof valNext != 'undefined') ? Number(valNext.valor) : ibovespaLast;
  var percentage = (- ((valNext * 100) / val) + 100).toFixed(2);
  return `${percentage}%<br>(${val})`;
}

function valore(values) {
  var dataService = JSON.parse(values),
      ibovespaLastMonth = Number(dataService[1]),
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
  vm.series = seriesByDate(series);

  function seriesByDate(series) {
    var reOrders = [],
        dates = series[0].item.map((item, index) => item.data);

    dates.forEach((date, index) => {
      reOrders[index] = [];
      reOrders[index].push(date);
      series.forEach(serie => {
        if(serie.item[index].valor) {
          if (serie.ID == 7845) {
            serie.item[index].valor = pctIbovespaCalc(serie.item[index].valor, serie.item[index + 1], ibovespaLastMonth);
          } else {
            serie.item[index].valor = `${serie.item[index].valor}%`;
          }
        } else {
          serie.item[index].valor = '-';
        }
        reOrders[index].push(serie.item[index].valor);
      });
    });
    return reOrders;
  }
}
