<template>
  <b-nav-item>
    <template v-if="!isLoading">
      <b-button
        :id="isCheck ? 'tooltip-check-out' : 'tooltip-check-in'"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        :variant="isCheck ? 'danger' : 'success'"
        class="btn-icon rounded-circle mr-1"
        size="sm"
        v-on:click="isCheck ? onCheckOut() : onCheckIn()"
      >
        <feather-icon
          size="21"
          :icon="isCheck ? 'CheckCircleIcon' : 'ClockIcon'"
        />
      </b-button>
      <b-tooltip
        :target="isCheck ? 'tooltip-check-out' : 'tooltip-check-in'"
        :variant="isCheck ? 'danger' : 'success'"
        placement="bottom"
      >
        {{ isCheck ? "Check Out" : "Check In" }}
      </b-tooltip>
    </template>

    <template v-else>
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="btn-icon rounded-circle mr-1"
        size="sm"
        disabled
      >
        <b-spinner small />
        <span class="sr-only">Loading...</span>
      </b-button>
    </template>
  </b-nav-item>
</template>

<script>
import {
  BButton,
  VBTooltip,
  BNavItem,
  BTooltip,
  BSpinner,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  name: "AttendanceCheckInOut",
  components: {
    BButton,
    BNavItem,
    BTooltip,
    BSpinner,
  },
  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },
  data() {
    return {
      isCheck: false,
      isLoading: false,
    };
  },
  async created() {
    try {
      this.isLoading = true;
      const res = await this.$api.get("/api/attendances/is-check-in");

      this.isLoading = false;
      this.isCheck = res?.data;
    } catch (error) {
      this.isLoading = false;

      this.$toast({
        component: ToastificationContent,
        props: {
          title: "Error",
          icon: "BellIcon",
          variant: "danger",
          text: error?.response?.data?.message,
        },
      });
    }
  },
  methods: {
    async onCheckIn() {
      try {
        this.isLoading = true;
        await this.$api.post("/api/attendances/check-in");

        this.isLoading = false;
        this.isCheck = true;
      } catch (error) {
        this.isLoading = false;

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Error",
            icon: "BellIcon",
            variant: "danger",
            text: error?.response?.data?.message,
          },
        });
      }
    },
    async onCheckOut() {
      try {
        this.isLoading = true;
        await this.$api.post("/api/attendances/check-out");

        this.isLoading = false;
        this.isCheck = false;
      } catch (error) {
        this.isLoading = false;

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Error",
            icon: "BellIcon",
            variant: "danger",
            text: error?.response?.data?.message,
          },
        });
      }
    },
  },
};
</script>
