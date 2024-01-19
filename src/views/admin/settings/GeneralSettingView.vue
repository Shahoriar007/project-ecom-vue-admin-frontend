<template>
  <b-card>
    <b-row>
      <b-col cols="12">
        <h4 class="mb-2">Company Info</h4>
      </b-col>
      <b-col cols="12">
        <hr class="my-2" />
      </b-col>
      <b-col cols="12">
        <h4 class="mb-2">Date and Time</h4>
      </b-col>
      <b-col cols="12">
        <validation-observer ref="weekendValidation">
          <b-form @submit.prevent="onWeekendSubmit">
            <b-row>
              <b-col md="2" class="align-self-center">
                <span class="text-nowrap">Weekends</span>
              </b-col>
              <b-col md="8" class="align-self-center">
                <validation-provider
                  #default="{ errors }"
                  name="weekends"
                  vid="weekends"
                >
                  <div v-for="(item, index) in weekends" :key="item?.id">
                    <b-form-checkbox
                      :class="index ? 'mt-1' : ''"
                      :checked="item?.value"
                      name="weekends"
                      switch
                      inline
                      @change="(e) => onWeekendChange(e, item)"
                    >
                      {{ item?.label }}
                    </b-form-checkbox>
                  </div>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-col>
              <b-col md="2" class="align-self-center">
                <b-button
                  type="submit"
                  class="float-right"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                >
                  Submit
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>
      <b-col cols="12">
        <hr class="my-2" />
      </b-col>
      <b-col cols="12">
        <validation-observer ref="checkInOutTimeValidation">
          <b-form @submit.prevent="onCheckInOutTimeSubmit">
            <b-row>
              <b-col md="2" class="align-self-center">
                <span class="text-nowrap">Check In And Out Time</span>
              </b-col>
              <b-col md="8" class="align-self-center">
                <validation-provider
                  #default="{ errors }"
                  name="check_in_out_time"
                  vid="check_in_out_time"
                >
                  <div
                    v-for="(item, index) in checkInOutTime"
                    :key="item?.id"
                    class="d-inline-block mr-1"
                  >
                    <b-form-group
                      :label="item?.label"
                      :label-for="`check-${index}`"
                    >
                      <b-form-timepicker
                        :id="`check-${index}`"
                        v-model="item.value"
                        locale="en"
                        show-seconds
                      />
                    </b-form-group>
                  </div>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-col>
              <b-col md="2" class="align-self-center">
                <b-button
                  type="submit"
                  class="float-right"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                >
                  Submit
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
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
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

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
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      weekends: [],
      checkInOutTime: [],
    };
  },
  async created() {
    try {
      const res = await this.$api.get("/api/settings");
      this.weekends = res?.data?.data?.weekends;
      this.checkInOutTime = res?.data?.data?.check_in_out_time;
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
    onWeekendChange(e, value) {
      this.weekends = this.weekends.map((item) => {
        if (item.id === value.id) {
          return {
            ...item,
            value: e,
          };
        }
        return item;
      });
    },
    async onWeekendSubmit() {
      this.$refs.weekendValidation.validate().then(async (success) => {
        if (success) {
          try {
            await this.$api.post("/api/settings", {
              weekends: this.weekends,
              check_in_out_time: this.check_in_out_time,
            });

            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Success",
                icon: "BellIcon",
                variant: "success",
                text: "Weekend successfully updated",
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
              this.$refs.weekendValidation.setErrors(
                error?.response?.data?.errors
              );
            }
          }
        }
      });
    },
    async onCheckInOutTimeSubmit() {
      this.$refs.checkInOutTimeValidation.validate().then(async (success) => {
        if (success) {
          try {
            await this.$api.post("/api/settings", {
              check_in_out_time: this.checkInOutTime,
            });

            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Success",
                icon: "BellIcon",
                variant: "success",
                text: "Check in out successfully updated",
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
              this.$refs.checkInOutTimeValidation.setErrors(
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

<style></style>
