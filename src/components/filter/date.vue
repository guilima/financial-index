<template>
  <div class="ui labeled input">
    <label class="ui label" for="dateInitial">Inicial</label>
    <input class="mr-10" type="text" id="dateInitial" value="" v-model="dateInitial" placeholder="MM/YYYY" v-on:keyup="inputDateInitial(dateInitial, $event)">
    <label for="dateEnd" class="ui label">Final</label>
    <input class="mr-10" type="text" name="dateEnd" id="dateEnd" value="" v-model="dateEnd" placeholder="MM/YYYY" v-on:keyup="inputDateEnd(dateEnd, $event)">
    <button class="ui primary button" :disabled="isDisabled" type="button" v-on:click="postValues({'dateInitial':'28/'+dateInitial,'dateEnd':'28/'+dateEnd})">Atualizar data</button>
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
      //date = {item: "changed"};
      if (event.key !== "Backspace") {
        if (date.match(/^(?![0-1])/)) this.dateInitial = "";
        if (date.match(/^(1[0-2]|0[1-9])/)) this.dateInitial = date.substring(0, 2) + "/" + date.substring(3, 7);
        return this.dateInitial;
      }
    },
    inputDateEnd: function (date, event) {
      if (event.key !== "Backspace") {
        if (date.match(/^(?![0-1])/)) this.dateEnd = "";
        if (date.match(/^(1[0-2]|0[1-9])/)) this.dateEnd = date.substring(0, 2) + "/" + date.substring(3, 7);
        return this.dateEnd;
      }
    }
  },
  computed: {
    isDisabled: function () {
      // evaluate whatever you need to determine disabled here...
      if (/^(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2})$/.test(this.dateInitial) &&
        /^(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2})$/.test(this.dateEnd) &&
        this.dateEnd.split('/').reverse().join('') > this.dateInitial.split('/').reverse().join('') &&
        this.dateEnd.split('/')[1] <= new Date().getFullYear() &&
        !this.loading) {

        return false;
      } else {

        return true;
      }
    }
  }
};
</script>
