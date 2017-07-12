<template>
  <div>
    <filter-date @dates="fetchValue"></filter-date>
    <button class="ui primary button"
      type="button"
      :disabled="isDisabled"
      @click="onChange('28/'+dateInitial,'28/'+dateEnd)">
      Atualizar data
    </button>
  </div>
</template>

<script>
import FilterDate from 'components/filter/filter-date.vue';
export default {
  data: () => ({
    dateInitial: '',
    dateEnd: ''
  }),
  props: {
    'isLoading': Boolean
  },
  components: {
    FilterDate
  },
  methods: {
    onChange (values, values2) {
      this.$emit('update', values, values2)
    },
    fetchValue(values, values2) {
      this.dateInitial = values;
      this.dateEnd = values2;
    }
  },
  computed: {
    isDisabled: function () {
      // evaluate whatever you need to determine disabled here...
      if (/^(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2})$/.test(this.dateInitial) &&
        /^(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2})$/.test(this.dateEnd) &&
        this.dateEnd.split('/').reverse().join('') > this.dateInitial.split('/').reverse().join('') &&
        this.dateEnd.split('/')[1] <= new Date().getFullYear() &&
        !this.isLoading) {

        return false;
      } else {

        return true;
      }
    }
  }
};
</script>
