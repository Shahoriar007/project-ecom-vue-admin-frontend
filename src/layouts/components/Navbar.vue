<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <dark-Toggler class="d-none d-lg-block" />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
     
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ user?.name }}
            </p>
            <span class="user-status">
              <!-- designation -->
              {{ user?.designation?.data?.name }}
            </span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="user?.avatar || avatar"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          v-on:click.prevent="
            () =>
              $route.name != 'user-profile'
                ? $router.push({ name: 'user-profile' })
                : null
          "
        >
          <feather-icon size="16" icon="UserIcon" class="mr-50" />
          <span>Profile</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="MailIcon" class="mr-50" />
          <span>Inbox</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="CheckSquareIcon" class="mr-50" />
          <span>Task</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="MessageSquareIcon" class="mr-50" />
          <span>Chat</span>
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item
          link-class="d-flex align-items-center"
          v-on:click.prevent="onLogout"
        >
          <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
          <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import AttendanceCheckInOut from "@/views/admin/attendance/AttendanceCheckInOut.vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import DarkToggler from "@core/layouts/components/app-navbar/components/DarkToggler.vue";
import {
BAvatar,
BDropdownDivider,
BDropdownItem,
BLink,
BNavItemDropdown,
BNavbarNav,
} from "bootstrap-vue";
import { mapGetters } from "vuex";

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
    AttendanceCheckInOut,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      user: "userModule/getUser",
    }),
    avatar() {
      return require("@/assets/images/avatars/avatar.webp");
    },
  },
  methods: {
    onLogout: async function () {
      try {
        await this.$api.post("api/logout");

        await this.$store.dispatch("authModule/setIsAuthenticated", {
          isAuthenticated: false,
          token: null,
        });

        await this.$store.dispatch("authModule/clearPersistedState");

        await this.$store.dispatch("userModule/removeUser");

        await this.$store.dispatch("userModule/setPermissions", {
          permissions: null,
        });

        this.$router.replace({ name: "login" });
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: `${error?.response?.data?.message}`,
            icon: "BellIcon",
            variant: "danger",
          },
        });
      }
    },
  },
};
</script>
