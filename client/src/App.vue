<template>
  <v-app>
    <Header />
    <router-view />
    <feedback />
  </v-app>
</template>

<script>
import Header from "@/components/Header";
import { mapActions } from "vuex";

export default {
  name: "App",

  components: {
    Header
  }
};
</script>

<style lang="scss">
@import "@/assets/style/layout";

body {
  h3 {
    letter-spacing: 0.2px;
  }
}
</style>