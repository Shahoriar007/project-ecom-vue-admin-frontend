<template>
  <b-card>
    <div>
      <!-- search input -->
      <div class="custom-search d-flex align-items-center justify-content-end">
        <div
          class="d-flex flex-column flex-sm-row align-items-center mb-1 justify-content-around"
        >
          <!-- <b-form-input
            v-on:keyup="onSearch"
            v-model.lazy="searchTerm"
            placeholder="Search..."
            type="text"
            class="d-inline-block mr-sm-1 mb-1 mb-sm-0"
          /> -->
          <template
            v-if="
              $permissionAbility(
                permissionsConstant.LEAVE_TYPES_CREATE,
                permissions
              )
            "
          >
            <b-button
              class="flex-shrink-0"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              v-on:click="showModal"
            >
              Create Leave Type
            </b-button>
          </template>
        </div>
      </div>

      <!-- table -->
      <vue-good-table
        :line-numbers="true"
        :rows="rows"
        :columns="columns"
        :sort-options="{
          enabled: true,
          multipleColumns: true,
          initialSortBy: [{ field: 'created_at', type: 'desc' }],
        }"
        :pagination-options="{
          enabled: true,
          perPage: pageLength,
        }"
      >
        <template slot="table-row" slot-scope="props">
          <!-- Column: eligible_employee_types -->
          <div v-if="props.column.field === 'eligible_employee_types'">
            <template v-if="props.row?.employeeType">
              <b-badge class="mr-1">
                {{ props.row?.employeeType?.data?.name }}
              </b-badge>
            </template>
          </div>

          <!-- Column: Action -->
          <span v-if="props.column.field === 'action'">
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
                      permissionsConstant.LEAVE_TYPES_EDIT,
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
                      permissionsConstant.LEAVE_TYPES_DELETE,
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
      id="modal-leave-types-form"
      centered
      :title="
        modelType == 'editModel' ? 'Edit Leave Type' : 'Create Leave Type'
      "
      hide-footer
      @hidden="hiddenModal"
      no-close-on-backdrop
    >
      <validation-observer ref="leaveTypesValidation">
        <b-form v-on:submit.prevent="validationForm">
          <!-- name -->
          <b-form-group label="Name" label-for="name">
            <validation-provider
              #default="{ errors }"
              name="name"
              vid="name"
              rules="required|max:255"
            >
              <b-form-input
                id="name"
                type="text"
                v-model="name"
                :state="errors.length > 0 ? false : null"
                placeholder="Leave Type"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <!-- select employee type-->
          <b-form-group label="Employee Type" label-for="employee-type-id">
            <ValidationProvider
              name="employee_type_id"
              v-slot="{ errors }"
              vid="employee_type_id"
            >
              <v-select
                id="employee-type-id"
                placeholder="Choose  Employee Types"
                v-model="selectEmployeeTypeId"
                :options="employeeTypesOption"
                :reduce="(country) => country.id"
                label="name"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-form-group>

          <!-- select Gender-->
          <b-form-group label="Gender" label-for="gender">
            <ValidationProvider name="gender" v-slot="{ errors }" vid="gender">
              <v-select
                id="gender"
                placeholder="Choose  Employee Types"
                v-model="selectGenderId"
                :options="genderOption"
                :reduce="(option) => option.value"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-form-group>

          <b-button
            type="submit"
            class="float-right"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
          >
            Submit
          </b-button>
        </b-form>
      </validation-observer>
    </b-modal>
  </b-card>
</template>

<script>
import {
  BCard,
  BAvatar,
  BBadge,
  BPagination,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BDropdown,
  BDropdownItem,
  BButton,
  BForm,
  BModal,
  VBModal,
} from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, max } from "@validations";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { mapGetters } from "vuex";
import { permissionsConstant } from "@/helpers/permissionsConstant";

