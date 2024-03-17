<template>
  <b-card>
    <div>
      <b-row>
        <b-col md="10">
          <!-- search input -->
          <div class="custom-search align-items-center">
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
          </div>
        </b-col>
        <b-col md="2">
          <b-form-group>
            <flat-pickr
              v-model="rangeDate"
              class="form-control"
              placeholder="Date Filter"
              :config="{ mode: 'range' }"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <!-- filter -->
      <template>
        <b-row>
          <b-col md="1">
            <div>
              <b-badge variant="light-primary" style="font-size: xx-large">
                {{ statusCount }}
              </b-badge>
            </div>
          </b-col>

          <template v-if="isRowChecked">
            <b-col md="1">
              <b-dropdown
                id="dropdown-1"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                text="Action"
                variant="primary"
              >
                <b-dropdown-item @click="printSelectedSticker()"
                  >Print Sticker</b-dropdown-item
                >
                <b-dropdown-item
                  value="pending"
                  @click="changeSelectedStatus('pending')"
                  >Mark as Pending</b-dropdown-item
                >
                <b-dropdown-item
                  value="processing"
                  @click="changeSelectedStatus('processing')"
                  >Mark as Processing</b-dropdown-item
                >
                <b-dropdown-item
                  value="packing"
                  @click="changeSelectedStatus('packing')"
                  >Mark as Packing</b-dropdown-item
                >
                <b-dropdown-item
                  value="shipping"
                  @click="changeSelectedStatus('shipping')"
                  >Mark as Shipping</b-dropdown-item
                >
                <b-dropdown-item
                  value="on_the_way"
                  @click="changeSelectedStatus('on_the_way')"
                  >Mark as On the way</b-dropdown-item
                >
                <b-dropdown-item
                  value="in_review"
                  @click="changeSelectedStatus('in_review')"
                  >Mark as In Review</b-dropdown-item
                >
                <b-dropdown-item
                  value="rejected"
                  @click="changeSelectedStatus('rejected')"
                  >Mark as Rejected</b-dropdown-item
                >
                <b-dropdown-item
                  value="returned"
                  @click="changeSelectedStatus('returned')"
                  >Mark as Returned</b-dropdown-item
                >
                <b-dropdown-item
                  value="canceled"
                  @click="changeSelectedStatus('canceled')"
                  >Mark as Canceled</b-dropdown-item
                >
                <b-dropdown-item
                  value="delivered"
                  @click="changeSelectedStatus('delivered')"
                  >Mark as Delivered</b-dropdown-item
                >
              </b-dropdown>
            </b-col>
          </template>

          <b-col md="10">
            <!-- radio button -->
            <div style="overflow-x: auto; white-space: nowrap; max-width: 100%">
              <b-form-group>
                <b-form-radio-group
                  id="btn-radios-1"
                  v-model="filterStatus"
                  button-variant="outline-primary"
                  :options="optionsRadio"
                  buttons
                  name="radios-btn-default"
                />
              </b-form-group>
            </div>
          </b-col>
        </b-row>
      </template>

      <!-- table -->
      <vue-good-table
        :line-numbers="true"
        mode="remote"
        @on-selected-rows-change="selectionChanged"
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
        :select-options="{
          enabled: true,
          selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
          selectionInfoClass: 'custom-class',
          selectionText: 'rows selected',
          clearSelectionText: 'clear',
          disableSelectInfo: false, // disable the select info panel on top
          selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
        }"
      >
        <template slot="table-row" slot-scope="props">
          <!-- Order -->
          <span v-if="props.column.field === 'format_order'">
            <div style="display: block">
              <b-link v-on:click="showModal(props.row.id)">
                <strong>ID: </strong> <span>{{ props.row.id }}</span>
              </b-link>
            </div>
            <div style="display: block">
              <strong>Tk: </strong>
              <span>{{
                props.row.total_price - props.row.delivery_charge
              }}</span>
            </div>
            <!-- <div style="display: block">
              <strong>Delivery Charge: </strong>
              <span>{{ props.row.delivery_charge }}</span>
            </div> -->
          </span>
          <!-- Column: head -->
          <span v-if="props.column.field === 'name'">
            <!-- {{ props.row. }} -->
            name
          </span>

          <!-- Column: Status -->
          <span v-if="props.column.field === 'format_status'">
            <b-badge variant="light-primary">
              {{ statusFormat(props.row.status) }}
            </b-badge>
          </span>

          <!-- payment method -->
          <span v-if="props.column.field === 'format_payment_method'">
            <template v-if="props.row.payment_method == 'cash_on_delivery'">
              <b-badge variant="light-primary"> COD </b-badge>
            </template>
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
                  <b-dropdown-item v-on:click="showModal(props.row.id)">
                    <feather-icon icon="Edit2Icon" class="mr-50" />
                    <span>View Here</span>
                  </b-dropdown-item>
                  <!-- <b-dropdown-item v-on:click="generateInvoice(props.row.id)">
                    <feather-icon icon="ClipboardIcon" class="mr-50" />
                    <span>Invoice</span>
                  </b-dropdown-item> -->
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

    <b-modal
      id="modal-order-details"
      centered
      size="xl"
      title="Order Details"
      hide-footer
      @hidden="hiddenModal"
      no-close-on-backdrop
    >
    <b-row>
      <b-col md="2" lg="2" xs="2">
        <h3 v-if="modalOrderId">Order Id: {{ modalOrderId }}</h3>
      </b-col>
      <b-col md="10" lg="10" xs="10">
        <h4 class="text-capitalize">Status: 
          <b-badge variant="light-primary" style="font-size: large">
          {{ statusFormat(modalOrderStatus) }}
          </b-badge>
        </h4>
      </b-col>
    </b-row>
