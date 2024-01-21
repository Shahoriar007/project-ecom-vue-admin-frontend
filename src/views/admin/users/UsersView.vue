<template>
  <b-card>
    <div>
      <!-- search input -->
      <div class="custom-search d-flex align-items-center justify-content-end">
        <div
          class="d-flex flex-column flex-sm-row align-items-center mb-1 justify-content-around"
        >
          <b-form-input
            v-on:keyup="onSearch"
            v-model.lazy="searchTerm"
            placeholder="Search..."
            type="text"
            class="d-inline-block mr-sm-1 mb-1 mb-sm-0"
          />
          <template
            v-if="
              $permissionAbility(permissionsConstant.USERS_CREATE, permissions)
            "
          >
            <b-button
              class="flex-shrink-0"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              v-on:click="showModal"
            >
              Create User
            </b-button>
          </template>
        </div>
      </div>

      <!-- table -->
      <vue-good-table
        :line-numbers="true"
        mode="remote"
        @on-page-change="onPageChange"
        @on-sort-change="onSortChange"
        @on-column-filter="onColumnFilter"
        @on-per-page-change="onPerPageChange"
        :totalRows="totalRecords"
        :isLoading.sync="isLoading"
        :rows="rows"
        :sort-options="{
          enabled: true,
          multipleColumns: true,
          initialSortBy: [
            { field: 'id', type: 'desc' },
            { field: 'name', type: 'desc' },
            { field: 'created_at', type: 'desc' },
          ],
        }"
        :columns="columns"
        :pagination-options="{
          enabled: true,
          perPage: pageLength,
        }"
      >
        <template slot="table-row" slot-scope="props">
          <!-- Column: head -->
          <span v-if="props.column.field === 'name'">
            <b-avatar :src="props?.row?.avatar" class="mr-1" />
          </span>

          <!-- Column: Status -->
          <span v-if="props.column.field === 'status'">
            <b-badge :variant="statusVariant(props.row.status)">
              {{ props.row.status ? "Active" : "Inactive" }}
            </b-badge>
          </span>

          <!-- Column: Action -->
          <span v-else-if="props.column.field === 'action'">
            <span>
              <b-dropdown
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template v-slot:button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="text-body align-middle mr-25"
                  />
                </template>
                <template
                  v-if="
                    $permissionAbility(
                      permissionsConstant.USERS_EDIT,
                      permissions
                    )
                  "
                >
                  <b-dropdown-item v-on:click="onShow(props.row)">
                    <feather-icon icon="Edit2Icon" class="mr-50" />
                    <span>Edit</span>
                  </b-dropdown-item>
                </template>

                <template
                  v-if="
                    $permissionAbility(
                      permissionsConstant.USERS_DELETE,
                      permissions
                    )
                  "
                >
                  <b-dropdown-item v-on:click="onDelete(props.row.id)">
                    <feather-icon icon="TrashIcon" class="mr-50" />
                    <span>Delete</span>
                  </b-dropdown-item>
                </template>
              </b-dropdown>
            </span>
          </span>

          <!-- Column: Common -->
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>

        <!-- pagination -->
        <template slot="pagination-bottom" slot-scope="props">
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
              <span class="text-nowrap"> Showing 1 to </span>
              <b-form-select
                v-model="pageLength"
                :options="['10', '15', '20']"
                class="mx-1"
                @input="
                  (value) => props.perPageChanged({ currentPerPage: value })
                "
              />
              <span class="text-nowrap"> of {{ props.total }} entries </span>
            </div>
            <div>
              <b-pagination
                :value="1"
                :total-rows="props.total"
                :per-page="pageLength"
                first-number
                last-number
                align="right"
                prev-class="prev-item"
                next-class="next-item"
                class="mt-1 mb-0"
                @input="(value) => props.pageChanged({ currentPage: value })"
              >
                <template #prev-text>
                  <feather-icon icon="ChevronLeftIcon" size="18" />
                </template>
                <template #next-text>
                  <feather-icon icon="ChevronRightIcon" size="18" />
                </template>
              </b-pagination>
            </div>
          </div>
        </template>
      </vue-good-table>
    </div>

    <b-modal
      id="modal-users-form"
      centered
      :title="modelType == 'editModel' ? 'Edit User' : 'Create User'"
      hide-footer
      @hidden="hiddenModal"
      no-close-on-backdrop
    >
      <validation-observer ref="usersValidation">
        <b-form v-on:submit.prevent="validationForm">
          <b-row>
            <!-- name -->
            <b-col cols="12">
              <b-form-group label="Name" label-for="name">
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  vid="name"
                  :rules="`${
                    modelType == 'editModel' ? '' : 'required'
                  }|max:255`"
                >
                  <b-form-input
                    id="name"
                    type="text"
                    v-model="name"
                    :state="errors.length > 0 ? false : null"
                    name="name"
                    placeholder="John Doe"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- email -->
            <b-col cols="12">
              <b-form-group label="Email" label-for="email">
                <validation-provider
                  #default="{ errors }"
                  name="email"
                  :rules="`${modelType == 'editModel' ? '' : 'required'}|email`"
                  vid="email"
                >
                  <b-form-input
                    id="email"
                    v-model="email"
                    :state="errors.length > 0 ? false : null"
                    name="email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- status -->
            <b-col cols="12">
              <b-form-group label="Status" label-for="status">
                <ValidationProvider
                  name="status"
                  v-slot="{ errors }"
                  vid="status"
                  :rules="`${modelType == 'editModel' ? '' : 'required'}`"
                >
                  <v-select
                    id="status"
                    v-model="selectStatusValue"
                    :options="statusValueOption"
                    :reduce="(option) => option.value"
                    label="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

            <!-- select role-->
            <b-col cols="12">
              <b-form-group label="Role" label-for="role-id">
                <ValidationProvider
                  name="role_id"
                  v-slot="{ errors }"
                  vid="role_id"
                  :rules="`${modelType == 'editModel' ? '' : 'required'}`"
                >
                  <v-select
                    id="role-id"
                    placeholder="Choose a role"
                    v-model="selectRoleId"
                    :options="roleIdOption"
                    :reduce="(option) => option.id"
                    label="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

         
        
            <!-- password -->
            <b-col cols="12">
              <b-form-group label="Password" label-for="password">
                <validation-provider
                  #default="{ errors }"
                  name="password"
                  :rules="`${modelType == 'editModel' ? '' : 'required'}|min:6`"
                  vid="password"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="password"
                      v-model="password"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="user-password"
                      placeholder="············"
                    />
                    <b-input-group-append
                      is-text
                      v-on:click="togglePasswordVisibility"
                    >
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- Confirm Password -->
            <b-col cols="12">
              <b-form-group
                label="Confirm Password"
                label-for="password_confirmation"
              >
                <validation-provider
                  #default="{ errors }"
                  name="password_confirmation"
                  :rules="`${
                    modelType == 'editModel' ? '' : 'required'
                  }|confirmed:password`"
                  vid="password_confirmation"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="password_confirmation"
                      v-model="password_confirmation"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="password_confirmation"
                      placeholder="············"
                    />
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
              >
                Submit
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-modal>
  </b-card>
</template>

<script>
import { email } from "@validations";
import {
BAvatar,
BBadge,
BButton,
BCard,
BCol,
BDropdown,
BDropdownItem,
BForm,
BFormGroup,
BFormInput,
BFormSelect,
BInputGroup,
BInputGroupAppend,
BModal,
BPagination,
BRow
} from "bootstrap-vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { VueGoodTable } from "vue-good-table";
import Ripple from "vue-ripple-directive";

import { permissionsConstant } from "@/helpers/permissionsConstant";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import { mapGetters } from "vuex";

export default {
  mixins: [togglePasswordVisibility],
  name: "UsersView",
  components: {
    BRow,
    BCol,
    BForm,
    BButton,
    BCard,
    VueGoodTable,
    BAvatar,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    ValidationProvider,
    ValidationObserver,
    BModal,
    BInputGroupAppend,
    BInputGroup,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      permissionsConstant,
      modelType: "",
      userId: "",
      name: "",
      password: "",
      password_confirmation: "",
      email: "",
      selectRoleId: "",
      roleIdOption: [],
     
      selectStatusValue: true,
      statusValueOption: [
        {
          name: "Active",
          value: true,
        },
        {
          name: "Inactive",
          value: false,
        },
      ],
   
      pageLength: 10,
      columns: [
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Email",
          field: "email",
        },
        {
          label: "Role",
          field: this.roleName,
          sortable: false,
        },
        
        {
          label: "Status",
          field: "status",
          sortable: false,
        },
        {
          label: "Created On",
          field: "created_at",
        },
        {
          label: "Action",
          field: "action",
          sortable: false,
        },
      ],
      rows: [],
      searchTerm: "",
      delayTimer: null,
      isLoading: false,
      totalRecords: 0,
      serverParams: {
        columnFilters: {},
        sort: [
          { field: "id", type: "desc" },
          { field: "name", type: "desc" },
          { field: "created_at", type: "desc" },
        ],
        page: 1,
        perPage: 10,
      },
    };
  },

  computed: {
    ...mapGetters({
      permissions: "userModule/getPermissions",
    }),
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    statusVariant() {
      const statusColor = {
        true: "light-success",
        false: "light-danger",
      };

      return (status) => statusColor[status];
    },
  },

  async created() {
    try {
      const [roles] = await Promise.all([
        this.getRoles(),
        
      ]);

      // roles
      this.roleIdOption = (roles?.data?.data || []).map((item) => {
        return {
          name: item?.name,
          id: item?.id,
        };
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
    roleName(rowObj) {
      return rowObj?.roles?.data[0]?.name;
    },
    showModal() {
      this.$bvModal.show("modal-users-form");
    },
    hiddenModal() {
      this.modelType = "";
      this.$bvModal.hide("modal-users-form");
      this.resetModal();
    },
    resetModal() {
      this.userId = "";
      this.name = "";
      this.selectRoleId = "";
      this.email = "";
      this.selectStatusValue = true;
      this.password = "";
      this.password_confirmation = "";
      
    },
    async onShow(value) {
      //   console.log("onShow", value);
      this.modelType = "editModel";
      this.userId = value?.id;
      this.name = value?.name;
      this.email = value?.email;
      this.selectRoleId = value?.roles?.data[0]?.id;
      this.selectStatusValue = value?.status;
     

      this.showModal();
    },
    async onDelete(id) {
      try {
        await this.$api.delete(`/api/users/${id}`);

        this.loadItems();

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "BellIcon",
            variant: "success",
            text: "User successfully Deleted",
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

    onSearch() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }

      this.delayTimer = setTimeout(() => {
        this.loadItems();
      }, 1000);
    },

    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },

    onPageChange(params) {
      this.updateParams({ page: params.currentPage });
      this.loadItems();
    },

    onPerPageChange(params) {
      this.updateParams({ perPage: params.currentPerPage });
      this.loadItems();
    },

    onSortChange(params) {
      this.updateParams({
        sort: params,
      });
      this.loadItems();
    },

    onColumnFilter(params) {
      this.updateParams(params);
      this.loadItems();
    },
    async getUsers(params) {
      return await this.$api.get("api/users?include=roles", {
        params: {
          show: params.show,
          page: params.page,
          sort: params.sort,
          q: params.q,
        },
      });
    },
    async getRoles() {
      return await this.$api.get("api/roles/priority-wise");
    },
  

    async loadItems() {
      try {
        const [users] = await Promise.all([
          this.getUsers({
            show: this.serverParams.perPage,
            page: this.serverParams.page,
            sort: this.serverParams.sort,
            q: this.searchTerm,
          }),
        ]);

        const data = users?.data?.data;
        const meta = users?.data?.meta;

        this.totalRecords = meta?.pagination?.total;
        this.rows = data;
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
    validationForm: async function () {
      this.$refs.usersValidation.validate().then(async (success) => {
        if (success) {
          try {
            if (this.modelType == "editModel") {
              await this.$api.put(`/api/users/${this.userId}`, {
                name: this.name,
                email: this.email,
                status: this.selectStatusValue,
                password: this.password,
                password_confirmation: this.password_confirmation,
                role_id: this.selectRoleId,
              });

              this.loadItems();
              this.hiddenModal();
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Success",
                  icon: "BellIcon",
                  variant: "success",
                  text: "User successfully Updated",
                },
              });
            } else {
              await this.$api.post("/api/users", {
                name: this.name,
                email: this.email,
                status: this.selectStatusValue,
                password: this.password,
                password_confirmation: this.password_confirmation,
                role_id: this.selectRoleId,
              });

              this.hiddenModal();

              this.loadItems();

              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Success",
                  icon: "BellIcon",
                  variant: "success",
                  text: "User successfully Created",
                },
              });
            }
          } catch (error) {
            if (error?.response?.data?.message) {
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

            if (error?.response?.data?.errors) {
              this.$refs.usersValidation.setErrors(
                error?.response?.data?.errors
              );
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-good-table.scss";
</style>
