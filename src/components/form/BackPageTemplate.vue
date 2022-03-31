<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-back-button slot="start" @click="goBack" ></ion-back-button>
      <slot name="ending"></slot>

    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title>{{title}} </ion-title>
      </ion-toolbar>
    </ion-header>
    <slot></slot>
  </ion-content>
</ion-page>
</template>

<script>
import {IonPage, IonHeader, IonToolbar, IonBackButton, IonContent, IonTitle} from "@ionic/vue";
import {useRouter} from "vue-router";

export default {
  name: "BackPageTemplate",
  components: {IonPage, IonHeader, IonToolbar, IonBackButton , IonContent, IonTitle},
  props: {
    title: String
  },
  setup() {
    const router = useRouter();
    const goBack = async () => await router.back();
    return {
      goBack
    }
  }
}
</script>

<style scoped>

</style>
