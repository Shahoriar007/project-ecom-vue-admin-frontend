<template>
  <div>
    

    <b-col lg="6" cols="12">
      <b-card>
        <b-row>
          <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Customer Name</h5>
            <template>
              <div>
                <b-card-text>{{
                  customerData?.customer?.full_name
                }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Phone</h5>
            <template>
              <div>
                <b-card-text>{{ customerData?.customer?.phone }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Address</h5>
            <template>
              <div>
                <b-card-text>{{ orderData?.detail_address }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="3" lg="3" xs="3">
            <b-dropdown
              id="dropdown-1"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              :text="orderStatus"
              variant="primary"
            >
              <b-dropdown-item
                value="pending"
                @click="selectedStatus('pending')"
                >Pending</b-dropdown-item
              >
              <b-dropdown-item
                value="processing"
                @click="selectedStatus('processing')"
                >Processing</b-dropdown-item
              >
              <b-dropdown-item
                value="packing"
                @click="selectedStatus('packing')"
                >Packing</b-dropdown-item
              >
              <b-dropdown-item
                value="shipping"
                @click="selectedStatus('shipping')"
                >Shipping</b-dropdown-item
              >
              <b-dropdown-item
                value="on_the_way"
                @click="selectedStatus('on_the_way')"
                >On the way</b-dropdown-item
              >
              <b-dropdown-item
                value="in_review"
                @click="selectedStatus('in_review')"
                >In Review</b-dropdown-item
              >
              <b-dropdown-item
                value="rejected"
                @click="selectedStatus('rejected')"
                >Rejected</b-dropdown-item
              >
              <b-dropdown-item
                value="returned"
                @click="selectedStatus('returned')"
                >Returned</b-dropdown-item
              >
              <b-dropdown-item
                value="canceled"
                @click="selectedStatus('canceled')"
                >Canceled</b-dropdown-item
              >
              <b-dropdown-item
                value="delivered"
                @click="selectedStatus('delivered')"
                >Delivered</b-dropdown-item
              >
            </b-dropdown>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="4" lg="4" xs="4">
            <h5 class="text-capitalize">Order Note</h5>
            <template>
              <div>
                <b-card-text>{{ orderData?.order_notes }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="4" lg="4" xs="4">
            <h5 class="text-capitalize">Order Status</h5>
            <template>
              <div>
                <b-card-text>{{ orderData?.status }}</b-card-text>
              </div>
            </template>
          </b-col>
        </b-row>
      </b-card>
    </b-col>

    <b-card>
      <div>
        <!-- search input -->
        <!-- <div class="custom-search d-flex align-items-center justify-content-end">
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
          
        </div>
      </div> -->

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
              <!-- {{ props.row. }} -->
              name
            </span>

            <!-- Column: Status -->
            <span v-if="props.column.field === 'format_quantity'">
              <b-badge variant="light-primary">
                {{ props.row.pivot.quantity }}
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
                  <template>
                    <b-dropdown-item v-on:click="onView(props.row.id)">
                      <feather-icon icon="Edit2Icon" class="mr-50" />
                      <span>View</span>
                    </b-dropdown-item>
                  </template>

                  <!-- <template v-if="$permissionAbility(USERS_DELETE, permissions)">
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
    </b-card>
  </div>
</template>

<script>
import { email } from '@validations'
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
  BRow,
  BCardText,
  BFormCheckboxGroup,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'

import {
  USERS_ACCESS,
  USERS_CREATE,
  USERS_DELETE,
  USERS_EDIT,
  USERS_SHOW,
} from '@/helpers/permissionsConstant'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { mapGetters } from 'vuex'

export default {
  mixins: [togglePasswordVisibility],
  name: 'CustomerView',
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
    BCardText,
    BFormCheckboxGroup,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      USERS_ACCESS,
      USERS_CREATE,
      USERS_SHOW,
      USERS_EDIT,
      USERS_DELETE,
      modelType: '',
      userId: '',
      name: '',
      password: '',
      password_confirmation: '',
      email: '',
      selectRoleId: '',
      roleIdOption: [],
      customerData: '',
      orderData: '',
      orderStatus: '',

      selectedRadio: 'active',
      optionsRadio: [
        { text: 'Active', value: 'active' },
        { text: 'Radio', value: 'radio' },
        { text: 'Radio', value: 'radio2' },
      ],

      selectStatusValue: true,
      statusValueOption: [
        {
          name: 'Active',
          value: true,
        },
        {
          name: 'Inactive',
          value: false,
        },
      ],

      pageLength: 10,
      columns: [
        // {
        //   label: 'Customer Name',
        //   field: 'customer_name.full_name',
        //   sortable: false,
        // },
        // {
        //   label: 'Country Name',
        //   field: 'country_name',
        //   sortable: false,
        // },
        // {
        //   label: 'City Name',
        //   field: 'city_name',
        //   sortable: false,
        // },
        {
          label: 'product Name',
          field: 'name',
          sortable: false,
        },

        {
          label: 'SKU',
          field: 'sku',
          sortable: false,
        },

        {
          label: 'Price',
          field: 'price',
          sortable: false,
        },
        {
          label: 'Sale Price',
          field: 'sale_price',
          sortable: false,
        },
        {
          label: 'Quantity',
          field: 'format_quantity',
          sortable: false,
        },
      ],
      rows: [],
      searchTerm: '',
      delayTimer: null,
      isLoading: false,
      totalRecords: 0,
      serverParams: {
        columnFilters: {},
        sort: [
          { field: 'id', type: 'desc' },
          { field: 'name', type: 'desc' },
          { field: 'created_at', type: 'desc' },
        ],
        page: 1,
        perPage: 10,
      },
    }
  },

  computed: {
    ...mapGetters({
      permissions: 'userModule/getPermissions',
    }),
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    statusVariant() {
      const statusColor = {
        true: 'light-success',
        false: 'light-danger',
      }

      return (status) => statusColor[status]
    },
  },

  async created() {
    try {
      const [roles] = await Promise.all([this.getRoles()])

      // roles
      this.roleIdOption = (roles?.data?.data || []).map((item) => {
        return {
          name: item?.name,
          id: item?.id,
        }
      })
    } catch (error) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Error',
          icon: 'BellIcon',
          variant: 'danger',
          text: error?.response?.data?.message,
        },
      })
    }
  },

  methods: {
    selectedStatus(status) {
      this.$api
        .post(`api/update-status`, {
          id: this.$route.params.id,
          status: status,
        })
        .then((res) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success',
              icon: 'BellIcon',
              variant: 'success',
              text: 'Order Status successfully Updated',
            },
          })

          this.loadItems()
        })
        .catch((error) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Error',
              icon: 'BellIcon',
              variant: 'danger',
              text: error?.response?.data?.message,
            },
          })
        })
    },

    onView(id) {
      this.$router.push({
        name: 'admin-orders-view',
        params: { id },
      })
    },
    roleName(rowObj) {
      return rowObj?.roles?.data[0]?.name
    },
    showModal() {
      this.$bvModal.show('modal-users-form')
    },
    hiddenModal() {
      this.modelType = ''
      this.$bvModal.hide('modal-users-form')
      this.resetModal()
    },
    resetModal() {
      this.userId = ''
      this.name = ''
      this.selectRoleId = ''
      this.email = ''
      this.selectStatusValue = true
      this.password = ''
      this.password_confirmation = ''
    },
    async onShow(value) {
      //   console.log("onShow", value);
      this.modelType = 'editModel'
      this.userId = value?.id
      this.name = value?.name
      this.email = value?.email
      this.selectRoleId = value?.roles?.data[0]?.id
      this.selectStatusValue = value?.status

      this.showModal()
    },
    async onDelete(id) {
      try {
        await this.$api.delete(`/api/users/${id}`)

        this.loadItems()

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Success',
            icon: 'BellIcon',
            variant: 'success',
            text: 'User successfully Deleted',
          },
        })
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error',
            icon: 'BellIcon',
            variant: 'danger',
            text: error?.response?.data?.message,
          },
        })
      }
    },

    onSearch() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer)
        this.delayTimer = null
      }

      this.delayTimer = setTimeout(() => {
        this.loadItems()
      }, 1000)
    },

    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps)
    },

    onPageChange(params) {
      this.updateParams({ page: params.currentPage })
      this.loadItems()
    },

    onPerPageChange(params) {
      this.updateParams({ perPage: params.currentPerPage })
      this.loadItems()
    },

    onSortChange(params) {
      this.updateParams({
        sort: params,
      })
      this.loadItems()
    },

    onColumnFilter(params) {
      this.updateParams(params)
      this.loadItems()
    },
    async getOrderDetails() {
      return await this.$api.get(`api/orders/details/${this.$route.params.id}`)
    },
    async getRoles() {
      return await this.$api.get('api/roles/priority-wise')
    },

    async loadItems() {
      try {
        const [orders] = await Promise.all([this.getOrderDetails()])

        const data = orders?.data?.data?.products

        const meta = orders?.data?.meta

        this.totalRecords = meta?.pagination?.total
        this.rows = data

        this.customerData = orders?.data?.data
        this.orderData = orders?.data?.data
        this.orderStatus = orders?.data?.data?.status
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error',
            icon: 'BellIcon',
            variant: 'danger',
            text: error?.response?.data?.message,
          },
        })
      }
    },
    validationForm: async function () {
      this.$refs.usersValidation.validate().then(async (success) => {
        if (success) {
          try {
            if (this.modelType == 'editModel') {
              await this.$api.put(`/api/users/${this.userId}`, {
                name: this.name,
                email: this.email,
                status: this.selectStatusValue,
                password: this.password,
                password_confirmation: this.password_confirmation,
                role_id: this.selectRoleId,
              })

              this.loadItems()
              this.hiddenModal()
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'BellIcon',
                  variant: 'success',
                  text: 'User successfully Updated',
                },
              })
            } else {
              await this.$api.post('/api/users', {
                name: this.name,
                email: this.email,
                status: this.selectStatusValue,
                password: this.password,
                password_confirmation: this.password_confirmation,
                role_id: this.selectRoleId,
              })

              this.hiddenModal()

              this.loadItems()

              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'BellIcon',
                  variant: 'success',
                  text: 'User successfully Created',
                },
              })
            }
          } catch (error) {
            if (error?.response?.data?.message) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Error',
                  icon: 'BellIcon',
                  variant: 'danger',
                  text: error?.response?.data?.message,
                },
              })
            }

            if (error?.response?.data?.errors) {
              this.$refs.usersValidation.setErrors(
                error?.response?.data?.errors
              )
            }
          }
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';

ul.dropdown-menu.show {
  z-index: 9999;
}
</style>
