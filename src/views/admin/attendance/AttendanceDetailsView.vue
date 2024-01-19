<template>
  <section>
    <b-row>
      <b-col lg="4" cols="12">
        <b-card>
          <div>
            <h5 class="text-capitalize mb-75">Name</h5>
            <b-card-text> {{ user?.name }} </b-card-text>
          </div>
          <div class="mt-2">
            <h5 class="text-capitalize mb-75">First Check In</h5>
            <b-card-text>
              <template v-if="attendanceDetails?.first_check_in">
                {{
                  [attendanceDetails?.first_check_in, "HH:mm:ss"]
                    | moment("LTS")
                }}
              </template>
            </b-card-text>
          </div>
          <div class="mt-2">
            <h5 class="text-capitalize mb-75">Last Check Out</h5>
            <b-card-text>
              <template v-if="attendanceDetails?.last_check_out">
                {{
                  [attendanceDetails?.last_check_out, "HH:mm:ss"]
                    | moment("LTS")
                }}
              </template>
            </b-card-text>
          </div>
          <div class="mt-2">
            <h5 class="text-capitalize mb-75">Expected Duty Hours</h5>
            <b-card-text>
              {{ attendanceDetails?.expected_duty_minutes | minutesToHours }}
            </b-card-text>
          </div>
          <div class="mt-2">
            <h5 class="text-capitalize mb-75">Total Worked Hours</h5>
            <b-card-text>
              {{ attendanceDetails?.total_worked_minutes | minutesToHours }}
            </b-card-text>
          </div>

          <div class="mt-2">
            <h5 class="text-capitalize mb-75">Date</h5>
            <b-card-text>
              <template v-if="attendanceDetails?.date">
                {{ attendanceDetails?.date | moment("ll") }}
              </template>
            </b-card-text>
          </div>
        </b-card>
      </b-col>

      <b-col lg="8" cols="12">
        <b-card>
          <div>
            <!-- table -->
            <vue-good-table
              :line-numbers="true"
              :rows="rows"
              :columns="columns"
              :sort-options="{
                enabled: true,
                multipleColumns: true,
              }"
              :pagination-options="{
                enabled: true,
                perPage: pageLength,
              }"
            >
              <template slot="table-row" slot-scope="props">
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

                      <!-- <template
                        v-if="
                          $permissionAbility(
                            permissionsConstant.DEPARTMENT_EMPLOYEE_DELETE,
                            permissions
                          )
                        "
                      >
                        <b-dropdown-item v-on:click="onDelete(props.row.id)">
                          <feather-icon icon="TrashIcon" class="mr-50" />
                          <span>Delete</span>
                        </b-dropdown-item>
                      </template> -->

                      <template
                        v-if="
                          $permissionAbility(
                            permissionsConstant.ATTENDANCE_DETAILS_EDIT,
                            permissions
                          )
                        "
                      >
                        <b-dropdown-item v-on:click="onShow(props.row)">
                          <feather-icon icon="Edit2Icon" class="mr-50" />
                          <span>Edit</span>
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
                        (value) =>
                          props.perPageChanged({ currentPerPage: value })
                      "
                    />
                    <span class="text-nowrap">
                      of {{ props.total }} entries
                    </span>
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
                      @input="
                        (value) => props.pageChanged({ currentPage: value })
                      "
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
            id="modal-attendance-details-form"
            centered
            title="Edit Attendance"
            hide-footer
            @hidden="hiddenModal"
            no-close-on-backdrop
          >
            <validation-observer ref="attendanceActivityValidation">
              <b-form v-on:submit.prevent="validationForm">
                <!-- check in-->
                <b-form-group label="Check In" label-for="check-in">
                  <validation-provider
                    #default="{ errors }"
                    name="check_in"
                    vid="check_in"
                    rules="required"
                  >
                    <b-form-timepicker
                      id="check-in"
                      v-model="check_in"
                      locale="en"
                      show-seconds
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
                <!-- check out-->
                <b-form-group label="Check Out" label-for="check-out">
                  <validation-provider
                    #default="{ errors }"
                    name="check_out"
                    vid="check_out"
                    rules="required"
                  >
                    <b-form-timepicker
                      id="check-out"
                      v-model="check_out"
                      locale="en"
                      show-seconds
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
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
      </b-col>
    </b-row>
  </section>
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
  BCol,
  BRow,
  BCardText,
  BFormTimepicker,
} from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { mapGetters } from "vuex";
import { permissionsConstant } from "@/helpers/permissionsConstant";
import minutesToHours from "@/filter/minutesToHours";

