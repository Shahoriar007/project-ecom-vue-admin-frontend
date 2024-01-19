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
                permissionsConstant.LEAVE_REQUESTS_CREATE,
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
              Create Leave Request
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
          <!-- <span v-if="props.column.field === 'head'">
            <template v-if="props.row.head_id != null">
              <b-avatar :src="props.row.head.data.avatar" class="mx-1" />
              <span class="text-nowrap">{{ props.row.head.data.name }}</span>
            </template>
          </span> -->

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
                      permissionsConstant.LEAVE_REQUESTS_EDIT,
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
                      permissionsConstant.LEAVE_REQUESTS_DELETE,
                      permissions
                    )
                  "
                >
                  <b-dropdown-item v-on:click="onDelete(props.row.id)">
                    <feather-icon icon="TrashIcon" class="mr-50" />
                    <span>Delete</span>
                  </b-dropdown-item>
                </template>

                <template
                  v-if="
                    $permissionAbility(
                      permissionsConstant.LEAVE_REQUESTS_APPROVE,
                      permissions
                    )
                  "
                >
                  <b-dropdown-item v-on:click="onApprove(props.row.id)">
                    <feather-icon icon="CheckIcon" class="mr-50" />
                    <span>Approve</span>
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
      id="modal-leave-request-form"
      centered
      :title="
        modelType == 'editModel' ? 'Edit Leave Request' : 'Create Leave Request'
      "
      hide-footer
      @hidden="hiddenModal"
      no-close-on-backdrop
    >
      <validation-observer ref="leaveRequestValidation">
        <b-form v-on:submit.prevent="validationForm">
          <!-- select Leave Type-->
          <b-form-group label="Leave Type" label-for="leave-type-id">
            <ValidationProvider
              name="leave_type_id"
              v-slot="{ errors }"
              vid="leave_type_id"
              rules="required"
            >
              <v-select
                id="leave-type-id"
                placeholder="Choose a Leave Type"
                v-model="selectLeaveTypeId"
                :options="leaveTypesOption"
                :reduce="(option) => option.id"
                label="name"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-form-group>

          <!-- select start date-->
          <b-form-group label="Start Date" label-for="start-date">
            <ValidationProvider
              name="start_date"
              v-slot="{ errors }"
              vid="start_date"
              rules="required"
            >
              <b-form-datepicker
                id="start-date"
                v-model="start_date"
                :state="errors.length > 0 ? false : null"
                locale="en-US"
                reset-button
                @context="onContextStartDate"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-form-group>

          <!-- select end date-->
          <b-form-group label="End Date" label-for="end-date">
            <ValidationProvider
              name="end_date"
              v-slot="{ errors }"
              vid="end_date"
              rules="required"
            >
              <b-form-datepicker
                id="end-date"
                v-model="end_date"
                :state="errors.length > 0 ? false : null"
                locale="en-US"
                @context="onContextEndDate"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-form-group>

          <!-- remarks -->
          <b-form-group label="Remarks" label-for="remarks">
            <validation-provider
              #default="{ errors }"
              name="remarks"
              vid="remarks"
              rules="required"
            >
              <b-form-textarea
                id="remarks"
                v-model="remarks"
                :state="errors.length > 0 ? false : null"
                placeholder="Remarks"
                rows="3"
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
  BFormDatepicker,
  BFormTextarea,
} from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, max } from "@validations";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { mapGetters } from "vuex";
import { permissionsConstant } from "@/helpers/permissionsConstant";

