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
      <notification-dropdown />
      <!-- check in and out -->
      
      <!-- check in and out -->
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
              <!-- <template v-if="user?.designation?.data?.name.length >= 10">
                {{ user?.designation?.data?.name.substr(0, 10) }}...
              </template>
              <template v-else>
                {{ user?.designation?.data?.name }}
              </template> -->
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
                ? $router.push({
                    name: 'user-profile',
                    params: { id: user.id },
                  })
                : null
          "
        >
          <feather-icon size="16" icon="UserIcon" class="mr-50" />
          <span>Profile</span>
        </b-dropdown-item>

        <!-- <b-dropdown-item link-class="d-flex align-items-center">
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
        </b-dropdown-item> -->

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
import { mapGetters } from "vuex";
import {
  BLink,
  BNavbarNav,
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
} from "bootstrap-vue";
import DarkToggler from "@core/layouts/components/app-navbar/components/DarkToggler.vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import NotificationDropdown from "./notification/NotificationDropdown";
export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
    NotificationDropdown,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      user: "userModule/getUser",
      permissions: "userModule/getPermissions",
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
