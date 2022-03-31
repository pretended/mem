<template>
  <ion-skeleton-text v-if="loading" animated :style="skeletonTextStyle"></ion-skeleton-text>
  <ion-avatar :style="imgAvatarStyle" v-else >
    <ion-img @ionImgDidLoad="didLoad" :src="src"></ion-img>
  </ion-avatar>

</template>

<script>
import {IonImg, IonAvatar, IonSkeletonText} from "@ionic/vue";
import {computed, ref} from "vue";

export default {
  name: "UserAvatar",
  components: {IonImg, IonAvatar, IonSkeletonText},
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
  setup(props) {
    const loading = ref(false);
    const didLoad = async () => {
      loading.value = false
    }
    return {
      didLoad,
      loading,
      imgAvatarStyle: computed(() => 'width: ' + props.width + 'px; height: ' + props.height + 'px'),
      skeletonTextStyle: computed(() => 'width: ' + props.width + 'px; height: ' + props.height + 'px; border-radius: 50%')
    }
  },
}
</script>

<style scoped>

</style>
