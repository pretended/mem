<template>
  <ion-page>
    <ion-content class="my-custom-camera-preview-content" :fullscreen="true" v-if="image === '' && video === ''">
      <div id="cameraPreview" class="cameraPreview">
        <div v-if="cameraActive">
          <ion-button color="light" size="small" @click="stopAndGoBack" fill="clear" class="image-overlay" id="closeCamera">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
          <ion-button color="light" size="small" @click="changeFlash" fill="clear" class="image-overlay" id="flashCamera">
            <ion-icon :icon="!flash_ ? flashIcon : flashOff"></ion-icon>
          </ion-button>
          <ion-button  color="light" size="small" @click="flipCamera" fill="clear"  class="image-overlay" id="flipCamera">
            <ion-icon :icon="cameraReverseOutline"></ion-icon>
          </ion-button>
          <ion-button  color="light" size="small" @click="captureImage" fill="clear"  class="image-overlay" id="cameraCapture">
            <ion-icon :icon="ellipseOutline"></ion-icon>
          </ion-button>
        </div>
        <div v-else style="display: flex;align-items: center; margin: auto">
          <ion-spinner ></ion-spinner>
        </div>
      </div>
    </ion-content>
    <ion-content v-else-if="image !== ''" :fullscreen="true">
      <ion-button color="light" size="small" @click="goBack" fill="clear" class="image-overlay"  id="btnclearimage">
        <ion-icon :icon="closeOutline"></ion-icon>
      </ion-button>
      <ion-button class="rounded image-overlay" color="primary" @click="openSendModal" size="small"  id="btnopenmodal">
        <ion-icon  style="padding-left: 4px" :icon="send"></ion-icon>
      </ion-button>
      <ion-img :src="image"></ion-img>
    </ion-content>

  </ion-page>
</template>

<script>
import {IonPage, IonContent, IonImg, IonButton, IonIcon, modalController, IonSpinner} from '@ionic/vue';
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
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "CameraPage",
  components: {IonContent, IonPage, IonImg, IonButton, IonIcon, IonSpinner},
  setup () {
    const image = ref('');
    const video = ref('');
    const cameraActive = ref(false);
    const flash_ = ref(false);
    const router = useRouter();
    const stopCamera = async () => {
      await CameraPreview.stop()
      cameraActive.value = false;
    }
    const openCamera =  async () => {
      const cameraPreviewPictureOptions = {
        position: 'rear',
        height: window.screen.height,
        width: window.screen.width,
        parent: 'cameraPreview',
        className: 'cameraPreview'
      };
      await CameraPreview.start(cameraPreviewPictureOptions);
      cameraActive.value = true;
    }
    const captureImage = async () => {
      const cameraPreviewPictureOptions= {
        quality: 100
      };
      const result = await CameraPreview.capture(cameraPreviewPictureOptions);
      const base64PictureData = result.value;
      image.value = 'data:image/jpeg;base64,' +  base64PictureData;
    }
    const changeFlash = async () => {
      flash_.value = !flash_.value

      const CameraPreviewFlashMode = {
        flashMode: flash_.value ? 'off' : 'on'
      }
      await CameraPreview.setFlashMode(CameraPreviewFlashMode)
    }
    const showModalController = async () => {
      const modal = await modalController.create({
        breakpoints: [0.1, 0.5, 1],
        initialBreakpoint: 0.5,
        id: 'modal-share',
        component: ShareContent,
        swipeToClose: true,
        animated: true,
        componentProps: {
          imageBase64: image.value,
        }
      })
      await modal.present()
    }
    const goBack = async () => {
      image.value = '';
      video.value = '';
      cameraActive.value = false;
      await openCamera()
    }
    const stopAndGoBack = async () => {
      await stopCamera();
      await router.back();
    }
    onMounted(async () => {
      console.log('mounted')
      await openCamera();
    })
    return {
      stopAndGoBack,
      openCamera,
      stopCamera,
      flipCamera: async () => await CameraPreview.flip(),
      captureImage,
      changeFlash,
      openSendModal: async () => await showModalController(),
      goBack,
      image,
      video,
      flash_,
      cameraActive,
      send,
      closeOutline,
      ellipseOutline,
      flashIcon: flash,
      flashOff,
      cameraReverseOutline
    }
  },
}
</script>

<style scoped >
.my-custom-camera-preview-content {
  --background: transparent;
}
#cameraPreview {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 11;
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
  z-index: 11;
}
#flipCamera {
  position: absolute;
  bottom: 3%;
  right: 3%;
  --ionicon-stroke-width:46px;
  z-index: 11;
}
#btnopenmodal {
  position: absolute;
  bottom: 3%;
  right: 3%;
  --ionicon-stroke-width:46px;
  z-index: 11;
}
#closeCamera {
  position: absolute;
  left: 1%;
  --ionicon-stroke-width:46px;
  z-index: 11;
}
#btnclearimage {
  position: absolute;
  --ionicon-stroke-width:46px;
  z-index: 11;
  z-index: 11;
}
#cameraCapture {
  position: absolute;
  left: 40%;
  bottom: 3%;
  --ionicon-stroke-width:46px;
  width: 70px;
  height: 70px;
  z-index: 11;
}
ion-icon {
  font-size: 64px;
  color: white;
}
.rounded {
  --border-radius: 50%;
}
</style>
