<template>
  <b-tabs
    vertical
    content-class="col-12 col-md-9 mt-1 mt-md-0"
    pills
    nav-wrapper-class="col-md-3 col-12"
    nav-class="nav-left"
  >
    <!-- info tab -->
    <b-tab active>
      <!-- title -->
      <template #title>
        <feather-icon icon="UserIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">Info</span>
      </template>

      <profile-info />
    </b-tab>
    <!--/ general tab -->

    <!-- general tab -->
    <b-tab>
      <!-- title -->
      <template #title>
        <feather-icon icon="UserIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">General</span>
      </template>

      <profile-general />
    </b-tab>
    <!--/ general tab -->

    <!-- change password tab -->
    <b-tab>
      <!-- title -->
      <template #title>
        <feather-icon icon="LockIcon" size="18" class="mr-50" />
        <span class="font-weight-bold">Change Password</span>
      </template>

      <profile-password />
    </b-tab>
    <!--/ change password tab -->
  </b-tabs>
</template>

<script>
import { BTabs, BTab } from "bootstrap-vue";
import ProfileGeneral from "./ProfileGeneral.vue";
import ProfilePassword from "./ProfilePassword.vue";
import ProfileInfo from "./ProfileInfo.vue";

export default {
  name: "ProfileView",
  components: {
    BTabs,
    BTab,
    ProfileGeneral,
    ProfilePassword,
    ProfileInfo,
  },
  data() {
    return {
      //
    };
  },
};
</script>
