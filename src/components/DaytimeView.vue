<template>
  <Card>
    <template #title> Sunrise/Sunset Calculator </template>
    <template #content>
      <h4 id="disclaimer">
        Disclaimer! This app uses sun angle estimations, therefore it may be off
        ±5 minutes.
      </h4>

      <div class="p-grid p-jc-evenly">
        <Card id="sunrise_card" class="p-md-2 p-col-12 p-shadow-14">
          <template #title> Sunrise </template>
          <template #content>
            <h3>
              {{ displayTime(solarEvents[0].getSunrise + timezone.offset) }}
              <br />
              {{ timezone.name }}
            </h3>
          </template>
        </Card>
        <Card id="sunset_card" class="p-md-2 p-col-12 p-shadow-14">
          <template #title> Sunset </template>
          <template #content>
            <h3>
              {{ displayTime(solarEvents[0].getSunset + timezone.offset) }}
              <br />
              {{ timezone.name }}
            </h3>
          </template>
        </Card>
        <Card id="daylight_card" class="p-md-2 p-col-12 p-shadow-14">
          <template #title> Daylight </template>
          <template #content>
            <h3>{{ displayHours(solarEvents[0].getDaylight) }}</h3>
          </template>
        </Card>
      </div>
    </template>

    <template #footer class="p-grid">
      <Chart
        class="p-md-8 p-col-12 p-m-auto p-shadow-14"
        v-if="solarEvents.length > 1"
        type="line"
        :data="graphData(solarEvents)"
        :options="basicOptions"
      />
    </template>
  </Card>
</template>

<script lang="ts">
// UI Components
import Chart from "primevue/chart";
import Card from "primevue/card";
import { Options, Vue } from "vue-class-component";

// TS Models
import Timezone from "@/models/Timezone";
import SolarEvent from "@/models/SolarEvent";
import GraphData from "@/models/GraphData";
import DataSet from "@/models/DataSet";

@Options({
  components: {
    Card,
    Chart,
  },
  props: {
    solarEvents: Array,
    timezone: Timezone,
  },
})
export default class DaytimeView extends Vue {
  public basicOptions = null;

  /**
   * Computed method for formating hours.
   * @param time time in float hours.
   * @return xx h yy min string fromat
   */
  public displayHours(time: number): string {
    return `${~~time}h ${~~((time - ~~time) * 60)}min`;
  }

  /**
   * Computed method for displaying time.
   * @param time time in float hours.
   * @return time in 24 hours fromat
   */
  public displayTime(time: number): string {
    time = time % 24;
    if (time < 0) time += 24;

    const hours = (time < 10 ? "0" : "") + ~~time;
    const minutes =
      ((time - ~~time) * 60 < 10 ? "0" : "") + ~~((time - ~~time) * 60);
    return `${hours}:${minutes}`;
  }

  /**
   * Computed method for setting solarevents to graphdata dataset.
   * @param solarevents array of solarevents models
   * @return graphData object with lables and dataset
   */
  public graphData(solarEvents: Array<SolarEvent>): GraphData {
    const graphData = new GraphData();
    const daylightDataset = new DataSet("Daylight", true, "#000000", false);
    const sunriseDataset = new DataSet("Sunrise UTC+0", false, "#ff4400", true);
    const sunsetDataset = new DataSet("Sunset UTC+0", false, "#000c5c", true);

    for (const solarEvent of solarEvents) {
      graphData.labels.push(
        `${("0" + solarEvent.getDate.getDate()).slice(-2)}.${(
          "0" +
          (solarEvent.getDate.getMonth() + 1)
        ).slice(-2)}`
      );
      daylightDataset.data.push(solarEvent.getDaylight);
      sunriseDataset.data.push(solarEvent.getSunrise);
      sunsetDataset.data.push(solarEvent.getSunset);
    }

    graphData.datasets.push(daylightDataset);
    graphData.datasets.push(sunriseDataset);
    graphData.datasets.push(sunsetDataset);

    return graphData;
  }
}
</script>

<style scoped>
#disclaimer {
  color: red;
}

#sunrise_card {
  background-color: #ff4400;
  color: #f4f5e5;
}

#sunset_card {
  background-color: #000c5c;
  color: #f4f5e5;
}
h3 {
  margin: 0px;
}
</style>
