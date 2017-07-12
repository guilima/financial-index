<template>
  <div class="ui labeled input">
    <label class="ui label" for="dateInitial">Inicial</label>
    <input class="mr-10" type="text" id="dateInitial" value="" v-model="dateInitial" placeholder="MM/YYYY" v-on:keyup="inputDateInitial(dateInitial, $event)">
    <label for="dateEnd" class="ui label">Final</label>
    <input class="mr-10" type="text" name="dateEnd" id="dateEnd" value="" v-model="dateEnd" placeholder="MM/YYYY" v-on:keyup="inputDateEnd(dateEnd, $event)">
  </div>
</template>

<script>
export default {
  data: () => ({
    dateInitial: '',
    dateEnd: ''
  }),
  methods: {
    inputDateInitial: function (date, event) {
      if (event.key !== "Backspace") {
        if (date.match(/^(?![0-1])/)) console.log(date);
        if (date.match(/^(1[0-2]|0[1-9])/)) this.dateInitial = date.substring(0, 2) + "/" + date.substring(3, 7);
      }
      this.groupDate;
      return this.dateInitial;
    },
    inputDateEnd: function (date, event) {
      if (event.key !== "Backspace") {
        if (date.match(/^(?![0-1])/)) this.dateEnd = "";
        if (date.match(/^(1[0-2]|0[1-9])/)) this.dateEnd = date.substring(0, 2) + "/" + date.substring(3, 7);
      }
      this.groupDate;
      return this.dateEnd;
    }
  },
  computed: {
    groupDate: function() {
      this.$emit('dates', this.dateInitial, this.dateEnd);
    }
  }
};
</script>