<br><br>
      <b-row>
        <b-col md="3" lg="3" xs="3">
          <h5 class="text-capitalize">Customer</h5>
          <template>
            <div>
              <b-card-text>
                <strong>
                <b-link v-on:click="onViewCustomer(modalCustomerId)">
                  {{ modalCustomerName }}
                </b-link>
              </strong>
              </b-card-text>
                
            </div>

            <div>
              <b-card-text>{{ modalCustomerPhone }}</b-card-text>
            </div>

            <div>
              <b-card-text>{{ modalCustomerAddress }}</b-card-text>
            </div>
          </template>

        </b-col>

        <b-col md="9" lg="9" xs="9">
          <b-row v-for="(item, index) in modalProducts" :key="index">
            <b-col md="3" lg="3" xs="3">
              <h5 class="text-capitalize">Product name</h5>
              <template>
                <div>
                  <b-card-text>{{ item.name }}</b-card-text>
                </div>
              </template>
            </b-col>

            <b-col md="2" lg="2" xs="2">
              <h5 class="text-capitalize">SKU</h5>
              <template>
                <div>
                  <b-card-text>{{ item.sku }}</b-card-text>
                </div>
              </template>
            </b-col>

            <b-col md="2" lg="2" xs="2">
              <h5 class="text-capitalize">Quantity</h5>
              <template>
                <div>
                  <b-card-text>{{ item.pivot.quantity }}</b-card-text>
                </div>
              </template>
            </b-col>

            <b-col md="2" lg="2" xs="2">
              <h5 class="text-capitalize">Image</h5>
              <div class="image-container">
                <img
                  class="small-image"
                  :src="item.small_pictures[0].original_url"
                />
                <div
                  class="large-image"
                  :style="{
                    backgroundImage:
                      'url(' + item.small_pictures[0].original_url + ')',
                  }"
                ></div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-modal>
  </b-card>
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
  BFormRadioGroup,
  BCardText,
  BLink,
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
import flatPickr from 'vue-flatpickr-component'

