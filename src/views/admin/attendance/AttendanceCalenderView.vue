<template>
  <b-card class="app-calendar p-2">
    <FullCalendar :options="calendarOptions" class="full-calendar">
      <template v-slot:eventContent="arg">
        <template v-if="arg?.event?.extendedProps?.user">
          <b-avatar
            size="sm"
            :src="arg?.event?.extendedProps?.user?.avatar"
            class="mr-1"
          />
          <b>{{ arg?.event?.extendedProps?.user?.name }}</b>
        </template>
        <template v-else>
          <b>{{ arg?.event?.title }}</b>
        </template>
      </template>
    </FullCalendar>
    <div class="d-flex justify-content-center mt-2">
      <b-list-group horizontal="md">
        <!-- <b-list-group-item variant="success">
          Cake caramels donut danish muffin biscuit
        </b-list-group-item> -->
        <b-list-group-item variant="danger">
          <span class="bullet mr-1 bullet-danger" />
          <span>Leave And Holiday</span>
        </b-list-group-item>
        <!-- <b-list-group-item variant="warning">
          Apple pie toffee pudding gummi bears
        </b-list-group-item> -->
      </b-list-group>
    </div>
  </b-card>
</template>

<script>
import { BCard, BAvatar, BListGroup, BListGroupItem } from "bootstrap-vue";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  name: "AttendanceCalenderView",
  components: {
    BCard,
    FullCalendar,
    BAvatar,
    BListGroup,
    BListGroupItem,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
          start: "sidebarToggle, prev,next, title",
          end: "dayGridMonth,timeGridDay,listMonth",
        },
        initialView: "dayGridMonth",
        weekends: true,
        // dateClick: this.handleDateClick,
        dayMaxEvents: 2,
        eventClassNames({ event: calendarEvent }) {
          const variantColor = {
            present: "success",
            holiday: "danger",
            leave: "danger",

            success: "success",
            danger: "danger",
            warning: "warning",
          };
          // console.log("eventClassNames", calendarEvent);
          // eslint-disable-next-line no-underscore-dangle
          const variantName =
            variantColor[calendarEvent?._def?.extendedProps?.variant];

          return [
            // Background Color
            `bg-light-${variantName}`,
          ];
        },
        events: [],
        showNonCurrentDates: false,
      },
    };
  },
  async created() {
    try {
      const [settings, leaveEmployees] = await Promise.all([
        this.getSettings(),
        this.getLeaveEmployees(),
        // this.getPresentEmployees(),
      ]);

      // present employees
      const mapLeaveEmployees = leaveEmployees?.data?.data.map(function (item) {
        return {
          date: item?.date,
          extendedProps: {
            user: {
              name: item?.user?.data?.name,
              avatar: item?.user?.data?.avatar,
            },
            variant: "danger",
          },
        };
      });

      this.calendarOptions.events.push(...mapLeaveEmployees);

      // present employees
      // const mapPresentEmployees = presentEmployees?.data?.data.map(function (
      //   item
      // ) {
      //   return {
      //     date: item?.date,
      //     extendedProps: {
      //       user: {
      //         name: item?.user?.data?.name,
      //         avatar: item?.user?.data?.avatar,
      //       },
      //       variant: "success",
      //     },
      //   };
      // });

      // this.calendarOptions.events.push(...mapPresentEmployees);

      // weekends
      const weekends = settings?.data?.data?.weekends
        .filter((item) => !!item.value)
        .map(function (item) {
          return item.code;
        });

      this.calendarOptions.events.push({
        daysOfWeek: weekends,
        allDay: true,
        overlap: false,
        display: "background",
        extendedProps: {
          variant: "holiday",
        },
      });
    } catch (error) {
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
    async getLeaveEmployees() {
      return await this.$api.get(
        "api/attendances/leave-employees?include=user"
      );
    },
    // async getPresentEmployees() {
    //   return await this.$api.get(
    //     "api/attendances/present-employees?include=user"
    //   );
    // },
    async getSettings() {
      return await this.$api.get("api/settings?select=weekends");
    },
    // toggleWeekends: function () {
    //   this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
    // },
    // handleDateClick: function (arg) {
    //   console.log("handleDateClick", arg);
    //   alert("date click! " + arg.dateStr);
    // },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
</style>
