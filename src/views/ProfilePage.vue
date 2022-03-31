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
      <ion-row @click="goToEditProfile">
        <ion-col  size="5" style="padding-left: 20px">
          <UserAvatar height="90" width="90" :src="user.photoURL" v-if="user.photoURL"></UserAvatar>
        </ion-col>
        <ion-col style=" margin: auto"  size="6">
          <div style="font-weight: bold;">{{user.displayName}}</div>
          <div style="font-size: 12px; font-weight: 500; color: #ababab">@{{user.username}}</div>
        </ion-col>
        <ion-col size="1" style="margin: auto" >
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
        </ion-col>
      </ion-row>
      <ion-row class="ion-margin-top">
        <ion-list style="width: 100%; border: 1px var(--ion-color-light) solid; border-radius: 20px; padding-top: 6px; padding-bottom: 6px;" class="ion-margin-horizontal ion-margin-top"  >
          <router-link   :to="{
                      name: 'FriendsPage',
                   }" style="text-decoration: none">
            <ion-item  class="ion-no-padding no-border-n"  >
              <ion-icon class="ion-margin-horizontal" :style="'padding:4px 4px 4px 4px; border-radius: 10px; color: white; background-color: #2A2A72;'" size="small" :icon="peopleCircle"></ion-icon>
              <ion-label  style="font-weight: 600" >Friends</ion-label>
              <ion-icon slot="end" size="small" :icon="chevronForwardOutline"></ion-icon>

            </ion-item>
          </router-link>
          <ion-item  class="ion-no-padding  no-border-n"  >
            <ion-icon class="ion-margin-horizontal" :style="'padding:4px 4px 4px 4px; border-radius: 10px; color: white; background-color: #009FFD;'" size="small"  :icon="chatboxEllipses"></ion-icon>
            <ion-label  style="font-weight: 600">Allow friend requests</ion-label>
            <ion-toggle @change="changeFriendRequest" :checked="user.allowFriendRequests"></ion-toggle>
          </ion-item>
        </ion-list>
          <ion-list style="width: 100%; border: 1px var(--ion-color-light) solid; border-radius: 20px; padding-top: 6px; padding-bottom: 6px;" class="ion-margin"  >
            <ion-item  class="ion-no-padding no-border-n" v-for="(about, index) in profileAbout" :key="index" @click="about.handler" style="height: 40px">
              <ion-icon class="ion-margin-horizontal" :style="'padding:5px 5px 5px 5px; border-radius: 10px; color: white; background-color: ' + about.bgColor" size="small" :icon="about.icon"></ion-icon>
              <ion-label  style="font-weight: 500; font-size: 16px">{{about.title}}</ion-label>
              <ion-icon slot="end" size="small" :icon="chevronForwardOutline"></ion-icon>

            </ion-item>

          </ion-list>
          <ion-button expand="block" fill="outline" color="danger" strong style="width: 90%; margin: auto" @click="logout" >
           Logout
          </ion-button>
      </ion-row>
    </ion-grid>
    <ion-refresher slot="fixed"  @ionRefresh="refreshContent($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
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
  IonButton, IonToggle, alertController, IonRefresher, IonRefresherContent
} from "@ionic/vue";
import { getCurrentUser} from "@/firebase/auth";
import { chevronForwardOutline, chatboxEllipses, peopleCircle, share, star, helpCircle, mail, lockClosed, document} from 'ionicons/icons'
import {getAuth} from "firebase/auth";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
export default {
  name: "SettingsPage",
  components: {IonRefresher, IonRefresherContent, UserAvatar, IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonList, IonButton, IonToggle},
  setup() {
    const router = useRouter();
    const profileAbout = [{
      title: 'Share mem',
      icon: share,
      bgColor: '#00d359',
      handler: () => {
        console.log('clicked share')
      }
    },
      {
        title: 'Rate mem',
        icon: star,
        bgColor: '#de9c52',
        handler: () => {return 1;}
      },
      {
        title: 'FAQ',
        icon: helpCircle,
        bgColor: '#F0544F',
        handler: () => {return 1;}
      },
      {
        title: 'Contact Us',
        icon: mail,
        bgColor: '#331832 ',
        handler: () => {return 1;}
      },
      {
        title: 'Privacy Policy',
        icon: lockClosed,
        bgColor: '#22577A',
        handler: () => {return 1;}
      },
      {
        title: 'Terms Of Service',
        icon: document,
        bgColor: '#38A3A5',
        handler: () => {return 1;}
      },
    ]
    const logout = async () => {
      const alert = await alertController.create({
        animated: true,
        cssClass: 'my-custom-class',
        header: 'Are you sure to logout?',
        message: 'You will be able to login later.',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            id: 'cancel-button',
            handler: blah => {
              console.log('Confirm Cancel:', blah)
            },
          },
          {
            text: 'Yes',
            id: 'confirm-button',
            handler: async () => {
              await getAuth().signOut()
              await router.push('/')
              return true;
            },
          },
        ],
      })
     await alert.present();

    }
    const changeFriendRequest = () => {
      //chagne
    }
    const user = ref(null)
    onMounted(async () => {
      user.value = await getCurrentUser()
    })
    const goToEditProfile = async () => {
      await router.push('/app/profile/edit')
    }
    const refreshContent = async (event) => {
      user.value = await getCurrentUser()
      event.target.complete();
    }

    return {
      refreshContent,
      goToEditProfile,
      logout,
      changeFriendRequest,
      user,
      profileAbout,
      chevronForwardOutline,
      chatboxEllipses,
      peopleCircle,
      share,
      star,
      helpCircle,
      mail,
      lockClosed,
      document
    }
  }
}
</script>

<style scoped>
.no-border-n {
  --border-style: 0px !important;
}
</style>
