<template>
  <v-main>
    <v-navigation-drawer
      width="25%"
      color="grey lighten-4"
      class="drawer"
      app
      permanent
    >
      <div class="px-2 ma-0">
        <v-text-field
          v-model="query"
          placeholder="Search..."
          class="rounded ma-0"
          light
          background-color="white"
          append-icon="mdi-magnify"
        ></v-text-field>
      </div>
      <div v-if="serverQuery" class="black--text px-2 text-body-2">
        {{ onlineCamerasSide.length + offlineCamerasSide.length }} cameras found
      </div>
      <v-list v-if="onlineCamerasSide || offlineCamerasSide">
        <div
          class="padding-tile"
          v-for="camera in onlineCamerasSide"
          :id="camera.id"
          :key="camera.id"
          @mouseenter="focusOnCamera(camera.id)"
          @mouseleave="unfocusOnCamera(camera.id)"
          @click="clickOnCamera(camera.id)"
        >
          <v-img :src="camera.thumbnail_url" />
          <div
            class="white--text pa-0 ma-0 tile-name"
            :id="'name-' + camera.id"
          >
            {{ camera.name }}
          </div>
        </div>
      </v-list>
      <v-list>
        <div
          class="padding-tile"
          v-for="camera in offlineCamerasSide"
          :id="camera.id"
          :key="camera.id"
          @mouseenter="focusOnCamera(camera.id)"
          @mouseleave="unfocusOnCamera(camera.id)"
          @click="clickOnCamera(camera.id)"
        >
          <v-img :src="camera.thumbnail_url" />
          <div
            class="white--text pa-0 ma-0 tile-name"
            :id="'name-' + camera.id"
          >
            {{ camera.name }}
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <LiveView
      v-if="liveView"
      @exit-cam="exitCamera"
      :dialog="dialog"
      :cameraSrc="cameraSrc"
      :cameraDivId="cameraDivId"
      :thumbnail="thumbnail"
      :status="status"
    />
    <GMap
      ref="mapComponent"
      v-if="onlineCameras.length"
      :onlineCameras="onlineCameras"
      :offlineCameras="offlineCameras"
      @click-on-marker="clickOnCamera"
      @hover-over-marker="findMarkerThumbnail"
      @out-of-marker="unfindMarkerThumbnail"
    />
  </v-main>
</template>

<script>
import GMap from "../components/GMap.vue";

export default {
  components: { GMap },
  data() {
    return {
      dialog: false,
      liveView: false,
      cameraDivId: "",
      cameraSrc: "",
      query: "",
      thumbnail: "",
      status: "",
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
    serverQuery() {
      return this.$store.getters["cameras/GET_SEARCH_QUERY"];
    },
  },
  watch: {
    query(newQuery) {
      this.$store.commit("cameras/SEARCH", newQuery);
    },
  },
  methods: {
    focusOnCamera(id) {
      this.$refs.mapComponent.focusOnMarker(id);
      document.getElementById("name-" + id).classList.add("tile-name-hover");
    },
    unfocusOnCamera(id) {
      this.$refs.mapComponent.outOfMarker(id);
      document.getElementById("name-" + id).classList.remove("tile-name-hover");
    },
    findCamera(id) {
      let cam = null;
      this.onlineCameras.forEach((camera) => {
        if (camera.id == id) cam = camera;
      });
      this.offlineCameras.forEach((camera) => {
        if (camera.id == id) cam = camera;
      });
      return cam;
    },
    clickOnCamera(id) {
      let cam = this.findCamera(id);
      console.log(cam);
      this.liveView = true;
      this.cameraDivId = `ec-container-${id}`;
      this.cameraSrc = `https://dash.evercam.io/live.view.widget.js?refresh=1&camera=${id}&private=true&api_id=${process.env.API_ID}&api_key=${process.env.API_KEY}&playpause=true&download=true&fullscreen=true&magnify=true`;
      this.thumbnail = cam.thumbnail_url;
      this.status = cam.status;
      this.dialog = true;
    },
    exitCamera() {
      this.cameraDivId = "";
      this.cameraSrc = "";
      this.dialog = false;
      this.liveView = false;
    },
    findMarkerThumbnail(id) {
      document.getElementById(id).scrollIntoView();
      document.getElementById(id).classList.add("padding-tile-hover");
      document.getElementById("name-" + id).classList.add("tile-name-hover");
    },
    unfindMarkerThumbnail(id) {
      document.getElementById(id).classList.remove("padding-tile-hover");
      document.getElementById("name-" + id).classList.remove("tile-name-hover");
    },
  },

  beforeCreate() {
    this.$store.dispatch("cameras/FETCH_CAMERAS");
  },
};
</script>

<style>
.padding-tile {
  position: relative;
  padding: 2px 4px;
}
.tile-name {
  position: absolute;
  bottom: 3px;
  left: 10px;
}
.tile-name-hover {
  bottom: 5px;
  left: 15px;
}
.padding-tile:hover {
  padding: 4px 8px;
  cursor: pointer;
}
.padding-tile-hover {
  padding: 4px 8px;
}
</style>