<template>
  <ion-item class="no-border-n">
    <ion-thumbnail slot="start">
      <ion-skeleton-text style="border-radius: 50%"></ion-skeleton-text>
    </ion-thumbnail>
    <ion-label>
      <h3>
        <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
      </h3>
      <p>
        <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
      </p>
      <p>
        <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
      </p>
    </ion-label>
  </ion-item>
</template>

<script>
import {IonItem, IonThumbnail, IonSkeletonText, IonLabel} from "@ionic/vue";

export default {
  name: "GroupItemSkeletonLoader",
  components: {
    IonItem, IonThumbnail, IonSkeletonText, IonLabel
  }
}
</script>

<style >
.no-border-n {
  --border-style: 0px !important;
}
</style>