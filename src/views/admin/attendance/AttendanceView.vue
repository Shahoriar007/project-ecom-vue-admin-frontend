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
            class="d-inline-block mb-1 mb-sm-0"
          />
          <!-- <template
            v-if="
              $permissionAbility(
                permissionsConstant.DEPARTMENT_CREATE,
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
              Create Attendance
            </b-button>
          </template> -->
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
          initialSortBy: [{ field: 'id', type: 'desc' }],
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
            <template v-if="props.row?.user_id">
              <b-avatar :src="props?.row?.user?.data?.avatar" class="mr-1" />
              <span class="text-nowrap">{{
                props?.row?.user?.data?.name
              }}</span>
            </template>
          </span>

          <span v-if="props.column.field === 'status'">
            <template v-if="props.row?.attendanceStatus?.data?.name">
              <span class="text-nowrap">{{
                props.row?.attendanceStatus?.data?.name
              }}</span>
            </template>
          </span>

          <span v-if="props.column.field === 'leave'">
            <template v-if="props.row?.on_leave">
              <span class="text-nowrap">Leave</span>
            </template>
          </span>

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
                      permissionsConstant.ATTENDANCE_SHOW,
                      permissions
                    )
                  "
                >
                  <b-dropdown-item v-on:click="onShowPage(props.row.id)">
                    <feather-icon icon="EyeIcon" class="mr-50" />
                    <span>Show</span>
                  </b-dropdown-item>
                </template>

                <!-- <template
                  v-if="
                    $permissionAbility(
                      permissionsConstant.DEPARTMENT_EDIT,
                      permissions
                    )
                  "
                >
                  <b-dropdown-item v-on:click="onShow(props.row)">
                    <feather-icon icon="Edit2Icon" class="mr-50" />
                    <span>Edit</span>
                  </b-dropdown-item>
                </template> -->

                <!-- <template
                  v-if="
                    $permissionAbility(
                      permissionsConstant.DEPARTMENT_DELETE,
                      permissions
                    )
                  "
                >
                  <b-dropdown-item v-on:click="onDelete(props.row.id)">
                    <feather-icon icon="TrashIcon" class="mr-50" />
                    <span>Delete</span>
                  </b-dropdown-item>
                </template> -->
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
      id="modal-department-form"
      centered
      :title="
        modelType == 'editModel' ? 'Edit Department' : 'Create Department'
      "
      hide-footer
      @hidden="hiddenModal"
      no-close-on-backdrop
    >
      <validation-observer ref="departmentValidation">
        <b-form v-on:submit.prevent="validationForm">
          <!-- name -->
          <b-form-group label="Name" label-for="name">
            <validation-provider #default="{ errors }" name="name" vid="name">
              <b-form-input
                id="name"
                type="text"
                v-model="name"
                :state="errors.length > 0 ? false : null"
                placeholder="Department"
                rules="required|max:255"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <!-- select head-->
          <b-form-group label="Head" label-for="head-id">
            <ValidationProvider
              name="head_id"
              v-slot="{ errors }"
              vid="name_id"
            >
              <v-select
                id="head-id"
                placeholder="Choose a Head"
                v-model="selectHeadId"
                :options="headIdOption"
                :reduce="(country) => country.id"
                label="name"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-form-group>

          <!-- select Division -->
          <b-form-group label="Division" label-for="division-id">
            <ValidationProvider
              name="division_id"
              v-slot="{ errors }"
              vid="division_id"
            >
              <v-select
                id="division-id"
                placeholder="Choose a Division"
                v-model="selectDivisionId"
                :options="divisionIdOption"
                :reduce="(country) => country.id"
                label="name"
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
import { minutesToHours } from "@/helpers/helpers";

