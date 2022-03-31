<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-button slot="end" fill="clear" strong @click="createNewGroup">New group</ion-button>
        <ion-title style="font-weight: bolder">Groups</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title style="font-weight: bolder" >Groups</ion-title>
        </ion-toolbar>
      </ion-header>
      <div v-if="loading">
        <GroupItemSkeletonLoader v-for="(number, index) in 8" :key="index"></GroupItemSkeletonLoader>
      </div>
    <ion-list class="ion-no-padding" v-else-if="groups.length > 0 && !loading">

      <router-link v-for="(group, index) in groups" :key="index"
                   :to="{
                      name: 'GroupProfile',
                      query: {q: group.uid}
                   }"
                   style="text-decoration: none">
        <GroupItem :users="group.usersInfo" :group-name="group.groupName" :creator-i-d="group.creatorUId" :reveal-date="group.revealDate">

        </GroupItem>

      </router-link>
    </ion-list>
      <div v-else style="display: flex; flex-direction: column; justify-content: center; align-items: center; max-width: 80%; margin-left: auto; margin-right: auto; margin-top: 100px">
        <ion-img :src="require('../assets/detective.png')" style="height: 15vh"></ion-img>
        <ion-label style="font-weight: bolder; font-size: 20px; margin-top: 20px; margin-bottom: 5px;">No groups were found</ion-label>
        <ion-label style="font-size: 16px; color: var(--ion-color-medium); font-weight: 500; text-align: center">You have not been added or you have not created any group for now.</ion-label>
        <ion-button style="width: 100%; margin-top: 20px" strong expand="block" @click="createNewGroup">Create group</ion-button>
      </div>
      <ion-refresher slot="fixed"  @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
    </ion-content>
  </ion-page>

</template>

<script>
import {
  IonToolbar,
  IonHeader,
  IonContent,
  IonPage,
  IonTitle,
  modalController,
  IonList,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonLabel, IonImg
} from "@ionic/vue";
import GroupItem from "@/components/GroupItem";
import {onMounted, ref} from "vue";
import {getAuth} from "firebase/auth";
import {getGroups, getMultipleUsersInfo} from "@/firebase/AppRequests";
import NewGroupForm from "@/components/form/NewGroupForm";
import GroupProfileInformation from "@/views/GroupProfileInformation";
import GroupItemSkeletonLoader from "@/components/loaders/GroupItemSkeletonLoader";
export default {
  name: "GroupsPage",
  components: {GroupItemSkeletonLoader, GroupItem, IonToolbar, IonHeader, IonContent, IonPage, IonLabel, IonImg, IonTitle, IonList, IonButton, IonRefresher, IonRefresherContent },
  setup() {
    const loading = ref(true);
    const groups = ref([])
    const user = getAuth().currentUser
    const getGroupsFromUser = async () => {
      groups.value = await getGroups(user.uid)
      for (const group of groups.value) {
        const users = await getMultipleUsersInfo(group.users)
        const myIndex = users.indexOf((each) => each.uid === user.uid)
        const element = users.splice(myIndex, 1)[0];
        users.splice(0,0, element)
        group.usersInfo = users
      }
      return groups.value;
    }
    onMounted(async () => {
        loading.value = true;
        await getGroupsFromUser()
      loading.value = false;
    })
    const refreshContent = async (event) => {
      loading.value = true;
      await getGroupsFromUser()
      event.target.complete();
      loading.value = false;
    }

    const createNewGroup = async () => {
      const modal = await modalController.create({
        id: 'new-group',
        component: NewGroupForm,
        componentProps: {
          title: 'New Group',
          modalId: 'new-group'
        }
      })
      return modal.present()
    }
    return {
      loading,
      createNewGroup,
      getGroupsFromUser,
      groups,
      refreshContent,
      GroupProfileInformation,
    }
  }
}
</script>

<style scoped>

</style>
