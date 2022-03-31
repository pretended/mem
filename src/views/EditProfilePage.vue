<template>
<BackPageTemplate title="Edit Profile" >
  <template v-slot:ending  >
    <ion-button  slot="end" fill="clear" strong @click="saveProfile">Save</ion-button>
  </template>

  <ion-grid v-if="user">
    <ion-row>
      <ion-col >
        <UserAvatar @click="changePic" :src="user.photoURL" style="margin: auto"></UserAvatar>
        <div style="height: 30px; width: 30px; position: absolute; left: 55%; bottom: 6%; background-color: var(--ion-color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center">
          <ion-icon :icon="camera" size="small"></ion-icon>
        </div>

      </ion-col>

    </ion-row>
    <ion-row>
      <ion-col>
        <ion-item class="no-border">
          <ion-label position="stacked"  style="margin-left: 2px; font-weight: 500; font-size: 15px">Name</ion-label>
          <ion-input class="input cccc" style="font-weight: 500; "  v-model="form.displayName" :value="form.displayName">
          </ion-input>
        </ion-item>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col>
        <ion-item class="no-border">
          <ion-label position="stacked"  style="margin-left: 2px; font-weight: 500; font-size: 15px">Username</ion-label>
          <ion-input class="input cccc" style="font-weight: 500; "  v-model="form.username" :value="form.username">
          </ion-input>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
</BackPageTemplate>
</template>

<script>
import BackPageTemplate from "@/components/form/BackPageTemplate";
import UserAvatar from "@/components/UserAvatar";
import {getCurrentUser} from "@/firebase/auth";
import {onMounted, reactive, ref} from "vue";
import {
  actionSheetController,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow, loadingController
} from "@ionic/vue";
import {camera} from "ionicons/icons";
import {Camera, CameraSource} from '@capacitor/camera'
import {getAuth} from "firebase/auth";
import {updateUserData} from "@/firebase/AppRequests";
import {useRouter} from "vue-router";
import {updateUserProfileImage} from "@/firebase/storage";

export default {
  name: "EditProfilePage",
  components: {UserAvatar, BackPageTemplate, IonGrid, IonRow, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonButton},
  setup() {
    const router = useRouter();
    const user = ref(null);
    const oldUsername = ref(null);
    const form = reactive({
    })
    const getUser = async () => {
      user.value = await getCurrentUser();
      return user.value;
    }
    onMounted(async () => {
      const user =await getUser()
      form.displayName = user.displayName
      form.username = user.username
      form.photoURL = user.photoURL
      oldUsername.value = user.username;
    })
    const buttons = [{
      text: 'Camera',
      handler: async () => {
        if(!(await Camera.checkPermissions()).camera === 'granted') {
          await Camera.requestPermissions({permissions: ['camera']})
        }
          const photo = await Camera.getPhoto({
            quality: 100,
            allowEditing: true,
            resultType: 'dataUrl',
            saveToGallery: false,
            webUseInput: true,
            source : CameraSource.Camera
          })
        await loadingController.create({message: 'Uploading...'})
          user.value.photoURL = await updateUserProfileImage(user.value.uid, photo.dataUrl);
        await loadingController.dismiss()
          await actionSheetController.dismiss()

      },
    },{
      text: 'Library',
      handler: async () => {
        if(!(await Camera.checkPermissions()).camera === 'granted') {
          await Camera.requestPermissions({permissions: ['photos']})
        }
          const options = {
            source : CameraSource.Photos,
            quality: 100,
            allowEditing: true,
            resultType: 'dataUrl',
            saveToGallery: false,
          }
        await loadingController.create({message: 'Uploading...'})
       const photo =  await Camera.getPhoto(options)
        user.value.photoURL = await updateUserProfileImage(user.value.uid, photo.dataUrl);
        await loadingController.dismiss()
          await actionSheetController.dismiss()
      },
    },]
    const changePic = async () => {
      const ActionSheetModal = await actionSheetController.create({
        header: 'Change profile image',
        subHeader: 'Your profile image wil be visible to everyone and will help your friends find you.',
        buttons: buttons
      })
      await ActionSheetModal.present()
    }
    const saveProfile = async () => {
      const displayName = form.displayName;
      const username = form.username;
      const user = getAuth().currentUser
      await updateUserData(user.uid, {
        displayName: displayName,
        username: username,
        oldUsername: oldUsername.value
      })
      await getCurrentUser();
      await router.back()
 }
    return {
      saveProfile,
      user,
      form,
      camera,
      changePic
    }
  }
}
</script>

<style scoped>
.no-border {
  --border-style: none;
}
.cccc {
  background-color: var(--ion-color-light);
}
.input {
  border: 0px whitesmoke solid !important;
  border-radius: 8px;
  --padding-start: 10px;
}
</style>