<template>
  <ion-app id="app">
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {defineComponent, onMounted} from 'vue';
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    onMounted(() => {
      GoogleAuth.initialize();
    });
  }
});
</script>

<style>
#app {
  background-color: transparent !important;
}
</style>