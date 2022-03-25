<template>
  <div :style="styleDiv">
    <div :style="'font-weight: bold; font-size: 9px; color: ' + textColor">{{text}}</div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Badge",
  props: {
    color: String,
    text: String,
    textColor: String
  },
  computed: {
    styleDiv() {
      return 'background-color: ' + this.color + '; padding: 7px; border-radius: 10px'
    }
  }
}
</script>

<style scoped>

</style>