export default {
  name: "LeaveRequestsView",
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
    BFormDatepicker,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      permissionsConstant,
      modelType: "",
      leaveRequestId: "",
      start_date: "",
      end_date: "",
      remarks: "",
      selectLeaveTypeId: "",
      leaveTypesOption: [],
      pageLength: 10,
      columns: [
        {
          label: "Leave Type",
          field: this.tableLeaveType,
          sortable: false,
        },
        {
          label: "Start date",
          field: "start_date",
          sortable: false,
        },
        {
          label: "End date",
          field: "end_date",
          sortable: false,
        },
        {
          label: "Remarks",
          field: "remarks",
          sortable: false,
        },
        {
          label: "Status",
          field: "status",
          formatFn: this.formatFnTableStatus,
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
      isLoading: false,
      totalRecords: 0,
      serverParams: {
        columnFilters: {},
        sort: [{ field: "id", type: "desc" }],
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

  async created() {
    try {
      const [leaveTypes] = await Promise.all([this.getLeaveTypes()]);

      // leave types
      this.leaveTypesOption = (leaveTypes?.data?.data || []).map((item) => {
        return {
          name: item.name,
          id: item.id,
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
    formatFnTableStatus(value) {
      if (value) {
        return "Approved";
      }
    },
    tableLeaveType(rowObj) {
      return rowObj?.leaveType?.data?.name;
    },
    onContextStartDate(ctx) {
      this.start_date = ctx.selectedYMD;
    },
    onContextEndDate(ctx) {
      this.end_date = ctx.selectedYMD;
    },
    showModal() {
      this.$bvModal.show("modal-leave-request-form");
    },
    hiddenModal() {
      this.modelType = "";
      this.$bvModal.hide("modal-leave-request-form");
      this.resetModal();
    },
    resetModal() {
      this.start_date = "";
      this.end_date = "";
      this.remarks = "";
      this.selectLeaveTypeId = "";
      this.leaveRequestId = "";
    },
    async onShow(value) {
      this.modelType = "editModel";

      this.leaveRequestId = value.id;
      this.start_date = value.start_date;
      this.end_date = value.end_date;
      this.remarks = value.remarks;
      this.selectLeaveTypeId = value.leave_type_id;

      this.showModal();
    },
    async onDelete(id) {
      try {
        await this.$api.delete(`/api/leave-requests/${id}`);

        this.loadItems();

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "BellIcon",
            variant: "success",
            text: "Leave Request successfully Deleted",
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
    async onApprove(id) {
      try {
        await this.$api.post(`/api/leave-requests/${id}/approve`);

        this.loadItems();

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "BellIcon",
            variant: "success",
            text: "Leave Request successfully Approved",
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

    async getLeaveRequests(params) {
      return await this.$api.get("api/leave-requests?include=leaveType", {
        params: {
          show: params.show,
          page: params.page,
          sort: params.sort,
          q: params.q,
        },
      });
    },
    async getLeaveTypes() {
      return await this.$api.get("api/leave-types/eligible/all");
    },

    async loadItems() {
      try {
        const [leaveRequests] = await Promise.all([
          this.getLeaveRequests({
            show: this.serverParams.perPage,
            page: this.serverParams.page,
            sort: this.serverParams.sort,
            q: this.searchTerm,
          }),
        ]);

        const data = leaveRequests?.data?.data;
        const meta = leaveRequests?.data?.meta;

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
      this.$refs.leaveRequestValidation.validate().then(async (success) => {
        if (success) {
          try {
            if (this.modelType == "editModel") {
              await this.$api.put(
                `/api/leave-requests/${this.leaveRequestId}`,
                {
                  start_date: this.start_date,
                  end_date: this.end_date,
                  remarks: this.remarks,
                  leave_type_id: this.selectLeaveTypeId,
                }
              );

              this.loadItems();
              this.hiddenModal();
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Success",
                  icon: "BellIcon",
                  variant: "success",
                  text: "Leave Request successfully Updated",
                },
              });
            } else {
              await this.$api.post(
                "/api/leave-requests",

                {
                  start_date: this.start_date,
                  end_date: this.end_date,
                  remarks: this.remarks,
                  leave_type_id: this.selectLeaveTypeId,
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
                  text: "Leave Request successfully Created",
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
              this.$refs.leaveRequestValidation.setErrors(
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
