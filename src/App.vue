<template>
  <div id="nav">
    <router-link to="/">Calculator</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>

<script lang="ts">
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

import { Vue } from "vue-class-component";

export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #f4f5e5;
    }
  }
}
body {
  background: rgb(255, 68, 0);
  background: -moz-linear-gradient(
    90deg,
    rgba(255, 68, 0, 1) 0%,
    rgba(255, 161, 37, 1) 50%,
    rgba(254, 255, 0, 1) 100%
  );
  background: -webkit-linear-gradient(
    90deg,
    rgba(255, 68, 0, 1) 0%,
    rgba(255, 161, 37, 1) 50%,
    rgba(254, 255, 0, 1) 100%
  );
  background: linear-gradient(
    90deg,
    rgba(255, 68, 0, 1) 0%,
    rgba(255, 161, 37, 1) 50%,
    rgba(254, 255, 0, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ff4400",endColorstr="#feff00",GradientType=1);
}
</style>
