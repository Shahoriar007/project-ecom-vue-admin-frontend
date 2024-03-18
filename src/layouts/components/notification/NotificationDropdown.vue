<template>
  <b-nav-item-dropdown
    class="dropdown-notification mr-25"
    menu-class="dropdown-menu-media"
    right
    v-on:show="resetNotificationCount"
  >
    <template #button-content>
      <feather-icon
        :badge="incomingNotificationCount"
        badge-classes="bg-danger"
        class="text-body"
        icon="BellIcon"
        size="21"
      />
    </template>

    <!-- Header -->
    <li class="dropdown-menu-header">
      <div class="dropdown-header d-flex">
        <h4 class="notification-title mb-0 mr-auto">Notifications</h4>
      </div>
    </li>

    <!-- Notifications -->
    <div v-if="isNotificationLoading">
      <div class="text-center">
        <b-spinner
          style="width: 3rem; height: 3rem"
          class="mr-1"
          variant="primary"
        />
      </div>
    </div>
    <div v-else>
      <vue-perfect-scrollbar
        :settings="perfectScrollbarSettings"
        class="scrollable-container media-list scroll-area"
        tagname="li"
      >
        <!-- Account Notification -->
        <b-link
          v-for="notification in notifications"
          :key="notification?.id"
          v-on:click="showNotificationDetails(notification)"
        >
          <b-media>
            <template #aside>
              <b-avatar size="32" :variant="notification?.data?.variant">
                <feather-icon :icon="notification?.data?.icon" />
              </b-avatar>
            </template>
            <p class="media-heading">
              <span class="font-weight-bolder">
                {{ notification?.data?.message }}
              </span>
            </p>
            <small class="notification-text">{{
              notification?.data?.sub_title
            }}</small
            ><br />
            <small class="notification-text">
              {{
                notification?.created_at | moment("ddd, MMM Do YYYY, h:mm a")
              }}
            </small>
          </b-media>
        </b-link>
      </vue-perfect-scrollbar>
    </div>

    <!-- Cart Footer -->
    <!-- <li class="dropdown-menu-footer">
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        block
        v-on:click="onShowPage"
        >Read all notifications</b-button
      >
    </li> -->
  </b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown,
  BBadge,
  BMedia,
  BLink,
  BAvatar,
  BButton,
  BFormCheckbox,
  BSpinner,
} from "bootstrap-vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Ripple from "vue-ripple-directive";
import { mapGetters } from "vuex";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
export default {
  name: "NotificationDropdown",
  components: {
    BNavItemDropdown,
    BBadge,
    BMedia,
    BLink,
    BAvatar,
    VuePerfectScrollbar,
    BButton,
    BFormCheckbox,
    BSpinner,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      perfectScrollbarSettings: {
        maxScrollbarLength: 60,
        wheelPropagation: false,
      },
      notifications: [],
      systemNotifications: [],
      isNotificationLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      permissions: "userModule/getPermissions",
      authUser: "userModule/getUser",
      incomingNotificationCount: "userModule/getIncomingNotificationCount",
    }),
  },
  created() {},
  methods: {
    onView() {
      this.$router.push({
        name: 'admin-orders',
      })
    },
    resetNotificationCount() {
      let incomingNotificationCount = 0;
      this.$store.dispatch("userModule/setIncomingNotificationCount", {
        incomingNotificationCount,
      });

      this.getUnreadNotifications();
    },

    async getUnreadNotifications() {
      try {
        this.isNotificationLoading = true;
        const unreadNotifications = await this.$api.get(
          "api/notifications/user/unread"
        );

        this.notifications = unreadNotifications?.data?.data;

        this.isNotificationLoading = false;
      } catch (error) {
        this.isNotificationLoading = false;
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
    async showNotificationDetails(notification) {

      if (notification?.data?.url) {
        const orderId = notification?.data?.model?.id;
        // const currentPageURL = window.location.href;
        // const baseUrl = new URL(currentPageURL).origin;
        // const notificationUrl = notification?.data?.url;
        // const routeUrl = `${baseUrl}/${notificationUrl}/${orderId}`;
        // window.open(routeUrl);

        // this.onView();

        //reload the page
        await this.markNotificationAsRead(notification);
        window.location.reload();
      }

    },
    async markNotificationAsRead(notification) {
      try {
        await this.$api.put(
          `api/notification/${notification?.id}/mark-as-read`
        );
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

    onShowPage() {
      this.$router.push({
        name: "admin-notification",
      });
    },
  },
};
</script>

<style>
</style>
