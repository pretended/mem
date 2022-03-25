<template>
    <ion-button fill="outline" id="trigger-button">
        +34
    </ion-button>
    <!-- Use a trigger -->
    <ion-modal trigger="trigger-button">
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-button fill="clear" slot="start" ><ion-icon :icon="closeOutline"></ion-icon></ion-button>
            <ion-title>Select phone dial code</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>        <div>Spain</div></ion-content>

      </ion-page>

    </ion-modal>

</template>

<script>
import {IonModal, IonContent, IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle} from "@ionic/vue";
import {closeOutline} from 'ionicons/icons';
export default {
  name: "PhoneNumberListPicker",
  components: {IonModal, IonContent, IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle },
  setup() {
    return {
      closeOutline
    }
  }
}
</script>

<style scoped>

</style>
