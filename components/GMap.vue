<template>
  <div class="map pa-0 ma-0" ref="map"></div>
</template>

<script>
import { MarkerClusterer } from "@googlemaps/markerclusterer";

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
          marker.setZIndex(marker.getZIndex() + (cameras.length * 2 + 1));
        });
        marker.addListener("mouseout", () => {
          marker.setIcon({
            url: marker.getIcon().url,
            size: {
              width: 38,
              height: 21,
            },
          });
          marker.setZIndex(marker.getZIndex() - (cameras.length * 2 + 1));
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
          (this.onlineCameras.length + this.offlineCameras.length + 1)
      );
    },
  },
  mounted() {
    let center = { lat: 53.3498, lng: -6.2603 };
    let clusterer = null;

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

    clusterer = new MarkerClusterer({
      map: this.map,
      markers: [...this.onlineMarkers, ...this.offlineMarkers],
      renderer: {
        render: function (cluster) {
          // Selecting the thumbnail image to put
          let thumbnailUrl = "";
          for (let i = 0; i < cluster.markers.length; i++) {
            if (cluster.markers[i].camera.status == "online") {
              thumbnailUrl = cluster.markers[i].camera.thumbnail_url;
              break;
            }
          }
          if (!thumbnailUrl)
            thumbnailUrl = cluster.markers[0].camera.thumbnail_url;

          // Setting the class
          let labelStyling = 'roundUnderTen'
          if(cluster.count >= 10)
            labelStyling = "roundOverTen"
          
          // Creating the marker using the thumbnail
          const singlecluster = new google.maps.Marker({
            position: cluster.position,
            icon: {
              url: thumbnailUrl,
              size: { width: 57, height: 31.5 },
              scaledSize: { width: 57, height: 31.5 },
              labelOrigin: new google.maps.Point(55,0),
            },
            label: {
              text: String(cluster.count),
              color: "rgba(255,255,255,0.9)",
              fontSize: "12px",
              className: labelStyling,
              fontWeight: "700",
            },
            // Adjusting the zIndex to be above other markers the more markers it contains
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + cluster.count,
          });
          // Creating the content for the info window
          let content = "<div class='black--text'><ul>";
          for (let i = 0; i < cluster.markers.length; i++) {
            content +=
              "<li><h3>" + cluster.markers[i].camera.name + "</h3></li>";
          }
          content += "</ul></div>";

          // Creating the infowindow
          const infowindow = new google.maps.InfoWindow({
            content: content,
          });

          // Adding the infowindow to the cluster on hover
          singlecluster.addListener("mouseover", () => {
            infowindow.open({
              anchor: singlecluster,
              map: this.map,
              shouldFocus: false,
            });
            // Larger marker on hover
            singlecluster.setIcon({
              url: singlecluster.getIcon().url,
              size: { width: 76, height: 42 },
              scaledSize: { width: 76, height: 42 },
              labelOrigin: new google.maps.Point(74,0),
            });
            singlecluster.setZIndex(
              singlecluster.getZIndex() +
                (google.maps.Marker.MAX_ZINDEX)
            );
          });

          // Closing the window when the mouse is out
          singlecluster.addListener("mouseout", () => {
            infowindow.close();
            // Back to normal when out
            singlecluster.setIcon({
              url: singlecluster.getIcon().url,
              size: { width: 57, height: 31.5 },
              scaledSize: { width: 57, height: 31.5 },
              labelOrigin: new google.maps.Point(55,0),
            });
            singlecluster.setZIndex(
              singlecluster.getZIndex() -
                (google.maps.Marker.MAX_ZINDEX)
            );
          });

          // Pushing the cluster to the map
          return singlecluster;
        },
      },
    });
  },
};
</script>

<style>
.map {
  height: 100vh;
}
.roundUnderTen{
  background-color: #1976d2;
  padding: 4px 8px;
  border-radius: 50%;
}
.roundOverTen{
  background-color: #1976d2;
  padding: 5px;
  border-radius: 50%;
}
</style>