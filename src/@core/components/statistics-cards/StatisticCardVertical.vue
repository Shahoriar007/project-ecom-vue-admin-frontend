<template>
  <b-card class="text-center">
    <b-avatar class="mb-1" :variant="`light-${color}`" size="45">
      <feather-icon size="21" :icon="icon" />
    </b-avatar>
    <div class="truncate">
      <h2 class="mb-25 font-weight-bolder">
        {{ statistic }}
      </h2>
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        size="sm"
        variant="primary"
        block
        :href="to"
      >
        {{ buttonName }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { BButton, BCard, BAvatar } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

export default {
  components: {
    BButton,
    BCard,
    BAvatar,
  },
  directives: {
    Ripple,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    color: {
      type: String,
      default: "primary",
    },
    to: {
      type: String,
      default: "/",
    },
    buttonName: {
      type: String,
      default: "Go",
    },
  },
};
</script>
