<template>
  <ion-page>
    <ion-content class="my-custom-camera-preview-content" :fullscreen="true" v-if="image === null && video === null">
      <div id="cameraPreview" class="cameraPreview">
        <div v-if="cameraActive">
          <ion-button color="light" size="small" @click="stopCamera" fill="clear" class="image-overlay" id="closeCamera">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
          <ion-button color="light" size="small" @click="changeFlash" fill="clear" class="image-overlay" id="flashCamera">
            <ion-icon :icon="!this.flash ? flashIcon : flashOff"></ion-icon>
          </ion-button>
          <ion-button  color="light" size="small" @click="flipCamera" fill="clear"  class="image-overlay" id="flipCamera">
            <ion-icon :icon="cameraReverseOutline"></ion-icon>
          </ion-button>
          <ion-button  color="light" size="small" @click="captureImage" fill="clear"  class="image-overlay" id="cameraCapture">
            <ion-icon :icon="ellipseOutline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-content>
    <ion-content v-else-if="image !== null">
      <ion-button color="light" size="small" @click="() => this.image = null" fill="clear" class="image-overlay" >
        <ion-icon :icon="closeOutline"></ion-icon>
      </ion-button>
      <ion-button class="rounded image-overlay" color="primary" @click="openSendModal" size="small"  id="btnopenmodal">
        <ion-icon  style="padding-left: 4px" :icon="send"></ion-icon>
      </ion-button>
      <ion-img :src="this.image"></ion-img>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonPage, IonContent, IonImg, IonButton, IonIcon, modalController} from '@ionic/vue';
import {
  closeOutline,
  ellipseOutline,
  flash,
  flashOff,
  cameraReverseOutline,
  send
} from 'ionicons/icons';
import {CameraPreview} from "@capacitor-community/camera-preview";
import ShareContent from "@/views/ShareContent";

export default {
  name: "CameraPage",
  components: {IonContent, IonPage, IonImg, IonButton, IonIcon},
  data: () => {
    return {
      image: null,
      video: null,
      cameraActive: false,
      flash: false
    }
  },
  async mounted() {
    await this.openCamera()
  },

  methods: {
    async openCamera() {
      const cameraPreviewPictureOptions = {
        position: 'rear',
        height: window.screen.height,
        width: window.screen.width,
        parent: 'cameraPreview',
        className: 'cameraPreview'
      };
      await CameraPreview.start(cameraPreviewPictureOptions);
      this.cameraActive = true;
    },
    async stopCamera() {
      await  this.$router.back()
    },
    async flipCamera() {
      await CameraPreview.flip()
    },
    async captureImage() {
      const cameraPreviewPictureOptions= {
        quality: 100
      };
      const result = await CameraPreview.capture(cameraPreviewPictureOptions);
      const base64PictureData = result.value;
      this.image = 'data:image/jpeg;base64,' +  base64PictureData;
    },
    async openSendModal() {
      await this.showModalController()
    },
    async showModalController() {
      const modal = await modalController.create({
        breakpoints: [0.1, 0.5, 1],
        initialBreakpoint: 0.5,
        id: 'modal-share',
        component: ShareContent,
        swipeToClose: true,
        animated: true,
        componentProps: {
          imageBase64: this.image,
        }
      })
      await modal.present()
    },
    async changeFlash() {
      this.flash = !this.flash

      const CameraPreviewFlashMode = {
        flashMode: this.flash ? 'off' : 'on'
      }
      await CameraPreview.setFlashMode(CameraPreviewFlashMode)
    }
  },
  setup() {
    return {
      send,
      closeOutline,
      ellipseOutline,
      flashIcon: flash,
      flashOff,
      cameraReverseOutline
    }
  }
}
</script>

<style scoped>
.my-custom-camera-preview-content {
  --background: transparent;
}
#cameraPreview {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.image-overlay {
  z-index: 1;
  position: absolute;

  width: 50px;
  height: 50px;
}
#flashCamera {
  position: absolute;
  right: 1%;
  --ionicon-stroke-width:36px;

}
#flipCamera {
  position: absolute;
  bottom: 3%;
  right: 3%;
  --ionicon-stroke-width:46px;
}
#btnopenmodal {
  position: absolute;
  bottom: 3%;
  right: 3%;
  --ionicon-stroke-width:46px;
}
#closeCamera {
  position: absolute;
  left: 1%;
  --ionicon-stroke-width:46px;
}
#cameraCapture {
  position: absolute;
  left: 40%;
  bottom: 3%;
  --ionicon-stroke-width:46px;
  width: 70px;
  height: 70px;
}
ion-icon {
  font-size: 64px;
  color: white;
}
.rounded {
  --border-radius: 50%;
}
</style>
