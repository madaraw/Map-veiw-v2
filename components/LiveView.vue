<template>
  <v-dialog v-model="dialog" style="overflow: hidden; " persistent width="987">
    <div>
      <v-btn @click="exitCam" fab light x-small id="exit-button" elevation="6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="width: 20px; height: 20px"
          viewBox="0 0 320 512"
        >
          <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
          />
        </svg>
      </v-btn>
    </div>

    <div
      v-if="status == 'online'"
      :id="cameraDivId"
      style="max-height: 100%; object-fit: contain; position: relative;"
    ></div>
    <div v-else class="offline-image">
      <img class="offline-image" :src="thumbnail" />
      <div class="status-offline rounded">{{ status }}</div>
    </div>
    <script :src="cameraSrc" async></script>
  </v-dialog>
</template>


<script>
export default {
  props: [
    "cameraDivId",
    "cameraSrc",
    "dialog",
    "status",
    "thumbnail",
  ],
  methods: {
    exitCam() {
      this.$emit("exit-cam");
    },
  },
};
</script>

<style>
#exit-button {
  position: absolute;
  top: 16px;
  right: 165px;
  z-index: 100;
}
.v-dialog--fullscreen {
  width: 100vw !important;
}
.offline-image {
  position: relative;
  width: 100%;
}
.status-offline {
  position: absolute;
  top: 0;
  left: 45%;
  background-color: darkgray;
  padding: 1px 2px;
}
</style>