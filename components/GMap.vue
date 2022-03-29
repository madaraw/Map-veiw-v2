<template>
  <div class="map pa-0 ma-0" ref="map"></div>
</template>

<script>
export default {
  name: "GMap",
  props: ["onlineCameras", "offlineCameras"],
  data() {
    return {
      map: null,
      onlineMarkers: [],
      offlineMarkers: [],
    };
  },
  methods: {
    markersCreation(cameras, map, thumbIcon) {
      let markers = [];
      for (let i = 0; i < cameras.length; i++) {
        thumbIcon.url = cameras[i].thumbnail_url;
        let marker = new google.maps.Marker({
          position: cameras[i].location,
          icon: thumbIcon,
          map: map,
          zIndex: i,
        });

        marker.camera = cameras[i];

        marker.addListener("mouseover", () => {
          marker.setIcon({
            url: marker.getIcon().url,
            size: { width: 57, height: 31.5 },
            scaledSize: { width: 57, height: 31.5 },
          });
          marker.setZIndex(marker.getZIndex() + ((cameras.length * 2) + 1));
        });
        marker.addListener("mouseout", () => {
          marker.setIcon({
            url: marker.getIcon().url,
            size: {
              width: 38,
              height: 21,
            },
            scaledSize: {
              width: 38,
              height: 21,
            },
          });
          marker.setZIndex(marker.getZIndex() - ((cameras.length * 2) + 1));
        });
        markers.push(marker);
      }
      return markers;
    },
    findMarker(id) {
      let markerFound = null;
      let found = false;
      this.onlineMarkers.forEach((marker) => {
        if (marker.camera.id == id) {
          markerFound = marker;
          found = true;
        }
      });
      if (!found) {
        this.offlineMarkers.forEach((marker) => {
          if (marker.camera.id == id) {
            markerFound = marker;
            found = true;
          }
        });
      }
      return markerFound;
    },
    focusOnMarker: function (id) {
      let marker = this.findMarker(id);
      marker.setIcon({
        url: marker.getIcon().url,
        size: { width: 57, height: 31.5 },
        scaledSize: { width: 57, height: 31.5 },
      });
      marker.setZIndex(
        marker.getZIndex() +
          this.onlineCameras.length +
          this.offlineCameras.length +
          1
      );
      this.map.panTo(marker.camera.location);
    },
    outOfMarker: function (id) {
      let marker = this.findMarker(id);
      marker.setIcon({
        url: marker.getIcon().url,
        size: {
          width: 38,
          height: 21,
        },
        scaledSize: {
          width: 38,
          height: 21,
        },
      });
      marker.setZIndex(
        marker.getZIndex() -
          (this.onlineCameras.length +
          this.offlineCameras.length +
          1)
      );
    },
  },
  mounted() {
    let center = { lat: 53.3498, lng: -6.2603 };

    // Embedding the map
    this.map = new this.$google.maps.Map(this.$refs.map, {
      zoom: 6,
      center: center,
      disableDefaultUI: true,
    });

    let thumbIcon = {
      url: "",
      size: {
        width: 38,
        height: 21,
      },
      scaledSize: {
        width: 38,
        height: 21,
      },
    };

    // Online camera markers
    this.onlineMarkers = this.markersCreation(
      this.onlineCameras,
      this.map,
      thumbIcon
    );

    // Offline camera markers
    this.offlineMarkers = this.markersCreation(
      this.offlineCameras,
      this.map,
      thumbIcon
    );

    // console.log(marker);
  },
};
</script>

<style>
.map {
  height: 100vh;
}
</style>