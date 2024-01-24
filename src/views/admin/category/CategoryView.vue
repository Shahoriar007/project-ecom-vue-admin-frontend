<template>
  <b-card>
    <div>
      <!-- search input -->
      <div class="custom-search d-flex align-items-center justify-content-end">
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
          <template v-if="$permissionAbility(USERS_CREATE, permissions)">
            <b-button
              class="flex-shrink-0"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              v-on:click="showModal"
            >
              Add
            </b-button>
          </template>
        </div>
      </div>

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
            <b-avatar :src="props?.row?.category_image_url" class="mr-1" />
          </span>

          <!-- Column: Status -->
          <span v-if="props.column.field === 'status'">
            <b-badge :variant="formatStatus(props.row.status)">
              {{ props.row.status ? 'Active' : 'Inactive' }}
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
                <template v-if="$permissionAbility(USERS_EDIT, permissions)">
                  <b-dropdown-item v-on:click="onShow(props.row)">
                    <feather-icon icon="Edit2Icon" class="mr-50" />
                    <span>Edit</span>
                  </b-dropdown-item>
                </template>

                <template v-if="$permissionAbility(USERS_DELETE, permissions)">
                  <b-dropdown-item v-on:click="onDelete(props.row.id)">
                    <feather-icon icon="TrashIcon" class="mr-50" />
                    <span>Delete</span>
                  </b-dropdown-item>
                </template>
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
      id="modal-category-form"
      centered
      :title="modalType == 'editModal' ? 'Edit Category' : 'Add Category'"
      hide-footer
      @hidden="hiddenModal"
      no-close-on-backdrop
    >
      <validation-observer ref="validationRef">
        <b-form v-on:submit.prevent="validationForm">
          <b-row>
            <b-col
              cols="12"
              class="d-flex align-items-center justify-content-center"
            >
              <img :src="previewImage" alt="Uploaded Image" id="preview" />
            </b-col>
            <b-col cols="12">
              <b-form-group label="Image" label-for="image">
                <validation-provider
                  #default="{ errors }"
                  name="image"
                  vid="image"
                >
                  <div class="d-flex">
                    <b-form-file
                      id="image"
                      v-model="image"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Choose an image or drop it here..."
                      drop-placeholder="Drop image here... "
                      @change="loadImage"
                      accept="image/*"
                      class="mr-1"
                    />
                    <b-button
                      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                      variant="danger"
                      class="mr-1"
                      @click="removeImage"
                    >
                      Remove
                    </b-button>
                  </div>

                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group label="Name" label-for="name">
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  vid="name"
                >
                  <b-form-input
                    id="name"
                    type="text"
                    v-model="name"
                    :state="errors.length > 0 ? false : null"
                    name="name"
                    placeholder="Category Name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group label="Description" label-for="description">
                <ValidationProvider
                  name="description"
                  v-slot="{ errors }"
                  vid="description"
                >
                  <b-form-textarea
                    id="remarks"
                    type="text"
                    v-model="description"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Category Description"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group label="Status" label-for="status">
                <ValidationProvider
                  name="status"
                  v-slot="{ errors }"
                  vid="status"
                >
                  <v-select
                    id="status"
                    v-model="status"
                    :options="statusValueOption"
                    :reduce="(option) => option.value"
                    label="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
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
    </b-modal>
  </b-card>
</template>

<script>
import {
  USERS_ACCESS,
  USERS_CREATE,
  USERS_DELETE,
  USERS_EDIT,
  USERS_SHOW,
} from '@/helpers/permissionsConstant'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  BAvatar,
  BBadge,
  BButton,
  BCard,
  BCol,
  BDropdown,
  BDropdownItem,
  BForm,
  BFormFile,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormTextarea,
  BInputGroup,
  BInputGroupAppend,
  BModal,
  BPagination,
  BRow,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import { mapGetters } from 'vuex'
export default {
  name: 'CategoryView',
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
    BFormFile,
    BFormTextarea,
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
      modalType: '',
      previewImage: 'https://placehold.co/200x200?text=Upload+Image',
      id: '',
      name: '',
      description: '',
      image: null,
      status: true,
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
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Description',
          field: 'description',
        },

        {
          label: 'Status',
          field: 'status',
          sortable: false,
        },
        {
          label: 'Created On',
          field: 'created_at',
          formatFn: this.formatFnTableLastContactDate,
          sortable: true,
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
  },

  methods: {
    formatStatus(status) {
      if (status) {
        return 'light-success'
      }
      return 'light-danger'
    },
    formatFnTableLastContactDate(value) {
      if (value) {
        return this.$moment(value).format('MMM Do YYYY, h:mm a')
      }
    },
    removeImage() {
      this.previewImage = 'https://placehold.co/200x200?text=Upload+Image'
      this.image = null
    },
    loadImage(event) {
      const fileInput = event.target

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.previewImage = e.target.result
        }

        reader.readAsDataURL(fileInput.files[0])
      }
    },
    showModal() {
      this.$bvModal.show('modal-category-form')
    },
    hiddenModal() {
      this.modalType = ''
      this.$bvModal.hide('modal-category-form')
      this.resetModal()
    },
    resetModal() {
      this.id = ''
      this.name = ''
      this.description = ''
      this.previewImage = 'https://placehold.co/200x200?text=Upload+Image'
      this.image = null
      this.status = true
    },
    async onShow(value) {
      this.modalType = 'editModal'
      this.id = value?.id
      this.name = value?.name
      this.description = value?.description
      this.previewImage = value?.category_image_url
      this.status = true

      this.showModal()
    },
    async onDelete(id) {
      try {
        await this.$api.delete(`/api/categories/${id}`)

        this.loadItems()

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Success',
            icon: 'BellIcon',
            variant: 'success',
            text: 'Category Successfully Deleted',
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
      return await this.$api.get('api/categories', {
        params: {
          show: params.show,
          page: params.page,
          sort: params.sort,
          q: params.q,
        },
      })
    },

    async loadItems() {
      try {
        const [categories] = await Promise.all([
          this.getUsers({
            show: this.serverParams.perPage,
            page: this.serverParams.page,
            sort: this.serverParams.sort,
            q: this.searchTerm,
          }),
        ])

        const data = categories?.data?.data
        const meta = categories?.data?.meta

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
      this.$refs.validationRef.validate().then(async (success) => {
        if (success) {
          try {
            const formData = new FormData()

            if (this.name) {
              formData.append('name', this.name)
            }
            if (this.description) {
              formData.append('description', this.description)
            }
            if (this.status) {
              formData.append('status', 1)
            } else {
              formData.append('status', 0)
            }

            if (this.image) {
              formData.append('image', this.image)
            }

            if (this.modalType == 'editModal') {
              if (
                this.previewImage ==
                'https://placehold.co/200x200?text=Upload+Image'
              ) {
                formData.append('image_exists', 0)
              } else {
                formData.append('image_exists', 1)
              }
              formData.append('_method', 'PUT')
              await this.$api.post(`/api/categories/${this.id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })

              this.loadItems()
              this.hiddenModal()
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'BellIcon',
                  variant: 'success',
                  text: 'Category Successfully Updated',
                },
              })
            } else {
              await this.$api.post('/api/categories', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })

              this.hiddenModal()

              this.loadItems()

              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'BellIcon',
                  variant: 'success',
                  text: 'Category Successfully Created',
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
              this.$refs.validationRef.setErrors(error?.response?.data?.errors)
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
#preview {
  max-width: 100%;
  max-height: 300px;
}
</style>
