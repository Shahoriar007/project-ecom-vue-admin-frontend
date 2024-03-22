<template>
  <b-card>
    <b-row>
      <b-col cols="12">
        <h4 class="mb-2">Delivery Charge</h4>
      </b-col>

      <b-col cols="12">
        <hr class="my-2" />
      </b-col>
      <b-col cols="12">
          <div >
            <b-row>
              <b-col md="2" class="align-self-center">
                <span class="text-nowrap">Inside & Outside Dhaka</span>
              </b-col>
              <b-col md="2" class="align-self-center">
                <!-- name -->

                <validation-provider
                  #default="{ errors }"
                  name="Inside Dhaka"
                  vid="inside_dhaka"
                  rules="required"
                > 
                  <b-form-input
                    id="inside_dhaka"
                    type="number"
                    v-model="chargeInsideDhaka"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Inside Dhaka"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-col>

              <b-col md="2" class="align-self-center">
                <!-- name -->

                <validation-provider
                  #default="{ errors }"
                  name="Outside Dhaka"
                  vid="outside_dhaka"
                  rules="required"
                >
                  <b-form-input
                    id="outside_dhaka"
                    type="number"
                    v-model="chargeOutsideDhaka"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Outside Dhaka"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-col>
              <b-col md="4" class="align-self-center">
                <!-- loading button -->
                <template v-if="isDeliveryChargeSubmitting">
                  <b-button class="float-right" variant="primary" disabled>
                    <b-spinner small />
                    Loading...
                  </b-button>
                </template>

                <!-- submit button -->
                <template v-else>
                  <b-button
                    type="submit"
                    class="float-right"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    @click="submitDeliveryCharge"
                  >
                    Submit
                  </b-button>
                </template>
              </b-col>
            </b-row>
          </div>
      </b-col>

      <b-col cols="12">
        <hr class="my-2" />
      </b-col>

    </b-row>
  </b-card>
</template>

<script>
import {
  BCard,
  BBadge,
  BForm,
  BFormCheckbox,
  BCol,
  BRow,
  BButton,
  BFormTimepicker,
  BFormGroup,
  BSpinner,
  BFormInput,
  BCardText,
  BFormTextarea,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, integer } from "@validations";

export default {
  name: "GeneralSettingView",
  components: {
    BForm,
    BCard,
    BBadge,
    BFormCheckbox,
    BCol,
    BRow,
    BButton,
    ValidationProvider,
    ValidationObserver,
    BFormTimepicker,
    BFormGroup,
    BSpinner,
    BFormInput,
    BCardText,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },

  data() {
    return {

      chargeInsideDhaka: '',
      chargeOutsideDhaka: '',
      isDeliveryChargeSubmitting: false,


    };
  },

  async created() {
    try {
      this.loadItems();
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

    async submitDeliveryCharge() {
      this.isDeliveryChargeSubmitting = true;

      try {
        const response = await this.$api.post('api/delivery-charge', {
          inside_dhaka: this.chargeInsideDhaka,
          outside_dhaka: this.chargeOutsideDhaka,
        });

        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "CheckIcon",
            variant: "success",
            text: response.data.message,
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
      } finally {
        this.isDeliveryChargeSubmitting = false;
        this.loadItems();
      }
    },

    async getMasterSetting() {
      return await this.$api.get('api/delivery-charge')
    },

    async loadItems() {
      try {
        const response = await this.getMasterSetting()

        const data = response.data.data[0];
        this.chargeInsideDhaka = data.inside_dhaka
        this.chargeOutsideDhaka = data.outside_dhaka
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
  },
};
</script>
