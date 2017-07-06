<template>
  <div class="ui labeled input">
    <label class="ui label" for="dateInitial">Inicial</label>
    <input class="mr-10" type="text" id="dateInitial" value="" v-model="dateInitial" placeholder="MM/YYYY" v-on:keyup="inputDateInitial(dateInitial, $event)">
    <label for="dateEnd" class="ui label">Final</label>
    <input class="mr-10" type="text" name="dateEnd" id="dateEnd" value="" v-model="dateEnd" placeholder="MM/YYYY" v-on:keyup="inputDateEnd(dateEnd, $event)">
    <button class="ui primary button" :disabled="isDisabled" type="button" v-on:click="getValues('POST',{'dateInitial':'28/'+dateInitial,'dateEnd':'28/'+dateEnd})">Atualizar data</button>
  </div>
</template>

<script>
export default {
  name: 'filterDate'
};
</script>
