<template>
  <div>
    <b-card>
      <b-row>
        <b-col md="3" lg="3" xs="3">
          <h5 class="text-capitalize">User Name</h5>
          <template>
            <div>
              <b-card-text>{{ userInfo?.name }}</b-card-text>
            </div>
          </template>
        </b-col>

        <b-col md="3" lg="3" xs="3">
          <h5 class="text-capitalize">User Email</h5>
          <template>
            <div>
              <b-card-text>{{ userInfo?.email }}</b-card-text>
            </div>
          </template>
        </b-col>

        <b-col md="3" lg="3" xs="3">
          <h5 class="text-capitalize">User Roles</h5>
          <template>
            <div>
              <b-card-text>{{ userInfo?.roles?.data[0]?.name }}</b-card-text>
            </div>
          </template>
        </b-col>

        <b-col md="3" lg="3" xs="3">
          <h5 class="text-capitalize">User Created On</h5>
          <template>
            <div>
              <b-card-text>{{
                this.formatFnTableLastContactDate(userInfo?.created_at)
              }}</b-card-text>
            </div>
          </template>
        </b-col>
      </b-row>
    </b-card>

    <b-card>

      <b-row>
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
        <b-col md="1">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1"
            @click="clearFilter"
          >
            Clear
          </b-button>
        </b-col>  
      </b-row>

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

      <!-- Column: Status -->
    <span v-if="props.column.field === 'format_order'">
      {{ props.row.order?.large_order_id }}
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
import {
  BCard,
  BCol,
  BRow,
  BBadge,
  BDropdown,
  BDropdownItem,
  BFormSelect,
  BPagination,
  BCardText,
  BButton,
  BFormGroup,


} from 'bootstrap-vue'
import { data } from 'vue-echarts'
import { VueGoodTable } from 'vue-good-table'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'



export default {
  name: 'UserActivityView',
  components: {
    BCard,
    BCol,
    BRow,
    BBadge,
    BDropdown,
    BDropdownItem,
    BFormSelect,
    BPagination,
    BCardText,
    VueGoodTable,
    flatPickr,
    BButton,
    BFormGroup,


  },

  directives: {
    Ripple,
  },

  data() {
    return {
      userInfo: {},
      userActivities: [],
      roleIdOption: [],
      totalRecords: 0,
      isLoading: false,
      rangeDate: null,

      
      columns: [
        {
          label: 'Order',
          field: 'format_order',
          sortable: false,
        },
        {
          label: 'Updated Time',
          field: 'created_at',
          sortable: false,
          formatFn: this.formatFnTableLastContactDate,
        },

        {
          label: 'Previous Status',
          field: 'previous_order_status',
          sortable: false,
          formatFn: this.formatFnTableStatus,

        },

        {
          label: 'Changed Status',
          field: 'current_order_status',
          sortable: false,
          formatFn: this.formatFnTableStatus,

        },
        
      ],
      rows: [],
      pageLength: 10,
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
    this.loadItems()
  },

  watch: {
    rangeDate: function (newVal, oldVal) {
      this.loadItems()
    },
  },

  methods: {
    clearFilter() {
      this.rangeDate = null
      this.loadItems()
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

    formatFnTableLastContactDate(value) {
      if (value) {
        return this.$moment(value).format('MMM Do YYYY, h:mm a')
      }
    },

    formatFnTableStatus(value){
      if (value == 'pending') {
        return 'Pending';
      }else if(value == 'pending-1'){
        return 'Pending 1';
      }else if(value == 'pending-2'){
        return 'Pending 2';
      }else if(value == 'processing'){
        return 'Processing';
      }else if(value == 'packing'){
        return 'Packing';
      }else if(value == 'shipping'){
        return 'Shipping';
      }else if(value == 'on_the_way'){
        return 'On the way';
      }else if(value == 'in_review'){
        return 'In Review';
      }else if(value == 'rejected'){
        return 'Rejected';
      }else if(value == 'returned'){
        return 'Returned';
      }else if(value == 'canceled'){
        return 'Canceled';
      }else{
        return 'Delivered';
      }
    },

    async getRoles() {
      return await this.$api.get('api/roles/priority-wise')
    },

    async getUser(userId, params) {
      return await this.$api.get(`api/users/${userId}?include=roles`)
    },
    async getActivities(params) {
      const userId = this.$route.params.id;
      return await this.$api.get(`api/user/${userId}/activities`,{
        params:{
          rangeDate: params.rangeDate
        }
      })
    },
    async loadItems() {
      try {
        const [user] = await Promise.all([this.getUser(this.$route.params.id)])

        const [activities] = await Promise.all([
          this.getActivities({
            rangeDate: this.rangeDate,
          }),
        ])

        const userActivities = activities?.data?.data
        this.rows = userActivities

        console.log(this.rows);

        const userData = user?.data?.data
        this.userInfo = userData

        console.log(this.userInfo)
      } catch (error) {
        console.log(error)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error',
            icon: 'BellIcon',
            variant: 'danger',
            text: 'Error 5',
          },
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';

</style>
