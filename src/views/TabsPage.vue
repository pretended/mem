<template>
  <ion-page>
    <ion-tabs >
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="discovery" href="/app/discovery">
          <ion-icon :icon="infiniteOutline" />
          <ion-label>Discovery</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="groups" href="/app/groups">
          <ion-icon :icon="peopleCircleOutline" />
          <ion-label>Groups</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="camera" @click="goToCamera">
          <ion-icon :icon="cameraOutline" />
          <ion-label>Camera</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/app/profile">
          <ion-icon :icon="personCircleOutline" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { personCircleOutline, peopleCircleOutline, cogOutline, cameraOutline, infiniteOutline } from 'ionicons/icons';
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    const router = useRouter();
    const goToCamera = async () => {
      await router.push('/camera')
    }

    return {
      goToCamera,
      infiniteOutline,
      personCircleOutline,
      cogOutline,
      peopleCircleOutline,
      cameraOutline
    }
  }
});
</script>
