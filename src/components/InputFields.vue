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
// TS Models
import Timezone from "@/models/Timezone";

// UI Components
import Card from "primevue/card";
import Fieldset from "primevue/fieldset";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { Options, Vue } from "vue-class-component";

// Map components
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
  // For realtime view and calculations we use watchers
  watch: {
    longitude: function (val) {
      this.longitude = val;
      this.updateMap(); // Updates marker location
      this.calculate(); // Recalculates the time
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
    enddate: function (val) {
      this.enddate = val;
      this.calculate();
    },
    selectedTimezone: function (val) {
      this.selectedTimezone = val;
      this.calculate();
    },
  },
})
export default class InputFields extends Vue {
  // Default values are set according to CGI Tartu's location :P
  public longitude = 26.741067622905167;
  public latitude = 58.36514538336391;
  public date = new Date();
  public enddate = new Date();
  private map!: Map;
  private marker!: Marker;

  public timezones = [
    new Timezone("UTC-11", -11),
    new Timezone("UTC-10", -10),
    new Timezone("UTC-9:30", -9.5),
    new Timezone("UTC-9", -9),
    new Timezone("UTC-8", -8),
    new Timezone("UTC-7", -7),
    new Timezone("UTC-6", -6),
    new Timezone("UTC-5", -5),
    new Timezone("UTC-4", -4),
    new Timezone("UTC-3:30", -3.5),
    new Timezone("UTC-3", -3),
    new Timezone("UTC-2", -2),
    new Timezone("UTC-1", -1),
    new Timezone("UTC+0", 0),
    new Timezone("UTC+1", 1),
    new Timezone("UTC+2", 2),
    new Timezone("UTC+3", 3),
    new Timezone("UTC+3:30", 3.5),
    new Timezone("UTC+4", 4),
    new Timezone("UTC+4:30", 4.5),
    new Timezone("UTC+5", 5),
    new Timezone("UTC+5:30", 5.5),
    new Timezone("UTC+5:45", 5.75),
    new Timezone("UTC+6", 6),
    new Timezone("UTC+6:30", 6.5),
    new Timezone("UTC+7", 7),
    new Timezone("UTC+8", 8),
    new Timezone("UTC+8:45", 8.75),
    new Timezone("UTC+9", 9),
    new Timezone("UTC+9:30", 9.5),
    new Timezone("UTC+10", 10),
    new Timezone("UTC+10:30", 10.5),
    new Timezone("UTC+11", 11),
    new Timezone("UTC+12", 12),
    new Timezone("UTC+12:45", 12.75),
    new Timezone("UTC+13", 13),
    new Timezone("UTC+14", 14),
  ];
  public selectedTimezone = this.timezones[16];

  /** If all important compononents (date, lat, lng) are present,
   * then emits data to Home.vue for further processing.
   */
  public calculate(): void {
    if (this.date && this.latitude && this.longitude)
      this.$emit(
        "calculate",
        Number(this.latitude),
        Number(this.longitude),
        this.date,
        this.enddate,
        this.selectedTimezone
      );
  }

  /**
   * Updates marker location on map.
   */
  public updateMap(): void {
    this.marker.setLatLng([this.latitude, this.longitude]);
    this.map.setView([this.latitude, this.longitude]);
  }

  /**
   * Takes lat and lng values from map according to user click.
   */
  public onMapClick(e: LeafletMouseEvent): void {
    this.longitude = e.latlng.lng;
    this.latitude = e.latlng.lat;
    this.updateMap();
  }

  /**
   * Vue interface method. Gets called on component mount, which means each time component is rendered.
   * Creates map instance and it's tileLayer and marker. Calls default calculation.
   */
  mounted(): void {
    this.map = L.map("mapid").setView([this.latitude, this.longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.marker = L.marker([this.latitude, this.longitude], {
      icon: L.icon({
        // No idea why assets do not work here. Had to use URL from web. Codesmell :(
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
