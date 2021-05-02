<template>
  <div class="home p-grid p-nogutter p-jc-center">
    <DaytimeView
      :solarEvents="solarEvents"
      :timezone="timezone"
      class="p-mb-3 p-col-12 p-xl-8"
    />
    <InputFields @calculate="save" class="p-col-12 p-xl-8" />
  </div>
</template>

<script lang="ts">
import SolarEvent from "@/models/SolarEvent";
import Timezone from "@/models/Timezone";

import { Options, Vue } from "vue-class-component";
import DaytimeView from "@/components/DaytimeView.vue"; // @ is an alias to /src
import InputFields from "@/components/InputFields.vue"; // @ is an alias to /src

@Options({
  components: {
    DaytimeView,
    InputFields,
  },
})
export default class Home extends Vue {
  public solarEvents: Array<SolarEvent> = [new SolarEvent(0, 0, new Date())];
  public timezone: Timezone = new Timezone("UTC+0", 0);

  /**
   * Saves solarEvents from inputFields emit.
   */
  public save(
    latitude: number,
    longitude: number,
    date: Date,
    enddate: Date,
    timezone: Timezone
  ): void {
    this.timezone = timezone;
    this.solarEvents = [new SolarEvent(latitude, longitude, new Date(date))];

    if (enddate) {
      let copyDate = new Date(date);
      while (enddate.valueOf() - copyDate.valueOf() > 0) {
        copyDate.setDate(copyDate.getDate() + 1);
        const newDate = new Date(copyDate);
        this.solarEvents.push(new SolarEvent(latitude, longitude, newDate));
      }
    }
  }
}
</script>