export default {
  name: "LeaveTypesView",
  components: {
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
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      permissionsConstant,
      modelType: "",
      leaveTypeId: "",
      name: "",
      selectEmployeeTypeId: "",
      employeeTypesOption: [],
      selectGenderId: "",
      genderOption: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "All", value: "All" },
      ],
      pageLength: 10,
      columns: [
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Eligible Employee Types",
          field: "eligible_employee_types",
        },
        {
          label: "Gender",
          field: "gender",
          sortable: false,
        },
        {
          label: "Leave Request Count",
          field: "leave_requests_count",
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
      // searchTerm: "",
      // delayTimer: null,
      // isLoading: false,
      // totalRecords: 0,
      // serverParams: {
      //   columnFilters: {},
      //   sort: [
      //     { field: "id", type: "desc" },
      //     { field: "name", type: "desc" },
      //     { field: "created_at", type: "desc" },
      //   ],
      //   page: 1,
      //   perPage: 10,
      // },
    };
  },

  computed: {
    ...mapGetters({
      permissions: "userModule/getPermissions",
    }),
  },

  async created() {
    try {
      const [employeeTypes] = await Promise.all([
        this.getEmployeeTypes(),
        this.loadItems(),
      ]);

      // employee types
      this.employeeTypesOption = (employeeTypes?.data?.data || []).map(
        (item) => {
          return {
            name: item.name,
            id: item.id,
          };
        }
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

  methods: {
    showModal() {
      this.$bvModal.show("modal-leave-types-form");
    },
    hiddenModal() {
      this.modelType = "";
      this.$bvModal.hide("modal-leave-types-form");
      this.resetModal();
    },
    resetModal() {
      this.name = "";
      this.selectEmployeeTypeId = "";
    },
    onShow(value) {
      this.modelType = "editModel";
      this.name = value.name;
      this.leaveTypeId = value.id;
      this.selectGenderId = value.gender;
      this.selectEmployeeTypeId = value?.employeeTypes?.data.map(
        (item) => item.id
      );

      this.showModal();
    },
    async onDelete(id) {
      try {
        await this.$api.delete(`/api/leave-types/${id}`);

        this.loadItems();

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "BellIcon",
            variant: "success",
            text: "Leave Type successfully Deleted",
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

    // onSearch() {
    //   if (this.delayTimer) {
    //     clearTimeout(this.delayTimer);
    //     this.delayTimer = null;
    //   }

    //   this.delayTimer = setTimeout(() => {
    //     this.loadItems();
    //   }, 1000);
    // },

    // updateParams(newProps) {
    //   this.serverParams = Object.assign({}, this.serverParams, newProps);
    // },

    // onPageChange(params) {
    //   this.updateParams({ page: params.currentPage });
    //   this.loadItems();
    // },

    // onPerPageChange(params) {
    //   this.updateParams({ perPage: params.currentPerPage });
    //   this.loadItems();
    // },

    // onSortChange(params) {
    //   this.updateParams({
    //     sort: params,
    //   });
    //   this.loadItems();
    // },

    // onColumnFilter(params) {
    //   this.updateParams(params);
    //   this.loadItems();
    // },

    async getLeaveTypes() {
      return await this.$api.get("api/leave-types?include=employeeType");
    },
    async getEmployeeTypes() {
      return await this.$api.get("api/employee-types/all");
    },

    async loadItems() {
      try {
        const [leaveTypes] = await Promise.all([this.getLeaveTypes()]);

        const data = leaveTypes?.data?.data;
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
      this.$refs.leaveTypesValidation.validate().then(async (success) => {
        if (success) {
          try {
            if (this.modelType == "editModel") {
              await this.$api.put(`/api/leave-types/${this.leaveTypeId}`, {
                name: this.name,
                employee_type_id: this.selectEmployeeTypeId,
                gender: this.selectGenderId,
              });

              this.loadItems();

              this.hiddenModal();

              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Success",
                  icon: "BellIcon",
                  variant: "success",
                  text: "Leave Type successfully Updated",
                },
              });
            } else {
              await this.$api.post(
                "/api/leave-types",

                {
                  name: this.name,
                  employee_type_id: this.selectEmployeeTypeId,
                  gender: this.selectGenderId,
                }
              );

              this.hiddenModal();

              this.loadItems();

              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Success",
                  icon: "BellIcon",
                  variant: "success",
                  text: "Leave Type successfully Created",
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
              this.$refs.leaveTypesValidation.setErrors(
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
