<template>
  <div>
    Main
    <button @click="throwError">Throw error</button>
  </div>
</template>

<script lang="ts">
import * as Sentry from "@sentry/vue";
import { Vue } from "vue-property-decorator";

export default class Main extends Vue {
  throwError() {
    Sentry.captureException("Sentry Error");
  }
}
</script>

<style></style>
