<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body">
      <div class="mb-4">
        <h2 v-if="this.selectedType === 'B'">{{ t("tapcustomerPart") }}</h2>
        <h2 v-if="this.selectedType === 'A'">{{ t("headerCustomer2") }}</h2>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <div class="mb-3 btn-group btn-group-size custome-tab">
          <button
            class="btn btn-primary"
            :class="{ active: selectedType === 'A' }"
            @click="setTabCompany('A')"
          >
            {{ t("Company") }}
          </button>
          <button
            class="btn btn-primary"
            :class="{ active: selectedType === 'B' }"
            @click="setTabCompany('B')"
          >
            {{ t("Customer") }}
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
            <option value="active">{{ t("statusActive") }}</option>
            <option value="not_active">{{ t("statusNotActive") }}</option>
          </select>
          <select
            v-if="selectedType === 'B'"
            class="form-control form-select size-font-sm"
            v-model="dropDownStatus"
            aria-label="Status select"
          >
            <option value="" selected hidden>ตัวกรอง</option>
            <option value="active">{{ t("statusActive") }}</option>
            <option value="not_active">{{ t("statusNotActive") }}</option>
          </select>
          <!-- <select
            v-if="selectedType === 'A'"
            class="form-control form-select size-font-sm"
            v-model="formData.status"
          >
            <option
              v-for="status in [...new Set(Customers.map((cus) => cus.Status))]"
              :key="status"
              :value="status"
            >
              {{ t(status === "active" ? "statusActive" : "statusNotActive") }}
            </option>
          </select> -->
          <!-- <select
            v-if="selectedType === 'B'"
            class="form-control form-select"
            v-model="formData.status"
          >
            <option
              v-for="status in [
                ...new Set(CompanyPerson.map((cus) => cus.status)),
              ]"
              :key="status"
              :value="status"
            >
              {{ t(status === "active" ? "statusActive" : "statusNotActive") }}
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
        <div class="col-6 col-sm-6 col-md-9 col-lg-9">
          <a
            class="btn btn-success float-right size-font-sm"
            @click="openPopup"
            v-if="this.selectedType === 'A'"
            >{{ t("addCustomer2") }}</a
          >
          <a
            class="btn btn-success float-right size-font-sm"
            @click="openPopup"
            v-if="this.selectedType === 'B'"
            >{{ t("addCustomer") }}</a
          >
        </div>
      </div>

      <!-- <div class="top-table-for-filter">
        <div>
          <select
            v-if="selectedType === 'A'"
            class="form-control form-select custome-search-css-mini"
            v-model="formData.status"
          >
            <option
              v-for="status in [...new Set(Customers.map((cus) => cus.Status))]"
              :key="status"
              :value="status"
            >
              {{ t(status === "active" ? "statusActive" : "statusNotActive") }}
            </option>
          </select>
          <select
            v-if="selectedType === 'B'"
            class="form-control form-select custome-search-css-mini"
            v-model="formData.status"
          >
            <option
              v-for="status in [
                ...new Set(CompanyPerson.map((cus) => cus.status)),
              ]"
              :key="status"
              :value="status"
            >
              {{ t(status === "active" ? "statusActive" : "statusNotActive") }}
            </option>
          </select>
        </div>
        <div class="add-btn mb-3" style="flex: 1">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 custome-search-css"
            style="width: 20%"
            :placeholder="$t('Search')"
          />
          <a
            class="btn btn-success"
            @click="openPopup"
            v-if="this.selectedType === 'A'"
            >{{ t("addCustomer2") }}</a
          >
          <a
            class="btn btn-success"
            @click="openPopup"
            v-if="this.selectedType === 'B'"
            >{{ t("addCustomer") }}</a
          >
        </div>
      </div> -->
      <div v-if="selectedType === 'A'">
        <CategoryList
          :initialTableData="filteredCustomer"
          :tableHeaders="tableHeaders"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          :isLoading="isLoading"
          :documentName="documentName"
          :showAllowButton="true"
        />
      </div>
      <div v-if="selectedType === 'B'">
        <CategoryList
          :initialTableData="filteredCompany"
          :tableHeaders="tableHeaders2"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit2"
          @handleDelete="handleDelete"
          v-if="CompanyPerson"
          :isLoading="isLoading"
          :documentName="documentName2"
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
    <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <h2 v-if="isAddingMode" style="padding:0px; !important">
        {{ t("headerPopupAddCustomer") }}
      </h2>
      <h2 v-if="isEditMode">{{ t("headerPopupEditCustomer") }}</h2>
      <div class="mb-3">
        <span style="color: red">*</span
        ><label class="col-sm-5 col-md-6">{{ t("customerName") }}</label>
        <input
          v-model="formData.cus_name"
          type="text"
          id="input-text"
          required
          :class="{ error: isEmpty.cus_name, 'form-control': true }"
        />
      </div>
      <div class="mb-3">
        <span style="color: red">*</span
        ><label class="col-sm-5 col-md-6">{{ t("customerAddress") }}</label>
        <input
          :class="{ error: isEmpty.cus_address, 'form-control': true }"
          v-model="formData.cus_address"
          type="text"
          id="input-text"
          required
        />
      </div>
      <div class="mb-3">
        <span style="color: red">*</span
        ><label class="col-sm-5 col-md-6">{{ t("phoneNum") }}</label>
        <input
          :class="{ error: isEmpty.cus_tel, 'form-control': true }"
          v-model="formData.cus_tel"
          type="text"
          id="input-text"
          @keypress="validateInput"
          maxlength="10"
          required
        />
      </div>
      <div class="mb-3">
        <span style="color: red">*</span
        ><label class="col-sm-5 col-md-6">{{ t("email") }}</label>
        <input
          :class="{ error: isEmpty.cus_email, 'form-control': true }"
          v-model="formData.cus_email"
          type="email"
          id="input-text"
          required
        />
      </div>

      <div class="mb-3">
        <span style="color: red">*</span
        ><label class="col-sm-5 col-md-6">{{ t("taxID") }}</label>
        <input
          :class="{ error: isEmpty.cus_tax, 'form-control': true }"
          v-model="formData.cus_tax"
          type="text"
          id="input-text"
          @keypress="validateInput"
          maxlength="13"
          required
        />
      </div>
      <div class="mb-3">
        <span style="color: red">*</span
        ><label class="col-sm-5 col-md-6">{{ t("customerPurchaseBy") }}</label>
        <input
          :class="{ error: isEmpty.cus_purchase, 'form-control': true }"
          v-model="formData.cus_purchase"
          type="text"
          id="input-text"
          required
        />
      </div>
      <div class="modal-footer">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addCustomer"
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
          @click="editCustomer"
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
    <Popup :isOpen="isPopupOpen2" :closePopup="closePopup2">
      <h2 style="padding: 0px" v-if="isAddingMode">
        {{ t("headerPopupEditCustomer3") }}
      </h2>
      <h2 style="padding: 0px" v-if="isEditMode">
        {{ t("headerPopupEditCustomer2") }}
      </h2>

      <div class="mb-3">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span
          >{{ t("cusNameHeaderTable2") }}</label
        >
        <input
          v-model="formDataCustomer.company_person_name"
          type="text"
          id="input-text"
          required
          :class="{ error: isEmpty2.company_person_name, 'form-control': true }"
        />
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6" hidden>
          <span style="color: red">*</span
          >{{ t("cusAddressHeaderTable2") }}</label
        >
        <input
          :class="{
            error: isEmpty2.company_person_address,
            'form-control': true,
          }"
          v-model="formDataCustomer.company_person_address"
          type="text"
          id="input-text"
          required
          hidden
        />
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("cusTelHeaderTable2") }}</label
        >
        <input
          :class="{ error: isEmpty2.company_person_tel, 'form-control': true }"
          v-model="formDataCustomer.company_person_tel"
          type="text"
          id="input-text"
          maxlength="10"
          @keypress="validateInput"
          required
        />
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span
          >{{ t("cusEmailHeaderTable2") }}</label
        >
        <input
          :class="{
            error: isEmpty2.company_person_email,
            'form-control': true,
          }"
          v-model="formDataCustomer.company_person_email"
          type="text"
          id="input-text"
          required
        />
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6">{{ t("quotationRemark") }}</label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="2"
        ></textarea>
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("cusCompany") }}</label
        >
        <select
          class="form-control col-sm-7 col-md-6 form-select"
          v-model="formDataCustomer.company_person_customer"
          :class="{ error: isEmpty2.company_person_customer }"
          id="cus_id"
        >
          <option
            v-for="CustomerDropown in CustomerDropown"
            :key="CustomerDropown.cus_id"
            :value="CustomerDropown.cus_id"
          >
            {{ CustomerDropown.cus_name }}
          </option>
        </select>
      </div>
      <div class="modal-footer">
        <button
          v-if="this.isEditMode"
          class="btn btn-primary me-3"
          @click="EditCustomer2"
        >
          Save
        </button>
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addCustomer2"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonAdd") }}</span>
        </button>
        <!-- <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isEditMode"
          @click="editCustomer"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </button> -->
        <button class="btn btn-secondary" @click="closePopup2">
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
          <button
            :disabled="isLoading"
            class="btn btn-danger me-3"
            @click="deleteCustomer"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t("buttonDelete") }}</span>
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
import CategoryList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import { computed, watch, ref } from "vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Customer",
  components: {
    Navigate, // Navigation component for page navigation
    CategoryList, // Table list component to display customers
    Popup, // Popup component for adding/editing/deleting customers
  },
  setup() {
    const { t } = useI18n(); // Localization setup for translated texts

    const documentName2 = computed(() => t("dontHaveCompany"));
    const documentName = computed(() => t("dontHaveCustomerCompany"));
    return { t, documentName, documentName2 };
  },
  data() {
    return {
      dropDownStatus: "",
      CustomerDropown: [],
      CompanyPerson: [],
      selectedType: "",
      category_file: "",
      errorMessages: [],
      isPopupVisible_error: false, // Control for displaying error popup
      Customers: [], // List of customers fetched from the server
      isPopupOpen: false, // Control for add/edit popup visibility
      isPopupOpen2: false, // Control for add/edit popup visibility
      isDeleteConfirmPopupOpen: false, // Control for delete confirmation popup visibility
      isLoading: false, // Loading state for API requests
      isPopupVisible: false, // Control for success message popup
      inputValue: "",
      inputError: false, // Flag for form input validation
      formData: {
        // Data model for customer form
        cus_id: "",
        cus_name: "",
        cus_address: "",
        cus_tel: "",
        cus_email: "",
        cus_tax: "",
        cus_purchase: "",
        status: "active",
      },
      formDataCustomer: {
        // Data model for customer form
        company_person_id: "",
        company_person_name: "",
        company_person_address: "",
        company_person_tel: "",
        company_person_email: "",
        company_person_customer: "",
      },
      isEmpty2: {
        // Data model for customer form
        company_person_id: "",
        company_person_name: "",
        company_person_address: "",
        company_person_tel: "",
        company_person_email: "",
        company_person_customer: "",
      },
      isEmpty: {
        // Data model for customer form
        cus_id: "",
        cus_name: "",
        cus_address: "",
        cus_tel: "",
        cus_email: "",
        cus_tax: "",
        cus_purchase: "",
        status: "active",
      },
      searchQuery: "",
    };
  },
  computed: {
    // Define table headers for displaying customer data
    tableHeaders() {
      return [
        { label: this.t("onlystatusHeaderTable"), key: "status" },
        { label: this.t("cusNameHeaderTable"), key: "Customer Name" },
        { label: this.t("cusAddressHeaderTable"), key: "Customer Address" },
        { label: this.t("cusTelHeaderTable"), key: "Customer Tel" },
        { label: this.t("cusEmailHeaderTable"), key: "Customer Email" },
        { label: this.t("cusTaxHeaderTable"), key: "Customer Tax" },
        { label: this.t("cusPurchaseHeaderTable"), key: "Purchase by" },
      ];
    },
    tableHeaders2() {
      return [
        { label: this.t("onlystatusHeaderTable"), key: "status" },
        { label: this.t("cusNameHeaderTable2"), key: "Customer Name" },
        // { label: this.t("cusAddressHeaderTable2"), key: "Customer Address" },
        { label: this.t("cusTelHeaderTable2"), key: "Customer Tel" },
        { label: this.t("cusEmailHeaderTable2"), key: "Customer Email" },
        { label: this.t("cusCompany"), key: "Customer Company" },
      ];
    },
    filteredCustomer() {
      let filteredCus = [...this.Customers];
      // กรองข้อมูล Categories โดยเปรียบเทียบกับ searchQuery
      // if (this.formData.status) {
      //   filteredCus = filteredCus.filter(
      //     (cus) =>
      //       cus.status.toLowerCase() === this.formData.status.toLowerCase()
      //   );
      // }

      if (this.searchQuery.trim()) {
        filteredCus = filteredCus.filter((cus) =>
          cus["Customer Name"]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }

      filteredCus.forEach((cus) => {
        const lang = this.t("headerLang");

        if (lang === "TH") {
          if (cus.status === "Active" || cus.status === "active") {
            cus.status = "เปิดใช้งาน";
          } else if (
            cus.status === "Not Active" ||
            cus.status === "not active"
          ) {
            cus.status = "ปิดใช้งาน";
          }
        } else {
          // กรณีภาษาอังกฤษหรือภาษาอื่นๆ อยากแสดงกลับเป็น status เดิม (กรณีมีการแปลงไปแล้ว)
          if (cus.status === "เปิดใช้งาน" || cus.status === "active") {
            cus.status = "Active";
          } else if (
            cus.status === "ปิดใช้งาน" ||
            cus.status === "not active"
          ) {
            cus.status = "Not Active";
          }
        }
      });

      // กรองจาก dropDownStatus
      if (this.selectedType === "A") {
        if (this.dropDownStatus === "active") {
          filteredCus = filteredCus.filter(
            (cus) =>
              cus.status.toLowerCase() === "active" ||
              cus.status.toLowerCase() === "เปิดใช้งาน"
          );
        } else if (this.dropDownStatus === "not_active") {
          filteredCus = filteredCus.filter(
            (cus) =>
              cus.status.toLowerCase() === "not active" ||
              cus.status.toLowerCase() === "ปิดใช้งาน"
          );
        }
      }
      return filteredCus; // ถ้าไม่มีการค้นหาแสดงทั้งหมด
    },
    filteredCompany() {
      let filteredCus = [...this.CompanyPerson];
      // console.log("filteredCus__>", filteredCus);
      // กรองข้อมูล Categories โดยเปรียบเทียบกับ searchQuery

      filteredCus.forEach((cus) => {
        const lang = this.t("headerLang");

        if (lang === "TH") {
          if (cus.status === "Active" || cus.status === "active") {
            cus.status = "เปิดใช้งาน";
          } else if (
            cus.status === "Not Active" ||
            cus.status === "not active"
          ) {
            cus.status = "ปิดใช้งาน";
          }
        } else {
          // กรณีภาษาอังกฤษหรือภาษาอื่นๆ อยากแสดงกลับเป็น status เดิม (กรณีมีการแปลงไปแล้ว)
          if (cus.status === "เปิดใช้งาน" || cus.status === "active") {
            cus.status = "Active";
          } else if (
            cus.status === "ปิดใช้งาน" ||
            cus.status === "not active"
          ) {
            cus.status = "Not Active";
          }
        }
      });

      if (this.dropDownStatus === "active") {
        filteredCus = filteredCus.filter(
          (cus) =>
            cus.status.toLowerCase() === "active" ||
            cus.status.toLowerCase() === "เปิดใช้งาน"
        );
      } else if (this.dropDownStatus === "not_active") {
        filteredCus = filteredCus.filter(
          (cus) =>
            cus.status.toLowerCase() === "not active" ||
            cus.status.toLowerCase() === "ปิดใช้งาน"
        );
      }

      if (this.searchQuery.trim()) {
        filteredCus = filteredCus.filter((cus) =>
          cus["Customer Name"]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }
      // console.log("filteredCus", filteredCus);
      // // กรองจาก dropDownStatus
      // if (this.dropDownStatus === "active") {
      //   filteredCus = filteredCus.filter(
      //     (cus) => cus.status.toLowerCase() === "active"
      //   );
      // } else if (this.dropDownStatus === "not_active") {
      //   filteredCus = filteredCus.filter(
      //     (cus) => cus.status.toLowerCase() === "not active"
      //   );
      // }
      // console.log("filteredCus", filteredCus);
      // console.log(filteredCus);
      return filteredCus; // ถ้าไม่มีการค้นหาแสดงทั้งหมด
    },
  },
  methods: {
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    async EditCustomer2() {
      const accessToken = localStorage.getItem("@accessToken");
      // Validate if required fields are filled
      if (!(await this.validateFormData2())) return;
      this.errorMessages = [];

      this.isLoading = true; // Set loading state
      const cusID = this.formDataCustomer.company_person_id;
      try {
        const response = await fetch(
          `${API_CALL}/Quotation/editCustomer2/${cusID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(this.formDataCustomer),
          }
        );
        const json = await response.json();
        console.log(json);

        if (json.statusCode === 200) {
          this.getCustomer(); // Refresh customer list
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup2(); // Close the popup
        } else {
          // if (json.data.includes("tax")) {
          //   this.errorMessages.push(this.$t("validation.cus_tax_already"));
          //   this.isEmpty.cus_tax = true;
          // } else if (json.data.includes("Customer")) {
          //   this.errorMessages.push(this.$t("validation.cus_name_already"));
          //   this.isEmpty.cus_name = true;
          // }
          // this.showPopup_error(json.data);
          // console.log("Edit customer error:", json);
        }
      } catch (error) {
        console.error("Error editing customer:", error);
      } finally {
        this.isLoading = false; // Reset loading state
      }
    },
    setTabCompany(type) {
      this.selectedType = type;
      this.getCustomer();
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email); // Return true if email is valid
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // Allow only numbers
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    async validateFormData2() {
      this.isEmpty2.company_person_address = false;
      this.isEmpty2.company_person_email = false;
      this.isEmpty2.company_person_name = false;
      this.isEmpty2.company_person_tel = false;
      this.isEmpty2.cus_name = false;

      const errorMessages = [];

      if (this.formDataCustomer.company_person_name.trim() === "") {
        this.isEmpty2.company_person_name = true;
        errorMessages.push(this.$t("validation.company_person_name"));
      }

      // if (this.formDataCustomer.company_person_address.trim() === "") {
      //   this.isEmpty2.company_person_address = true;
      //   errorMessages.push(this.$t("validation.company_person_address"));
      // }

      if (this.formDataCustomer.company_person_tel.trim() === "") {
        this.isEmpty2.company_person_tel = true;
        errorMessages.push(this.$t("validation.company_person_tel"));
      } else if (
        this.formDataCustomer.company_person_tel.length !== 9 &&
        this.formDataCustomer.company_person_tel.length !== 10
      ) {
        this.isEmpty2.company_person_tel = true;
        errorMessages.push(this.$t("validation.cus_tel_length"));
      }

      if (this.formDataCustomer.company_person_email.trim() === "") {
        this.isEmpty2.company_person_email = true;
        errorMessages.push(this.$t("validation.company_person_email"));
      } else if (
        !this.validateEmail(this.formDataCustomer.company_person_email)
      ) {
        this.isEmpty2.company_person_email = true;
        errorMessages.push(this.$t("validation.company_person_email2"));
      }

      if (this.formDataCustomer.company_person_customer === "") {
        this.isEmpty2.company_person_customer = true;
        errorMessages.push(this.$t("validation.company_person_customer"));
      }

      if (errorMessages.length > 0) {
        this.showPopup_validate(errorMessages);
        return false;
      } else {
        return true;
      }
    },
    async validateFormData() {
      this.isEmpty.cus_name = false;
      this.isEmpty.cus_address = false;
      this.isEmpty.cus_tel = false;
      this.isEmpty.cus_email = false;
      this.isEmpty.cus_purchase = false;
      this.isEmpty.cus_tax = false;

      const errorMessages = [];

      if (this.formData.cus_name.trim() === "") {
        this.isEmpty.cus_name = true;
        errorMessages.push(this.$t("validation.cus_name"));
      }

      if (this.formData.cus_address.trim() === "") {
        this.isEmpty.cus_address = true;
        errorMessages.push(this.$t("validation.cus_address"));
      }

      if (this.formData.cus_tel.trim() === "") {
        this.isEmpty.cus_tel = true;
        errorMessages.push(this.$t("validation.cus_tel"));
      } else if (
        this.formData.cus_tel.length !== 10 &&
        this.formData.cus_tel.length !== 9
      ) {
        this.isEmpty.cus_tel = true;
        errorMessages.push(this.$t("validation.cus_tel_length"));
      }

      if (this.formData.cus_email.trim() === "") {
        this.isEmpty.cus_email = true;
        errorMessages.push(this.$t("validation.cus_email"));
      } else if (!this.validateEmail(this.formData.cus_email)) {
        this.isEmpty.cus_email = true;
        errorMessages.push(this.$t("validation.cus_email2"));
      }

      if (this.formData.cus_tax.trim() === "") {
        this.isEmpty.cus_tax = true;
        errorMessages.push(this.$t("validation.cus_tax"));
      } else if (this.formData.cus_tax.length !== 13) {
        this.isEmpty.cus_tax = true;
        errorMessages.push(this.$t("validation.cus_tax_length"));
      }

      if (this.formData.cus_purchase.trim() === "") {
        this.isEmpty.cus_purchase = true;
        errorMessages.push(this.$t("validation.cus_purchase"));
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
    // Open the popup for adding a new customer
    async openPopup() {
      if (this.selectedType === "A") {
        this.isPopupOpen = true;
      } else {
        this.isPopupOpen2 = true;

        this.formDataCustomer = {
          // Data model for customer frm
          company_person_id: "",
          company_person_name: "",
          company_person_address: "",
          company_person_tel: "",
          company_person_email: "",
          company_person_customer: "",
        };
        const response = await fetch(`${API_CALL}/Quotation/getCustomer`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        this.CustomerDropown = json.data;
      }
      this.isAddingMode = true; // Add mode
      this.isEditMode = false; // Disable edit mode
    },
    // Close the popup and reset form data
    closePopup2() {
      this.isPopupOpen2 = false;
      this.isPopupVisible_error = false;
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        // Reset form data
        cus_id: "",
        cus_name: "",
        cus_address: "",
        cus_tel: "",
        cus_email: "",
        cus_tax: "",
        cus_purchase: "",
        status: "",
      };
      this.isEmpty.cus_name = false;
      this.isEmpty.cus_address = false;
      this.isEmpty.cus_tel = false;
      this.isEmpty.cus_email = false;
      this.isEmpty.cus_purchase = false;
      this.isEmpty.cus_tax = false;

      this.category_file = ""; // Reset file input
      this.inputError = false; // Reset validation error state
      this.isPopupVisible_error = false;
    },
    // Close the delete confirmation popup
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    // Open the popup in edit mode and pre-fill the form with selected customer data
    handleEdit(item) {
      console.log("Edit item:", item);
      this.isPopupOpen = true;
      this.isAddingMode = false; // Disable add mode
      this.isEditMode = true; // Enable edit mode
      this.formData = {
        // Populate form with selected customer data
        cus_id: item.ID,
        status: item.status,
        cus_name: item["Customer Name"],
        cus_address: item["Customer Address"],
        cus_tel: item["Customer Tel"],
        cus_email: item["Customer Email"],
        cus_tax: item["Customer Tax"],
        cus_purchase: item["Purchase by"],
      };
    },
    async handleEdit2(item) {
      console.log("Edit item:", item);
      this.isPopupOpen2 = true;
      this.isAddingMode = false; // Disable add mode
      this.isEditMode = true; // Enable edit mode

      // หา id จาก CustomerDropown โดยใช้ชื่อ
      const response = await fetch(`${API_CALL}/Quotation/getCustomer`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();

      this.CustomerDropown = json.data;
      const customer = this.CustomerDropown.find(
        (customer) => customer.cus_name === item["Customer Company"]
      );

      this.formDataCustomer = {
        // Data model for customer form
        company_person_id: item.ID,
        company_person_name: item["Customer Name"],
        company_person_address: item["Customer Address"],
        company_person_tel: item["Customer Tel"],
        company_person_email: item["Customer Email"],
        company_person_customer: customer ? customer.cus_id : null,
      };
    },
    // Open the delete confirmation popup and store the customer ID to be deleted
    handleDelete(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formData = {
        cus_id: item.ID,
      };
      this.formDataCustomer = {
        company_person_id: item.ID,
      };
    },
    // Show success message popup
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false; // Auto-hide after 2 seconds
      }, 2000);
    },
    // Show error message popup
    showPopup_error(message) {
      this.popupMessage_error = message;

      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible_error = false; // Auto-hide after 2 seconds
      }, 2000);
    },
    // Validate email format using regular expression
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    // Import customer data from a CSV file
    async importCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true; // Set loading state
      try {
        const formDataFile = new FormData();
        formDataFile.append("file", this.category_file);

        const response = await fetch(`${API_CALL}/migrate/importcsv`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataFile,
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getCustomer(); // Refresh customer list
          console.log("Category imported successfully");
          this.category_file = ""; // Reset file input
        } else {
          console.log("Import category error:", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false; // Reset loading state
      }
    },
    // Fetch the list of customers from the API
    async getCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true; // Set loading state
      try {
        const response = await fetch(`${API_CALL}/Quotation/getCustomer`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        console.log("json", json);

        if (json.statusCode === 200) {
          // Map API response data to the expected table structure
          if (this.selectedType === "A") {
            this.CompanyPerson = [];
            this.Customers = json.data.map((item) => {
              let initialTableData = {
                ID: item.cus_id,
                status: item.Status,
                "Customer Name": item.cus_name,
                "Customer Address": item.cus_address,
                "Customer Tel": item.cus_tel,
                "Customer Email": item.cus_email,
                "Customer Tax": item.cus_tax,
                "Purchase by": item.cus_purchase,
              };
              return initialTableData;
            });
          } else {
            this.Customers = [];
            const response = await fetch(
              `${API_CALL}/Quotation/getCompanyPerson`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const json = await response.json();
            console.log(json);
            this.CompanyPerson = json.data
              // .filter((item) => item.company_person_status === "active") // กรองเฉพาะสถานะ active
              .map((item) => {
                let initialTableData = {
                  ID: item.company_person_id,
                  status: item.company_person_status,
                  "Customer Name": item.company_person_name,
                  // "Customer Address": item.company_person_address,
                  "Customer Tel": item.company_person_tel,
                  "Customer Email": item.company_person_email,
                  "Customer Company": item.cus_name,
                };
                return initialTableData;
              });
          }
        } else {
          this.showPopup_error(json.data); // Show error message
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false; // Reset loading state
      }
    },
    // Add a new customer via an API call, with form validation
    async addCustomer2() {
      const accessToken = localStorage.getItem("@accessToken");
      // await this.validateFormData();
      // alert(this.errorMessages.length);

      // this.isLoading = true;
      // this.errorMessages = [];
      if (!(await this.validateFormData2())) return;
      // this.errorMessages = [];
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/addCustomer2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(this.formDataCustomer),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.isPopupVisible_error = false;
          this.getCustomer(); // Refresh customer list
          this.showPopup(this.$t("validation.AddSucc"));
          this.formDataCustomer = {
            // Reset form data
            company_person_id: "",
            company_person_name: "",
            company_person_address: "",
            company_person_tel: "",
            company_person_email: "",
            company_person_customer: "",
          };
          this.isPopupOpen2 = false; // Close the popup
        }
      } catch (error) {
        console.error("Error adding customer:", error);
      } finally {
        this.isLoading = false; // Reset loading state
      }
      // }
    },
    async addCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      // await this.validateFormData();
      // alert(this.errorMessages.length);

      // this.isLoading = true;
      // this.errorMessages = [];
      if (!(await this.validateFormData())) return;
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/addCustomer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(this.formData),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.isPopupVisible_error = false;
          this.getCustomer(); // Refresh customer list
          this.showPopup(this.$t("validation.AddSucc"));
          this.formData = {
            // Reset form data
            cus_id: "",
            cus_name: "",
            cus_address: "",
            cus_tel: "",
            cus_email: "",
            cus_tax: "",
            cus_purchase: "",
            status: "",
          };
          this.isPopupOpen = false; // Close the popup
        } else {
          this.errorMessages = [];
          if (json.data.includes("tax")) {
            this.errorMessages.push(this.$t("validation.cus_tax_already"));
            this.isEmpty.cus_tax = true;
          } else if (json.data.includes("Contact")) {
            this.errorMessages.push(this.$t("validation.cus_name_Contact"));
            this.isEmpty.cus_tel = true;
          } else if (json.data.includes("Customer")) {
            this.errorMessages.push(this.$t("validation.cus_name_already"));
            this.isEmpty.cus_name = true;
          }
          this.showPopup_error(json.data);
          console.log("Add customer error:", json);
        }
      } catch (error) {
        console.error("Error adding customer:", error);
      } finally {
        this.isLoading = false; // Reset loading state
      }
      // }
    },
    // Edit an existing customer via an API call, with form validation
    async editCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      // Validate if required fields are filled
      if (!(await this.validateFormData())) return;
      this.errorMessages = [];

      this.isLoading = true; // Set loading state
      const cusID = this.formData.cus_id;
      try {
        const response = await fetch(
          `${API_CALL}/Quotation/editCustomer/${cusID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(this.formData),
          }
        );
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getCustomer(); // Refresh customer list
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup(); // Close the popup
        } else {
          if (json.data.includes("tax")) {
            this.errorMessages.push(this.$t("validation.cus_tax_already"));
            this.isEmpty.cus_tax = true;
          } else if (json.data.includes("Contact")) {
            this.errorMessages.push(this.$t("validation.cus_name_Contact"));
            this.isEmpty.cus_tel = true;
          } else if (json.data.includes("Customer")) {
            this.errorMessages.push(this.$t("validation.cus_name_already"));
            this.isEmpty.cus_name = true;
          }
          this.showPopup_error(json.data);
          console.log("Edit customer error:", json);
        }
      } catch (error) {
        console.error("Error editing customer:", error);
      } finally {
        this.isLoading = false; // Reset loading state
      }
      // }
    },
    // Delete a customer via an API call
    async deleteCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      let cusID = null;
      this.isLoading = true;

      try {
        // กำหนด cusID ตามประเภท
        if (this.selectedType === "A") {
          cusID = this.formData.cus_id;
        } else {
          cusID = this.formDataCustomer.company_person_id;
        }

        // สร้าง URL ตามประเภท
        const endpoint =
          this.selectedType === "A"
            ? `${API_CALL}/Quotation/deleteCustomer/${cusID}`
            : `${API_CALL}/Quotation/deleteCustomer2/${cusID}`;

        // ส่งคำขอลบ
        const response = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete customer.");
        }

        const json = await response.json();

        if (json.statusCode === 200) {
          this.Customers = this.Customers.filter(
            (item) => item.cus_id !== cusID
          );
          this.getCustomer();
          this.showPopup(this.$t("validation.DelateSucc"));
          this.closeDeleteConfirmPopup();
        } else {
          this.showPopup(this.$t("validation.DelateFail"));
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        this.showPopup(this.$t("validation.ErrorOccurred"));
      } finally {
        this.isLoading = false; // Reset loading state
      }
    },
  },
  // Fetch the customer list when the component is created
  created() {
    this.setTabCompany("A");
    this.getCustomer();
  },
};
</script>
