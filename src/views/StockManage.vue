<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body">
      <div class="mb-5">
        <h2>{{ t("headerStockManage") }}</h2>
      </div>
      <div class="add-btn mb-3">
        <a class="btn btn-success size-font-sm" @click="openPopup">{{
          t("manageStock")
        }}</a>
      </div>
      <div v-if="role === 'SUPERUSER'">
        <productList
          :tableHeaders="tableHeaders"
          :initialTableData="transactionTable"
          @handleManage="handleManage"
          :columnforManage="true"
          v-if="transactionTable"
          :isLoading="isLoading"
          :documentName="documentName"
        />
      </div>
      <div v-if="role != 'SUPERUSER'">
        <productList
          :tableHeaders="tableHeaders"
          :initialTableData="transactionTable"
          @handleManage="handleManage"
          :columnforManage="false"
          v-if="transactionTable"
          :isLoading="isLoading"
          :documentName="documentName"
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
    <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <div class="mb-4">
        <h3>{{ t("manageStock") }}</h3>
      </div>
      <div class="div-for-formControl mb-3">
        <div class="col-6 col-sm-6 col-md-6 col-lg-6">
          <label class="col-sm-6 col-md-6"
            ><span style="color: red">*</span
            >{{ t("productNameProduct") }}</label
          >
        </div>
        <div class="col-6 col-sm-6 col-md-6 col-lg-6">
          <v-autocomplete
            :items="currentTableData"
            item-title="productname"
            item-value="productID"
            variant="outlined"
            v-model="formData.productID"
            :class="{ error: isEmpty.productID }"
            :change="selectProdcut(formData.productID)"
          >
          </v-autocomplete>
        </div>
      </div>
      <!-- <div class="mb-3 div-for-InputDropdown">
        <label class="col-sm-6 col-md-6">{{ t("productNameProduct") }}</label>
        <div class="relative-wrapper">
          <v-autocomplete
            label=""
            :items="currentTableData"
            item-title="productname"
            item-value="productID"
            variant="outlined"
            v-model="formData.productID"
            :class="{ error: isEmpty.productID }"
          >
          </v-autocomplete>
        </div> -->
      <!-- <select class=" form-control col-sm-7 col-md-6 form-select" v-model="formData.productID" id="categoryID"
                    :class="{ 'error': inputError }">
                    <option v-for="product in currentTableData" :key="product.productID" :value="product.productID">
                        {{ product.productname }}
                    </option>
                </select> -->
      <!-- </div> -->
      <div class="mb-3 div-for-formControl">
        <label
          ><span style="color: red">*</span>{{ t("manageStockType") }}</label
        >
        <select
          class="form-control form-select"
          v-model="formData.transactionType"
          :class="{ error: isEmpty.transactionType }"
        >
          <option value="Receive">{{ t("receive") }}</option>
          <option value="Issue">{{ t("issue") }}</option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label>{{ t("current_product_amount") }}</label>
        <input
          class="form-control"
          v-model="formData.current_product_amount"
          type="number"
          readonly="true"
          disabled="true"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label
          ><span style="color: red">*</span>{{ t("quantityProduct") }}</label
        >
        <input
          class="form-control"
          v-model="formData.quantity"
          type="number"
          min="1"
          @input="checkQuantity"
          :class="{ error: isEmpty.quantity }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label>{{ t("update_product_amount") }}</label>
        <input
          class="form-control"
          v-model="formData.update_product_amount"
          type="number"
          readonly="true"
          disabled="true"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label>{{ t("productDetail") }}</label>
        <input
          class="form-control"
          v-model="formData.transactionDetail"
          :class="{ error: inputError }"
        />
      </div>
      <div class="modal-footer">
        <button
          v-if="isAddingMode"
          :disabled="isLoading"
          class="btn btn-primary me-3"
          @click="producTransaction"
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
          v-if="isEditingMode"
          :disabled="isLoading"
          class="btn btn-primary me-3"
          @click="editTransaction"
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
import Popup from "../components/popup.vue";
import productList from "../components/tableList.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import { computed, watch, ref } from "vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "manageStock",
  components: {
    Navigate,
    Popup,
    productList,
  },
  setup() {
    const { t } = useI18n();

    const documentName = computed(() => t("dontHaveStock"));
    return { t, documentName };
  },
  data() {
    return {
      Product: [],
      errorMessages: [],
      isPopupVisible_error: false,
      isPopupOpen: false,
      currentTableData: [], // Stores product data
      transactionTable: [], // Stores transaction data
      isLoading: false, // Controls the loading state
      isPopupVisible: false, // Controls success popup visibility
      inputError: false, // Tracks input validation errors
      role: localStorage.getItem("RoleName"), // Fetches user role from local storage
      formData: {
        productID: "", // Product ID for transactions
        ID: "", // Transaction ID for editing
        product: "",
        transactionType: "", // Type of transaction (issue/receive)
        quantity: "", // Quantity of product for transaction
        transactionDetail: "", // Additional details for transaction
        current_product_amount: "",
        update_product_amount: "",
      },
      isEmpty: {
        productID: "", // Product ID for transactions
        ID: "", // Transaction ID for editing
        product: "",
        transactionType: "", // Type of transaction (issue/receive)
        quantity: "", // Quantity of product for transaction
        transactionDetail: "", // Additional details for transaction
      },
    };
  },
  computed: {
    tableHeaders() {
      // Defines table headers for product transaction list
      return [
        { label: this.t("productTranHeaderTable"), key: "product" },
        { label: this.t("datepaysalaryHeaderTable"), key: "Date" },
        { label: this.t("transHeaderTable"), key: "Transaction" },
        { label: this.t("productDetailHeaderTable"), key: "Detail" },
        { label: this.t("quanHeaderTable"), key: "Quantity" },
      ];
    },
    transactionTable() {
      let filteredStock = [...this.transactionTable];

      if (this.t("headerLang") === "TH") {
        filteredStock = filteredStock.map((prod) => ({
          ...prod,
          Transaction:
            prod.Transaction === "Receive"
              ? this.t("ReceiveLG")
              : prod.Transaction === "Issue"
              ? this.t("IssueLG")
              : prod.Transaction,
          Date: this.formatThaiDate(prod.Date), // แปลงวันที่เป็นไทย
        }));
      } else {
        filteredStock = filteredStock.map((prod) => ({
          ...prod,
          Date: this.formatEnglishDate(prod.Date), // แปลงวันที่เป็นอังกฤษ
        }));
      }
      return filteredStock;
    },
  },
  methods: {
    async selectProdcut(id) {
      // สมมุติว่า Product เป็น array และคุณต้องการหา product ที่มี id ตรงกับที่ส่งมา
      const selectedProduct = this.Product.find((p) => p.productID === id);

      if (!selectedProduct) {
        console.error("Product not found");
        return;
      }

      this.formData.current_product_amount = selectedProduct.amount;

      if (this.formData.transactionType === "Receive") {
        this.formData.update_product_amount =
          parseInt(this.formData.current_product_amount) +
          parseInt(this.formData.quantity);
      } else {
        this.formData.update_product_amount =
          this.formData.current_product_amount - this.formData.quantity;
      }
    },
    async getProduct() {
      const response = await fetch(`${API_CALL}/product/getProduct`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await response.json();
      this.Product = json.data;
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    formatThaiDate(dateStr) {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      const thaiMonths = [
        "",
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
      ];
      const thaiYear = parseInt(year) + 543;
      return `${parseInt(day)} ${thaiMonths[parseInt(month)]} ${thaiYear}`;
    },
    formatEnglishDate(dateStr) {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      const englishMonths = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${parseInt(day)} ${englishMonths[parseInt(month)]} ${year}`;
    },
    validateFormData() {
      // ตั้งค่า isEmpty ของทุกฟิลด์เป็น false ก่อนเริ่มการตรวจสอบ
      this.isEmpty.productID = false;
      this.isEmpty.transactionType = false;
      this.isEmpty.quantity = false;

      const errorMessages = [];

      // ตรวจสอบฟิลด์ productID
      if (this.formData.productID === "") {
        this.isEmpty.productID = true;
        errorMessages.push(this.$t("validation.productID"));
      } else {
        // ตรวจสอบ productID ใน currentTableData
        const matchingProduct = this.currentTableData.find(
          (item) => item.productID === this.formData.productID
        );

        if (this.formData.transactionType === "issue") {
          if (!matchingProduct) {
            errorMessages.push(this.$t("validation.productNotFound"));
          } else if (matchingProduct.amount < this.formData.quantity) {
            errorMessages.push(this.$t("validation.quantityExceedsStock"));
          }
        }
      }

      if (this.formData.transactionType === "") {
        this.isEmpty.transactionType = true;
        errorMessages.push(this.$t("validation.transactionType"));
      }
      if (this.formData.quantity === "") {
        this.isEmpty.quantity = true;
        errorMessages.push(this.$t("validation.quantity"));
      }
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
    checkQuantity() {
      // Ensures quantity input is at least 1
      if (this.formData.quantity <= 0) {
        this.formData.quantity = 1;
      }
    },
    openPopup() {
      // Opens popup for adding a new transaction
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditingMode = false;
    },
    closePopup() {
      // Closes the popup and resets form data
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditingMode = false;
      this.formData = {
        productID: "",
        ID: "",
        product: "",
        transactionType: "",
        quantity: "",
        transactionDetail: "",
      };
      this.isEmpty.productID = false;
      this.isEmpty.transactionType = false;
      this.isEmpty.quantity = false;

      this.inputError = false;
      this.isPopupVisible_error = false;
    },
    handleManage(item) {
      // Opens popup for editing an existing transaction and populates form with selected transaction data
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditingMode = true;

      if (item.Transaction === "ลดสินค้า") {
        item.Transaction = "Issue";
      } else if (item.Transaction === "เพิ่มสินค้า") {
        item.Transaction = "Receive";
      }
      this.formData = {
        productID: item.productID,
        ID: item.ID,
        transactionType: item.Transaction,
        quantity: item.Quantity,
        transactionDetail: item.Detail,
      };
    },
    showPopup(message) {
      // Displays success popup with a custom message
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000); // Popup visible for 2 seconds
    },
    showPopup_error(message) {
      // Displays error popup with a custom message

      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000); // Error popup visible for 2 seconds
    },
    async getProductByTypeID() {
      // Fetches products of a specific type (ID 1) from the server
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/getProduct`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.currentTableData = json.data.filter(
            (item) =>
              item.productTypeID === 1 &&
              (item.Status === "active" || item.Status === "Discontinued")
          );
          //   console.log(this.currentTableData);
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getTransaction() {
      // Fetches all product transactions from the server
      const accessToken = localStorage.getItem("@accessToken");
      try {
        this.isLoading = true;
        const response = await fetch(`${API_CALL}/product/getTransaction`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        console.log(json);
        if (json.statusCode === 200) {
          this.transactionTable = json.data.map((item) => ({
            ID: item.id,
            productID: item.productID,
            product: item.Product,
            Date: item.Date,
            Transaction: item.Transaction,
            Detail: item.Detail,
            Quantity: item.Quantity,
          }));
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async producTransaction() {
      // Adds a new product transaction (either issue or receive)
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;
      // if (
      //   !this.formData.productID ||
      //   !this.formData.transactionType ||
      //   !this.formData.quantity ||
      //   !this.formData.transactionDetail
      // ) {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill all data");
      // } else if (this.formData.quantity < 1) {
      //   this.inputError = true;
      //   this.showPopup_error("Quantity must be more than 0");
      // } else {
      //   this.inputError = false;
      //   this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/AddTransaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            productID: this.formData.productID,
            transactionType: this.formData.transactionType,
            quantity: this.formData.quantity,
            transactionDetail: this.formData.transactionDetail,
          }),
        });
        const json = await response.json();
        console.log(json);

        if (json.statusCode === 200) {
          console.log(json);
          this.getTransaction();
          this.getProduct();
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup();
        } else {
          // this.showPopup_error(`${json.data}`);
          let errorMessages = [];
          errorMessages.push(json.data);
          this.showPopup_validate(errorMessages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
    async editTransaction() {
      if (!(await this.validateFormData())) return;
      // Edits an existing product transaction
      const accessToken = localStorage.getItem("@accessToken");

      this.errorMessage = [];
      this.isLoading = true;
      // if (
      //   this.formData.productID === "" ||
      //   this.formData.transactionType === "" ||
      //   this.formData.quantity === ""
      // ) {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill all data");
      // } else {
      //   this.inputError = false;
      //   this.isLoading = true;
      const tranID = this.formData.ID;
      try {
        const response = await fetch(
          `${API_CALL}/product/EditTransaction/${tranID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              productID: this.formData.productID,
              transactionType: this.formData.transactionType,
              quantity: this.formData.quantity,
              transactionDetail: this.formData.transactionDetail,
            }),
          }
        );
        const json = await response.json();
        console.log(json.data);

        if (json.statusCode === 200) {
          this.getTransaction();
          this.getProduct();
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup();
        } else {
          // let errorMessages = [];
          // errorMessages.push(json.data);
          // this.showPopup_validate(errorMessages);
          // this.showPopup_error(json.data);
          let errorMessages = [];
          errorMessages.push(json.data);
          this.showPopup_validate(errorMessages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
  },
  created() {
    // Initial fetching of product and transaction data when the component is created
    this.getProductByTypeID();
    this.getTransaction();
    this.getProduct();
  },
};
</script>
