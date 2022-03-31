<template>
<ion-item  class="ion-no-padding ion-no-margin no-border" style="padding-top: 5px; padding-bottom: 5px;"  >
  <ion-grid class="ion-no-padding">
    <ion-row>
      <ion-col size="3" style="padding-left: 20px">
        <UserAvatar :src="user.photoURL" height="40" width="40"></UserAvatar>
      </ion-col>
      <ion-col size="6">
        <div>
          <ion-label style="font-weight: 600; font-size: 16px">{{user.displayName}}</ion-label>
          <ion-label  style="font-weight: 500; font-size: 14px" color="medium">@{{ user.username}}</ion-label>
        </div>
      </ion-col>
      <ion-col size="3" v-if="!isSameUser && showFollowings" class="ion-text-end" style="padding-right: 15px">
        <div v-if="showFollowings">
          <ion-button v-if="!isUserFollowing" @click="followUser_" >
            Follow
          </ion-button>
          <ion-button v-else @click="unfollowUser_" fill="outline">
            Unfollow
          </ion-button>
        </div>
      </ion-col>
      <slot name="morecols"></slot>
    </ion-row>


  </ion-grid>

</ion-item>
</template>

<script>
import UserAvatar from "@/components/UserAvatar";
import {IonItem, IonLabel, IonGrid, IonRow, IonCol, IonButton, } from "@ionic/vue";
import {computed, onBeforeMount, ref} from "vue";
import {getAuth} from "firebase/auth";
import {followUser, isUserFollowingOtherUser, unfollowUser} from "@/firebase/AppRequests";
export default {
  name: "UserListCard",
  props: {
    user: Object,
    showFollowings: {
      type: Boolean,
      default: true
    },

  },
  components: {UserAvatar, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonButton},
  setup(props) {
    const isUserFollowing = ref(false);
    const user = getAuth().currentUser
    const followUser_ = async () => {
      isUserFollowing.value = true;
      await followUser(user.uid, props.user.uid)
    }
    const unfollowUser_ = async () => {
      isUserFollowing.value = false;
      await unfollowUser(user.uid, props.user.uid)
    }
    onBeforeMount(async () => {
      isUserFollowing.value = await isUserFollowingOtherUser(user.uid, props.user.uid )
    })
    return {
      isUserFollowing,
      followUser_,
      unfollowUser_,
      isSameUser: computed(() => props.user.uid === user.uid)
    }
  }
}
</script>

<style scoped>
.no-border {
  --border-style: 0px;
}
</style>
