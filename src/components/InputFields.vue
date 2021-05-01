<template>
  <div class="p-grid p-nogutter">
    <div id="mapid" class="p-md-6 p-col-12"></div>

    <Card class="p-md-6 p-col-12">
      <template #title> Coordinates </template>
      <template #content>
        <div class="p-fluid">
          <div class="p-field">
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon">
                <i class="pi pi-tag"></i>
              </span>
              <span class="p-float-label">
                <InputText id="latitude" v-model="latitude" />
                <label for="latitude">Latitude</label>
              </span>
            </div>
          </div>

          <div class="p-field">
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon"><i class="pi pi-tag"></i></span>
              <span class="p-float-label">
                <InputText id="longitude" v-model="longitude" />
                <label for="longitude">Longitude</label>
              </span>
            </div>
          </div>

          <div class="p-field">
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon"
                ><i class="pi pi-calendar"></i
              ></span>
              <span class="p-float-label">
                <Calendar id="date" v-model="date" dateFormat="dd/mm/yy" />
                <label for="date">Date</label>
              </span>
            </div>
          </div>
        </div>
      </template>
      <template #footer> </template>
    </Card>
  </div>
</template>

<script lang="ts">
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import { Options, Vue } from "vue-class-component";

import "leaflet/dist/leaflet.css";
import L, { LeafletMouseEvent, Map, Marker } from "leaflet";

@Options({
  components: {
    InputText,
    Card,
    Button,
    Calendar,
  },
  watch: {
    longitude: function (val) {
      this.longitude = val;
      this.updateMap();
      this.calculate();
    },
    latitude: function (val) {
      this.latitude = val;
      this.updateMap();
      this.calculate();
    },
    date: function (val) {
      this.date = val;
      this.calculate();
    },
  },
})
export default class InputFields extends Vue {
  public longitude = 26.741067622905167;
  public latitude = 58.36514538336391;
  public date = new Date();
  private map!: Map;
  private marker!: Marker;

  public calculate(): void {
    if (this.date && this.latitude && this.longitude)
      this.$emit(
        "calculate",
        Number(this.longitude),
        Number(this.latitude),
        new Date(this.date)
      );
  }

  public updateMap(): void {
    this.marker.setLatLng([this.latitude, this.longitude]);
    this.map.setView([this.latitude, this.longitude]);
  }

  public onMapClick(e: LeafletMouseEvent): void {
    this.longitude = e.latlng.lng;
    this.latitude = e.latlng.lat;
    this.updateMap();
  }

  mounted(): void {
    this.map = L.map("mapid").setView([this.latitude, this.longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.marker = L.marker([this.latitude, this.longitude], {
      icon: L.icon({
        iconUrl: "http://leafletjs.com/examples/custom-icons/leaf-red.png",
        shadowUrl: "http://leafletjs.com/examples/custom-icons/leaf-shadow.png",

        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
      }),
    }).addTo(this.map);

    this.map.on("click", this.onMapClick);
    this.calculate();
  }
}
</script>

<style>
#mapid {
  height: 500px;
}
</style>
