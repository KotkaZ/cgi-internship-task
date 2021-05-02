<template>
  <Card>
    <template #title> Daytime View </template>
    <template #content>
      <h3>
        Disclaimer! This app uses sun angle estimations, therefore it may be off
        ±5 minutes.
      </h3>

      <div class="p-grid p-jc-evenly">
        <Card class="p-md-2 p-col-12">
          <template #title> Sunrise </template>
          <template #content>
            {{ displayTime(solarEvents[0].getSunrise + timezone) }}
          </template>
        </Card>
        <Card class="p-md-2 p-col-12">
          <template #title> Sunset </template>
          <template #content>
            {{ displayTime(solarEvents[0].getSunset + timezone) }}
          </template>
        </Card>
        <Card class="p-md-2 p-col-12">
          <template #title> Daylight </template>
          <template #content>
            {{ displayHours(solarEvents[0].getDaylight) }}
          </template>
        </Card>
      </div>
    </template>

    <template #footer>
      <Chart
        v-if="solarEvents.length > 1"
        type="line"
        :data="graphData(solarEvents)"
        :options="basicOptions"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import Chart from "primevue/chart";
import Card from "primevue/card";
import { Options, Vue } from "vue-class-component";
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
    timezone: Number,
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
    const dataSet = new DataSet("Daylight length", true, "#FFA726");

    for (const solarEvent of solarEvents) {
      graphData.labels.push(
        `${("0" + solarEvent.getDate.getDate()).slice(-2)}.${(
          "0" +
          (solarEvent.getDate.getMonth() + 1)
        ).slice(-2)}`
      );
      dataSet.data.push(solarEvent.getDaylight);
    }

    graphData.datasets.push(dataSet);

    return graphData;
  }
}
</script>

<style scoped>
h3 {
  color: red;
}
</style>
