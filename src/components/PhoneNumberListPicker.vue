<template>

  <ion-item class="no-border-n" style="border: 2px solid white; border-radius: 20px">
    <ion-select style="margin-top: 20px">
      <ion-label>Select your carrier</ion-label>
      <ion-select-option v-for="(country, index) in countries" :key="index" :value="country.name">{{country.flag}} {{country.name}}</ion-select-option>
    </ion-select>
  </ion-item>

</template>

<script>
import {IonItem, IonLabel, IonSelect, IonSelectOption} from "@ionic/vue";
import {closeOutline} from 'ionicons/icons';
import countries from '@/data/country_info'
export default {
  name: "PhoneNumberListPicker",
  components: {IonItem,IonSelect, IonSelectOption, IonLabel},
  setup() {
    return {
      closeOutline,
      countries: countries
    }
  }
}
</script>

<style >
.no-border-n {
  --border-style: none;
}
</style>
