
import Vue from 'vue';
const EventBus = new Vue();
export default EventBus;
import CreateChart from 'components/chart/echart.js';
import FilterDates from 'components/filter/filter-dates.vue';
import FilterSeries from 'components/filter/filter-series.vue';
import valuesService from 'services/valueSeries';

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
        .then(getValuesSeriesSuccess)
        .catch(function (err) {
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
  return value ? `${value.toFixed(2)}%` : '-';
}

function getValuesSeriesSuccess(response) {
  const financialIndexes = response.data;
  const dates = financialIndexes[0].series.map(serie => {
    const [year, month] = serie.date.split("-");
    return `${month}/${year}`;
  });
  vm.names = financialIndexes.map(financialIndex => financialIndex.name);
  vm.series = dates.map((date, index) =>
    [date, ...financialIndexes.map( financialIndex => numberAddPercentage(financialIndex.series[index].value) )]
  );

  CreateChart(financialIndexes, dates, numberAddPercentage);
}
