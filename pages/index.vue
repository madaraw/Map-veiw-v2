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
        >
          <v-img :src="camera.thumbnail_url" />
        </div>
      </v-list>
      <v-list>
        <v-list-item
          class="padding-tile"
          v-for="camera in offlineCamerasSide"
          :key="camera.id"
          @mouseenter="focusOnCamera(camera.id)"
          @mouseleave="unfocusOnCamera(camera.id)"
        >
          <v-img :src="camera.thumbnail_url" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <GMap ref="mapComponent" v-if="onlineCameras.length" :onlineCameras="onlineCameras" :offlineCameras="offlineCameras" />
  </v-main>
</template>

<script>
import GMap from "../components/GMap.vue"

export default {
  components: {GMap},
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
  methods:{
    focusOnCamera(id){
      this.$refs.mapComponent.focusOnMarker(id)
    },
    unfocusOnCamera(id){
      this.$refs.mapComponent.outOfMarker(id)
    },
  },
  mounted() {
  },

  beforeCreate() {
    this.$store.dispatch("cameras/FETCH_CAMERAS");
    this.$store.dispatch("cameras/FETCH_CAMERAS_KEY");
  },
};
</script>

<style>
.padding-tile{
  padding: 2px 4px;
}
.padding-tile:hover{
  padding: 4px 8px;
}
</style>