export default {
  name: "AttendanceDetailsView",
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
    BCol,
    BRow,
    BCardText,
    BFormTimepicker,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      permissionsConstant,
      user: null,
      attendanceDetails: null,
      modelType: "",
      attendance_activity_id: "",
      check_in: "",
      check_out: "",
      pageLength: 10,
      columns: [
        {
          label: "Date",
          field: "date",
          sortable: false,
          formatFn: this.formatFnTableCheckDate,
        },
        {
          label: "Check In",
          field: "check_in",
          formatFn: this.formatFnTableCheckIn,
        },

        {
          label: "Check Out",
          field: "check_out",
          formatFn: this.formatFnTableCheckOut,
        },
        {
          label: "Worked Minutes",
          field: "worked_minutes",
          sortable: false,
        },
        {
          label: "Action",
          field: "action",
          sortable: false,
        },
      ],
      rows: [],
    };
  },
  computed: {
    ...mapGetters({
      permissions: "userModule/getPermissions",
    }),
  },

  async created() {
    this.loadItems();
  },

  methods: {
    formatFnTableCheckDate(value) {
      if (value) {
        return this.$moment(value).format("ll");
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
    // onSearchUsers(search, loading) {
    //   if (search.length) {
    //     const id = this.$route.params.id;
    //     loading(true);
    //     if (this.delayTimer) {
    //       clearTimeout(this.delayTimer);
    //       this.delayTimer = null;
    //     }

    //     this.delayTimer = setTimeout(async () => {
    //       const resUsers = await this.$api.get(
    //         `api/department/${id}/users/search?include=userDepartment`,
    //         {
    //           params: {
    //             q: search,
    //           },
    //         }
    //       );
    //       // console.log("resUsers", resUsers);
    //       const dataUsers = resUsers?.data?.data;
    //       this.usersOption = (dataUsers || []).map((item) => {
    //         let name = item.name;
    //         let department = null;

    //         if (item.department_id) {
    //           name = `${item.name} (${item?.userDepartment?.data?.name})`;
    //           department = item?.userDepartment?.data?.name;
    //         }

    //         return {
    //           name: name,
    //           id: item.id,
    //           department,
    //         };
    //       });
    //       loading(false);
    //     }, 1000);
    //   }
    // },

    showModal() {
      this.$bvModal.show("modal-attendance-details-form");
    },
    hiddenModal() {
      this.$bvModal.hide("modal-attendance-details-form");
      this.resetModal();
    },
    resetModal() {
      this.modelType = "";
      this.attendance_id = "";
      this.check_in = "";
      this.check_out = "";
    },
    async onShow(value) {
      // console.log("onShow", value);
      this.modelType = "editModel";

      this.attendance_activity_id = value.id;
      this.check_in = value.check_in;
      this.check_out = value.check_out;

      this.showModal();
    },
    // async onDelete(id) {
    //   try {
    //     await this.$api.post("/api/sync-user-department", {
    //       user_id: id,
    //     });

    //     this.loadItems();

    //     this.$toast({
    //       component: ToastificationContent,
    //       props: {
    //         title: "Success",
    //         icon: "BellIcon",
    //         variant: "success",
    //         text: "Successfully Delete",
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

    async loadItems() {
      try {
        const id = this.$route.params.id;
        const res = await this.$api.get(
          `/api/attendances/${id}?include=user,attendanceActivities`
        );
        const { attendanceActivities, user, ...attendanceDetails } =
          res?.data?.data;

        this.user = user?.data;
        this.rows = attendanceActivities?.data;
        this.attendanceDetails = attendanceDetails;

        // console.log("attendanceActivities", attendanceActivities);

        // this.department = res?.data?.data;
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
      try {
        const success = await this.$refs.attendanceActivityValidation
          .validate()
          .then((success) => success);

        if (success && this.modelType == "editModel") {
          await this.$api.put(
            `/api/attendance-activities/${this.attendance_activity_id}`,
            {
              check_in: this.check_in,
              check_out: this.check_out,
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
              text: "Attendance Successfully Updated",
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
          this.$refs.attendanceActivityValidation.setErrors(
            error?.response?.data?.errors
          );
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-good-table.scss";
</style>
