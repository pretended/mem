<template>
  <BackPageTemplate title="Friends">
    <ion-searchbar  animated placeholder="Search users" @input="search($event.target.value)"></ion-searchbar>
    <ion-list style="width: 100%">
      <UserListCard :user="user" v-for="(user, index) in friends" :key="index">
        <template v-slot:morecols v-if="user.uid === currUser.uid" >
          <ion-col size="3" style="display: flex; align-items: center; justify-content: end; padding-right: 6px">
            <ion-badge color="primary" >
                You
            </ion-badge>
          </ion-col>

        </template>
      </UserListCard>
      <ion-item-divider>
        Found Users
      </ion-item-divider>
    </ion-list>
  </BackPageTemplate>
</template>

<script>
import BackPageTemplate from "@/components/form/BackPageTemplate";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "@/firebase/auth";
import {getMultipleUsersInfo, querySearchForUsernameOrDisplayName} from "@/firebase/AppRequests";
import {IonList, IonSearchbar, IonCol} from "@ionic/vue";
import UserListCard from "@/components/UserListCard";
import {getAuth} from "firebase/auth";
export default {
  name: "FriendsView",
  components: { UserListCard, BackPageTemplate, IonList, IonSearchbar, IonCol},
  setup() {
    const friends = ref();
    const startFriends = ref();
    onMounted(async () => {
      const currentUser = await getCurrentUser();
      console.log(currentUser.friends)
      friends.value = await getMultipleUsersInfo(currentUser.friends)
      startFriends.value = friends.value ;
    })
    const search = async (text) => {
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
      currUser: getAuth().currentUser
    }
  }
}
</script>

<style scoped>

</style>
