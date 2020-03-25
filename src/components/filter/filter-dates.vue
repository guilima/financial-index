<template>
  <div>
    <datepicker
      v-model="dateInitial"
      :format="'dd/MM/yyyy'"
      :name="'Inicio'"
      :language="'pt-br'"
      placeholder="dd/mm/aaaa"
      wrapper-class="ui labeled input"
      :disabled="{to: new Date(1973, 0, 5), from: new Date()}">
    </datepicker>
    <datepicker
      @keyup="dateEnd = new Date()"
      v-model="dateEnd"
      :format="'dd/MM/yyyy'"
      :name="'Final'"
      :language="'pt-br'"
      placeholder="dd/mm/aaaa"
      wrapper-class="ui labeled input"
      :disabled="{to: dateInitial ? new Date(dateInitial) : new Date(1973, 0, 5), from: new Date()}">
    </datepicker>
    <button class="ui primary button"
      type="button"
      :disabled="isDisabled || isLoading"
      v-on:click="senDate()">
      Atualizar data
    </button>
  </div>
</template>

<script>
import styles from '../../styles.module.css';
import EventBus from 'app';
import Datepicker from 'vuejs-datepicker';
export default {
  data: () => ({
    dateInitial: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    dateEnd: new Date(new Date().setMonth(new Date().getMonth() - 1))
  }),
  props: {
    isLoading: Boolean
  },
  components: {
    Datepicker
  },
  methods: {
    formattedDate: function (date, type) {
      const [month, day, year] = new Date(date).toLocaleString('en-US', {"year":"numeric",'month':"2-digit",'day': "2-digit"}).split("/");
      return type == 'ISO8601' ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
    },
    senDate: function() {
      EventBus.$emit('update-dates', this.formattedDate(this.dateInitial, 'ISO8601'), this.formattedDate(this.dateEnd, 'ISO8601'));
    }
  },
  computed: {
    isDisabled: function () {
      if(!this.dateInitial || !this.dateEnd) {
        return true;
      }
      const dateInitial = this.formattedDate(this.dateInitial);
      const dateEnd = this.formattedDate(this.dateEnd);
      const isDateFormatted = (date) => /^([1-2][0-9]|3[0-1]|0[1-9]|\d)\/(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2})$/.test(date);
      const isDateEndAfterInitial = this.dateEnd.getTime() >= this.dateInitial.getTime();
      const isDateEndBeforeToday = this.dateEnd.getTime() <= new Date().getTime();

      if (isDateFormatted(dateInitial) &&
          isDateFormatted(dateEnd) &&
          isDateEndAfterInitial &&
          isDateEndBeforeToday) {
        return false;
      } else {
        return true;
      }
    },
  },
  created: function () {
    EventBus.$on('update-series', (series) =>
      this.$emit('update-financial', this.formattedDate(this.dateInitial,  'ISO8601'), this.formattedDate(this.dateEnd,  'ISO8601'), series )
    );
  },
};
</script>
