<template>
  <ModalTemplate title="Add Members" :modal-id="modalId" class="modal-templ">
    <template v-slot:header>
      <ion-button slot="end" fill="clear" strong :disabled="membersToAdd.length === 0" @click="addMembers">Add</ion-button>
    </template>
    <ion-grid class="ion-no-padding">
      <ion-row>
        <ion-item-divider style="font-weight: 600; font-size: 15px" color="transparent">
          Suggestions
        </ion-item-divider>
      </ion-row>
      <ion-row>
        <ion-list style="width: 100%" v-if="suggested.length > 0" class="ion-color-medium">
          <UserListCard @click="membersHandler(user)" :user="user" v-for="(user, index) in suggested" :key="index" :show-followings="false" >
            <template v-slot:morecols>
              <ion-col size="3" style="display: flex; align-items: center; justify-content: end">
                  <ion-checkbox  :checked="user.checked"
                            ></ion-checkbox>
              </ion-col>
            </template>
          </UserListCard>
        </ion-list>
      <div v-else style="font-weight: 500; width: 100%; font-size: 17px;color: var(--ion-color-medium); display: flex; align-items: center; flex-direction: column; margin-top: 20px; margin-bottom: 20px"  >
        No suggestions ...

        <ion-button @click="goToFriends" strong class="ion-padding-horizontal ion-margin-vertical" expand="block" style="width: 100%; margin-top: 30px" >
          Add friends
        </ion-button>
        or
        <ion-button strong class="ion-padding-horizontal ion-margin-vertical" expand="block" style="width: 100%; ">
          🔗 Share the group link
        </ion-button>
      </div>
      </ion-row>
      <ion-row>
      </ion-row>
    </ion-grid>
  </ModalTemplate>
</template>

<script>
import ModalTemplate from "@/components/templates/ModalTemplate";
import {
  IonGrid,
  IonRow,
  IonItemDivider,
  IonButton,
  modalController,
  IonCol,
  IonCheckbox,
  IonList
} from "@ionic/vue";
import {getAuth} from "firebase/auth";
import {addMembersToGroup, getMultipleUsersInfo, getUserInfo} from "@/firebase/AppRequests";
import {onBeforeMount, ref} from "vue";
import UserListCard from "@/components/UserListCard";
import {useRouter} from "vue-router";
export default {
  name: "AddMembersToGroupForm",
  components: { ModalTemplate, IonGrid,IonRow, IonList, IonItemDivider, UserListCard, IonButton, IonCol, IonCheckbox },
  props: {
    modalId: String,
    group: Object
  },
  setup(props) {
    const membersToAdd = ref([])
    const addMembers = async () => {
      const uids = membersToAdd.value.map((m) => m.uid);
      await addMembersToGroup(props.group.uid, uids);
      await modalController.dismiss();
    }
    const membersHandler = async (member) => {
      if (membersToAdd.value.some((m) => member.uid === m.uid)) {
        member.checked = false;
      await  removeFromMembers(member)
      } else {
        member.checked = true;
        membersToAdd.value.push(member)
      }
    }
    const removeFromMembers = async (member) => {
      membersToAdd.value.splice(membersToAdd.value.indexOf(me => me.uid === member.uid), 1);
    }
    const suggested = ref([])
    const router = useRouter();
    const goToFriends = async () => {
      await modalController.dismiss()
      await router.push('/app/friends')
    }
    const getUserSuggestions = async () => {
      const user = getAuth().currentUser;
      const uid = user.uid;
      const userUIds = (await getUserInfo(uid)).friends
      const usersInfo = await getMultipleUsersInfo(userUIds)
      const res = []
      usersInfo.forEach((user) => {
        if (!props.group.users.includes(user.uid) ) {
          user.checked = false;
          res.push(user)
        }
      })
      return res;
    }
    onBeforeMount(async () => {
      suggested.value = await getUserSuggestions()
    })
    return {
      goToFriends,
      suggested,
      gr: props.group,
      membersHandler,
      membersToAdd,
      removeFromMembers,
      addMembers
    }
  }
}
</script>

<style scoped>
.modal-templ {
  --background: red !important;
}
</style>
