<template>
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
            <h5 class="text-capitalize">Pending 1</h5>
            <template>
              <div>
                <b-card-text>{{ totalPending1Count }}</b-card-text>
              </div>
            </template>
          </b-col>

        <b-col md="2" lg="2" xs="2">
            <h5 class="text-capitalize">Pending 2</h5>
            <template>
              <div>
                <b-card-text>{{ totalPending2Count }}</b-card-text>
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
            <h5 class="text-capitalize">Packing</h5>
            <template>
              <div>
                <b-card-text>{{ totalPackagingCount }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="2" lg="2" xs="2">
            <h5 class="text-capitalize">Shipping</h5>
            <template>
              <div>
                <b-card-text>{{ totalShippingCount }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="2" lg="2" xs="2">
            <h5 class="text-capitalize">On The Way</h5>
            <template>
              <div>
                <b-card-text>{{ totalOnTheWayCount }}</b-card-text>
              </div>
            </template>
          </b-col>

          <b-col md="2" lg="2" xs="2">
            <h5 class="text-capitalize">In Review</h5>
            <template>
              <div>
                <b-card-text>{{ totalInReviewCount }}</b-card-text>
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
  props: {
    customerId: Number,
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
      totalPending1Count: '',
      totalPending2Count: '',
      totalProcessingCount: '',
      totalPackagingCount: '',
      totalShippingCount: '',
      totalOnTheWayCount: '',
      totalInReviewCount: '',
      totalCancelCount: '',
      totalReturnedCount: '',
      totalDeliveredCount: '',

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

      this.loadItems();

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
    async getRoles() {
      return await this.$api.get('api/roles/priority-wise')
    },

    async getTotalOrderAmount(id) {
      return await this.$api.get(`api/customer/${id}/total-order-amount`)
    },

    async loadItems() {
      try {

        
        const totalPurchaseAmount = await this.getTotalOrderAmount(this.customerId);

        this.totalPurchaseAmount = totalPurchaseAmount.data.totalOrderAmount;
        this.totalPendingCount = totalPurchaseAmount.data.totalPendingCount;
        this.totalPending1Count = totalPurchaseAmount.data.totalPending1Count;
        this.totalPending2Count = totalPurchaseAmount.data.totalPending2Count;
        this.totalProcessingCount = totalPurchaseAmount.data.totalProcessingCount;
        this.totalPackagingCount = totalPurchaseAmount.data.totalPackagingCount;
        this.totalShippingCount = totalPurchaseAmount.data.totalShippingCount;
        this.totalOnTheWayCount = totalPurchaseAmount.data.totalOnTheWayCount;
        this.totalInReviewCount = totalPurchaseAmount.data.totalInReviewCount;
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
            text: "Data loading error",
          },
        })
      }
    },


  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
