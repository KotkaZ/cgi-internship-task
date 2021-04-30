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
                <InputMask
                  id="latitude"
                  v-model="latitude"
                  mask="999.?999999"
                />
                <label for="latitude">Latitude</label>
              </span>
            </div>
          </div>

          <div class="p-field">
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon"><i class="pi pi-tag"></i></span>
              <span class="p-float-label">
                <InputMask
                  id="longitude"
                  v-model="longitude"
                  mask="999.?99999"
                />
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
                <Calendar id="date" v-model="date" dateFormat="mm.dd.yy" />
                <label for="date">Date</label>
              </span>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="p-fluid">
          <Button icon="pi pi-search" label="Calculate" @click="calculate()" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import Card from "primevue/card";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import { Options, Vue } from "vue-class-component";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

@Options({
  components: {
    InputMask,
    Card,
    Button,
    Calendar,
  },
})
export default class InputFields extends Vue {
  public longitude = 0.0;
  public latitude = 0.0;
  public date = "";

  public calculate(): void {
    this.$emit(
      "calculate",
      Number(this.longitude),
      Number(this.latitude),
      new Date(this.date)
    );
  }

  mounted(): void {
    const map = L.map("mapid").setView([51.505, -0.09], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map);
  }
}
</script>

<style>
#mapid {
  height: 500px;
}
</style>
