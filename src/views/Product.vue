<template>
  <div class="main-page page_product">
    <div class="page-body">
      <div class="mb-4">
        <h2 v-if="selectedType === 'A'">{{ t("product") }}</h2>
        <h2 v-else-if="selectedType === 'B'">{{ t("service") }}</h2>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <div class="mb-3 btn-group btn-group-size custome-tab">
          <Button
            :customClass="
              'btn btn-primary' + (selectedType === 'A' ? ' active' : '')
            "
            @click="setProductType('A')"
          >
            {{ t("product") }}
          </Button>
          <Button
            :customClass="
              'btn btn-primary' + (selectedType === 'B' ? ' active' : '')
            "
            @click="setProductType('B')"
          >
            {{ t("service") }}
          </Button>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4 col-sm-4 col-md-2 col-lg-2">
          <Dropdown
            v-if="selectedType === 'A'"
            v-model="dropDownStatus"
            :options="statusOptions"
            :placeholder="t('filter')"
            class="size-font-sm"
          />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <div class="col-6 col-sm-6 col-md-9 col-lg-9 text-end">
          <a
            v-if="selectedType === 'A'"
            class="btn btn-success me-3 size-font-sm me-2"
            @click="openPopup"
            >{{ t("addProduct") }}</a
          >
          <a
            v-else-if="selectedType === 'B'"
            class="btn btn-success me-3 size-font-sm me-2"
            @click="openPopup"
            >{{ t("addService") }}</a
          >
          <a
            class="btn btn-outline-secondary mdi mdi-export-variant size-font-sm"
            @click="exportProduct"
          ></a>
        </div>
      </div>

      <div class="product-show-only-desktop">
        <productList
          :tableHeaders="tableHeaders"
          :initialTableData="filteredProducts"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          v-if="currentTableData"
          :isLoading="isLoading"
          :documentName="selectedType === 'A' ? documentName : documentName2"
          :showAllowButton="true"
        />
      </div>
      <div
        v-if="isLoading"
        class="d-flex justify-content-center align-items-center"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
  <div>
  <Popup :isOpen="isPopupOpen" :closePopup="closePopup" :formData="formData">
  <div class="mb-3" style="margin-left: -10px; margin-top: -25px">
    <h2 v-if="isAddingMode && selectedType === 'A'">{{ t("headerPopupAddProduct") }}</h2>
    <h2 v-if="isAddingMode && selectedType === 'B'">{{ t("headerPopupAddService") }}</h2>
    <h2 v-if="isEditMode && selectedType === 'A'">{{ t("headerPopupEditProduct") }}</h2>
    <h2 v-if="isEditMode && selectedType === 'B'">{{ t("headerPopupEditService") }}</h2>
  </div>

  <div v-for="field in fieldConfig" :key="field.key">
    <div v-if="!field.condition || (field.condition === 'isProduct' && formData.product_type_id === 1)" class="mb-3 div-for-formControl">
      <label class="col-sm-3 col-md-6">
        <span v-if="field.required" style="color: red">*</span>
        <span v-if="field.labelDynamic">
          {{ selectedType === 'A' ? t("productNameProduct") : t("productNameService") }}
        </span>
        <span v-else>{{ t(field.label) }}</span>
      </label>

      <div class="col-sm-7 col-md-6">
        <Dropdown
          v-if="field.componentType === 'Dropdown'"
          v-model="formData[field.key]"
          :options="this[field.optionsKey]"
          :error="isEmpty[field.key]"
        />

        <TextField
          v-else-if="field.componentType === 'PriceField'"
          v-model="formattedPrice"
          type="text"
          @input="updatePrice"
          @keypress="onlyNumber"
          :class="{ error: isEmpty[field.key] }"
        />

        <TextField
          v-else-if="field.componentType === 'TextField'"
          v-model="formData[field.key]"
          :type="field.type"
          :error="isEmpty[field.key]"
          :disabled="field.key === 'amount' && isEditMode"
        />
      </div>
    </div>
  </div>

  <div class="mb-3 div-for-formControl">
    <div class="mb-6 col-6">
      <input class="form-control" type="file" @change="handleFileUpload" accept="image/png, image/gif, image/jpeg" ref="fileInput" style="width: 100%" />
      <a v-if="showError" class="text-danger">{{ errorMessage }}</a>
      <a v-if="showInfo" class="text-secondary">{{ t("warningsizeproductImage") }}</a>
      <a v-if="showApprove" class="text-success">{{ approveMessage }}</a>
    </div>
    <div class="mb-3 col-6">
      <img v-if="exp_files" :src="exp_files" alt="Uploaded Image" class="image_exp" />
    </div>
  </div>

  <div class="mb-3 modal-footer">
      <Button
    :disabled="isLoading"
    customClass="btn btn-primary me-3"
    v-if="isAddingMode"
    @click="addProduct"
  >
    <span
      v-if="isLoading"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
    <span v-else>{{ t("buttonAdd") }}</span>
  </Button>
  <Button
    :disabled="isLoading"
    customClass="btn btn-primary me-3"
    v-if="isEditMode"
    @click="editProduct"
  >
    <span
      v-if="isLoading"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
    <span v-else>{{ t("buttonSave") }}</span>
  </Button>
  <Button customClass="btn btn-secondary" @click="closePopup">
    {{ t("buttonCancel") }}
  </Button>
    </div>
