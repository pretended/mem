<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-back-button slot="start" ></ion-back-button>
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

export default {
  name: "BackPageTemplate",
  components: {IonPage, IonHeader, IonToolbar, IonBackButton , IonContent, IonTitle},
  props: {
    title: String
  }
}
</script>

<style scoped>

</style>
