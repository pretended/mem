<template>
<ion-page>
    <ion-header collapse="condense" class="ion-padding-top">
      <ion-toolbar >
        <ion-title class="ion-text-center" size="large">MeM</ion-title>
      </ion-toolbar>
    </ion-header>
  <ion-content :fullscreen="false" class="ion-padding">
    <ion-grid class="ion-text-center ion-padding-vertical" style="font-weight: bold" v-if="nStep === 0">
      <ion-text >
      Let's get started,
    </ion-text>
      <ion-text >
       what's your full name?
      </ion-text>
      <ion-input class="input ion-text-center ion-padding-vertical" style="font-weight: bold" v-model="form.name" placeholder="Your Full Name" >

      </ion-input>
    </ion-grid>
    <ion-grid class="ion-text-center ion-padding-vertical" style="font-weight: bolder" v-else-if="nStep === 1">
      <ion-text >
        Hi, {{ form.name }}. Login using these options
      </ion-text>

      <ion-button @click="googleAuth" color="light" expand="block" fill="solid" strong style="font-weight: bold" class="ion-margin-vertical"><img class="logo_google ion-margin-end" :src="require('../../src/assets/google_logo.png')" alt="logoGoogle"/>Continue with Google</ion-button>
      <ion-button @click="nextStep" color="light" expand="block" fill="solid" strong style="font-weight: bold" class="ion-margin-vertical">Continue with phone number</ion-button>

    </ion-grid>
    <ion-grid class="ion-text-center ion-padding-vertical" style="font-weight: bolder" v-else-if="nStep === 2">
      <ion-text >
        Create your account with your phone number
      </ion-text>

     <PhoneNumberListPicker></PhoneNumberListPicker>
    </ion-grid>
      <ion-button @click="nextStep" strong expand="block" :disabled="nStep > 2 || form.name === ''" style="font-weight: bolder" class="ion-margin-vertical" v-if="nStep !== 1">
        Continue
      </ion-button>
  </ion-content>
</ion-page>
</template>

<script>
import {defineComponent, ref, reactive, onMounted,} from "vue";
import {
  IonHeader,
  IonPage,
  IonText,
  IonInput,
  loadingController,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonButton,
  IonContent, isPlatform , toastController,
} from "@ionic/vue";
import {Auth} from "@/firebase/auth";
import PhoneNumberListPicker from "@/components/PhoneNumberListPicker";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "MeMWelcomeStepper",
  components: {PhoneNumberListPicker, IonPage, IonHeader, IonText, IonInput, IonTitle, IonToolbar, IonGrid, IonButton, IonContent},
  setup() {
    const nStep = ref(0);
    const router = useRouter();
    const form = reactive({
      name: '',
      phoneNumber: ''
    })
    const nextStep = () => {
      nStep.value++;
    }
    onMounted(() => {
      console.log(isPlatform('mobileweb') )
    })
    const googleAuth = async () => {
      const loading = await loadingController.create({
        message: 'Please, wait'
      })
      try {
        await loading.present()
        const r = await new Auth().googleAuth();
        console.log(r)
        await router.push('/app/profile')
      } catch (e) {
        const mod = await toastController.create({
          message: e.message,
          duration: 2000,
          color: 'danger'
        })
        await mod.present()
      }
      finally {
        await loading.dismiss()
      }
    }
    return {nStep, nextStep, form, googleAuth}
  }
})
</script>

<style >
.input {
  border: 0px white solid;
}
.logo_google {
  height: 25px;
  width: 25px;
}
</style>
