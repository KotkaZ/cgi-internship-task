<template>
  <div class="home">
    <DaytimeView :solarEvent="solarEvent" class="p-mb-3" />
    <InputFields @calculate="save" />
  </div>
</template>

<script lang="ts">
import SolarEvent from "@/models/SolarEvent";
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
  public solarEvent: SolarEvent = new SolarEvent(0.0, 0.0, new Date());

  public save(latitude: number, longitude: number, date: Date): void {
    this.solarEvent = new SolarEvent(latitude, longitude, date);
  }
}
</script>
