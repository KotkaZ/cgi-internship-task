<template>
  <div class="p-grid p-nogutter nested-grid">
    <div class="p-md-6 p-col-12">
      <div id="mapid" class="p-mr-2"></div>
    </div>

    <Card class="p-md-6 p-col-12">
      <template #title> Coordinates </template>
      <template #content>
        <div class="p-fluid p-grid">
          <!--Latitude input textbox-->
          <div class="p-field p-col-12 p-md-6">
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

          <!--Longitude input textbox-->
          <div class="p-field p-col-12 p-md-6">
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon"><i class="pi pi-tag"></i></span>
              <span class="p-float-label">
                <InputText id="longitude" v-model="longitude" />
                <label for="longitude">Longitude</label>
              </span>
            </div>
          </div>

          <!--Main date input calendar field-->
          <div class="p-field p-col-12">
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

          <!--Advanced fieldset-->
          <Fieldset
            legend="Advanced"
            :toggleable="true"
            :collapsed="true"
            class="p-col-12"
          >
            <div class="p-fluid p-grid">
              <!--Date interval input calendar-->
              <div class="p-field p-col-12">
                <div class="p-inputgroup">
                  <span class="p-inputgroup-addon"
                    ><i class="pi pi-calendar"></i
                  ></span>
                  <span class="p-float-label">
                    <Calendar
                      id="enddate"
                      v-model="enddate"
                      dateFormat="dd/mm/yy"
                      :minDate="date"
                    />
                    <label for="enddate">Interval enddate</label>
                  </span>
                </div>
              </div>

              <!--Dropdown menu for timezones-->
              <div class="p-field p-col-12">
                <div class="p-inputgroup">
                  <span class="p-inputgroup-addon"
                    ><i class="pi pi-clock"></i
                  ></span>
                  <span class="p-float-label">
                    <Dropdown
                      id="timezonepicker"
                      v-model="selectedTimezone"
                      :options="timezones"
                      optionLabel="name"
                      placeholder="Select a Timezone"
                    />
                    <label for="timezonepicker">Timezone</label>
                  </span>
                </div>
              </div>
            </div>
          </Fieldset>
        </div>
      </template>
      <template #footer> </template>
    </Card>
  </div>
</template>

<script lang="ts">
import Card from "primevue/card";
import Fieldset from "primevue/fieldset";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { Options, Vue } from "vue-class-component";

import "leaflet/dist/leaflet.css";
import L, { LeafletMouseEvent, Map, Marker } from "leaflet";

@Options({
  components: {
    InputText,
    Card,
    Button,
    Calendar,
    Fieldset,
    Dropdown,
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
  public enddate = new Date();
  public rangeChecked = false;
  private map!: Map;
  private marker!: Marker;

  public timezones = [
    { name: "UTC-11", code: "-11" },
    { name: "UTC-10", code: "-10" },
    { name: "UTC-9:30", code: "-9.5" },
    { name: "UTC-9", code: "-9" },
    { name: "UTC-8", code: "-8" },
    { name: "UTC-7", code: "-7" },
    { name: "UTC-6", code: "-6" },
    { name: "UTC-5", code: "-5" },
    { name: "UTC-4", code: "-4" },
    { name: "UTC-3:30", code: "-3.5" },
    { name: "UTC-3", code: "-3" },
    { name: "UTC-2", code: "-2" },
    { name: "UTC-1", code: "-1" },
    { name: "UTC+0", code: "+0" },
    { name: "UTC+1", code: "+1" },
    { name: "UTC+2", code: "+2" },
    { name: "UTC+3", code: "+3" },
    { name: "UTC+3:30", code: "+3.5" },
    { name: "UTC+4", code: "+4" },
    { name: "UTC+4:30", code: "+4.5" },
    { name: "UTC+5", code: "+5" },
    { name: "UTC+5:30", code: "+5.5" },
    { name: "UTC+5:45", code: "+5.75" },
    { name: "UTC+6", code: "+6" },
    { name: "UTC+6:30", code: "+6.5" },
    { name: "UTC+7", code: "+7" },
    { name: "UTC+8", code: "+8" },
    { name: "UTC+8:45", code: "+8.75" },
    { name: "UTC+9", code: "+9" },
    { name: "UTC+9:30", code: "+9.5" },
    { name: "UTC+10", code: "+10" },
    { name: "UTC+10:30", code: "+10.5" },
    { name: "UTC+11", code: "+11" },
    { name: "UTC+12", code: "+12" },
    { name: "UTC+12:45", code: "+12.75" },
    { name: "UTC+13", code: "+13" },
    { name: "UTC+14", code: "+14" },
  ];
  public selectedTimezone = this.timezones[16];

  public calculate(): void {
    if (this.date && this.latitude && this.longitude)
      this.$emit(
        "calculate",
        Number(this.longitude),
        Number(this.latitude),
        this.date,
        this.enddate,
        this.selectedTimezone
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
