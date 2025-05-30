<template>
  <div class="main-page page_product">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body">
      <div class="mb-4">
        <h2 v-if="selectedType === 'A'">{{ t("product") }}</h2>
        <h2 v-else-if="selectedType === 'B'">{{ t("service") }}</h2>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <div class="mb-3 btn-group btn-group-size custome-tab">
          <button
            class="btn btn-primary"
            :class="{ active: selectedType === 'A' }"
            @click="setProductType('A')"
          >
            {{ t("product") }}
          </button>
          <button
            class="btn btn-primary"
            :class="{ active: selectedType === 'B' }"
            @click="setProductType('B')"
          >
            {{ t("service") }}
          </button>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4 col-sm-4 col-md-2 col-lg-2">
          <select
            v-if="selectedType === 'A'"
            class="form-control form-select size-font-sm"
            v-model="dropDownStatus"
            aria-label="Status select"
          >
            <option value="" selected hidden>{{ t("filter") }}</option>
            <option value="active">{{ t("statusOpenSale") }}</option>
            <!-- <option value="not_active">{{ t("DiscontinuedLG") }}</option> -->
            <option value="discon">{{ t("discon") }}</option>
          </select>
          <!-- <select
            v-if="selectedType === 'B'"
            class="form-control form-select size-font-sm"
            v-model="dropDownStatus"
            aria-label="Status select"
          >
            <option value="" selected hidden>ตัวกรอง22</option>
            <option value="active">{{ t("statusActive") }}</option>
            <option value="not_active">{{ t("statusNotActive") }}</option>
            <option value="discon">{{ t("discon") }}</option>
          </select> -->
          <!-- <select
            class="form-control form-select size-font-sm"
            v-model="formData.status"
          >
            <option
              v-for="status in [
                ...new Set(currentTableData.map((pd) => pd.status)),
              ]"
              :key="status"
              :value="status"
            >
              {{
                t(
                  status === "active"
                    ? "statusActive"
                    : status === "Discontinued"
                    ? "DiscontinuedLG"
                    : "statusNotActive"
                )
              }}
            </option>
          </select> -->
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
        <!-- <div class="col-1 col-sm-1 col-md-7 col-lg-7"></div> -->
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
      <!-- <div class="top-table-for-filter">
        <div>
          <select
            class="form-control form-select custome-search-css-mini mb-3"
            v-model="formData.status"
          >
            <option
              v-for="status in [
                ...new Set(currentTableData.map((pd) => pd.status)),
              ]"
              :key="status"
              :value="status"
            >
              {{
                t(
                  status === "active"
                    ? "statusActive"
                    : status === "Discontinued"
                    ? "DiscontinuedLG"
                    : "statusNotActive"
                )
              }}
            </option>
          </select> -->
      <!-- <select
            class="form-control form-select"
            v-model="formData.status"
            @change="getProductByStatus()"
          >
            <option value="active">{{ t("statusActive") }}</option>
            <option value="not active">{{ t("statusNotActive") }}</option>
          </select>
          {{ formData.status }} -->
      <!-- </div>
        <div class="add-btn mb-3" style="flex: 1">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 custome-search-css"
            style="width: 20%"
            :placeholder="$t('Search')"
          />
          <a class="btn btn-success me-3" @click="openPopup">{{
            t("addProduct")
          }}</a>
          <a
            class="btn btn-outline-secondary mdi mdi-export-variant"
            @click="exportProduct"
          ></a>
        </div>
      </div> -->
      <div class="show-only-desktop">
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
        <h2 v-if="isAddingMode && selectedType === 'A'">
          {{ t("headerPopupAddProduct") }}
        </h2>
        <h2 v-if="isAddingMode && selectedType === 'B'">
          {{ t("headerPopupAddService") }}
        </h2>
        <h2 v-if="isEditMode && selectedType === 'A'">
          {{ t("headerPopupEditProduct") }}
        </h2>
        <h2 v-if="isEditMode && selectedType === 'B'">
          {{ t("headerPopupEditService") }}
        </h2>
      </div>
      <div class="mb-3 div-for-formControl" hidden>
        <label class="col-sm-3 col-md-6" for="productTypeID">{{
          t("productType")
        }}</label>
        <select
          class="form-control col-sm-7 col-md-6 form-select"
          v-model="formData.productTypeID"
          id="productTypeID"
          :class="{ error: isEmpty.productTypeID }"
        >
          <option
            v-for="productType in productTypes"
            :key="productType.productTypeID"
            :value="productType.productTypeID"
          >
            {{ displayProductType(productType.productTypeName) }}
          </option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-3 col-md-6" for="categoryID">{{
          t("productCategory")
        }}</label>
        <select
          class="form-control col-sm-7 col-md-6 form-select"
          v-model="formData.categoryID"
          id="categoryID"
          :class="{ error: isEmpty.categoryID }"
        >
          <option
            v-for="category in Categories"
            :key="category.categoryID"
            :value="category.categoryID"
          >
            {{ category.categoryName }}
          </option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label
          for="productname"
          class="col-sm-3 col-md-6"
          v-if="selectedType === 'A'"
          ><span style="color: red">*</span>{{ t("productNameProduct") }}</label
        >
        <label
          for="productname"
          class="col-sm-3 col-md-6"
          v-else-if="selectedType === 'B'"
          ><span style="color: red">*</span>{{ t("productNameService") }}</label
        >
        <input
          class="form-control col-sm-7 col-md-6"
          v-model="formData.productname"
          type="text"
          id="productname"
          :class="{ error: isEmpty.productname }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-3 col-md-6" for="productdetail">{{
          t("productDetail")
        }}</label>
        <input
          class="form-control col-sm-7 col-md-6"
          v-model="formData.productdetail"
          type="text"
          id="productdetail"
          :class="{ error: inputError }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-3 col-md-6" for="price"
          ><span style="color: red">*</span>{{ t("productPriceSale") }}</label
        >
        <input
          class="form-control col-sm-7 col-md-6"
          v-model="formattedPrice"
          type="text"
          id="price"
          @input="updatePrice"
          @keypress="onlyNumber"
          :class="{ error: isEmpty.price }"
        />
      </div>
      <!-- <div class="mb-3 div-for-formControl">
        <label class="col-sm-3 col-md-6" for="productcost">{{
          t("productCost")
        }}</label>
        <input
          class="form-control col-sm-7 col-md-6"
          v-model="formattedCost"
          type="text"
          id="productcost"
          @input="updateCost"
          @keypress="onlyNumber"
          :class="{ error: isEmpty.productcost }"
        />
      </div> -->
      <div class="mb-3 div-for-formControl" v-if="formData.productTypeID === 1">
        <label class="col-sm-3 col-md-6" for="amount">{{
          t("productAmount")
        }}</label>
        <input
          class="form-control col-sm-7 col-md-6"
          v-model="formData.amount"
          type="number"
          id="amount"
          :readonly="this.isEditMode"
          :disabled="this.isEditMode"
          :class="{ error: isEmpty.amount }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <div class="mb-6 col-6">
          <input
            class="form-control"
            type="file"
            @change="handleFileUpload"
            accept="image/png, image/gif, image/jpeg"
            :class="{ error: isEmpty.productImg }"
            ref="fileInput"
            style="width: 100%"
          />
          <a v-if="showError" class="text-danger">{{ errorMessage }}</a>
          <a v-if="showInfo" class="text-secondary">{{
            t("warningsizeproductImage")
          }}</a>
          <a v-if="showApprove" class="text-success">{{ approveMessage }}</a>
        </div>
        <div class="mb-3 col-6">
          <img
            v-if="exp_files != ''"
            :src="exp_files || formData.productImg"
            alt="Uploaded Image"
            class="image_exp"
          />
        </div>
      </div>
      <div
        class="mb-3 div-for-formControl"
        v-if="formData.status === 'not active'"
      >
        <label class="col-sm-3 col-md-6">{{ t("Status") }}</label>
        <select
          class="form-control col-sm-7 col-md-6 form-select"
          v-model="formData.status"
        >
          <option value="active">Active</option>
          <option value="not active">Not Active</option>
        </select>
      </div>
      <div class="mb-3 modal-footer">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
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
        </button>
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
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
        </button>
        <button class="btn btn-secondary" @click="closePopup">
          {{ t("buttonCancel") }}
        </button>
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
          <button class="btn btn-danger me-3" @click="deleteProduct">
            {{ t("buttonDelete") }}
          </button>
          <button class="btn btn-secondary" @click="closeDeleteConfirmPopup">
            {{ t("buttonCancel") }}
          </button>
        </div>
      </Popup>
    </div>
    <div v-if="isPopupVisible" class="popup-success">
      <div class="popup-content-success">
        <a>{{ popupMessage }}</a>
      </div>
    </div>
    <!-- <div v-if="isPopupVisible_error" class="popup-success">
      <div class="popup-content-error">
        <h3>{{ $t("validate_popupError") }}</h3>
        <ul>
          <li v-for="(msg, index) in errorMessages" :key="index">{{ msg }}</li>
        </ul>
      </div>
    </div> -->
    <div v-if="isPopupVisible_error" class="popup-error2">
      <div class="text-end">
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="closeErrorPopup"
          style="color: #9f9999"
        ></button>
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

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Product",
  components: {
    Navigate,
    productList,
    Popup,
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
      dropDownStatus: "",
      errorMessages: [],
      // Various state variables for controlling the UI
      selectedStatus: 1,
      isPopupVisible_error: false,
      exp_files: [], // Stores selected image file
      Image_pd: [], // Image upload handler
      cloudName: "dd65y87uu", // Cloudinary settings for image upload
      apiKey: "358619918594822",
      uploadPreset: "product_Img",
      isPopupOpen: false, // Controls the add/edit popup
      activeProductTypeID: null, // Active product type ID
      isDeleteConfirmPopupOpen: false, // Controls delete confirmation popup
      currentTableData: [], // Stores current table data
      productTypes: [], // Available product types
      Categories: [], // Available categories
      inputError: false, // Input validation flag
      isLoading: false, // Loading state flag
      isPopupVisible: false, // Controls success popup
      selectedType: "", // Selected product type (A or B)
      showError: false, // Image upload error state
      showInfo: true, // Image info state
      showApprove: false, // Image upload approval state
      approveMessage: "", // Image approval message
      errorMessage: "", // Error message
      formData: {
        // Form data for product
        productTypeID: "",
        productname: "",
        productdetail: "",
        amount: "",
        price: "",
        productcost: "0",
        categoryID: "",
        productID: "",
        productImg: "",
        status: "active",
      },
      isEmpty: {
        productTypeID: false,
        categoryID: false,
        productname: false,
        price: false,
        productcost: false,
      },
      searchQuery: "",
    };
  },
  computed: {
    formattedPrice: {
      get() {
        return this.formData.price
          ? new Intl.NumberFormat("en-US").format(this.formData.price)
          : "";
      },
      set(value) {
        this.formData.price = Number(value.replace(/,/g, "")); // ลบ , ออกก่อนบันทึกค่า
      },
    },
    formattedCost: {
      get() {
        return this.formData.productcost
          ? new Intl.NumberFormat("en-US").format(this.formData.productcost)
          : "";
      },
      set(value) {
        this.formData.productcost = Number(value.replace(/,/g, "")); // ลบ , ออกก่อนบันทึกค่า
      },
    },
    // Defines headers for the product table
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
      // ("Discontinued");
      // ("not active");

      // กรองตามสถานะ
      // if (this.formData.status) {
      //   filteredProduct = filteredProduct.filter(
      //     (emp) =>
      //       emp.status.toLowerCase() === this.formData.status.toLowerCase()
      //   );
      // }
      // กรองข้อมูล Categories โดยเปรียบเทียบกับ searchQuery
      if (this.searchQuery.trim()) {
        filteredProduct = filteredProduct.filter((prod) =>
          prod["productname"]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }

      // แปลงค่าของ status ถ้าภาษาเป็น TH และ status เป็น "Discontinued"
      // if (this.t("headerLang") === "TH") {
      //   filteredProduct = filteredProduct.map((prod) => ({
      //     ...prod,
      //     status:
      //       prod.status === "Discontinued"
      //         ? this.t("DiscontinuedLG")
      //         : prod.status === "active"
      //         ? "เปิดใช้งาน"
      //         : prod.status === "not active"
      //         ? "ปิดใช้งาน"
      //         : prod.status,
      //   }));
      // }

      // console.log("filteredProduct", filteredProduct);
      // filteredProduct.forEach((cus) => {
      //   const lang = this.t("headerLang");
      //   if (this.selectedType === "A") {
      //     if (lang === "TH") {
      //       if (cus.status === "Active" || cus.status === "active") {
      //         cus.status = "เปิดใช้งาน";
      //       } else if (
      //         cus.status === "Not Active" ||
      //         cus.status === "not active"
      //       ) {
      //         cus.status = "ปิดใช้งาน";
      //       } else if (cus.status === "Discontinued") {
      //         cus.status = "หมดสต็อก";
      //       }
      //     } else {
      //       // กรณีภาษาอังกฤษหรือภาษาอื่นๆ อยากแสดงกลับเป็น status เดิม (กรณีมีการแปลงไปแล้ว)
      //       if (cus.status === "เปิดใช้งาน" || cus.status === "active") {
      //         cus.status = "Active";
      //       } else if (
      //         cus.status === "ปิดใช้งาน" ||
      //         cus.status === "not active"
      //       ) {
      //         cus.status = "Not Active";
      //       } else if (cus.status === "หมดสต็อก") {
      //         cus.status = "Out of Stock";
      //       }
      //     }
      //   }
      // });

      // // if (this.selectedType === "A") {
      // if (this.dropDownStatus === "active") {
      //   filteredProduct = filteredProduct.filter(
      //     (emp) =>
      //       emp.status.toLowerCase() === "active" ||
      //       emp.status.toLowerCase() === "เปิดใช้งาน"
      //   );
      // } else if (this.dropDownStatus === "not_active") {
      //   filteredProduct = filteredProduct.filter(
      //     (emp) =>
      //       emp.status.toLowerCase() === "not active" ||
      //       emp.status.toLowerCase() === "ปิดใช้งาน"
      //   );
      // } else if (this.dropDownStatus === "discon") {
      //   // alert("Gg");
      //   filteredProduct = filteredProduct.filter(
      //     (emp) =>
      //       emp.status === "Out of Stock" ||
      //       emp.status.toLowerCase() === "หมดสต็อก"
      //   );
      // }
      console.log("filteredProduct", filteredProduct);
      filteredProduct.forEach((cus) => {
        const lang = this.t("headerLang");
        if (this.selectedType === "A") {
          if (lang === "TH") {
            // alert("1");
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
            // ภาษาอังกฤษ
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

      // ฟิลเตอร์ตาม dropDownStatus
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

      console.log("filteredProduct-->>", filteredProduct);

      // }
      return filteredProduct; // ถ้าไม่มีการค้นหาแสดงทั้งหมด
    },
  },
  watch: {
    "formData.price": function (newVal) {
      if (newVal < 0) {
        this.formData.price = 0;
      }
    },
    "formData.productcost": function (newVal) {
      if (newVal < 0) {
        this.formData.productcost = 0;
      }
    },
  },
  methods: {
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    onlyNumber(event) {
      if (!/[\d]/.test(event.key)) {
        event.preventDefault(); // ป้องกันการพิมพ์อักขระที่ไม่ใช่ตัวเลข
      }
    },
    updatePrice(event) {
      const rawValue = event.target.value.replace(/,/g, ""); // ลบ , ออกก่อนแปลงเป็นตัวเลข
      this.formData.price = Number(rawValue); // แปลงเป็นตัวเลขแล้วบันทึก
    },
    updateCost(event) {
      const rawValue = event.target.value.replace(/,/g, ""); // ลบ , ออกก่อนแปลงเป็นตัวเลข
      this.formData.productcost = Number(rawValue); // แปลงเป็นตัวเลขแล้วบันทึก
    },
    displayProductType(name) {
      if (this.t("headerLang") === "TH") {
        if (name === "product") return "สินค้า";
        if (name === "service") return "เซอร์วิส";
        return name; // ถ้าไม่มีเงื่อนไขตรงก็คืนค่าปกติ
      } else {
        return name;
      }
    },
    // Sets the selected product type and refreshes the product list
    setProductType(type) {
      this.selectedType = type;
      this.getProduct();
    },
    // Opens the popup for adding or editing products
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
      this.getCategory();
      this.clearFormData();
      if (this.selectedType === "A") {
        this.formData.productTypeID = "1";
      } else {
        this.formData.productTypeID = "2";
      }
      // จัดการทั้งกรณี null และ undefined
      this.Image_pd = [];
      this.exp_files = [];
    },
    // Closes the popup and resets form data
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      const getCurrentStatus = this.formData.status;
      (this.formData = {
        productTypeID: "",
        productname: "",
        productdetail: "",
        amount: "",
        price: "",
        productcost: "",
        categoryID: "",
        productID: "",
        productImg: "",
        status: "",
      }),
        (this.isEmpty.productTypeID = false);
      this.isEmpty.categoryID = false;
      this.isEmpty.productname = false;
      this.isEmpty.price = false;
      this.isEmpty.productcost = false;
      this.isEmpty.amount = false;
      this.isEmpty.productImg = false;

      this.exp_files = "";
      this.inputError = false;
      this.formData.status = getCurrentStatus;
      this.isPopupVisible_error = false;
    },
    // Closes the delete confirmation popup
    closeDeleteConfirmPopup() {
      this.formData.status = "active";
      this.isDeleteConfirmPopupOpen = false;
    },
    // Opens the edit popup and loads the product data for editing
    handleEdit(item) {
      // this.getProduct();
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      const getCurrentStatus = this.formData.status;
      this.formData = {
        productTypeID: item.productTypeID,
        productname: item.productname,
        productdetail: item.productdetail,
        amount: item.amount,
        price: parseFloat(item.price.replace(/,/g, "")),
        productcost: parseFloat(item.productcost.replace(/,/g, "")),
        categoryID: item.categoryID,
        productID: item.ID,
        productImg: item.productImg,
        status: item.status,
      }; // Copy item data to formData

      this.exp_files = this.formData.productImg;
      // this.formData.status = getCurrentStatus;
      this.getProductType();
      this.getCategory();

      if (!item.productImg) {
        // จัดการทั้งกรณี null และ undefined
        this.Image_pd = [];
        this.exp_files = [];
      } else {
        // เพิ่มเติม: จัดการกรณีที่ productImg มีค่า
        console.log("กำลังแก้ไขข้อมูลสินค้าที่มีรูปภาพ:", item.productImg);
      }
    },
    // Opens the delete confirmation popup
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { productID: item.ID };
    },
    // Handles image upload and validates the file size
    handleFileUpload(event) {
      this.errorMessages = [];
      const file = event.target.files[0];

      if (!file) return;

      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        this.errorMessages.push(this.$t("validation.validateImgOnly"));
        this.showPopup_validate(this.errorMessages);
        this.$refs.fileInput.value = ""; // เคลียร์ค่า input
        this.Image_pd = [];
        this.exp_files = [];
        return;
      }

      this.Image_pd = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.exp_files = e.target.result; // Stores the image URL
      };
      reader.readAsDataURL(file);

      this.checkImageFileSize(file); // Validates file size
    },
    // Checks image file size and sets appropriate messages
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
    // Displays a success popup
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000); // 2 seconds
    },
    // Displays an error popup
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      // setTimeout(() => {
      //   this.isPopupVisible = false;
      //   this.isPopupVisible_error = false;
      // }, 2000);
    },
    // Exports the product data to a CSV file
    // async exportProduct() {
    //   const accessToken = localStorage.getItem("@accessToken");
    //   this.isLoading = true;
    //   try {
    //     const response = await fetch(
    //       `${API_CALL}/migrate/export-csv/products`,
    //       {
    //         headers: { Authorization: `Bearer ${accessToken}` },
    //       }
    //     );
    //     if (!response.ok) throw new Error("Network response was not ok");
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(new Blob([blob]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "Products.csv"); // Set the filename for download
    //     document.body.appendChild(link);
    //     link.click();
    //     window.URL.revokeObjectURL(url); // Cleanup the URL
    //   } catch (error) {
    //     console.error("Error exporting data:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    // async exportProduct() {
    //   const accessToken = localStorage.getItem("@accessToken");
    //   this.isLoading = true;
    //   try {
    //     const response = await fetch(
    //       `${API_CALL}/migrate/export-csv/products`,
    //       {
    //         headers: { Authorization: `Bearer ${accessToken}` },
    //       }
    //     );

    //     if (!response.ok) throw new Error("Network response was not ok");

    //     const blob = await response.blob();

    //     // อ่านข้อมูล CSV เป็น text
    //     const text = await blob.text();

    //     // เพิ่ม BOM (UTF-8) เพื่อรองรับภาษาไทย
    //     const bom = "\uFEFF";
    //     const utf8Blob = new Blob([bom + text], {
    //       type: "text/csv;charset=utf-8;",
    //     });

    //     // สร้าง URL และดาวน์โหลดไฟล์
    //     const url = window.URL.createObjectURL(utf8Blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "Products.csv"); // กำหนดชื่อไฟล์
    //     document.body.appendChild(link);
    //     link.click();

    //     // ทำความสะอาด URL
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error("Error exporting data:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    async exportProduct() {
      this.isLoading = true;
      try {
        const data = this.currentTableData;

        console.log("currentTableData---------------->", this.currentTableData);

        // Map คอลัมน์เป็นภาษาไทย
        let columnMap = [];
        if (this.selectedType === "A") {
          columnMap = {
            Category: "หมวดหมู่",
            productname: "รายการสินค้า",
            productdetail: "รายละเอียด",
            price: "ราคาขาย",
            productImg: "รูปภาพ",
            amount: "จำนวนสินค้าในคลัง",
            // ละ status ไม่ต้องแสดง
          };
        } else {
          columnMap = {
            Category: "หมวดหมู่",
            productname: "รายการสินค้า",
            productdetail: "รายละเอียด",
            price: "ราคาขาย",
            productImg: "รูปภาพ",
            // ละ status ไม่ต้องแสดง
          };
        }

        // หัวตารางภาษาไทย
        const headers = Object.keys(columnMap);
        const headerRow = headers.map((key) => `"${columnMap[key]}"`).join(",");

        // แปลงข้อมูลแต่ละแถว
        const rows = data.map((item) => {
          return headers
            .map((key) => {
              let value = item[key] ?? "";
              // Escape เครื่องหมาย " ถ้ามี
              if (typeof value === "string") {
                value = value.replace(/"/g, '""');
              }
              return `"${value}"`;
            })
            .join(",");
        });

        const csvContent = [headerRow, ...rows].join("\n");

        // ใส่ BOM สำหรับภาษาไทย
        const bom = "\uFEFF";
        const utf8Blob = new Blob([bom + csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        // ดาวน์โหลด
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

    // async exportProduct() {
    //   const accessToken = localStorage.getItem("@accessToken");
    //   this.isLoading = true;
    //   try {
    //     const response = await fetch(
    //       `${API_CALL}/migrate/export-csv/products`,
    //       {
    //         headers: { Authorization: `Bearer ${accessToken}` },
    //       }
    //     );

    //     if (!response.ok) throw new Error("Network response was not ok");

    //     const blob = await response.blob();
    //     console.log("blob",response);

    //     // อ่านข้อมูล CSV เป็น text
    //     let text = await blob.text();

    //     // แปลงข้อมูล CSV ให้เป็น Array แต่ละบรรทัด
    //     let lines = text.split("\n");

    //     // หาตำแหน่งของคอลัมน์ "Status"
    //     let headers = lines[0].split(",");
    //     let statusIndex = headers.indexOf("Status");

    //     if (statusIndex !== -1) {
    //       lines = lines.map((line, index) => {
    //         if (index === 0) return line; // ข้ามบรรทัดแรก (Header)

    //         let cols = line.split(",");
    //         if (cols[statusIndex]) {
    //           cols[statusIndex] =
    //             cols[statusIndex].trim().charAt(0).toUpperCase() +
    //             cols[statusIndex].trim().slice(1);
    //         }
    //         return cols.join(",");
    //       });
    //     }

    //     // รวมกลับเป็นข้อความ CSV
    //     text = lines.join("\n");

    //     // เพิ่ม BOM (UTF-8) เพื่อรองรับภาษาไทย
    //     const bom = "\uFEFF";
    //     const utf8Blob = new Blob([bom + text], {
    //       type: "text/csv;charset=utf-8;",
    //     });

    //     // สร้าง URL และดาวน์โหลดไฟล์
    //     const url = window.URL.createObjectURL(utf8Blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "Products.csv"); // กำหนดชื่อไฟล์
    //     document.body.appendChild(link);
    //     link.click();

    //     // ทำความสะอาด URL
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error("Error exporting data:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    // Fetches the product type list from the API
    async getProductType() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/product/getProductType`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.productTypes = json.data; // Load product types into the dropdown
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    },
    // Fetches the list of products filtered by type
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
                return item.productTypeID === 1;
              } else if (this.selectedType === "B") {
                return item.productTypeID !== 1;
              }

              return false;
            })
            .map((item) => {
              let product = {
                ID: item.productID,
                Category: item.product_category.categoryName,
                productname: item.productname,
                productdetail: item.productdetail,
                price: parseFloat(item.price.toFixed(2)).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                  }
                ),
                productcost: parseFloat(
                  item.productcost.toFixed(2)
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                }),
                productImg: item.productImg,
                productTypeID: item.productTypeID,
                categoryID: item.categoryID,
                status: item.Status,
              };
              if (this.selectedType === "A") {
                product.amount = item.amount;
              }
              return product;
            });
        } else {
          this.showPopup_error(json.data);
          console.log("ProductByType", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getProductByStatus() {
      // alert("working");
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
                return item.productTypeID === 1;
              } else if (this.selectedType === "B") {
                return item.productTypeID !== 1;
              }

              if (this.formData.status === "active") {
                return (item.Status = "active");
              } else {
                return (item.Status = "not active");
              }
              // return false;
            })
            .map((item) => {
              let product = {
                ID: item.productID,
                Category: item.product_category.categoryName,
                productname: item.productname,
                productdetail: item.productdetail,
                price: item.price,
                productcost: item.productcost,
                productImg: item.productImg,
                productTypeID: item.productTypeID,
                categoryID: item.categoryID,
                status: item.Status,
              };
              if (this.selectedType === "A") {
                product.amount = item.amount;
              }
              return product;
            });
        } else {
          this.showPopup_error(json.data);
          console.log("ProductByType", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // Adds a new product to the list
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
        console.log(json);
        if (json.statusCode === 200) {
          this.isPopupVisible_error = false;
          // this.resetFormData();
          this.clearFormData();
          this.getProduct(); // Refresh product list after adding
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
    // Fetches available product categories from the API
    // async getCategory() {
    //   const accessToken = localStorage.getItem("@accessToken");
    //   try {
    //     const response = await fetch(`${API_CALL}/product/getCategory`, {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     });
    //     const json = await response.json();
    //     if (json.statusCode === 200) {
    //       this.Categories = json.data; // Load categories into dropdown
    //     } else {
    //       this.showPopup_error(json.data);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching categories:", error);
    //   }
    // },
    async getCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/product/getCategory`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          // Clone and sort categories
          const categories = [...json.data];

          categories.sort((a, b) => {
            const nameA = a.categoryName.toLowerCase();
            const nameB = b.categoryName.toLowerCase();

            // จัดอันดับพิเศษ
            if (nameA === "ไม่มีหมวดหมู่") return 1; // ไปล่างสุด
            if (nameB === "ไม่มีหมวดหมู่") return -1;

            if (nameA === "อื่น") return 1; // รองสุดท้าย
            if (nameB === "อื่น") return -1;

            return nameA.localeCompare(nameB);
          });

          this.Categories = categories;

          // ตั้งค่า default เป็น "ไม่มีหมวดหมู่"
          if (this.isAddingMode) {
            const noCategory = this.Categories.find(
              (c) => c.categoryName === "ไม่มีหมวดหมู่"
            );
            if (noCategory) {
              this.formData.categoryID = noCategory.categoryID;
            }
          }
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    // Updates product details
    async editProduct() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;
      const productID = this.formData.productID;
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
          this.getProduct(); // Refresh product list after editing
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
    // Deletes a product from the list
    async deleteProduct() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const productID = this.formData.productID;

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
        console.log("----->>", json);
        if (json.statusCode === 200) {
          this.getProduct(); // Refresh product list after deletion
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
    validateFormData() {
      // ตั้งค่า isEmpty ของทุกฟิลด์เป็น false ก่อนเริ่มการตรวจสอบ
      this.isEmpty.productTypeID = false;
      this.isEmpty.categoryID = false;
      this.isEmpty.productname = false;
      this.isEmpty.price = false;
      this.isEmpty.productcost = false;
      this.isEmpty.amount = false;
      this.isEmpty.productImg = false;

      const errorMessages = [];

      // ตรวจสอบฟิลด์ productTypeID
      if (this.formData.productTypeID === "") {
        this.isEmpty.productTypeID = true;
        errorMessages.push(this.$t("validation.productTypeID"));
      }
      // if (
      //   (this.formData.productTypeID === 1 && this.formData.amount === "") ||
      //   (this.formData.productTypeID === 1 && this.formData.amount === 0)
      // ) {
      //   this.isEmpty.amount = true;
      //   errorMessages.push(this.$t("validation.amount"));
      // }

      // ตรวจสอบฟิลด์ categoryID
      if (this.formData.categoryID === "") {
        this.isEmpty.categoryID = true;
        errorMessages.push(this.$t("validation.categoryID"));
      }

      // ตรวจสอบฟิลด์ productname
      if (this.formData.productname.trim() === "") {
        this.isEmpty.productname = true;
        errorMessages.push(this.$t("validation.productname"));
      }

      const isDuplicateName = this.currentTableData.some(
        (item) =>
          item.productname.trim() === this.formData.productname.trim() &&
          item.ID !== this.formData.productID // ตรวจสอบว่าข้อมูลไม่ได้เป็นตัวเอง
      );
      if (isDuplicateName) {
        this.isEmpty.productname = true;
        errorMessages.push(this.$t("validation.duplicateProductName"));
      }

      // ตรวจสอบฟิลด์ price
      if (this.formData.price === "" || this.formData.price === 0) {
        this.isEmpty.price = true;
        errorMessages.push(this.$t("validation.price"));
      }

      // ตรวจสอบฟิลด์ productcost
      // if (this.formData.productcost === "" || this.formData.productcost === 0) {
      //   this.isEmpty.productcost = true;
      //   errorMessages.push(this.$t("validation.productcost"));
      // }
      // ตรวจสอบรูปภาพ

      // if (this.isAddingMode == true) {
      //   if (this.Image_pd.length === 0) {
      //     this.isEmpty.productImg = true;
      //     errorMessages.push(this.$t("validation.productImg"));
      //   } else {
      //     const fileExtension = this.Image_pd.name
      //       .split(".")
      //       .pop()
      //       .toLowerCase(); // ดึงนามสกุลไฟล์
      //     if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
      //       this.isEmpty.productImg = true;
      //       errorMessages.push(this.$t("validation.invalidFileType"));
      //     }
      //   }
      // }

      // if (this.isEditMode == true) {
      //   alert(this.formData.productImg);
      //   if (!["jpg", "jpeg", "png"].includes(this.formData.productImg)) {
      //     this.isEmpty.productImg = true;
      //     errorMessages.push(this.$t("validation.productImg"));
      //   } else {
      //     const fileExtension = this.Image_pd.name
      //       .split(".")
      //       .pop()
      //       .toLowerCase(); // ดึงนามสกุลไฟล์
      //     if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
      //       this.isEmpty.productImg = true;
      //       errorMessages.push(this.$t("validation.invalidFileType"));
      //     }
      //   }
      // }

      // if (this.isEditMode) {
      //   // ตรวจสอบว่ามี productImg หรือไม่
      //   if (this.formData.productImg || this.Image_pd?.name) {
      //     // ดึงนามสกุลไฟล์จากชื่อไฟล์ที่เก็บใน database
      //     const fileExtension1 = this.formData.productImg
      //       ? this.formData.productImg.split(".").pop().toLowerCase()
      //       : null;

      //     // ดึงนามสกุลไฟล์จากชื่อไฟล์ใหม่ที่อัพโหลด
      //     const fileExtension2 = this.Image_pd?.name
      //       ? this.Image_pd.name.split(".").pop().toLowerCase()
      //       : null;

      //     // ตรวจสอบนามสกุลไฟล์
      //     if (
      //       (fileExtension1 &&
      //         ["jpg", "jpeg", "png"].includes(fileExtension1)) ||
      //       (fileExtension2 && ["jpg", "jpeg", "png"].includes(fileExtension2))
      //     ) {
      //       // ถ้านามสกุลถูกต้อง ถือว่าแก้ไขสำเร็จ
      //       // alert("Edit สำเร็จ");
      //     } else {
      //       // ถ้านามสกุลไม่ถูกต้อง ให้แจ้งเตือนและอัพโหลดใหม่
      //       this.isEmpty.productImg = true;
      //       errorMessages.push(this.$t("validation.invalidFileType"));
      //     }
      //   } else {
      //     // กรณีไม่มีไฟล์ทั้งเก่าและใหม่ ให้แจ้งเตือนให้อัพโหลดใหม่
      //     this.isEmpty.productImg = true;
      //     errorMessages.push(this.$t("validation.productImg"));
      //   }
      // }

      // if (this.isEditMode == true) {
      //   if (this.Image_pd.length === 0) {
      //     this.isEmpty.productImg = true;
      //     errorMessages.push(this.$t("validation.productImg"));
      //   } else {
      //     const fileExtension = this.Image_pd.name
      //       .split(".")
      //       .pop()
      //       .toLowerCase(); // ดึงนามสกุลไฟล์
      //     if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
      //       this.isEmpty.productImg = true;
      //       errorMessages.push(this.$t("validation.invalidFileType"));
      //     }
      //   }
      // }

      // if (this.isEditMode) {
      //   if (!this.Image_pd?.name && !this.formData.productImg) {
      //     this.isEmpty.productImg = true;
      //     errorMessages.push(this.$t("validation.productImg"));
      //   } else {
      //   }
      // }
      if (errorMessages.length > 0) {
        this.showPopup_validate(errorMessages);
        return false;
      } else {
        return true;
      }
    },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages; // เก็บข้อความใน errorMessages
        // this.showErrorPopup = true; // แสดง Popup
        this.isPopupVisible_error = true;
        // setTimeout(() => {
        //   this.isPopupVisible_error = false; // ซ่อน Popup หลังจากหน่วงเวลา
        // }, 3000); // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที)
      } else {
        this.showPopup_error(messages);
      }
    },
    // Helper function to create FormData for API requests
    createFormData() {
      const formDataImage = new FormData();
      formDataImage.append("file", this.Image_pd);
      formDataImage.append("productTypeID", this.formData.productTypeID);
      formDataImage.append("productname", this.formData.productname.trim());
      formDataImage.append("productdetail", this.formData.productdetail);
      formDataImage.append("amount", this.formData.amount || 0);
      formDataImage.append("price", parseFloat(this.formData.price) || 0);
      formDataImage.append(
        "productcost",
        parseFloat(this.formData.productcost) || 0
      );
      formDataImage.append("categoryID", this.formData.categoryID);
      formDataImage.append("Status", this.formData.status);
      return formDataImage;
    },
    clearFormData() {
      this.formData = {
        productTypeID: "1",
        productname: "",
        productdetail: "",
        amount: 0,
        price: 0,
        productcost: 0,
        categoryID: "",
        status: "", // หรือตั้งค่าเริ่มต้นเป็นค่า default ที่ต้องการ
      };
      this.Image_pd = null;
    },

    // Resets form data after adding/editing product
    resetFormData() {
      this.formData = {
        productTypeID: "",
        productname: "",
        productdetail: "",
        amount: "",
        price: "",
        productcost: "",
        categoryID: "",
        productImg: "",
      };
      // this.exp_files.value = "";
      this.exp_files = [];
      this.$refs.fileInput.value = ""; // รีเซ็ต input file
      this.Image_pd.value = "";
    },
  },
  // Fetches required data on component creation
  created() {
    this.setProductType("A");
    this.getProductType();
    // this.getCategory();
    // this.getProduct();
  },
};
</script>

<style>
.is-invalid {
  border: 1px solid red;
}

.show-only-desktop table thead tr th:nth-child(9),
.show-only-desktop table tbody tr td:nth-child(9) {
  display: none;
}

.show-only-desktop table thead tr th:nth-child(7),
.show-only-desktop table tbody tr td:nth-child(7) {
  display: none;
}
</style>
