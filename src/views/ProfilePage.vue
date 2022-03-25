<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-title>My Profile</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title >My Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-grid class="ion-no-padding" v-if="user !== null">
      <ion-row>
        <ion-col  size="5" style="padding-left: 20px">
          <UserAvatar height="90" width="90" :src="user.photoURL" v-if="user.photoURL"></UserAvatar>
        </ion-col>
        <ion-col style="font-weight: bold; margin: auto"  size="6">
          <div>{{user.displayName}}</div>
          <div style="font-size: 12px">@{{user.username}}</div>
        </ion-col>
        <ion-col size="1" style="margin: auto" >
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
        </ion-col>
      </ion-row>
      <ion-row class="ion-margin-top">
        <ion-item-divider style="font-weight: 600; font-size: 15px" >
          My Account
        </ion-item-divider>
        <ion-list style="width: 100%" >
          <router-link   :to="{
                      name: 'FriendsPage',
                   }" style="text-decoration: none">
            <ion-item  class="ion-no-padding"  >
              <ion-icon class="ion-margin-horizontal" :icon="peopleCircleOutline"></ion-icon>
              <ion-label  style="font-weight: 600" >Friends</ion-label>
              <ion-icon slot="end" size="small" :icon="chevronForwardOutline"></ion-icon>

            </ion-item>
          </router-link>
          <ion-item  class="ion-no-padding"  >
            <ion-icon class="ion-margin-horizontal" :icon="chatboxEllipsesOutline"></ion-icon>
            <ion-label  style="font-weight: 600">Allow friend requests</ion-label>
            <ion-toggle @change="changeFriendRequest" :checked="user.allowFriendRequests"></ion-toggle>
          </ion-item>
          <ion-item-divider style="font-weight: 600; font-size: 15px">
            About
          </ion-item-divider>
          <ion-item  class="ion-no-padding"  >
            <ion-icon class="ion-margin-horizontal" :icon="shareOutline"></ion-icon>
            <ion-label  style="font-weight: 600">Share mem</ion-label>
          </ion-item>
          <ion-item  class="ion-no-padding"  >
            <ion-icon class="ion-margin-horizontal" :icon="starOutline"></ion-icon>
            <ion-label  style="font-weight: 600">Rate mem</ion-label>
          </ion-item>
          <ion-item  class="ion-no-padding"  >
            <ion-icon class="ion-margin-horizontal" :icon="helpCircleOutline"></ion-icon>
            <ion-label  style="font-weight: 600">FAQ</ion-label>
          </ion-item>
          <ion-item  class="ion-no-padding"  >
            <ion-icon class="ion-margin-horizontal" :icon="mailOutline"></ion-icon>
            <ion-label  style="font-weight: 600">Contact us</ion-label>
          </ion-item>
          <ion-item  class="ion-no-padding"  >
            <ion-icon class="ion-margin-horizontal" :icon="lockClosedOutline"></ion-icon>
            <ion-label  style="font-weight: 600">Privacy policy</ion-label>
          </ion-item>
          <ion-item  class="ion-no-padding"  >
            <ion-icon class="ion-margin-horizontal" :icon="documentOutline"></ion-icon>
            <ion-label  style="font-weight: 600">Terms of service</ion-label>
          </ion-item>
          <ion-button  expand="block" fill="clear" color="danger" strong style="margin-top: 10px; " @click="logout" >
           Logout
          </ion-button>
        </ion-list>
      </ion-row>
    </ion-grid>
  </ion-content>
</ion-page>
</template>

<script>
import UserAvatar from "@/components/UserAvatar";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonLabel,
  IonItem,
  IonList,
  IonItemDivider, IonButton, IonToggle
} from "@ionic/vue";
import { getCurrentUser} from "@/firebase/auth";
import { chevronForwardOutline, chatboxEllipsesOutline, peopleCircleOutline, shareOutline, starOutline, helpCircleOutline, mailOutline, lockClosedOutline, documentOutline} from 'ionicons/icons'
import {getAuth} from "firebase/auth";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
export default {
  name: "SettingsPage",
  components: {UserAvatar, IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonList, IonItemDivider, IonButton, IonToggle},
  setup() {
    const router = useRouter();
    const logout = async () => {
      await getAuth().signOut()
      await router.push('/')
      return true;
    }
    const changeFriendRequest = () => {
      //chagne
    }
    const user = ref(null)
    onMounted(async () => {
      user.value = await getCurrentUser()
      console.log(user.value)
    })

    return {
      logout,
      changeFriendRequest,
      user,
      chevronForwardOutline,
      chatboxEllipsesOutline,
      peopleCircleOutline,
      shareOutline,
      starOutline,
      helpCircleOutline,
      mailOutline,
      lockClosedOutline,
      documentOutline
    }
  }
}
</script>

<style scoped>

</style>
