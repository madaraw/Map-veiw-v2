<template>
  <v-main> 
    <v-navigation-drawer app permanent>
    </v-navigation-drawer>
    <div class="map pa-0 ma-0" ref="map"></div>
    </v-main>
</template>

<script>
export default {
  mounted() {
    let map = null;
    let center = { lat: 53.3498, lng: -6.2603 };

    // Embedding the map
    map = new this.$google.maps.Map(this.$refs.map, {
      zoom: 6,
      center: center,
      disableDefaultUI: true,
    });
  },
};
</script>

<style>
.map{
  height: 100vh;
}
</style>