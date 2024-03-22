<template>
  <div>
    <b-card>

      <b-row>
        <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Customer Name</h5>
            <template>
              <div>
                <b-card-text>{{ customerInfo?.full_name }}</b-card-text>
              </div>
            </template>
          </b-col>


        <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Customer Email</h5>
            <template>
              <div>
                <b-card-text>{{ customerInfo?.email }}</b-card-text>
              </div>
            </template>
          </b-col>


          <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Customer Phone</h5>
            <template>
              <div>
                <b-card-text>{{ customerInfo?.phone }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Customer Created On</h5>
            <template>
              <div>
                <b-card-text>{{ this.formatFnTableLastContactDate(customerInfo?.created_at) }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Total Order Count</h5>
            <template>
              <div>
                <b-card-text>{{ totalRecords }}</b-card-text>
              </div>
            </template>

          </b-col>

          <b-col md="3" lg="3" xs="3">
            <h5 class="text-capitalize">Total Purchase Amount</h5>
            <template>
              <div>
                <b-card-text>{{ totalPurchaseAmount }}</b-card-text>
              </div>
            </template>
          </b-col>
      </b-row>
    </b-card>

    <b-card>
      <b-row>
        <b-col md="2" lg="2" xs="2">
            <h5 class="text-capitalize">Pending</h5>
            <template>
              <div>
                <b-card-text>{{ totalPendingCount }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="2" lg="2" xs="2">

            <h5 class="text-capitalize">Processing</h5>
            <template>
              <div>
                <b-card-text>{{ totalProcessingCount }}</b-card-text>
              </div>
            </template>
          </b-col>

        <b-col md="2" lg="2" xs="2">

            <h5 class="text-capitalize">Cancel</h5>
            <template>
              <div>
                <b-card-text>{{ totalCancelCount }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="2" lg="2" xs="2">

            <h5 class="text-capitalize">Returned</h5>
            <template>
              <div>
                <b-card-text>{{ totalReturnedCount }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="2" lg="2" xs="2">

            <h5 class="text-capitalize">Delivered</h5>
            <template>
              <div>
                <b-card-text>{{ totalDeliveredCount }}</b-card-text>
              </div>
            </template>
          </b-col>
      </b-row>

    </b-card>

    <b-card>
    
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
          <span v-if="props.column.field === 'format_id'">
            <strong>ID : </strong>{{ props.row.id }}
          </span>

          <!-- Column: Status -->
          <span v-if="props.column.field === 'format_status'">
            <b-badge variant="light-primary">
              {{ statusFormat(props.row.status) }}
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
      totalPurchaseAmount: "",
      customerInfo: {},

      totalPendingCount: '',
      totalProcessingCount: '',
      totalCancelCount: '',
      totalReturnedCount: '',
      totalDeliveredCount: '',

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
      {
          label: 'Order',
          field: 'format_id',
          sortable: false,
        },
        {
          label: 'Detail Address',
          field: 'detail_address',
          sortable: false,
        },

        {
          label: 'Payment Method',
          field: 'payment_method',
          sortable: false,
        },

        {
          label: 'Total Price',
          field: 'total_price',
          sortable: false,
        },
        {
          label: 'Delivery Charge',
          field: 'delivery_charge',
          sortable: false,
        },
        {
          label: 'Status',
          field: 'format_status',
          sortable: false,
        },
        {
          label: 'Action',
          field: 'action',
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
      authUser: "userModule/getUser",
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
    statusFormat(status) {
      const statusMap = {
        'pending': 'Pending',
        'pending-1': 'Pending 1',
        'pending-2': 'Pending 2',
        'processing': 'Processing',
        'packing': 'Packing',
        'shipping': 'Shipping',
        'on_the_way': 'On the way',
        'in_review': 'In Review',
        'rejected': 'Rejected',
        'returned': 'Returned',
        'canceled': 'Canceled',
        'delivered': 'Delivered'
      }

      return statusMap[status]
    },

    formatFnTableLastContactDate(value) {
      if (value) {
        return this.$moment(value).format('MMM Do YYYY, h:mm a')
      }
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

    async getTotalOrderAmount(id) {
      return await this.$api.get(`api/customer/${id}/total-order-amount`)
    },

    async getOrders(params) {
      return await this.$api.get('api/orders/all', {
        params: {
          show: params.show,
          page: params.page,
          sort: params.sort,
          q: params.q,
          customerId: params.customerId,
        },
      })
    },
    async getRoles() {
      return await this.$api.get('api/roles/priority-wise')
    },

    async loadItems() {
      try {
        const [order] = await Promise.all([
          this.getOrders({
            show: this.serverParams.perPage,
            page: this.serverParams.page,
            sort: this.serverParams.sort,
            q: this.searchTerm,
            customerId: this.$route.params.id,
          }),
        ])

        const data = order?.data?.data;

        console.log(data);

        const meta = order?.data?.meta;

        this.totalRecords = meta?.pagination?.total;

        this.rows = data;

         // i want sum of total purchase amount from data.total_price
        //  this.totalPurchaseAmount = data.reduce((acc, item) => {
        //   return acc + Number(item.total_price)
        // }, 0) 

        this.customerInfo = data[0]?.customer;


        const totalPurchaseAmount = await this.getTotalOrderAmount(this.$route.params.id);



        this.totalPurchaseAmount = totalPurchaseAmount.data.totalOrderAmount;
        this.totalPendingCount = totalPurchaseAmount.data.totalPendingCount;
        this.totalProcessingCount = totalPurchaseAmount.data.totalProcessingCount;
        this.totalCancelCount = totalPurchaseAmount.data.totalCancelledCount;
        this.totalReturnedCount = totalPurchaseAmount.data.totalReturnedCount;
        this.totalDeliveredCount = totalPurchaseAmount.data.totalDeliveredCount;


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
</style>
