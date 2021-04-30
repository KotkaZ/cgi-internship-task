<template>
  <Card>
    <template #title> Daytime View </template>
    <template #content>
      <div class="p-grid p-jc-evenly">
        <Card class="p-md-2 p-col-12">
          <template #title> Sunrise </template>
          <template #content>
            {{ displayTime(solarEvent.getSunrise) }}
          </template>
        </Card>
        <Card class="p-md-2 p-col-12">
          <template #title> Sunset </template>
          <template #content>
            {{ displayTime(solarEvent.getSunset) }}
          </template>
        </Card>
        <Card class="p-md-2 p-col-12">
          <template #title> Daylight </template>
          <template #content>
            {{ displayHours(solarEvent.getDaylight) }}
          </template>
        </Card>
      </div>
    </template>
    <template #footer> </template>
  </Card>
</template>

<script lang="ts">
import SolarEvent from "@/models/SolarEvent";
import Card from "primevue/card";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    Card,
  },
  props: {
    solarEvent: SolarEvent,
  },
})
export default class DaytimeView extends Vue {
  public displayHours(time: number): string {
    return `${~~time}h ${~~((time - ~~time) * 60)}min`;
  }

  public displayTime(time: number): string {
    console.log(time);
    const hours = (time < 10 ? "0" : "") + ~~time;
    const minutes =
      ((time - ~~time) * 60 < 10 ? "0" : "") + ~~((time - ~~time) * 60);
    return `${hours}:${minutes}`;
  }
}
</script>

<style></style>
