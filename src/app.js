import FilterDate from './components/filter/date.vue';
import valuesService from './services/valueSeries';
import Vue from 'vue';

var vm = new Vue({
  el: '#app-4',
  data: {
    names: [],
    series: [],
    loading: true
  },
  components: {
    FilterDate
  },
  methods: {
    getValues() {
      valuesService.getValuesSeriesService()
        .then(function (values) {
          valore(values);
          console.log('Success');
        }).catch(function (err) {
          console.error('Augh, there was an error!', err);
        }).then(function () {
          vm.loading = false;
        });
    },
    postValues(body) {
      this.loading = true;
      valuesService.postValuesSeriesService(body)
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

function valoresSeriesService(method, body = null) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, 'https://fintech-bcb.herokuapp.com/users/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.withCredentials = false;

    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr);
    if (body) body = JSON.stringify(body);
    xhr.send(body);
  });
}

function pctIbovespaCalc(val, valNext, ibovespaLast) {
  val = Number(val),
    valNext = (typeof valNext != 'undefined') ? Number(valNext.valor) : ibovespaLast;
  var percentage = (- ((valNext * 100) / val) + 100).toFixed(2);
  return `${percentage}%<br>(${val})`;
}

function valore(values) {
  var dataService = JSON.parse(values),
    ibovespaLastMonth = Number(dataService[1]),
    series = dataService[0].serie,
    dates = series[0].item.map((item, index) => item.data);
  console.log(dataService);
  var seriesByDate = function () {
    var reOrders = [];
    dates.forEach((date, index) => {
      reOrders[index] = [];
      reOrders[index].push(date);
      series.forEach(serie => {
        if (serie.ID == 7845) {
          serie.item[index].valor = pctIbovespaCalc(serie.item[index].valor, serie.item[index + 1], ibovespaLastMonth);
        } else {
          serie.item[index].valor = `${serie.item[index].valor}%`;
        }
        reOrders[index].push(serie.item[index].valor);
      });
    });
    return reOrders;
  };

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
  vm.series = seriesByDate();
}
