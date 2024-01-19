<template>
  <b-card>
    <validation-observer ref="profilePasswordValidation">
      <b-form v-on:submit.prevent="validationForm">
        <b-row>
          <!-- old password -->
          <b-col cols="12">
            <b-form-group label="Old Password" label-for="old-password">
              <validation-provider
                #default="{ errors }"
                name="old_password"
                rules="required|min:6"
                vid="old_password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="old-password"
                    v-model="old_password"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    :type="passwordFieldTypeOld"
                    name="old_password"
                    placeholder="············"
                  />
                  <b-input-group-append is-text v-on:click="togglePasswordOld">
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIconOld"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- new password -->
          <b-col cols="6">
            <b-form-group label="New Password" label-for="password">
              <validation-provider
                #default="{ errors }"
                name="password"
                rules="required|min:6"
                vid="password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    :type="passwordFieldTypeNew"
                    name="password"
                    placeholder="············"
                  />
                  <b-input-group-append is-text v-on:click="togglePasswordNew">
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIconNew"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Confirm Password -->
          <b-col cols="6">
            <b-form-group
              label="Confirm Password"
              label-for="password_confirmation"
            >
              <validation-provider
                #default="{ errors }"
                name="password_confirmation"
                rules="required|confirmed:password"
                vid="password_confirmation"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password_confirmation"
                    v-model="password_confirmation"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    :type="passwordFieldTypeNew"
                    name="password_confirmation"
                    placeholder="············"
                  />
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- submit and reset -->
          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              type="submit"
              variant="primary"
            >
              Submit
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BFormText,
  BFormDatalist,
  BFormInvalidFeedback,
  BInputGroup,
  BInputGroupPrepend,
  BFormValidFeedback,
  BFormFile,
  BInputGroupAppend,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, min, confirmed } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    BFormText,
    BFormDatalist,
    BFormInvalidFeedback,
    BInputGroup,
    BInputGroupPrepend,
    BFormValidFeedback,
    BFormFile,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      old_password: "",
      password: "",
      password_confirmation: "",

      passwordFieldTypeOld: "password",
      passwordFieldTypeNew: "password",
      passwordFieldTypeRetype: "password",
    };
  },
  computed: {
    passwordToggleIconOld() {
      return this.passwordFieldTypeOld === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
    },
    passwordToggleIconNew() {
      return this.passwordFieldTypeNew === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
    },
    passwordToggleIconRetype() {
      return this.passwordFieldTypeRetype === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
    },
  },
  methods: {
    togglePasswordOld() {
      this.passwordFieldTypeOld =
        this.passwordFieldTypeOld === "password" ? "text" : "password";
    },
    togglePasswordNew() {
      this.passwordFieldTypeNew =
        this.passwordFieldTypeNew === "password" ? "text" : "password";
    },
    togglePasswordRetype() {
      this.passwordFieldTypeRetype =
        this.passwordFieldTypeRetype === "password" ? "text" : "password";
    },

    resetForm() {
      this.old_password = "";
      this.password = "";
      this.password_confirmation = null;

      this.$refs.profilePasswordValidation.reset();
    },
    validationForm: async function () {
      this.$refs.profilePasswordValidation.validate().then(async (success) => {
        if (success) {
          try {
            const res = await this.$api.put(
              "/api/user/profile/password/update",
              {
                old_password: this.old_password,
                password: this.password,
                password_confirmation: this.password_confirmation,
              }
            );
            // console.log("res", res);
            const data = res?.data?.data;

            await this.$store.dispatch("userModule/setUser", {
              user: data,
            });

            this.resetForm();

            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Success",
                icon: "BellIcon",
                variant: "success",
                text: "Profile password successfully updated",
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
              this.$refs.profileGeneralValidation.setErrors(
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
