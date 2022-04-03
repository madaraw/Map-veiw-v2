<template>
  <v-main>
    <v-navigation-drawer
      width="25%"
      color="grey lighten-4"
      class="drawer"
      app
      permanent
    >
      <v-list>
        <div
          class="padding-tile"
          v-for="camera in onlineCamerasSide"
          :key="camera.id"
          @mouseenter="focusOnCamera(camera.id)"
          @mouseleave="unfocusOnCamera(camera.id)"
          @click="clickOnCamera(camera.id)"
        >
          <v-img :src="camera.thumbnail_url" />
        </div>
      </v-list>
      <v-list>
        <div
          class="padding-tile"
          v-for="camera in offlineCamerasSide"
          :key="camera.id"
          @mouseenter="focusOnCamera(camera.id)"
          @mouseleave="unfocusOnCamera(camera.id)"
          @click="clickOnCamera(camera.id)"
        >
          <v-img :src="camera.thumbnail_url" />
        </div>
      </v-list>
    </v-navigation-drawer>
    <LiveView
      v-if="liveView"
      @exit-cam="exitCamera"
      :dialog="dialog"
      :cameraSrc="cameraSrc"
      :cameraDivId="cameraDivId"
    />
    <GMap
      ref="mapComponent"
      v-if="onlineCameras.length"
      :onlineCameras="onlineCameras"
      :offlineCameras="offlineCameras"
      @click-on-marker="clickOnCamera"
    />
  </v-main>
</template>

<script>
import GMap from "../components/GMap.vue";
import liveView from "../components/liveView.vue";

export default {
  components: { GMap, liveView },
  data() {
    return {
      dialog: false,
      liveView: false,
      cameraDivId: "",
      cameraSrc: "",
    };
  },
  computed: {
    onlineCamerasSide() {
      return this.$store.getters["cameras/GET_SHOWING_ONLINE_CAMS"];
    },
    offlineCamerasSide() {
      return this.$store.getters["cameras/GET_SHOWING_OFFLINE_CAMS"];
    },
    onlineCameras() {
      return this.$store.getters["cameras/GET_ONLINE_CAMS"];
    },
    offlineCameras() {
      return this.$store.getters["cameras/GET_OFFLINE_CAMS"];
    },
  },
  methods: {
    focusOnCamera(id) {
      this.$refs.mapComponent.focusOnMarker(id);
    },
    unfocusOnCamera(id) {
      this.$refs.mapComponent.outOfMarker(id);
    },
    clickOnCamera(id) {
      this.liveView = true;
      this.cameraDivId = `ec-container-${id}`;
      this.cameraSrc = `https://dash.evercam.io/live.view.widget.js?refresh=1&camera=${id}&private=true&api_id=${process.env.API_ID}&api_key=${process.env.API_KEY}&playpause=true&download=true&fullscreen=true&magnify=true`;
      this.dialog = true;
    },
    exitCamera() {
      this.cameraDivId = "";
      this.cameraSrc = "";
      this.dialog = false;
      this.liveView = false;
    },
  },

  beforeCreate() {
    this.$store.dispatch("cameras/FETCH_CAMERAS");
  },
};
</script>

<style>
.padding-tile {
  padding: 2px 4px;
}
.padding-tile:hover {
  padding: 4px 8px;
  cursor: pointer;
}
.frame {
  height: 100vh;
}
.v-dialog--fullscreen {
  width: 100vw !important;
}
</style>