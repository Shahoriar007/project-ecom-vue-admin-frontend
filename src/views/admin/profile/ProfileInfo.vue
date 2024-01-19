<template>
  <b-card>
    <b-row>
      <!-- User Info: Left col -->
      <b-col
        cols="21"
        xl="6"
        class="d-flex justify-content-between flex-column"
      >
        <!-- User Avatar & Action Buttons -->
        <div class="d-flex justify-content-start">
          <b-avatar :src="user?.avatar || avatar" size="104px" rounded />
          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h4 class="mb-0">{{ user?.name }}</h4>
              <span class="card-text">{{ user?.email }}</span>
            </div>
          </div>
        </div>
      </b-col>

      <!-- Right Col: Table -->
      <b-col cols="12" xl="6">
        <table class="mt-2 mt-xl-0 w-100">
          <tr>
            <th class="pb-50">
              <feather-icon icon="UserIcon" class="mr-75" />
              <span class="font-weight-bold">Name</span>
            </th>
            <td class="pb-50">{{ user?.name }}</td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="CheckIcon" class="mr-75" />
              <span class="font-weight-bold">Status</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ user?.status ? "Active" : "Inactive" }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="UserCheckIcon" class="mr-75" />
              <span class="font-weight-bold">Role</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ user?.roles?.data[0]?.name }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="AwardIcon" class="mr-75" />
              <span class="font-weight-bold">Designation</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ user?.designation?.data?.name }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="PackageIcon" class="mr-75" />
              <span class="font-weight-bold">Department</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ user?.department?.data?.name }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="FlagIcon" class="mr-75" />
              <span class="font-weight-bold">Country</span>
            </th>
            <td class="pb-50"></td>
          </tr>
          <tr>
            <th>
              <feather-icon icon="PhoneIcon" class="mr-75" />
              <span class="font-weight-bold">Contact</span>
            </th>
            <td></td>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import { BCard, BButton, BAvatar, BRow, BCol } from "bootstrap-vue";
// import { avatarText } from "@core/utils/filter";
// import useUsersList from "../users-list/useUsersList";

export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
  },
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapGetters({
      user: "userModule/getUser",
    }),
    avatar() {
      return require("@/assets/images/avatars/avatar.webp");
    },
  },
};
</script>
