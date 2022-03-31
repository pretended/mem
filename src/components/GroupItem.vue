<template>
<ion-item class="ion-no-padding no-border" >
  <ion-label style="padding-left: 20px">
    <ion-grid class="ion-no-padding">
      <ion-row>
        <ion-col size="3">
          <UserAvatar :class="index === 1 ? 'absolut_pos' : 'ion-margin-bottom'" v-for="(user, index) in usersSliced" :key="index" :src="user.photoURL" height="50" width="5
          0" ></UserAvatar>
        </ion-col>
        <ion-col size="8" style="display: flex; align-items: center;">
          <div>
            <ion-label style="font-weight: 600">{{groupName}}</ion-label>
              <ion-row>
                <ion-label style="font-weight: 500; font-size: 12px; color: grey" v-for="(user, index) in usersSliced" :key="index">{{user.username}}<span v-if="usersSliced.length > 1">,&nbsp;</span></ion-label>
                <ion-label style="font-weight: 500; font-size: 12px; color: grey" v-if="nUsers > 2">{{nUsers - 2 > 0 ? nUsers - 2 : ''}} more...</ion-label>
              </ion-row>
          </div>

        </ion-col>
        <ion-col size="1" style="margin: auto" >
          <ion-icon style="font-weight: bold" :icon="chevronForwardOutline"></ion-icon>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-label>

</ion-item>
</template>

<script>
import {IonItem, IonLabel, IonGrid, IonCol, IonRow, IonIcon} from "@ionic/vue";
import UserAvatar from "@/components/UserAvatar";
import {chevronForwardOutline} from "ionicons/icons";
import {computed,} from "vue";
import {getAuth} from "firebase/auth";

export default {
  name: "GroupItem",
  props: {
    groupName: String,
    creatorID: String,
    revealDate: [String, Date],
    users: Array,
  },
  components: {UserAvatar, IonItem, IonLabel, IonGrid, IonCol, IonRow, IonIcon},
  setup(props) {
    const c = computed(() => {
      if (!props.users) return [];         // ✅ Return an empty array if undefined
      return Array.from(props.users).slice(0,2)
      })
    const nUsers = computed(() => {
      if (!props.users) return 0;         // ✅ Return an empty array if undefined
      return props.users.length
    })
    return {
      chevronForwardOutline,
      usersSliced: c,
      isGroupOwner: computed(() => props.creatorID === getAuth().currentUser.uid ),
      nUsers
    }
  },

}
</script>

<style scoped>
.no-border {
  --border-style: none;
}
.absolut_pos {
  position: absolute;
  right: 30px;
  left: 10px;
  top: 10px;
}
.no_show {
  display: none;
}
</style>
