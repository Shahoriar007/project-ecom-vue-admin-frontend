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
      <h5 class="text-capitalize">User Phone</h5>
      <template>
        <div>
          <!-- <b-card-text>{{ userInfo?.phone }}</b-card-text> -->
        </div>
      </template>
    </b-col>

    <b-col md="3" lg="3" xs="3">
      <h5 class="text-capitalize">User Created On</h5>
      <template>
        <div>
          <b-card-text>{{ this.formatFnTableLastContactDate(userInfo?.created_at) }}</b-card-text>
        </div>
      </template>
    </b-col>

    
</b-row>
</b-card>

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
            <strong>ID : </strong>{{ props.row.format_id }}
          </span>

          <!-- Column: Status -->
          <span v-if="props.column.field === 'updated_at'">
            <b-badge variant="light-primary">
              {{ this.formatFnTableLastContactDate(props.row.updated_at) }}
            </b-badge>
          </span>

          <span v-if="props.column.field === 'previous_status'">
          {{ props.row.previous_status }}
          </span>

          <span v-if="props.column.field === 'changed_status'">
            {{ props.row.changed_status }}
          </span>

          <!-- Column: Action -->
          <!-- <span v-else-if="props.column.field === 'action'">
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
                  <b-dropdown-item v-if="$permissionAbility(ORDERS_SHOW, permissions)" v-on:click="onView(props.row.id)">
                    <feather-icon icon="Edit2Icon" class="mr-50" />
                    <span>View</span>
                  </b-dropdown-item>
                </template>

              </b-dropdown>
            </span>
          </span> -->


        </template>

        <!-- pagination -->
        <!-- <template slot="pagination-bottom" slot-scope="props">
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
        </template> -->
      </vue-good-table>
  </div>

</template>
<script>
import{
  BCard,
  BCol,
  BRow,
  BBadge,
  BDropdown,
  BDropdownItem,
  BFormSelect,
  BPagination,
} from 'bootstrap-vue'
import { data } from 'vue-echarts';

export default{
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
  },
  
data() {
  return {
    userInfo: {},
    userActivities: [],
    roleIdOption: [],
    totalRecords: 0,
    isLoading: false,
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
      columns: [
      {
          label: 'Order',
          field: 'format_id',
          sortable: false,
        },
        {
          label: 'Updated Time',
          field: 'updated_at',
          sortable: false,
        },

        {
          label: 'Previous Status',
          field: 'previous_status',
          sortable: false,
        },

        {
          label: 'Changed Status',
          field: 'changed_status',
          sortable: false,
        },
        {
          label: 'Action',
          field: 'action',
          sortable: false,
        },
      ],



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
    this.loadItems();
  },

  methods: {
    formatFnTableLastContactDate(value) {
      if (value) {
        return this.$moment(value).format('MMM Do YYYY, h:mm a')
      }
    },

    async getRoles() {
      return await this.$api.get('api/roles/priority-wise')
    },

    async getUser(userId) {
      return await this.$api.get(`api/users/${userId}`);
    },
    async getActivities(userId) {
      return await this.$api.get(`api/user/activities/${userId}`);
    },
    async loadItems() {
      console.log(this.$route.params.id);
      try {
        const [user] = await Promise.all([
          this.getUser(this.$route.params.id),
        ])

        const [activities] = await Promise.all([
          this.getActivities(this.$route.params.id),
        ])
        
        const userActivities = activities?.data?.data;
        this.rows = userActivities;
        const userData = user?.data?.data;
        this.userInfo = userData;


      } catch (error) {
        console.log("error 3");

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error',
            icon: 'BellIcon',
            variant: 'danger',
            text: "Error 3",
          },
        })
      }
    },
  }
}

</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
