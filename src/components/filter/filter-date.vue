<template>
  <div class="ui labeled input">
    <label for="dateEnd" class="ui label" v-if="label" v-text="label"></label>
    <input class="mr-10" type="text" id="dateInitial"
      ref="input"
      :value="date"
      placeholder="MM/YYYY"
      @keyup="inputDate($event.target.value, $event)">
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  methods: {
    inputDate: function (date, event) {
      if (event.key !== "Backspace") {
        var itDate = date;
        if (date.match(/^(?![0-1])/)) itDate = '';
        if (date.match(/^(1[0-2]|0[1-9])/)) itDate = date.substring(0, 2) + "/" + date.substring(3, 7);
        if(itDate !== date)
          this.$refs.input.value = itDate;
      }
      this.$emit('input', itDate);
    }
  }
};
</script>
