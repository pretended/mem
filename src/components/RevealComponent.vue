<template>
<ion-page>
  <ion-header v-if="group_.statistics">
    <ion-toolbar class="toolbar toolbar-container" style="padding: 0px !important;">
      <div  style="display: flex; flex-direction: row; justify-content: space-between; padding-bottom: 8px; padding-top: 8px; '">
        <ion-progress-bar :style="'width: ' + pgWidth + '%'" v-for="(progress, index) in group_.statistics.length" :key="index" :value="v[index]"></ion-progress-bar>
      </div>
      <div >
        <swiper       class="mySwiper" :cube-effect="{ shadow: false, slideShadows: false }"
                      :slides-per-view="1"
                      :centeredSlides="true"
                      @slideChange="onSlideChange" effect="fade" :modules="modules" :zoom="true"
                      :autoplay="{
      delay: 4000,
      disableOnInteraction: false,
      stopOnLastSlide: true
    }"  >
          <swiper-slide v-for="(p, index) in group_.statistics" :key="index" >
            <ion-img :src="p.url" ></ion-img>
          </swiper-slide>
        </swiper>
      </div>
    </ion-toolbar>
  </ion-header>

</ion-page>
</template>

<script>
import {IonicSlides, IonPage, IonProgressBar, IonImg, IonToolbar, IonHeader} from "@ionic/vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Zoom, EffectFade } from 'swiper';

import {ref} from "vue";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/zoom';
import '@ionic/vue/css/ionic-swiper.css';
import 'swiper/css/effect-fade';

export default {
  name: "RevealComponent",
  components: {IonPage,IonProgressBar,Swiper, SwiperSlide, IonImg, IonToolbar, IonHeader  },
  props: {
    group: Object,
    modalId: String
  },
  setup(props) {
    const intervalRef = ref();
    const index = ref(0);
    const onSlideChange = (ev) => {
       if (ev.swipeDirection === 'next') {
        v.value[index.value] = 1
        index.value += 1
      } else if (ev.swipeDirection === 'prev') {
        v.value[index.value] = 0;
        index.value -= 1
      } else {
        v.value[index.value] = 1
        index.value += 1
      }
      if (ev.isEnd) {
        setTimeout(() => {
          clearInterval(intervalRef.value)
        }, 4000)
      }
    };
    const v = ref(new Array(props.group.value.statistics.length).fill(0))
    const time = 100
    intervalRef.value = setInterval(() => {
      v.value[index.value] += 0.025

    }, time)
    return {
      group_: props.group,
      v: v,
      pgWidth: props.group.value.statistics ? 100 / (props.group.value.statistics.length * 1.0075) : 0,
      modules: [EffectFade, Autoplay, Zoom, IonicSlides],
      onSlideChange,
    }
  }
}
</script>

<style scoped>

.swiper {
  width: 100% !important;
  height: 100%;
}
.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 100% !important;
  height: 100%;
}

.swiper-slide img {
  display: block;
  width: 100%;
}
.toolbar {
  background-color: var(--ion-color-base);
  --opacity: 0 !important;
  padding-inline-start: 0px !important;
  padding-inline-end: 0px !important;
  padding: 0px !important;;
}
.toolbar .toolbar-container {
  padding-inline-start: 0px !important;
  padding-inline-end: 0px !important;
  padding: 0px !important;;
}
.toolbar-container {
  padding-inline-start: 0px !important;
  padding-inline-end: 0px !important;
  padding: 0px !important
}
</style>
