<template>
  <v-dialog v-model="dialog" persistent style="height: 100vh;">
    <div>
      <v-btn @click="exitCam" fab light x-small class="text-subtitle-2" id="exit-button" elevation="6">X</v-btn>
    </div>
    <div>
      <div :id="cameraDivId" style="width: 100%; position: relative">
      </div>
    </div>
    <script :src="cameraSrc" async></script>
  </v-dialog>
</template>


<script>
export default {
  props: ["cameraDivId", "cameraSrc", "dialog"],
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
  top: 8px;
  right: 8px;
  z-index: 100;
}
.v-dialog--fullscreen {
  width: 100vw !important;
}
</style>