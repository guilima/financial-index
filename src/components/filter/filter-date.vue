<template>
  <div class="ui labeled input">
    <label :for="label" class="ui label" v-if="label" v-text="label"></label>
    <input class="mr-10" type="text" :id="label"
      ref="input"
      :value="date"
      placeholder="MM/YYYY"
      @keyup="updateDate($event.target.value, $event)">
  </div>
</template>

<script>
export default {
  props: ['date', 'label'],
  methods: {
    updateDate: function (date, event) {
      var formattedDate;
      if (event.key !== "Backspace") {
        if (date.match(/^(?!1[0-2])/)) formattedDate = date.substring(0, 1);
        if (date.match(/^(?![0-1])/)) formattedDate = '';
        if (date.match(/^(0[1-9]|1[0-2])/)) formattedDate = date.substring(0, 2) + "/" + date.substring(3, 7);
      }
      if(formattedDate !== date)
        this.$refs.input.value = formattedDate;

      this.$emit('input', formattedDate);
    }
  }
};
</script>
