<template>
  <div class="series-picker">
    <ul class="series list">
      <li class="serie active"
        v-for="(serie, index) in series"
        v-if="serie.active"
        :key="index"
        v-on:click="clickSerie(serie)">
        {{ serie.name }}
      </li>
      <li class="serie add"
        v-if="!hasSeriesActived()">
        adicionar +
        <ul class="list">
          <li class="serie"
            v-for="(serie, index) in series" v-if="!serie.active"
            :key="index"
            v-on:click="clickSerie(serie)">
            {{ serie.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import EventBus from 'app';
export default {
  data: () => ({
    series: [
      {
        'name': 'CDI',
        'code': 4391,
        'active': true
      },
      {
        'name': 'IPCA',
        'code': 433,
        'active': true
      },
      {
        'name': 'IGP-M',
        'code': 189,
        'active': true
      },
      {
        'name': 'INCC',
        'code': 192,
        'active': true
      },
      {
        'name': 'Ibovespa',
        'code': 7832,
        'active': true
      },
      {
        'name': 'Ouro',
        'code': 7830,
        'active': false
      },
      {
        'name': 'Poupança',
        'code': 196,
        'active': false
      },
      {
        'name': 'SELIC',
        'code': 4390,
        'active': false
      },
    ]
  }),
  methods: {
    activeSeriesCode: function () {
      return this.series.filter( serie => serie.active ).map( serie => serie.code );
    },
    clickSerie: function(serie) {
      serie.active = !serie.active;
      EventBus.$emit('update-series', this.activeSeriesCode());
    },
    hasSeriesActived: function() {
      return this.activeSeriesCode().length === this.series.length
    }
  },
  created: function () {
    EventBus.$on( 'update-dates', (startDate, endDate) =>
      this.$emit('update-financial', startDate, endDate, this.activeSeriesCode() )
    );
  }
};
</script>

<style>
  .series {
    margin: 10px -3px 0;
  }

  .list {
    list-style: none;
    padding: 0;
  }

  .series > .serie {
    display: inline-block;
    padding: 4px 16px;
    margin: 0 3px;
    border-radius: 20px;
    background-color: #eee;
  }
  .serie {
    cursor: pointer;
    user-select: none;
  }
  .serie.add {
    margin: 0;
    position: relative;
  }
  .serie.add:hover {
    border-radius: 13px 13px 0 0;
    background-color: #dcdcdc;
  }
  .serie.add > .list {
    position: absolute;
    top: 100%;
    z-index: 1;
    width: 100%;
    left: 0;
    padding-left: 16px;
    display: none;
    background-color: #dcdcdc;
    border-radius: 0 0 13px 13px;
    padding-bottom: 5px;
  }
  .serie.add:hover > .list { display: block; }

  .serie.active {
    background-color: #ffba20;
    color: #fff;
  }
  .serie.active:hover {
    background-color: #e8aa1f;
  }
</style>
