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
          <template v-if="$permissionAbility(PRODUCTS_CREATE, permissions)">
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
        mode="remote"
        style-class="vgt-table table-custom-style bordered condensed"
        :line-numbers="true"
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
            <b-avatar
              :src="props?.row?.product_image_urls[0]?.original_url"
              class="mr-1"
            />
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
                <template v-if="$permissionAbility(PRODUCTS_EDIT, permissions)">
                  <b-dropdown-item v-on:click="onShow(props.row)">
                    <feather-icon icon="Edit2Icon" class="mr-50" />
                    <span>Show/ Edit Details</span>
                  </b-dropdown-item>
                </template>

                <template
                  v-if="$permissionAbility(PRODUCTS_DELETE, permissions)"
                >
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
      id="modal-product-form"
      centered
      :title="modalType == 'editModal' ? 'Edit Product' : 'Add Product'"
      hide-footer
      @hidden="hiddenModal"
      no-close-on-backdrop
      size="lg"
    >
      <validation-observer ref="validationRef">
        <b-form v-on:submit.prevent="validationForm">
          <b-row>
            <b-col
              cols="12"
              v-if="modalType == 'editModal' && previewImageArray.length > 0"
              class="mb-1"
            >
              <h5>Uploaded Images</h5>
              <div
                class="d-flex justify-content-center"
                style="overflow-x: auto"
              >
                <div
                  v-for="(image, index) in previewImageArray"
                  :key="index"
                  class="image-container"
                >
                  <img :src="image.preview" alt="Preview" class="mr-1" />
                </div>
              </div>
            </b-col>
            <b-col cols="12">
              <h5>New Images</h5>
              <div
                v-if="imageArray.length > 0"
                class="d-flex justify-content-center"
                style="overflow-x: auto"
              >
                <div
                  v-for="(image, index) in imageArray"
                  :key="index"
                  class="image-container"
                >
                  <img :src="image.preview" alt="Preview" class="mr-1" />
                </div>
              </div>
              <div
                v-else
                class="d-flex align-items-center justify-content-center"
              >
                <img :src="previewImage" alt="Preview" />
              </div>
            </b-col>
            <b-col md="12" lg="12" xs="12">
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

            <b-col md="6" lg="6" xs="12">
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
                    placeholder="Product Name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6" lg="6" xs="12">
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
            <b-col md="12" lg="12" xs="12">
              <b-form-group label="Description" label-for="description">
                <ValidationProvider
                  name="description"
                  v-slot="{ errors }"
                  vid="description"
                >
                  <!-- <b-form-textarea
                    id="remarks"
                    type="text"
                    v-model="description"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Product Description"
                  /> -->

                  <quill-editor
                    v-model="description"
                    :options="editorOption"
                    :style="{
                      height: '13rem !important',
                      paddingBottom: '5rem !important',
                    }"
                  >
                    <div id="toolbar" slot="toolbar">
                      <span class="ql-formats">
                        <button class="ql-bold">Bold</button>
                        <button class="ql-italic">Italic</button>
                        <button class="ql-underline">Underline</button>
                        <button class="ql-strike">Strike</button>
                        <button class="ql-blockquote"></button>
                        <button class="ql-list" value="ordered"></button>
                        <button class="ql-list" value="bullet"></button>
                        <button class="ql-script" value="sub"></button>
                        <button class="ql-script" value="super"></button>
                        <button class="ql-indent" value="-1"></button>
                        <button class="ql-indent" value="+1"></button>
                        <button class="ql-direction" value="rtl"></button>
                        <button class="ql-align" value=""></button>
                        <button class="ql-align" value="center"></button>
                        <button class="ql-align" value="right"></button>
                        <button class="ql-align" value="justify"></button>
                        <select class="ql-color"></select>
                        <select class="ql-background"></select>
                        <select class="ql-size">
                          <option value="small" />

                          <option selected />
                          <option value="large" />
                          <option value="huge" />
                        </select>

                        <select class="ql-font"></select>
                        <select class="ql-header">
                          <option value="1">Heading 1</option>
                          <option value="2">Heading 2</option>
                          <option value="3">Heading 3</option>
                          <option value="4">Heading 4</option>
                          <option value="5">Heading 5</option>
                          <option value="6">Heading 6</option>
                          <option selected>Normal</option>
                        </select>

                        <button class="ql-link"></button>
                      </span>
                    </div>
                  </quill-editor>
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col md="12" lg="12" xs="12">
              <b-form-group label="Offer Notice" label-for="offer_notice">
                <ValidationProvider
                  name="offer_notice"
                  v-slot="{ errors }"
                  vid="offer_notice"
                >
                  <!-- <b-form-textarea
                    id="offer_notice"
                    type="text"
                    v-model="offerNotice"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Product Offer Notice"
                  /> -->

                  <!-- Second Quill Editor -->
                  <quill-editor
                    v-model="offerNotice"
                    :options="editorOption2"
                    :style="{
                      height: '13rem !important',
                      paddingBottom: '5rem !important',
                    }"
                  >
                    <div id="toolbar2" slot="toolbar">
                      <span class="ql-formats">
                        <button class="ql-bold">Bold</button>
                        <button class="ql-italic">Italic</button>
                        <button class="ql-underline">Underline</button>
                        <button class="ql-strike">Strike</button>
                        <button class="ql-blockquote"></button>
                        <button class="ql-list" value="ordered"></button>
                        <button class="ql-list" value="bullet"></button>
                        <button class="ql-script" value="sub"></button>
                        <button class="ql-script" value="super"></button>
                        <button class="ql-indent" value="-1"></button>
                        <button class="ql-indent" value="+1"></button>
                        <button class="ql-direction" value="rtl"></button>
                        <button class="ql-align" value=""></button>
                        <button class="ql-align" value="center"></button>
                        <button class="ql-align" value="right"></button>
                        <button class="ql-align" value="justify"></button>
                        <select class="ql-color"></select>
                        <select class="ql-background"></select>
                        <select class="ql-size">
                          <option value="small" />

                          <option selected />
                          <option value="large" />
                          <option value="huge" />
                        </select>

                        <select class="ql-font"></select>
                        <select class="ql-header">
                          <option value="1">Heading 1</option>
                          <option value="2">Heading 2</option>
                          <option value="3">Heading 3</option>
                          <option value="4">Heading 4</option>
                          <option value="5">Heading 5</option>
                          <option value="6">Heading 6</option>
                          <option selected>Normal</option>
                        </select>

                        <button class="ql-link"></button>
                      </span>
                    </div>
                  </quill-editor>
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

            <b-col md="4" lg="4" xs="12">
              <b-form-group label="Category " label-for="category_id">
                <ValidationProvider
                  name="category_id"
                  v-slot="{ errors }"
                  vid="category_id"
                >
                  <v-select
                    id="category_id"
                    v-model="categoryId"
                    :options="categoryOptions"
                    :reduce="(option) => option.id"
                    label="name"
                    placeholder="Select Product Category"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col md="4" lg="4" xs="12">
              <b-form-group label="SKU Code " label-for="sku_code">
                <ValidationProvider
                  name="sku_code"
                  v-slot="{ errors }"
                  vid="sku_code"
                >
                  <b-form-input
                    id="sku_code"
                    type="text"
                    v-model="skuCode"
                    :state="errors.length > 0 ? false : null"
                    name="sku_code"
                    placeholder="Product SKU Code"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col md="4" lg="4" xs="12">
              <b-form-group label="Quantity " label-for="quantity">
                <ValidationProvider
                  name="quantity"
                  v-slot="{ errors }"
                  vid="quantity"
                >
                  <b-form-input
                    id="quantity"
                    type="number"
                    v-model="quantity"
                    :state="errors.length > 0 ? false : null"
                    name="quantity"
                    placeholder="Product Quantity"
                    @wheel.prevent
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

            <b-col md="4" lg="4" xs="12">
              <b-form-group label="Regular Price " label-for="regular_price">
                <ValidationProvider
                  name="regularPrice"
                  v-slot="{ errors }"
                  vid="regularPrice"
                >
                  <b-form-input
                    id="regularPrice"
                    type="number"
                    v-model="regularPrice"
                    :state="errors.length > 0 ? false : null"
                    name="regularPrice"
                    placeholder="Product Regular Price"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

            <b-col md="4" lg="4" xs="12">
              <b-form-group label="Sale Price " label-for="sale_price">
                <ValidationProvider
                  name="sale_price"
                  v-slot="{ errors }"
                  vid="sale_price"
                >
                  <b-form-input
                    id="sale_price"
                    type="number"
                    v-model="salePrice"
                    :state="errors.length > 0 ? false : null"
                    name="sale_price"
                    placeholder="Product Sale Price"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

            <b-col md="4" lg="4" xs="12">
              <b-form-group label="Label" label-for="labels">
                <ValidationProvider
                  name="labels"
                  v-slot="{ errors }"
                  vid="labels"
                >
                  <v-select
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    id="labels"
                    class="custom-font"
                    placeholder="Add Label"
                    v-model="selectLabels"
                    label="name"
                    multiple
                    taggable
                    push-tags
                  >
                  </v-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

            <b-col md="3" lg="3" xs="12">
              <b-form-group label="Flash Sale" label-for="is_flash_sale">
                <ValidationProvider
                  name="is_flash_sale"
                  v-slot="{ errors }"
                  vid="is_flash_sale"
                >
                  <v-select
                    id="is_flash_sale"
                    v-model="isFlashSale"
                    :options="statusValueOption"
                    :reduce="(option) => option.value"
                    label="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col md="3" lg="3" xs="12">
              <b-form-group label="New Arrival" label-for="is_new_arrival">
                <ValidationProvider
                  name="is_new_arrival"
                  v-slot="{ errors }"
                  vid="is_new_arrival"
                >
                  <v-select
                    id="is_new_arrival"
                    v-model="isNewArrival"
                    :options="statusValueOption"
                    :reduce="(option) => option.value"
                    label="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col md="3" lg="3" xs="12">
              <b-form-group label="Hot Deal" label-for="is_hot_deal">
                <ValidationProvider
                  name="is_hot_deal"
                  v-slot="{ errors }"
                  vid="is_hot_deal"
                >
                  <v-select
                    id="is_hot_deal"
                    v-model="isHotDeal"
                    :options="statusValueOption"
                    :reduce="(option) => option.value"
                    label="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col md="3" lg="3" xs="12">
              <b-form-group label="For You" label-for="is_for_you">
                <ValidationProvider
                  name="is_for_you"
                  v-slot="{ errors }"
                  vid="is_for_you"
                >
                  <v-select
                    id="is_for_you"
                    v-model="isForYou"
                    :options="statusValueOption"
                    :reduce="(option) => option.value"
                    label="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>
            </b-col>

            <!-- submit and reset -->
            <b-col md="12" lg="12" xs="12">
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
  PRODUCTS_CREATE,
  PRODUCTS_DELETE,
  PRODUCTS_EDIT,
  PRODUCTS_SHOW,
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
import { quillEditor } from 'vue-quill-editor'
import Ripple from 'vue-ripple-directive'
import { mapGetters } from 'vuex'
export default {
  name: 'ProductView',
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
    quillEditor,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: '#toolbar',
        },
      },
      editorOption2: {
        modules: {
          toolbar: '#toolbar2',
        },
      },
      PRODUCTS_SHOW,
      PRODUCTS_CREATE,
      PRODUCTS_EDIT,
      PRODUCTS_DELETE,
      imageArray: [],
      previewImageArray: [],
      modalType: '',
      previewImage: 'https://placehold.co/200x200?text=Upload+Image',
      id: '',
      name: '',
      description: '',
      offerNotice: '',
      image: null,
      status: true,
      selectLabels: [],
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
      categoryOptions: [],
      categoryId: '',
      skuCode: '',
      quantity: '',

      regularPrice: '',
      salePrice: '',
      isFlashSale: true,
      isNewArrival: true,
      isHotDeal: true,
      isForYou: true,

      pageLength: 10,
      columns: [
        {
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Description',
          field: 'description',
          sortable: false,
        },
        {
          label: 'Price',
          field: 'price_format',
          sortable: false,
        },
        {
          label: 'Quantity',
          field: 'quantity',
          sortable: false,
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

  async created() {
    const categories = await this.getActiveCategories()

    this.categoryOptions = (categories?.data?.data || []).map((item) => {
      let name = item.name

      return {
        name,
        id: item.id,
      }
    })
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
      if (this.imageArray.length > 0) {
        this.imageArray.pop()
      } else {
        this.previewImage = 'https://placehold.co/200x200?text=Upload+Image'
      }
    },
    loadImage(event) {
      const fileInput = event.target

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.imageArray.push({
            file: fileInput.files[0],
            preview: e.target.result,
          })
        }

        reader.readAsDataURL(fileInput.files[0])
      }
    },

    async getActiveCategories() {
      return await this.$api.get('api/categories/active-all')
    },
    showModal() {
      this.$bvModal.show('modal-product-form')
    },
    hiddenModal() {
      this.modalType = ''
      this.$bvModal.hide('modal-product-form')
      this.resetModal()
    },
    resetModal() {
      this.id = ''
      this.name = ''
      this.description = ''
      this.offerNotice = ''
      this.imageArray = []
      this.previewImage = 'https://placehold.co/200x200?text=Upload+Image'
      this.status = true
      this.categoryId = ''
      this.skuCode = ''
      this.quantity = ''

      this.regularPrice = ''
      this.salePrice = ''
      this.isFlashSale = true
      this.isNewArrival = true
      this.isHotDeal = true
      this.isForYou = true
    },
    async onShow(value) {
      this.modalType = 'editModal'
      this.id = value?.id
      this.name = value?.name
      this.description = value?.description
      this.offerNotice = value?.offer_notice
      this.previewImageArray = (value?.product_image_urls || []).map((item) => {
        return {
          preview: item?.original_url,
        }
      })
      this.status = value?.status ? true : false
      this.categoryId = value?.category_id
      this.skuCode = value?.sku_code
      this.quantity = value?.quantity

      this.regularPrice = value?.regular_price
      this.salePrice = value?.sale_price
      this.isFlashSale = value?.is_flash_sale ? true : false
      this.isNewArrival = value?.is_new_arrival ? true : false
      this.isHotDeal = value?.is_hot_deal ? true : false
      this.isForYou = value?.is_for_you ? true : false

      this.showModal()
    },
    async onDelete(id) {
      try {
        await this.$api.delete(`/api/products/${id}`)

        this.loadItems()

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Success',
            icon: 'BellIcon',
            variant: 'success',
            text: 'Product Successfully Deleted',
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
    async getProducts(params) {
      return await this.$api.get('api/products', {
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
        const [products] = await Promise.all([
          this.getProducts({
            show: this.serverParams.perPage,
            page: this.serverParams.page,
            sort: this.serverParams.sort,
            q: this.searchTerm,
          }),
        ])

        const data = products?.data?.data
        const meta = products?.data?.meta

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
            if (this.offerNotice) {
              formData.append('offer_notice', this.offerNotice)
            }
            if (this.status) {
              formData.append('status', 1)
            } else {
              formData.append('status', 0)
            }
            if (this.categoryId) {
              formData.append('category_id', this.categoryId)
            }
            if (this.skuCode) {
              formData.append('sku_code', this.skuCode)
            }
            formData.append('quantity', this.quantity)

            if (this.regularPrice) {
              formData.append('regular_price', this.regularPrice)
            }
            if (this.salePrice) {
              formData.append('sale_price', this.salePrice)
            }

            if (this.selectLabels) {
              this.selectLabels.forEach(function (element) {
                formData.append('labels[]', element)
              })
            }

            if (this.isFlashSale) {
              formData.append('is_flash_sale', 1)
            } else {
              formData.append('is_flash_sale', 0)
            }
            if (this.isNewArrival) {
              formData.append('is_new_arrival', 1)
            } else {
              formData.append('is_new_arrival', 0)
            }
            if (this.isHotDeal) {
              formData.append('is_hot_deal', 1)
            } else {
              formData.append('is_hot_deal', 0)
            }
            if (this.isForYou) {
              formData.append('is_for_you', 1)
            } else {
              formData.append('is_for_you', 0)
            }
            this.imageArray.forEach((image) => {
              formData.append(`images[]`, image.file)
            })
            if (this.modalType == 'editModal') {
              formData.append('_method', 'PUT')
              await this.$api.post(`/api/products/${this.id}`, formData, {
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
                  text: 'Product Successfully Updated',
                },
              })
            } else {
              await this.$api.post('/api/products', formData, {
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
                  text: 'Product Successfully Created',
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
@import '@core/scss/vue/libs/quill.scss';
#preview {
  max-width: 100%;
  max-height: 300px;
}
.image-container {
  max-width: 100%; /* Ensures images don't exceed the width of their container */
  max-height: 100%; /* Optional: Limits the height if needed */
}
.table-custom-style {
  font-size: 13px !important;
  white-space: nowrap !important;
  min-height: 140px !important;
  tr,
  th,
  td {
    vertical-align: middle !important;
    text-align: center !important;
  }
}

.custom-font {
  font-size: 13px !important;
}
</style>
