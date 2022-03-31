<template>
  <ion-page class="modal-templ">
    <ion-header class="modal-templ">
      <ion-toolbar class="modal-templ">
          <ion-button @click="dismissModal" fill="clear" slot="start"><ion-icon :icon="closeOutline"></ion-icon></ion-button>
        <ion-title >{{title}}</ion-title>
        <slot name="header"></slot>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="modal-templ">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent , modalController,  IonIcon
} from "@ionic/vue";
import {closeOutline} from 'ionicons/icons';

export default {
  name: "ModalTemplate",
  props: {
    title: {
      default : '',
      type: String
    },
    modalId: String
  },
  components: {    IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonContent , IonIcon},
  setup(props) {
    const dismissModal = async () => {
      await modalController.dismiss(undefined, undefined, props.modalId)
    }
    return {
      dismissModal,
      closeOutline
    }
  }
}
</script>

<style scoped>
.modal-templ {
  background-color: black !important;
  --background: black !important;
  --ion-background-color: black !important;
}
</style>
