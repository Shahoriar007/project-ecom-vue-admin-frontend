<template>
  <b-card>
    <validation-observer ref="profileGeneralValidation">
      <b-form v-on:submit.prevent="validationForm">
        <b-row>
          <!-- avatar -->
          <b-col cols="12">
            <b-form-group label="Avatar" label-for="avatar">
              <validation-provider
                #default="{ errors }"
                name="avatar"
                rules="size:1024|mimes:image/*"
                vid="avatar"
              >
                <b-form-file
                  id="avatar"
                  v-model="avatar"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- name -->
          <b-col cols="6">
            <b-form-group label="Name" label-for="name">
              <validation-provider
                #default="{ errors }"
                name="name"
                vid="name"
                rules="max:255"
              >
                <b-form-input
                  id="name"
                  type="text"
                  v-model="name"
                  :state="errors.length > 0 ? false : null"
                  name="name"
                  placeholder="John Doe"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- email -->
          <b-col cols="6">
            <b-form-group label="Email" label-for="email">
              <validation-provider
                #default="{ errors }"
                name="email"
                rules="email"
                vid="email"
              >
                <b-form-input
                  id="email"
                  v-model="email"
                  :state="errors.length > 0 ? false : null"
                  name="email"
                  placeholder="john@example.com"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- submit  -->
          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              type="submit"
              variant="primary"
              class="mr-1"
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
import { email, max, mimes, size } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormGroup,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,
    BFormCheckbox,
    BForm,
    BFormText,
    BButton,
    BFormDatalist,
    BFormInvalidFeedback,
    BFormValidFeedback,
    BFormFile,
    ValidationProvider,
    ValidationObserver,
    BInputGroupAppend,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      name: "",
      email: "",
      avatar: null,
    };
  },
  methods: {
    resetForm() {
      this.name = "";
      this.email = "";
      this.avatar = null;
    },
    validationForm: async function () {
      this.$refs.profileGeneralValidation.validate().then(async (success) => {
        if (success) {
          try {
            const formData = new FormData();

            formData.append("_method", "PATCH");

            if (this.avatar) {
              formData.append("avatar", this.avatar);
            }

            if (Object.keys(this.name).length != 0) {
              formData.append("name", this.name);
            }

            if (Object.keys(this.email).length != 0) {
              formData.append("email", this.email);
            }

            const res = await this.$api.post(
              "/api/user/profile/general/update",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
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
                text: "Profile general successfully updated",
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
