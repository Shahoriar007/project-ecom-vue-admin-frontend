<template>
  <b-card :title="roleName">
    <div>
      <!-- table -->
      <vue-good-table
        :columns="columns"
        :rows="rows"
        :sort-options="{
          enabled: false,
        }"
      >
        <template slot="table-row" slot-scope="props">
          <!-- Column: name -->
          <div v-if="props.column.field === 'name'">
            <span class="text-nowrap">{{ props.row.name }}</span>
          </div>

          <!-- Column: access -->
          <div v-else-if="props.column.field === 'access'">
            <template v-if="props.row?.permissions">
              <template v-for="item in props.row?.permissions?.data">
                <template v-if="item?.group == 'access'">
                  <b-form-checkbox
                    :key="item?.id"
                    :checked="roleHasPermissions.includes(item?.id)"
                    name="check-button"
                    switch
                    inline
                    @change="(isChecked) => onChangeSwitch(isChecked, item.id)"
                  >
                    <!-- {{ item?.name | strSnakeToPascal }} -->
                  </b-form-checkbox>
                </template>
              </template>
            </template>
          </div>

          <!-- Column: create -->
          <div v-else-if="props.column.field === 'create'">
            <template v-if="props.row?.permissions">
              <template v-for="item in props.row?.permissions?.data">
                <template v-if="item?.group == 'create'">
                  <b-form-checkbox
                    :key="item?.id"
                    :checked="roleHasPermissions.includes(item?.id)"
                    name="check-button"
                    switch
                    inline
                    @change="(isChecked) => onChangeSwitch(isChecked, item.id)"
                  >
                    <!-- {{ item?.name | strSnakeToPascal }} -->
                  </b-form-checkbox>
                </template>
              </template>
            </template>
          </div>

          <!-- Column: show -->
          <div v-else-if="props.column.field === 'show'">
            <template v-if="props.row?.permissions">
              <template v-for="item in props.row?.permissions?.data">
                <template v-if="item?.group == 'show'">
                  <b-form-checkbox
                    :key="item?.id"
                    :checked="roleHasPermissions.includes(item?.id)"
                    name="check-button"
                    switch
                    inline
                    @change="(isChecked) => onChangeSwitch(isChecked, item.id)"
                  >
                    <!-- {{ item?.name | strSnakeToPascal }} -->
                  </b-form-checkbox>
                </template>
              </template>
            </template>
          </div>

          <!-- Column: edit -->
          <div v-else-if="props.column.field === 'edit'">
            <template v-if="props.row?.permissions">
              <template v-for="item in props.row?.permissions?.data">
                <template v-if="item?.group == 'edit'">
                  <b-form-checkbox
                    :key="item?.id"
                    :checked="roleHasPermissions.includes(item?.id)"
                    name="check-button"
                    switch
                    inline
                    @change="(isChecked) => onChangeSwitch(isChecked, item.id)"
                  >
                    <!-- {{ item?.name | strSnakeToPascal }} -->
                  </b-form-checkbox>
                </template>
              </template>
            </template>
          </div>

          <!-- Column: delete -->
          <div v-else-if="props.column.field === 'delete'">
            <template v-if="props.row?.permissions">
              <template v-for="item in props.row?.permissions?.data">
                <template v-if="item?.group == 'delete'">
                  <b-form-checkbox
                    :key="item?.id"
                    :checked="roleHasPermissions.includes(item?.id)"
                    name="check-button"
                    switch
                    inline
                    @change="(isChecked) => onChangeSwitch(isChecked, item.id)"
                  >
                    <!-- {{ item?.name | strSnakeToPascal }} -->
                  </b-form-checkbox>
                </template>
              </template>
            </template>
          </div>

          <!-- Column: others -->
          <div v-else-if="props.column.field === 'others'">
            <template v-if="props.row?.permissions">
              <template v-for="item in props.row?.permissions?.data">
                <template v-if="item?.group == 'others'">
                  <b-form-checkbox
                    :key="item?.id"
                    :checked="roleHasPermissions.includes(item?.id)"
                    name="check-button"
                    switch
                    inline
                    @change="(isChecked) => onChangeSwitch(isChecked, item.id)"
                  >
                    {{ item?.name | strSnakeToPascal }}
                  </b-form-checkbox>
                </template>
              </template>
            </template>
          </div>

          <!-- Column: Common -->
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </b-card>
</template>

<script>
import { BCard, BBadge, BForm, BFormCheckbox } from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import strSnakeToPascal from "@/filter/strSnakeToPascal";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  name: "RolePermissionView",
  components: {
    BForm,
    BCard,
    VueGoodTable,
    BBadge,
    BFormCheckbox,
  },

  data() {
    return {
      pageLength: 10,
      columns: [
        {
          label: "Module",
          field: "name",
        },
        {
          label: "Access",
          field: "access",
        },
        {
          label: "Create",
          field: "create",
        },
        {
          label: "Show",
          field: "show",
        },
        {
          label: "Edit",
          field: "edit",
        },
        {
          label: "Delete",
          field: "delete",
        },
        {
          label: "Others",
          field: "others",
        },
      ],
      rows: [],
      roleName: "",
      roleHasPermissions: [],
    };
  },

  async created() {
    const resMD = await this.$api.get(
      "api/get-modules-permissions?include=permissions"
    );
    this.rows = resMD?.data?.data;
    // console.log("resMD", resMD);

    const id = this.$route.params.id;
    const resRHP = await this.$api.get(`api/roles/${id}?include=permissions`);
    this.roleName = resRHP?.data?.data?.name;
    this.roleHasPermissions = resRHP?.data?.data?.permissions?.data.map(
      (item) => item.id
    );
  },

  methods: {
    async onChangeSwitch(isChecked, p_id) {
      const id = this.$route.params.id;

      try {
        const resPU = await this.$api.post(
          `api/roles/${id}/permission-update?include=permissions`,
          {
            attach: isChecked,
            permission_id: p_id,
          }
        );

        this.roleHasPermissions = resPU?.data?.data?.permissions?.data.map(
          (item) => item.id
        );

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "BellIcon",
            variant: "success",
            text: "Permission successfully Update",
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
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-good-table.scss";
</style>
