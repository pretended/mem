<template>
  <BackPageTemplate title="Friends">
    <ion-searchbar  animated placeholder="Search users" @input="search($event.target.value)"></ion-searchbar>
    <ion-list v-if="friends.length > 0" style="width: 100%">

      <ion-item-divider>
        Found Users
      </ion-item-divider>
      <div >
        <UserListCard :user="user" v-for="(user, index) in friends" :key="index">
          <template v-slot:morecols v-if="user.uid === currUser.uid" >
            <ion-col size="3" style="display: flex; align-items: center; justify-content: end; padding-right: 6px">
              <ion-badge color="primary" >
                You
              </ion-badge>
            </ion-col>
          </template>
        </UserListCard>
      </div>

    </ion-list>
    <div v-else-if="friends.length === 0 && cValueText" style="display: flex; justify-content: center; align-items: center; height: 15%; flex-direction: column">
      <span style="font-weight: 600">No user was found</span>
      <span style="font-weight: 400; font-size: 12px; color:#b6b6b6">Search by name or username and try again</span>
    </div>
    <div v-else style="display: flex; justify-content: center; align-items: center; height: 15%; flex-direction: column">
      <span style="font-weight: 600">Start searching...</span>
      <span style="font-weight: 400; font-size: 12px; color:#b6b6b6">Search by name or username</span>
    </div>
  </BackPageTemplate>
</template>

<script>
import BackPageTemplate from "@/components/form/BackPageTemplate";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "@/firebase/auth";
import {getMultipleUsersInfo, querySearchForUsernameOrDisplayName} from "@/firebase/AppRequests";
import {IonList, IonSearchbar, IonCol, IonBadge, IonItemDivider} from "@ionic/vue";
import UserListCard from "@/components/UserListCard";
import {getAuth} from "firebase/auth";
export default {
  name: "FriendsView",
  components: { UserListCard, BackPageTemplate, IonList, IonSearchbar, IonCol, IonBadge, IonItemDivider},
  setup() {
    const friends = ref([]);
    const startFriends = ref([]);
    const cValueText = ref('');
    onMounted(async () => {
      const currentUser = await getCurrentUser();
      friends.value = await getMultipleUsersInfo(currentUser.friends)
      console.log(currentUser)
      startFriends.value = friends.value ;
    })
    const search = async (text) => {
      cValueText.value = text
      if (text === '' || text === null || text === undefined || text.length === 0) {
        friends.value = startFriends.value;
      } else {
        friends.value = await querySearchForUsernameOrDisplayName(text)
      }
    }
    return {
      startFriends,
      search,
      friends,
      currUser: getAuth().currentUser,
      cValueText
    }
  }
}
</script>

<style scoped>

</style>
