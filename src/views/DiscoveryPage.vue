<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title  style="font-weight: bold">Discovery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" >
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Discovery</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>

</template>

<script>
import {IonPage, IonToolbar, IonTitle, IonContent, IonHeader} from "@ionic/vue";

export default {
  name: "FriendsPage",
  components: {
    IonPage, IonToolbar, IonTitle, IonContent, IonHeader
  }
}
</script>

<style scoped>

</style>
