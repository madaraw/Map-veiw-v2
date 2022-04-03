<template>
  <v-dialog v-model="dialog" persistent fullscreen>
    <div>
      <v-btn @click="exitCam" id="exit-button" elevation="2">Exit</v-btn>
    </div>
    <div class="frame">
      <div :id="cameraDivId" style="width: 100%; position: relative"></div>
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
  top: 0;
  left: 0;
  z-index: 100;
}
</style>