<template>
  <ion-avatar :style="imgAvatarStyle" >
    <ion-img :src="src"></ion-img>
  </ion-avatar>
<!--  <ion-skeleton-text animated v-else :style="skeletonTextStyle"></ion-skeleton-text>-->
</template>

<script>
import {IonImg, IonAvatar, } from "@ionic/vue";

export default {
  name: "UserAvatar",
  components: {IonImg, IonAvatar, },
  props: {
    src: [String, null, undefined],
    width: {
      type: [Number, String],
      default: 125
    },
    height:  {
      type: [Number, String],
      default: 125
    },
  },
  computed: {
    imgAvatarStyle () {
      return 'width: ' + this.width + 'px; height: ' + this.height + 'px'
    },
    skeletonTextStyle() {
      return 'width: ' + this.width + 'px; height: ' + this.height + 'px; border-radius: 50%'
    }
  }
}
</script>

<style scoped>

</style>