export default {
  name: "AttendanceView",
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
      departmentId: "",
      name: "",
      selectHeadId: "",
      headIdOption: [],
      selectDivisionId: "",
      divisionIdOption: [],
      pageLength: 10,
      columns: [
        {
          label: "Date",
          field: "date",
        },
        {
          label: "Name",
          field: "name",
          sortable: false,
        },

        {
          label: "Status",
          field: "status",
          sortable: false,
        },
        {
          label: "Expected Duty Hours",
          field: "expected_duty_minutes",
          sortable: false,
          formatFn: this.formatFnTableExpectedDutyHours,
        },
        {
          label: "Check In",
          field: "first_check_in",
          formatFn: this.formatFnTableCheckIn,
        },
        {
          label: "Check Out",
          field: "last_check_out",

          formatFn: this.formatFnTableCheckOut,
        },
        {
          label: "Total Worked Hours",
          field: "total_worked_minutes",
          formatFn: this.formatFnTableTotalWorkedMinutes,
        },
        {
          label: "Extra/Less Duty Hours",
          field: "extra_less_duty_minutes",
          sortable: false,
          formatFn: this.formatFnTableExtraLessDutyHours,
        },
        {
          label: "Leave",
          field: "leave",
          sortable: false,
        },
        // {
        //   label: "Break Duration",
        //   field: "break_duration",
        //   sortable: false,
        // },
        // {
        //   label: "Actual Duty",
        //   field: "actual_duty",
        //   sortable: false,
        // },
        // {
        //   label: "Extra/Less Duty",
        //   field: "extra_less_duty",
        //   sortable: false,
        // },
        // {
        //   label: "Location",
        //   field: "location",
        // },
        // {
        //   label: "Remarks",
        //   field: "remarks",
        //   sortable: false,
        // },
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
        sort: [{ field: "first_check_in", type: "desc" }],
        page: 1,
        perPage: 10,
      },
    };
  },

  computed: {
    ...mapGetters({
      permissions: "userModule/getPermissions",
    }),
  },

  methods: {
    formatFnTableExtraLessDutyHours(value) {
      if (value) {
        return minutesToHours(value);
      }
    },
    formatFnTableExpectedDutyHours(value) {
      if (value) {
        return minutesToHours(value);
      }
    },
    formatFnTableCheckIn(value) {
      if (value) {
        return this.$moment(value, "HH:mm:ss").format("LTS");
      }
    },
    formatFnTableCheckOut(value) {
      if (value) {
        return this.$moment(value, "HH:mm:ss").format("LTS");
      }
    },
    formatFnTableTotalWorkedMinutes(value) {
      if (value) {
        return minutesToHours(value);
      }
    },
    showModal() {
      this.$bvModal.show("modal-department-form");
    },
    hiddenModal() {
      this.modelType = "";
      this.$bvModal.hide("modal-department-form");
      this.resetModal();
    },
    resetModal() {
      this.name = "";
      this.selectHeadId = "";
    },
    onShowPage(id) {
      this.$router.push({
        name: "admin-attendance-details",
        params: { id },
      });
    },
    // async onShow(value) {
    //   this.modelType = "editModel";
    //   this.name = value.name;
    //   this.departmentId = value.id;
    //   this.selectHeadId = value.head_id;
    //   this.selectDivisionId = value.division_id;

    //   this.showModal();
    // },
    // async onDelete(id) {
    //   try {
    //     await this.$api.delete(`/api/departments/${id}`);

    //     this.loadItems();

    //     this.$toast({
    //       component: ToastificationContent,
    //       props: {
    //         title: "Success",
    //         icon: "BellIcon",
    //         variant: "success",
    //         text: "Department successfully Deleted",
    //       },
    //     });
    //   } catch (error) {
    //     this.$toast({
    //       component: ToastificationContent,
    //       props: {
    //         title: "Error",
    //         icon: "BellIcon",
    //         variant: "danger",
    //         text: error?.response?.data?.message,
    //       },
    //     });
    //   }
    // },

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
    async getAttendances(params) {
      return await this.$api.get(
        "api/attendances?include=user,attendanceStatus",
        {
          params: {
            show: params.show,
            page: params.page,
            sort: params.sort,
            q: params.q,
          },
        }
      );
    },
    async loadItems() {
      try {
        const [attendances] = await Promise.all([
          this.getAttendances({
            show: this.serverParams.perPage,
            page: this.serverParams.page,
            sort: this.serverParams.sort,
            q: this.searchTerm,
          }),
        ]);

        // const checkIn = settings?.data?.data?.check_in_out_time[0]?.value;
        // const checkOut = settings?.data?.data?.check_in_out_time[1]?.value;

        const data = attendances?.data?.data;
        const meta = attendances?.data?.meta;

        this.totalRecords = meta?.pagination?.total;
        this.rows = data;
        // console.log("settings", settings, expectedDutyHours);
        // console.log("data", data);

        // const resUser = await this.$api.get("api/users");

        // this.headIdOption = (resUser?.data?.data || []).map((item) => {
        //   return {
        //     name: item.name,
        //     id: item.id,
        //   };
        // });

        // const resDivisionAll = await this.$api.get("api/divisions/all");

        // this.divisionIdOption = (resDivisionAll?.data?.data || []).map(
        //   (item) => {
        //     return {
        //       name: item.name,
        //       id: item.id,
        //     };
        //   }
        // );
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
      this.$refs.departmentValidation.validate().then(async (success) => {
        if (success) {
          try {
            if (this.modelType == "editModel") {
              await this.$api.put(`/api/departments/${this.departmentId}`, {
                name: this.name,
                head_id: this.selectHeadId,
                division_id: this.selectDivisionId,
              });

              this.loadItems();
              this.hiddenModal();
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Success",
                  icon: "BellIcon",
                  variant: "success",
                  text: "Department successfully Updated",
                },
              });
            } else {
              await this.$api.post(
                "/api/departments",

                {
                  name: this.name,
                  head_id: this.selectHeadId,
                  division_id: this.selectDivisionId,
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
                  text: "Department successfully Created",
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
              this.$refs.departmentValidation.setErrors(
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
