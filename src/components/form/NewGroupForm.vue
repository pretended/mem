<template>
<ModalTemplate :modal-id="modalId" :title="title">
  <ion-grid style="padding-left: 25px; padding-right: 25px;">
    <ion-row>
      <ion-col >
        <ion-item color="white" class="no-border ion-no-padding ">
          <ion-label position="floating"  style="margin-left: 10px; font-weight: 500; font-size: 15px">Group Name</ion-label>
          <ion-input class="input " style="font-weight: 500" v-model="form.name"  >
          </ion-input>
        </ion-item>
      </ion-col>
      <ion-col class="ion-padding-end ion-margin-vertical">
        <ion-label  style="font-weight: 500">Reveal Date</ion-label>
        <ion-datetime placeholder="Select Date" style="margin-top: 10px"
                      :min="getMinDate" :max="getMaxDate" presentation="date-time"
                      minute-values="0,15,30,45" v-model="form.revealDate"

        ></ion-datetime>
      </ion-col>
      <ion-col>
        <ion-button expand="block" strong @click="create">Create</ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</ModalTemplate>
</template>

<script>
import ModalTemplate from "@/components/templates/ModalTemplate";
import {reactive, } from "vue";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonLabel,
  IonItem,
  IonDatetime,
  toastController,
  modalController
} from "@ionic/vue";
import {Tools} from "@/firebase/Tools";
import {createNewGroup} from "@/firebase/auth";
import {getAuth} from "firebase/auth";
import moment from 'moment'
export default {
  name: "NewGroupForm",
  components: {ModalTemplate, IonGrid, IonRow, IonCol, IonInput, IonLabel, IonItem, IonDatetime  },
  props: {
    modalId: String,
    title: String
  },
  setup() {

    const tomorrow = new Date()
    const maxConstrain = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    maxConstrain.setDate(maxConstrain.getDate() + (7 * 4))
    const parseDateMinMaxStr = (date) => date.toLocaleDateString().replaceAll('/', '-').split('-').reverse().map(date =>  date < 10 ? '0' + date : date).join('-');
    const getMinDate = parseDateMinMaxStr(tomorrow)
    const getMaxDate = parseDateMinMaxStr(maxConstrain)
    function toNearest30Minutes(date) {
      const start = moment(date)
      return start.minute() % 30 === 0
          ?
          moment(date).format() :
          moment(start, moment.ISO_8601).add(30 -  start.minute() % 30, "minutes").format()
    }
    const form = reactive({
      name: '',
      revealDate: toNearest30Minutes(new Date(tomorrow))
    })

    const create = async () => {
        try {
          if (new Tools().validateNewGroupForm(form)) {
            const data = {
              created: new Date(),
              creatorUId: getAuth().currentUser.uid,
              groupName: form.name,
              revealDate: form.revealDate,
              uid: new Date().getTime().toString(),
              users: [getAuth().currentUser.uid]
            }
            await createNewGroup(data);
            const controller = await toastController.create({
              message: 'Group Created!',
              color: 'success',
              duration: 2000,
            })
            await controller.present();
            await modalController.dismiss();
          }
        }
        catch (e) {
          let message = e.message
          if (message.includes('but it was: a custom ea object')) {
            message = 'Please create a valid date!'
          }
          const controller = await toastController.create({
            message: message,
            color: 'danger',
            duration: 2000,
          })
          await controller.present();
        }
    }

    return {
      create,
      form,
      getMinDate,
      getMaxDate
    }
  }
}
</script>

<style scoped>
.input {
  border: 0px whitesmoke solid;
  border-radius: 8px;
  --padding-start: 10px;
}
.no-border {
  --border-style: 0px;
}
</style>
