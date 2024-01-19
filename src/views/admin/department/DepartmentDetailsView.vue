<template>
  <section>
    <b-row>
      <b-col lg="4" cols="12">
        <b-card>
          <div>
            <h5 class="text-capitalize mb-75">Name</h5>
            <b-card-text> {{ department.name }} </b-card-text>
          </div>
          <template v-if="department.head_id">
            <div class="mt-2">
              <h5 class="text-capitalize mb-75">Head</h5>
              <b-card-text> {{ department.head.data.name }} </b-card-text>
            </div>
          </template>

          <template v-if="department.division_id">
            <div class="mt-2">
              <h5 class="text-capitalize mb-75">Division</h5>
              <b-card-text> {{ department.division.data.name }} </b-card-text>
            </div>
          </template>

          <div class="mt-2">
            <h5 class="text-capitalize mb-75">Created ON</h5>
            <b-card-text> {{ department.created_at }} </b-card-text>
          </div>
        </b-card>
      </b-col>

      <b-col lg="8" cols="12">
        <b-card>
          <div>
            <!-- search input -->
            <div
              class="custom-search d-flex align-items-center justify-content-end"
            >
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
                    $permissionAbility(
                      permissionsConstant.DEPARTMENT_EMPLOYEE_ADD,
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
                    Add Employee
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
                  <b-avatar :src="props.row.avatar" class="mr-1" />
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
                            permissionsConstant.DEPARTMENT_EMPLOYEE_DELETE,
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
            id="modal-department-show-form"
            centered
            title="Add Employee"
            hide-footer
            @hidden="hiddenModal"
            no-close-on-backdrop
          >
            <validation-observer ref="departmentUserValidation">
              <b-form v-on:submit.prevent="validationForm">
                <!-- select Division -->
                <b-form-group label="Employee" label-for="user-id">
                  <ValidationProvider
                    name="user_id"
                    v-slot="{ errors }"
                    vid="user_id"
                  >
                    <v-select
                      id="user-id"
                      placeholder="Search a employee"
                      v-model="selectUserId"
                      :options="usersOption"
                      :reduce="(option) => option.id"
                      label="name"
                      :filterable="false"
                      @search="onSearchUsers"
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
} from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, max } from "@validations";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { mapGetters } from "vuex";
import { permissionsConstant } from "@/helpers/permissionsConstant";

export default {
  name: "DepartmentDetailsView",
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
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      permissionsConstant,
      selectUserId: "",
      usersOption: [],
      pageLength: 10,
      columns: [
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Designation",
          field: "designation.data.name",
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
      department: {},
    };
  },
  computed: {
    ...mapGetters({
      permissions: "userModule/getPermissions",
    }),
  },

  async created() {
    try {
      const id = this.$route.params.id;
      const resDepartment = await this.$api.get(
        `/api/departments/${id}?include=head,division`
      );

      const dataDepartment = resDepartment?.data?.data;
      this.department = dataDepartment;
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

  watch: {
    selectUserId(newData, oldData) {
      if (newData) {
        const departmentOption = this.usersOption.find(
          (item) => item.id == newData
        ).department;

        if (departmentOption) {
          this.$swal({
            title: "Warning!",
            text: "Your selected user has a department do you want to change department?",
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-outline-danger ml-1",
            },
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: "Ok",
            showLoaderOnConfirm: true,
          }).then((result) => {
            if (result.isDismissed) {
              this.resetModal();
            }
          });
        }
      }
    },
  },

  methods: {
    onSearchUsers(search, loading) {
      if (search.length) {
        const id = this.$route.params.id;
        loading(true);
        if (this.delayTimer) {
          clearTimeout(this.delayTimer);
          this.delayTimer = null;
        }

        this.delayTimer = setTimeout(async () => {
          const resUsers = await this.$api.get(
            `api/department/${id}/users/search?include=department`,
            {
              params: {
                q: search,
              },
            }
          );
          // console.log("resUsers", resUsers);
          const dataUsers = resUsers?.data?.data;
          this.usersOption = (dataUsers || []).map((item) => {
            let name = item.name;
            let department = null;

            if (item.department_id) {
              name = `${item.name} (${item?.department?.data?.name})`;
              department = item?.department?.data?.name;
            }

            return {
              name: name,
              id: item.id,
              department,
            };
          });
          loading(false);
        }, 800);
      }
    },

    showModal() {
      this.$bvModal.show("modal-department-show-form");
    },
    hiddenModal() {
      this.$bvModal.hide("modal-department-show-form");
      this.resetModal();
    },
    resetModal() {
      this.selectUserId = "";
      this.usersOption = [];
    },
    async onDelete(id) {
      try {
        await this.$api.post("/api/sync-user-department", {
          user_id: id,
        });

        this.loadItems();

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "BellIcon",
            variant: "success",
            text: "Successfully Delete",
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

    async loadItems() {
      const id = this.$route.params.id;
      try {
        const resDepartmentUsers = await this.$api.get(
          `/api/department/${id}/users?include=designation`,
          {
            params: {
              show: this.serverParams.perPage,
              page: this.serverParams.page,
              sort: this.serverParams.sort,
              q: this.searchTerm,
            },
          }
        );

        // console.log("resDepartmentUsers", resDepartmentUsers);

        const data = resDepartmentUsers?.data?.data;
        const meta = resDepartmentUsers?.data?.meta;

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
      this.$refs.departmentUserValidation.validate().then(async (success) => {
        if (success) {
          try {
            await this.$api.post("/api/sync-user-department", {
              department_id: this.$route.params.id,
              user_id: this.selectUserId,
            });

            this.hiddenModal();

            this.loadItems();

            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Success",
                icon: "BellIcon",
                variant: "success",
                text: "Successfully Add",
              },
            });
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
              this.$refs.departmentUserValidation.setErrors(
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
