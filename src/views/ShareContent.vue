<template>
<ion-page>
  <ion-content :fullscreen="true" >
      <ion-toolbar color="inherit">
        <ion-title class="ion-text-center ion-padding-top"  style="font-weight: bolder; font-size: 16px">Share</ion-title>
      </ion-toolbar>

    <ion-list class="ion-no-padding">
        <GroupItem @click="sendData(group)" v-for="(group, index) in groups" :key="index" :users="group.infoUsers" :group-name="group.groupName" :creator-i-d="group.creatorUId" :reveal-date="group.revealDate">
        </GroupItem>

    </ion-list>
  </ion-content>
</ion-page>
</template>

<script>
import {IonContent, IonPage, IonList, IonToolbar, modalController,} from "@ionic/vue";
import {onBeforeMount, ref} from "vue";
import {getGroups, getMultipleUsersInfo} from "@/firebase/AppRequests";
import {getAuth} from "firebase/auth";
import GroupItem from "@/components/GroupItem";
import {sendImageToStorage} from "@/firebase/storage";
import {useRouter} from "vue-router";

export default {
  name: "ShareContent",
  components: {GroupItem, IonPage, IonContent, IonList, IonToolbar, },
  props: {
    imageBase64: {
      type: String,
      required: false
    },
    video: {
      type: Object,
      required: false
    },
    type: String
  },
  setup(props) {
    const groups = ref([])
    const router = useRouter();
    const loading = ref(true)
    const getUserGroups = async () => {
      groups.value = await getGroups(getAuth().currentUser.uid)
      for (const group of groups.value) {
        group.infoUsers =  await getMultipleUsersInfo(group.users);
      }
    }
    const dismissModal = async (group) => {
      await modalController.dismiss();
      await router.push('/group?q=' + group.uid)
    }
    const sendData = async (group) => {
      if (props.imageBase64) {
        // send image to backend
        const userUId = getAuth().currentUser.uid
        await sendImageToStorage(userUId, group.uid, props.imageBase64)
        await dismissModal(group)
      } else if (props.video) {
        // send video to backend

      }
    }
    onBeforeMount( () => {
       getUserGroups()
    })
    return {
      groups,
      loading,
      sendData
    }
  }
}
</script>

<style scoped>

</style>
