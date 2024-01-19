<template>
  <div>
    <b-row class="match-height">
      <b-col md="2" sm="6">
        <statistic-card-vertical
          icon="EyeIcon"
          statistic="36.9k"
          color="info"
          button-name="Division"
          to="/admin/division"
        />
      </b-col>
      <b-col md="2" sm="6">
        <statistic-card-vertical
          color="warning"
          icon="MessageSquareIcon"
          statistic="12k"
          button-name="Department"
          to="/admin/department"
        />
      </b-col>
      <b-col md="2" sm="6">
        <statistic-card-vertical
          color="danger"
          icon="ShoppingBagIcon"
          statistic="97.8k"
          button-name="Roles"
          to="/admin/Roles"
        />
      </b-col>
      <b-col md="2" sm="6">
        <statistic-card-vertical
          color="primary"
          icon="HeartIcon"
          statistic="26.8"
          button-name="Users"
          to="/admin/users"
        />
      </b-col>
      <b-col md="2" sm="6">
        <statistic-card-vertical
          color="success"
          icon="AwardIcon"
          statistic="689"
          button-name="Designation"
          to="/admin/designation"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol } from "bootstrap-vue";
import StatisticCardVertical from "@core/components/statistics-cards/StatisticCardVertical.vue";

export default {
  name: "AdminDashboardView",
  components: {
    BRow,
    BCol,
    StatisticCardVertical,
  },
};
</script>

<style></style>