export default {
  mixins: [togglePasswordVisibility],
  name: 'OrderView',
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
    BFormRadioGroup,
    flatPickr,
    BCardText,
    BLink,
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
      userId: '',
      name: '',
      password: '',
      password_confirmation: '',
      email: '',
      selectRoleId: '',
      roleIdOption: [],
      statusCount: '',
      rangeDate: null,
      isRowChecked: false,
      selectedRows: [],

      // order details modal
      modalOrderId: '',
      modalCustomerName: '',
      modalOrderStatus: '',

      modalCustomerPhone: '',
      modalCustomerAddress: '',
      modalProducts: [],
      modalCustomerId: '',

      filterStatus: '',
      optionsRadio: [
        { text: 'All', value: 'all' },
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Packing', value: 'packing' },
        { text: 'Shipping', value: 'shipping' },
        { text: 'On the way', value: 'on_the_way' },
        { text: 'In Review', value: 'in_review' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Returned', value: 'returned' },
        { text: 'Canceled', value: 'canceled' },
        { text: 'Delivered', value: 'delivered' },
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
        {
          label: 'Order',
          field: 'format_order',
          sortable: false,
        },
        {
          label: 'Status',
          field: 'format_status',
          sortable: false,
        },
        {
          label: 'Updated',
          field: 'updated_at',
          formatFn: this.formatFnTableLastContactDate,
        },
        {
          label: 'Delivery Charge',
          field: 'delivery_charge',
          sortable: false,
        },
        {
          label: 'Customer Name',
          field: 'customer.full_name',
          sortable: false,
        },
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
          label: 'Detail Address',
          field: 'detail_address',
          sortable: false,
        },

        {
          label: 'Payment Method',
          field: 'format_payment_method',
          sortable: false,
        },

        {
          label: 'Created At',
          field: 'created_at',
          formatFn: this.formatFnTableLastContactDate,
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

  watch: {
    filterStatus: function (newVal, oldVal) {
      this.loadItems()
    },
    rangeDate: function (newVal, oldVal) {
      console.log(newVal, oldVal)
      this.loadItems()
    },
  },

  methods: {
    onViewCustomer(id) {
      this.$router.push({
        name: 'admin-customer-history',
        params: { id },
      })
    },
    statusFormat(status) {
      if (status == 'pending') {
        return 'Pending'
      } else if (status == 'processing') {
        return 'Processing'
      } else if (status == 'packing') {
        return 'Packing'
      } else if (status == 'shipping') {
        return 'Shipping'
      } else if (status == 'on_the_way') {
        return 'On the way'
      } else if (status == 'in_review') {
        return 'In Review'
      } else if (status == 'rejected') {
        return 'Rejected'
      } else if (status == 'returned') {
        return 'Returned'
      } else if (status == 'canceled') {
        return 'Canceled'
      } else if (status == 'delivered') {
        return 'Delivered'
      }
    },
    selectionChanged(params) {
      if (params?.selectedRows.length == 0) {
        this.isRowChecked = false
        this.selectedRows = []
      } else {
        this.isRowChecked = true
        this.selectedRows = params?.selectedRows
        console.log(this.selectedRows)
      }
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

    async getOrderDetails(id) {
      return await this.$api.get(`api/orders/details/${id}`)
    },

    // show order details modal
    async showModal(id) {
      await this.getOrderDetails(id)
        .then((response) => {
          console.log(response.data.data)

          this.modalOrderId = response.data.data.id
          this.modalCustomerName = response.data.data.customer.full_name
          this.modalOrderStatus = response.data.data.status

          this.modalCustomerPhone = response.data.data.customer.phone
          this.modalCustomerAddress = response.data.data.detail_address
          this.modalProducts = response.data.data.products

          this.modalCustomerId = response.data.data.customer.id

          this.$bvModal.show('modal-order-details')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    hiddenModal(id) {
      this.$bvModal.hide('modal-order-details')
      this.resetModal()
    },
    resetModal() {
      this.modalOrderId = ''
      this.modalCustomerName = ''
      this.modalOrderStatus = ''

      this.modalCustomerPhone = ''
      this.modalCustomerAddress = ''
      this.modalProducts = []
      this.modalCustomerId = ''
    },
    // invoice generation
    saveFile(file) {
      const blob = new Blob([file], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)

      //open report pdf in new tab
      link.target = '_blank' // Open in a new tab
      link.click()
    },

    // sticker generation
    async printSelectedSticker() {
      const orderIds = (this.selectedRows || []).map((item) => {
        return item?.id
      })

      try {
        const response = await this.$api.put(
          'api/print-sticker',
          {
            orderIds: orderIds,
          },
          {
            responseType: 'blob',
          }
        )

        await this.saveFile(response.data)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Success',
            icon: 'BellIcon',
            variant: 'success',
            text: 'Sticker Generated',
          },
        })
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
      }
    },

    async changeSelectedStatus(status) {
      const orderIds = (this.selectedRows || []).map((item) => {
        return item?.id
      })

      try {
        await this.$api.put(`api/order/status/multiple`, {
          ids: orderIds,
          status: status,
        })

        this.loadItems()

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Success',
            icon: 'BellIcon',
            variant: 'success',
            text: 'Selected records successfully changed',
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

    async generateInvoice(id) {
      try {
        const response = await this.$api.get('api/print-invoice', {
          responseType: 'blob',
          params: {
            orderId: id,
          },
        })

        await this.saveFile(response.data)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Success',
            icon: 'BellIcon',
            variant: 'success',
            text: 'Invoice Generated',
          },
        })
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
      }
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
    async getUsers(params) {
      return await this.$api.get('api/orders/all', {
        params: {
          show: params.show,
          page: params.page,
          sort: params.sort,
          q: params.q,
          filterStatus: params.filterStatus,
          rangeDate: params.rangeDate,
        },
      })
    },
    async getRoles() {
      return await this.$api.get('api/roles/priority-wise')
    },

    async loadItems() {
      try {
        const [users] = await Promise.all([
          this.getUsers({
            show: this.serverParams.perPage,
            page: this.serverParams.page,
            sort: this.serverParams.sort,
            q: this.searchTerm,
            filterStatus: this.filterStatus,
            rangeDate: this.rangeDate,
          }),
        ])

        const data = users?.data?.data

        const meta = users?.data?.meta
        this.statusCount = meta?.pagination?.total

        this.totalRecords = meta?.pagination?.total
        this.rows = data
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
@import '@core/scss/vue/libs/vue-flatpicker.scss';

.image-container {
  position: relative;
  display: inline-block;
}

.small-image {
  width: 100px;
  display: block;
}

.large-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background-size: contain;
  background-repeat: no-repeat;
  transition: width 0.5s, height 0.5s;
}

.image-container:hover .large-image {
  width: 500px;
  height: 500px;
  z-index: 9999;
}
</style>