</Popup>
    <div class="delete-popup">
      <Popup
        :isOpen="isDeleteConfirmPopupOpen"
        :closePopup="closeDeleteConfirmPopup"
      >
        <div class="mb-5">
          <a>{{ t("deleteConfirmSentence") }}</a>
        </div>
        <div class="modal-footer">
          <Button customClass="btn btn-danger me-3" @click="deleteProduct">
            {{ t("buttonDelete") }}
          </Button>
          <Button
            customClass="btn btn-secondary"
            @click="closeDeleteConfirmPopup"
          >
            {{ t("buttonCancel") }}
          </Button>
        </div>
      </Popup>
    </div>
    <div v-if="isPopupVisible" class="popup-success">
      <div class="popup-content-success">
        <a>{{ popupMessage }}</a>
      </div>
    </div>
    <div v-if="isPopupVisible_error" class="popup-error2">
      <div class="text-end">
        <Button
          type="button"
          customClass="btn-close"
          aria-label="Close"
          @click="closeErrorPopup"
        />
      </div>
      <div class="popup-content-error2">
        <ul>
          <li v-for="(msg, index) in errorMessages" :key="index">
            {{ msg }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Navigate from "../components/Navigation.vue";
import productList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import { computed, watch, ref } from "vue";
import Button from "../components/button.vue";
import Dropdown from "../components/dropdown.vue";
import TextField from "../components/textField.vue";
import formConfig from '../config/field_config/product/form_product.json';

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Product",
  components: {
    Navigate,
    productList,
    Popup,
    Button,
    Dropdown,
    TextField,
  },
  setup() {
    const { t } = useI18n();
    const documentName = computed(() => t("dontHaveProduct"));
    const documentName2 = computed(() => t("dontHaveService"));
    return {
      t,
      documentName,
      documentName2,
    };
  },
  data() {
    return {
      fieldConfig: formConfig,
      dropDownStatus: "",
      errorMessages: [],
      isPopupVisible_error: false,
      exp_files: [],
      Image_pd: [],
      cloudName: "dd65y87uu",
      apiKey: "358619918594822",
      uploadPreset: "product_Img",
      isPopupOpen: false,
      activeProductTypeID: null,
      isDeleteConfirmPopupOpen: false,
      currentTableData: [],
      productTypes: [],
      Categories: [],
      inputError: false,
      isLoading: false,
      isPopupVisible: false,
      selectedType: "",
      showError: false,
      showInfo: true,
      showApprove: false,
      approveMessage: "",
      errorMessage: "",
      formData: {
        product_type_id: "",
        product_name: "",
        product_detail: "",
        amount: "",
        price: "",
        product_cost: "0",
        category_id: "",
        product_id: "",
        product_img: "",
        status: "active",
      },
      isEmpty: {
        product_type_id: false,
        category_id: false,
        product_name: false,
        price: false,
        product_cost: false,
        amount: false,
      },
      searchQuery: "",
    };
  },
  computed: {
    categoryOptions() {
      if (!this.Categories) return [];
      return this.Categories.map((cat) => ({
        value: cat.category_id,
        text: cat.category_name,
      }));
    },
    statusOptions() {
      return [
        { value: "active", text: this.t("statusOpenSale") },
        { value: "discon", text: this.t("discon") },
      ];
    },
    formattedPrice: {
      get() {
        return this.formData.price
          ? new Intl.NumberFormat("en-US").format(this.formData.price)
          : "";
      },
      set(value) {
        this.formData.price = Number(value.replace(/,/g, ""));
      },
    },
    formattedCost: {
      get() {
        return this.formData.product_cost
          ? new Intl.NumberFormat("en-US").format(this.formData.product_cost)
          : "";
      },
      set(value) {
        this.formData.product_cost = Number(value.replace(/,/g, ""));
      },
    },
    tableHeaders() {
      if (this.selectedType === "A") {
        return [
          { label: this.t("categoryNameHeaderTable"), key: "Category" },
          { label: this.t("productHeaderTable"), key: "Product Name" },
          { label: this.t("productDetailHeaderTable"), key: "Detail" },
          { label: this.t("priceHeaderTable"), key: "Price" },
          { label: this.t("costHeaderTable"), key: "Cost" },
          { label: this.t("productImageHeaderTable"), key: "Product Image" },
          { label: this.t("onlystatusHeaderTable"), key: "status" },
          { label: this.t("amountHeaderTable"), key: "Amount" },
        ];
      } else if (this.selectedType === "B") {
        return [
          { label: this.t("categoryNameHeaderTable"), key: "Category" },
          { label: this.t("serviceHeaderTable"), key: "Product Name" },
          { label: this.t("productDetailHeaderTable"), key: "Detail" },
          { label: this.t("priceHeaderTable"), key: "Price" },
          { label: this.t("costHeaderTable"), key: "Cost" },
          { label: this.t("serviceImageHeaderTable"), key: "Product Image" },
          { label: this.t("onlystatusHeaderTable"), key: "status" },
        ];
      }
    },
    filteredProducts() {
      let filteredProduct = [...this.currentTableData];

      if (this.searchQuery.trim()) {
        filteredProduct = filteredProduct.filter((prod) =>
          prod["product_name"]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }

      filteredProduct.forEach((cus) => {
        const lang = this.t("headerLang");
        if (this.selectedType === "A") {
          if (lang === "TH") {
            if (
              cus.status === "On Sales" ||
              cus.status === "on sales" ||
              cus.status === "active"
            ) {
              cus.status = "เปิดขาย";
            } else if (
              cus.status === "ยกเลิกขาย" ||
              cus.status === "not active" ||
              cus.status === "Discontinued "
            ) {
              cus.status = "ยกเลิกขาย";
            } else if (
              cus.status === "หมดสต็อก" ||
              cus.status === "Discontinued"
            ) {
              cus.status = "หมดสต็อก";
            }
          } else {
            if (
              cus.status === "เปิดขาย" ||
              cus.status === "on sales" ||
              cus.status === "active"
            ) {
              cus.status = "On Sales";
            } else if (
              cus.status === "ยกเลิกขาย" ||
              cus.status === "not active" ||
              cus.status === "Discontinued "
            ) {
              cus.status = "Discontinued ";
            } else if (
              cus.status === "หมดสต็อก" ||
              cus.status === "Discontinued"
            ) {
              cus.status = "Out of Stock";
            }
          }
        }
      });

      if (this.selectedType === "A") {
        if (this.dropDownStatus === "active") {
          filteredProduct = filteredProduct.filter(
            (emp) =>
              emp.status.toLowerCase() === "on sales" ||
              emp.status === "เปิดขาย"
          );
        } else if (this.dropDownStatus === "not_active") {
          filteredProduct = filteredProduct.filter(
            (emp) =>
              emp.status.toLowerCase() === "discontinued " ||
              emp.status === "ยกเลิกขาย"
          );
        } else if (this.dropDownStatus === "discon") {
          filteredProduct = filteredProduct.filter(
            (emp) => emp.status === "Out of Stock" || emp.status === "หมดสต็อก"
          );
        } else {
          filteredProduct = filteredProduct.filter(
            (emp) =>
              emp.status.toLowerCase() === "on sales" ||
              emp.status === "Out of Stock" ||
              emp.status === "หมดสต็อก" ||
              emp.status === "เปิดขาย"
          );
        }
      } else {
        filteredProduct = filteredProduct.filter(
          (emp) => emp.status.toLowerCase() !== "not active"
        );
      }

      return filteredProduct;
    },
  },
  watch: {
    "formData.price": function (newVal) {
      if (newVal < 0) {
        this.formData.price = 0;
      }
    },
    "formData.product_cost": function (newVal) {
      if (newVal < 0) {
        this.formData.product_cost = 0;
      }
    },
  },
  methods: {
    validateFormData() {
            // รีเซ็ตค่า isEmpty ทั้งหมด
        this.isEmpty = Object.fromEntries(
          this.fieldConfig.map(field => [field.key, false])
        );
        this.errorMessages = [];

        // วนลูป fieldConfig รูปแบบใหม่ (Array of Objects)
        for (const field of this.fieldConfig) {
          const value = this.formData[field.key];

          // ตรวจสอบฟิลด์ที่จำเป็น (required)
          if (field.required && (!value || value === 0)) {
            // เงื่อนไขพิเศษ: ไม่ต้อง validate 'amount' ถ้าเป็น Service
            if (field.key === 'amount' && this.formData.product_type_id !== 1) {
              continue; // ข้ามไป field ถัดไป
            }
            this.isEmpty[field.key] = true;
            this.errorMessages.push(this.$t(`validation.${field.key}`));
          }
        }

        // ตรวจสอบชื่อซ้ำ (เหมือนเดิม)
        const isDuplicateName = this.currentTableData.some(
          (item) => 
            item.product_name.trim() === this.formData.product_name.trim() && 
            item.ID !== this.formData.product_id
        );
        if (this.formData.product_name && isDuplicateName) {
          this.isEmpty.product_name = true;
          this.errorMessages.push(this.$t("validation.duplicateProductName"));
        }

        // แสดง popup ถ้ามี error
        if (this.errorMessages.length > 0) {
          this.showPopup_validate(this.errorMessages);
          return false; // คืนค่าว่า validate ไม่ผ่าน
        }
        
        return true; // คืนค่าว่า validate ผ่าน
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    onlyNumber(event) {
      if (!/[\d]/.test(event.key)) {
        event.preventDefault();
      }
    },
    updatePrice(event) {
      const rawValue = event.target.value.replace(/,/g, "");
      this.formData.price = Number(rawValue);
    },
    updateCost(event) {
      const rawValue = event.target.value.replace(/,/g, "");
      this.formData.product_cost = Number(rawValue);
    },
    displayProductType(name) {
      if (this.t("headerLang") === "TH") {
        if (name === "product") return "สินค้า";
        if (name === "service") return "เซอร์วิส";
        return name;
      } else {
        return name;
      }
    },
    setProductType(type) {
      this.selectedType = type;
      this.getProduct();
    },
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
      this.getCategory();
      this.clearFormData();
      if (this.selectedType === "A") {
        this.formData.product_type_id = "1";
      } else {
        this.formData.product_type_id = "2";
      }
      this.Image_pd = [];
      this.exp_files = [];
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      const getCurrentStatus = this.formData.status;
      (this.formData = {
        product_type_id: "",
        product_name: "",
        product_detail: "",
        amount: "",
        price: "",
        product_cost: "",
        category_id: "",
        product_id: "",
        product_img: "",
        status: "",
      }),
        (this.isEmpty.product_type_id = false);
      this.isEmpty.category_id = false;
      this.isEmpty.product_name = false;
      this.isEmpty.price = false;
      this.isEmpty.product_cost = false;
      this.isEmpty.amount = false;
      this.isEmpty.product_img = false;

      this.exp_files = "";
      this.inputError = false;
      this.formData.status = getCurrentStatus;
      this.isPopupVisible_error = false;
    },
    closeDeleteConfirmPopup() {
      this.formData.status = "active";
      this.isDeleteConfirmPopupOpen = false;
    },
    handleEdit(item) {
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      const getCurrentStatus = this.formData.status;
      this.formData = {
        product_type_id: item.product_type_id,
        product_name: item.product_name,
        product_detail: item.product_detail,
        amount: item.amount,
        price: parseFloat(item.price.replace(/,/g, "")),
        product_cost: parseFloat(item.product_cost.replace(/,/g, "")),
        category_id: item.category_id,
        product_id: item.ID,
        product_img: item.product_img,
        status: item.status,
      };

      this.exp_files = this.formData.product_img;
      this.getProductType();
      this.getCategory();

      if (!item.product_img) {
        this.Image_pd = [];
        this.exp_files = [];
      } else {
        console.log("กำลังแก้ไขข้อมูลสินค้าที่มีรูปภาพ:", item.product_img);
      }
    },
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { product_id: item.ID };
    },
    handleFileUpload(event) {
      this.errorMessages = [];
      const file = event.target.files[0];

      if (!file) return;

      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        this.errorMessages.push(this.$t("validation.validateImgOnly"));
        this.showPopup_validate(this.errorMessages);
        this.$refs.fileInput.value = "";
        this.Image_pd = [];
        this.exp_files = [];
        return;
      }

      this.Image_pd = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.exp_files = e.target.result;
      };
      reader.readAsDataURL(file);

      this.checkImageFileSize(file);
    },
    checkImageFileSize(Image_file) {
      const fileSizeInKB = Image_file.size / 1024;
      if (fileSizeInKB > 5 * 1024) {
        this.errorMessage = "File size exceeds maximum limit (5 MB)";
        this.showError = true;
      } else {
        this.showApprove = true;
        this.approveMessage = "File size is within the limit.";
      }
    },
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000);
    },
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
    },
    async exportProduct() {
      this.isLoading = true;
      try {
        const data = this.currentTableData;
        let columnMap = [];
        if (this.selectedType === "A") {
          columnMap = {
            Category: "หมวดหมู่",
            product_name: "รายการสินค้า",
            product_detail: "รายละเอียด",
            price: "ราคาขาย",
            product_img: "รูปภาพ",
            amount: "จำนวนสินค้าในคลัง",
          };
        } else {
          columnMap = {
            Category: "หมวดหมู่",
            product_name: "รายการสินค้า",
            product_detail: "รายละเอียด",
            price: "ราคาขาย",
            product_img: "รูปภาพ",
          };
        }

        const headers = Object.keys(columnMap);
        const headerRow = headers.map((key) => `"${columnMap[key]}"`).join(",");

        const rows = data.map((item) => {
          return headers
            .map((key) => {
              let value = item[key] ?? "";
              if (typeof value === "string") {
                value = value.replace(/"/g, '""');
              }
              return `"${value}"`;
            })
            .join(",");
        });

        const csvContent = [headerRow, ...rows].join("\n");
        const bom = "\uFEFF";
        const utf8Blob = new Blob([bom + csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        const url = window.URL.createObjectURL(utf8Blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Products.csv");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error exporting product:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getProductType() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/product/getProductType`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.productTypes = json.data;
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    },
    async getProduct() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/getProduct`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.currentTableData = json.data
            .filter((item) => {
              if (this.selectedType === "A") {
                return item.product_type_id === 1;
              } else if (this.selectedType === "B") {
                return item.product_type_id !== 1;
              }
              return false;
            })
            .map((item) => {
              let product = {
                ID: item.product_id,
                Category: item.product_category.category_name,
                product_name: item.product_name,
                product_detail: item.product_detail,
                price: parseFloat(item.price.toFixed(2)).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                  }
                ),
                product_cost: parseFloat(
                  item.product_cost.toFixed(2)
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                }),
                product_img: item.product_img,
                product_type_id: item.product_type_id,
                category_id: item.category_id,
                status: item.product_status,
              };
              if (this.selectedType === "A") {
                product.amount = item.amount;
              }
              return product;
            });
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getProductByStatus() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/getProduct`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.currentTableData = json.data
            .filter((item) => {
              if (this.selectedType === "A") {
                return item.product_type_id === 1;
              } else if (this.selectedType === "B") {
                return item.product_type_id !== 1;
              }
              if (this.formData.status === "active") {
                return (item.product_status = "active");
              } else {
                return (item.product_status = "not active");
              }
            })
            .map((item) => {
              let product = {
                ID: item.product_id,
                Category: item.product_category.category_name,
                product_name: item.product_name,
                product_detail: item.product_detail,
                price: item.price,
                product_cost: item.product_cost,
                product_img: item.product_img,
                product_type_id: item.product_type_id,
                category_id: item.category_id,
                status: item.product_status,
              };
              if (this.selectedType === "A") {
                product.amount = item.amount;
              }
              return product;
            });
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async addProduct() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;
      try {
        const formDataImage = this.createFormData();
        const response = await fetch(`${API_CALL}/product/AddProduct`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formDataImage,
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.isPopupVisible_error = false;
          this.clearFormData();
          this.getProduct();
          this.showPopup(this.$t("validation.AddSucc"));
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error adding product:", error);
      } finally {
        this.isLoading = false;
        this.isPopupOpen = false;
      }
    },
    async getCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/product/getCategory`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          const categories = [...json.data];
          categories.sort((a, b) => {
            const nameA = a.category_name.toLowerCase();
            const nameB = b.category_name.toLowerCase();
            if (nameA === "ไม่มีหมวดหมู่") return 1;
            if (nameB === "ไม่มีหมวดหมู่") return -1;
            if (nameA === "อื่น") return 1;
            if (nameB === "อื่น") return -1;
            return nameA.localeCompare(nameB);
          });
          this.Categories = categories;
          if (this.isAddingMode) {
            const noCategory = this.Categories.find(
              (c) => c.category_name === "ไม่มีหมวดหมู่"
            );
            if (noCategory) {
              this.formData.category_id = noCategory.category_id;
            }
          }
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async editProduct() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;
      const productID = this.formData.product_id;
      try {
        const formDataImage = this.createFormData();
        const response = await fetch(
          `${API_CALL}/product/EditProduct/${productID}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formDataImage,
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.isPopupOpen = false;
          this.getProduct();
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error editing product:", error);
      } finally {
        this.isLoading = false;
        this.isPopupOpen = true;
        this.isPopupOpen = false;
      }
    },
    async deleteProduct() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const productID = this.formData.product_id;

      try {
        const response = await fetch(
          `${API_CALL}/product/DeleteProduct/${productID}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ productID }),
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getProduct();
          this.showPopup(this.$t("validation.DelateSucc"));
          this.closeDeleteConfirmPopup();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        this.isLoading = false;
        this.isPopupOpen = false;
      }
    },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages;
        this.isPopupVisible_error = true;
      } else {
        this.showPopup_error(messages);
      }
    },
    createFormData() {
      const formDataImage = new FormData();
      formDataImage.append("file", this.Image_pd);
      formDataImage.append("product_type_id", this.formData.product_type_id);
      formDataImage.append("product_name", this.formData.product_name.trim());
      formDataImage.append("product_detail", this.formData.product_detail);
      formDataImage.append("amount", this.formData.amount || 0);
      formDataImage.append("price", parseFloat(this.formData.price) || 0);
      formDataImage.append(
        "product_cost",
        parseFloat(this.formData.product_cost) || 0
      );
      formDataImage.append("category_id", this.formData.category_id);
      formDataImage.append("product_status", this.formData.status);
      return formDataImage;
    },
    clearFormData() {
      this.formData = {
        product_type_id: "1",
        product_name: "",
        product_detail: "",
        amount: 0,
        price: 0,
        product_cost: 0,
        category_id: "",
        status: "",
      };
      this.Image_pd = null;
    },
    resetFormData() {
      this.formData = {
        product_type_id: "",
        product_name: "",
        product_detail: "",
        amount: "",
        price: "",
        product_cost: "",
        category_id: "",
        product_img: "",
      };
      this.exp_files = [];
      this.$refs.fileInput.value = "";
      this.Image_pd.value = "";
    },
  },
  created() {
    this.setProductType("A");
    this.getProductType();
  },
};
</script>