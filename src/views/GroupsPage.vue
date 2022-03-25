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
    <ion-list class="ion-no-padding">

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
      <ion-refresher slot="fixed"  @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
    </ion-content>
  </ion-page>

</template>

<script>
import {IonToolbar, IonHeader, IonContent, IonPage, IonTitle, modalController, IonList, IonButton, IonRefresher, IonRefresherContent} from "@ionic/vue";
import GroupItem from "@/components/GroupItem";
import {onMounted, ref} from "vue";
import {getAuth} from "firebase/auth";
import {getGroups, getMultipleUsersInfo} from "@/firebase/AppRequests";
import NewGroupForm from "@/components/form/NewGroupForm";
import GroupProfileInformation from "@/views/GroupProfileInformation";
export default {
  name: "GroupsPage",
  components: { GroupItem, IonToolbar, IonHeader, IonContent, IonPage, IonTitle, IonList, IonButton, IonRefresher, IonRefresherContent },
  setup() {
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
        await getGroupsFromUser()

    })
    const refreshContent = async (event) => {
      await getGroupsFromUser()
      event.target.complete();
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
