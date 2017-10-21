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
      @click="$emit('update', formattedDate(dateInitial), formattedDate(dateEnd))">
      Atualizar data
    </button>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
export default {
  data: () => ({
    dateInitial: '',
    dateEnd: ''
  }),
  props: {
    isLoading: Boolean
  },
  components: {
    Datepicker
  },
  methods: {
    formattedDate: function (date) {
      // dd/mm/yyyy
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
  },
  computed: {
    isDisabled: function () {
      // evaluate whatever you need to determine disabled here...
      if(!this.dateInitial || !this.dateEnd)
        return true;
      if (/^([1-2][0-9]|3[0-1]|0[1-9]|\d)\/(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2})$/.test(this.formattedDate(this.dateInitial)) &&
        /^([1-2][0-9]|3[0-1]|0[1-9]|\d)\/(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2})$/.test(this.formattedDate(this.dateEnd)) &&
        this.formattedDate(this.dateEnd).split('/').reverse().join('') > this.formattedDate(this.dateInitial).split('/').reverse().join('') &&
        this.dateEnd.getFullYear() <= new Date().getFullYear()) {

        return false;
      } else {

        return true;
      }
    },

  }
};
</script>
