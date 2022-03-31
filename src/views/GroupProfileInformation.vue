<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-back-button slot="start" @click="back_" ></ion-back-button>
      <ion-button slot="end" fill="clear" strong @click="actionSheetHandler">
        <ion-icon  :icon="ellipsisVertical"></ion-icon> </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title>Group </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-grid v-if="groupData" class="ion-no-padding" style="height: 90%; justify-content: space-between; display: flex; flex-direction: column">
    <div>
      <ion-row>
        <ion-col class="ion-text-center" style="font-weight: bold">
          <ion-label style="font-size: 25px">{{groupData.groupName}}</ion-label>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="ion-text-center" style="font-weight: bold">
          <ion-label style="font-size: 12px">
            Reveal <br>{{formattedRevealDate()}}
          </ion-label>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-item-divider style="font-weight: 600; font-size: 15px" color="transparent">
          Members
          <ion-button slot="end" @click="addMembers(groupData)" strong fill="clear">Add members</ion-button>
        </ion-item-divider>
        <ion-list style="width: 100%">
          <UserListCard :user="user" v-for="(user, index) in groupData.usersInfo" :key="index">
            <template v-slot:morecols v-if="user.uid === currUser.uid" >
              <ion-col size="3" style="display: flex; align-items: center; justify-content: end; padding-right: 6px">
                <ion-badge color="primary" >
                  You
                </ion-badge>
              </ion-col>

            </template>
          </UserListCard>
        </ion-list>
      </ion-row>

      <ion-row>
        <ion-item-divider style="font-weight: 600; font-size: 15px" color="transparent">
          Metrics
        </ion-item-divider>
        <ion-list v-if="groupData.usersInfo" style="width: 100%">
          <ion-row v-for="(statistic, index) in groupData.statistics" :key="index" class="ion-padding-horizontal" style="display: flex; justify-content: center" >
            <ion-label class="ion-text-center" style="font-size: 12px; font-weight: 500; color: #9a9a9a; margin-top: 1px; margin-bottom: 1px">
              {{statistics.action[statistic.action]( statistic, groupData, groupData.usersInfo)}}
            </ion-label>
          </ion-row>
        </ion-list>
      </ion-row>
    </div>
      <div>
        <ion-row class="ion-padding-horizontal" style="margin-top: 40px;  display: flex; align-items: end ">
          <ion-button expand="block"  strong style="width: 100%" @click="reveal" :disabled="moment(new Date()).isBefore(moment(groupData.revealDate)) ">Reveal</ion-button>
        </ion-row>
      </div>

    </ion-grid>
    <ion-refresher slot="fixed"  @ionRefresh="refreshContent($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
  </ion-content>
</ion-page>

</template>

<script>
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonItemDivider,
  modalController,
  loadingController,
  actionSheetController,
  IonRefresher,
  IonRefresherContent,
  IonLabel,
  IonBadge,
  IonList,
  IonIcon,
  toastController,
} from "@ionic/vue";
import {useRoute, useRouter} from "vue-router";
import UserListCard from "@/components/UserListCard";
import AddMembersToGroupForm from "@/components/form/AddMembersToGroupForm";
import {getCurrentInstance, onBeforeMount, ref} from "vue";
import {getGroupByUID, getMultipleUsersInfo, leaveGroup} from "@/firebase/AppRequests";
import {getAuth} from "firebase/auth";
import {ellipsisVertical} from 'ionicons/icons';
import statistics from '../data/Statistics';
import moment from "moment";
import RevealComponent from "@/components/RevealComponent";
export default {
  name: "GroupProfileInformation",
  components: {
    UserListCard,
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle,IonBackButton, IonGrid, IonRow, IonCol, IonButton, IonItemDivider, IonIcon, IonRefresher, IonRefresherContent, IonLabel, IonBadge, IonList, },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const query = useRoute().query;
    const groupId = query.q
    const groupData = ref()
    const ci = getCurrentInstance()
    const back_ = async () => {
      let query = Object.assign({},route.query);
      delete query.q;
      await router.replace({query});
      await router.back()
    }
    const reveal = async () => {
      const modal = await modalController.create({
        animated: true,
        component: RevealComponent,
        componentProps: {
          group: groupData,
          modalId: 'modal-reveal'
        },
        swipeToClose: true,
        id: 'modal-reveal',
        presentingElement: ci.parent.refs.ionRouterOutlet,
      })
      await modal.present()
    }
    const getGroup = async () => {
      groupData.value = await getGroupByUID(groupId);
      const users = await getMultipleUsersInfo(groupData.value.users)
      const myIndex = users.indexOf((each) => each.uid === getAuth().currentUser.uid)
      const element = users.splice(myIndex, 1)[0];
      users.splice(0,0, element)
      groupData.value.usersInfo = users
    }
    onBeforeMount(async () => {
      if (!groupData.value) {
        const loading = await loadingController.create({
          message: 'Loading'
        })
        await loading.present();
        await getGroup()
        await loading.dismiss();
      }
    })
    const addMembers = async (group) => {
      const modal = await modalController.create({
        id: 'modal-addmembers',
        component: AddMembersToGroupForm,
        componentProps: {
          modalId: 'modal-addmembers',
          group: group
        }
      })
      await modal.present();
    }
    const goBack = async () => {
        await router.back();
    }
    const refreshContent = async (ev) => {
      await getGroup()
      ev.target.complete()
    }
    const isOwner = () => (getAuth().currentUser.uid === groupData.value.creatorUId);
    const actionSheetHandler = async () => {

      const deleteBtn =           {
        text: 'Delete Group',
        role: 'destructive',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          console.log('Delete clicked')
        },
      }
      const buttons =  [

        {
          text: 'Share Group',
          handler: () => {
            console.log('Share clicked')
          },
        },
        {
          text: 'Leave Group',
          handler: async () => {
            const uid = getAuth().currentUser.uid;
            try {
              await leaveGroup(groupData.value.uid, uid);
              await router.push('/app/groups')
              await (await toastController.create({
                message: 'You have left group ' + groupData.value.groupName,
                duration: 3000
              })).present();
            } catch (e) {
              console.error(e)
            }
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked')
          },
        },
      ]
      if (isOwner()) {
        buttons.splice(0, 0, deleteBtn)
      }
      const asHandler = await actionSheetController.create({
        header: groupData.value.groupName,
        buttons: buttons
      })
      await asHandler.present()
      const { role, data } = await asHandler.onDidDismiss();
      console.log('onDidDismiss resolved with role and data', role, data);
    }

    return {
      back_,
      refreshContent,
      addMembers,
      goBack,
      groupData,
      ellipsisVertical,
      actionSheetHandler,
      currUser: getAuth().currentUser,
      statistics,
      formattedRevealDate: () => moment(groupData.value.revealDate).format('dddd, DD MMM YYYY HH:MM z'),
      moment: moment,
      reveal
    }
  }
}
</script>

<style scoped>
.absolut_pos {
  position: absolute;
  right: 155px;
}
</style>
