<template>
  <div class="main-page">
    <div class="page-body">
      <div class="mb-4">
        <h2 v-if="this.selectedType === 'B'">{{ t("tapcustomerPart") }}</h2>
        <h2 v-if="this.selectedType === 'A'">{{ t("headerCustomer2") }}</h2>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <div class="mb-3 btn-group btn-group-size custome-tab">
          <Button
            :customClass="
              'btn btn-primary' + (selectedType === 'A' ? ' active' : '')
            "
            @click="setTabCompany('A')"
          >
            {{ t("Company") }}
          </Button>
          <Button
            :customClass="
              'btn btn-primary' + (selectedType === 'B' ? ' active' : '')
            "
            @click="setTabCompany('B')"
          >
            {{ t("Customer") }}
          </Button>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4 col-sm-4 col-md-2 col-lg-2">
          <Dropdown
            v-if="selectedType === 'A' || selectedType === 'B'"
            v-model="dropDownStatus"
            :options="statusOptions"
            :placeholder="t('filter')"
            class="size-font-sm"
          />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <TextField
            v-model="searchQuery"
            type="text"
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
   <div v-for="field in companyFieldConfig" :key="field.key" class="mb-3">
    <label class="col-sm-5 col-md-6">
        <span v-if="field.required" style="color: red">*</span>{{ t(field.label) }}
    </label>
    <TextField
        v-model="formData[field.key]"
        :type="field.type"
        :error="isEmpty[field.key]"
        :maxlength="field.maxlength"
        @keypress="field.isNumeric ? validateInput($event) : null"
    />
  </div>
      <div class="modal-footer">
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
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
        </Button>
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
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
        </Button>
        <Button customClass="btn btn-secondary" @click="closePopup">
          {{ t("buttonCancel") }}
        </Button>
      </div>
    </Popup>
    <Popup :isOpen="isPopupOpen2" :closePopup="closePopup2">
      <h2 style="padding: 0px" v-if="isAddingMode">
        {{ t("headerPopupEditCustomer3") }}
      </h2>
      <h2 style="padding: 0px" v-if="isEditMode">
        {{ t("headerPopupEditCustomer2") }}
      </h2>
   <div v-for="field in customerFieldConfig" :key="field.key" class="mb-3">
    <label class="col-sm-5 col-md-6">
        <span v-if="field.required" style="color: red">*</span>{{ t(field.label) }}
    </label>
    <div style="display: inline-block; width: 50%;">
      <Dropdown
          v-if="field.componentType === 'Dropdown'"
          v-model="formDataCustomer[field.key]"
          :options="companyOptions"
          :error="isEmpty2[field.key]"
      />
      <TextField
          v-else
          v-model="formDataCustomer[field.key]"
          :type="field.type"
          :error="isEmpty2[field.key]"
          :maxlength="field.maxlength"
          @keypress="field.isNumeric ? validateInput($event) : null"
      />
    </div>
  </div>
      <div class="modal-footer">
        <Button
          v-if="this.isEditMode"
          customClass="btn btn-primary me-3"
          @click="EditCustomer2"
        >
          Save
        </Button>
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addCompany"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonAdd") }}</span>
        </Button>
        <Button customClass="btn btn-secondary" @click="closePopup2">
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
          <Button
            :disabled="isLoading"
            customClass="btn btn-danger me-3"
            @click="deleteCustomer"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t("buttonDelete") }}</span>
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
import CategoryList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import Button from "../components/button.vue"; // 1. นำเข้า component
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import { computed, watch, ref } from "vue";
import Dropdown from "../components/dropdown.vue";
import TextField from "../components/textField.vue";
import customerForms from '../config/field_config/customer/form_customer.json';


const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Customer",
  components: {
    Navigate,
    CategoryList,
    Popup,
    Button, // 2. ลงทะเบียน component
    Dropdown,
    TextField
  },
  setup() {
    const { t } = useI18n();

    const documentName2 = computed(() => t("dontHaveCompany"));
    const documentName = computed(() => t("dontHaveCustomerCompany"));
    return { t, documentName, documentName2 };
  },
  data() {
    return {
      companyFieldConfig: customerForms.company,
      customerFieldConfig: customerForms.contactPerson,
      dropDownStatus: "",
      CustomerDropown: [],
      CompanyPerson: [],
      selectedType: "",
      category_file: "",
      errorMessages: [],
      isPopupVisible_error: false,
      Customers: [],
      isPopupOpen: false,
      isPopupOpen2: false,
      isDeleteConfirmPopupOpen: false,
      isLoading: false,
      isPopupVisible: false,
      inputValue: "",
      inputError: false,
      formData: {
        customer_id: "",
        customer_name: "",
        customer_address: "",
        customer_tel: "",
        cus_email: "",
        cus_tax: "",
        cus_purchase: "",
        status: "active",
      },
      formDataCustomer: {
        company_person_id: "",
        company_person_name: "",
        company_person_address: "",
        company_person_tel: "",
        company_person_email: "",
        company_person_customer: "",
      },
      isEmpty2: {
        company_person_id: "",
        company_person_name: false,
        company_person_address: false,
        company_person_tel: false,
        company_person_email: false,
        company_person_customer: false,
      },
      isEmpty: {
        customer_id: "",
        customer_name: false,
        customer_address: false,
        customer_tel: false,
        cus_email: false,
        cus_tax: false,
        cus_purchase: false,
        status: "active",
      },
      searchQuery: "",
    };
  },
  computed: {
    statusOptions() {
      return [
        { value: "active", text: this.t("statusActive") },
        { value: "not_active", text: this.t("statusNotActive") },
      ];
    },
    companyOptions() {
      if (!this.CustomerDropown) return [];
      return this.CustomerDropown.map((customer) => ({
        value: customer.customer_id,
        text: customer.customer_name,
      }));
    },
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
        { label: this.t("cusTelHeaderTable2"), key: "Customer Tel" },
        { label: this.t("cusEmailHeaderTable2"), key: "Customer Email" },
        { label: this.t("cusCompany"), key: "Customer Company" },
      ];
    },
    filteredCustomer() {
      let filteredCus = [...this.Customers];

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
      return filteredCus;
    },
    filteredCompany() {
      let filteredCus = [...this.CompanyPerson];

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
      return filteredCus;
    },
  },
  methods: {
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    async EditCustomer2() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData2())) return;
      this.errorMessages = [];

      this.isLoading = true;
      const cusID = this.formDataCustomer.company_person_id;
      try {
        const response = await fetch(
          `${API_CALL}/Quotation/editCompany/${cusID}`,
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
          this.getCustomer();
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup2();
        }
      } catch (error) {
        console.error("Error editing customer:", error);
      } finally {
        this.isLoading = false;
      }
    },
    setTabCompany(type) {
      this.selectedType = type;
      this.getCustomer();
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    async validateFormData2() {
      this.isEmpty2.company_person_address = false;
      this.isEmpty2.company_person_email = false;
      this.isEmpty2.company_person_name = false;
      this.isEmpty2.company_person_tel = false;
      this.isEmpty2.customer_name = false;

      const errorMessages = [];

      if (this.formDataCustomer.company_person_name.trim() === "") {
        this.isEmpty2.company_person_name = true;
        errorMessages.push(this.$t("validation.company_person_name"));
      }

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
      this.isEmpty.customer_name = false;
      this.isEmpty.customer_address = false;
      this.isEmpty.customer_tel = false;
      this.isEmpty.cus_email = false;
      this.isEmpty.cus_purchase = false;
      this.isEmpty.cus_tax = false;

      const errorMessages = [];

      if (this.formData.customer_name.trim() === "") {
        this.isEmpty.customer_name = true;
        errorMessages.push(this.$t("validation.cus_name"));
      }

      if (this.formData.customer_address.trim() === "") {
        this.isEmpty.customer_address = true;
        errorMessages.push(this.$t("validation.cus_address"));
      }

      if (this.formData.customer_tel.trim() === "") {
        this.isEmpty.customer_tel = true;
        errorMessages.push(this.$t("validation.cus_tel"));
      } else if (
        this.formData.customer_tel.length !== 10 &&
        this.formData.customer_tel.length !== 9
      ) {
        this.isEmpty.customer_tel = true;
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
        this.errorMessages = messages;
        this.isPopupVisible_error = true;
      } else {
        this.showPopup_error(messages);
      }
    },
    async openPopup() {
      if (this.selectedType === "A") {
        this.isPopupOpen = true;
      } else {
        this.isPopupOpen2 = true;

        this.formDataCustomer = {
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
      this.isAddingMode = true;
      this.isEditMode = false;
    },
    closePopup2() {
      this.isPopupOpen2 = false;
      this.isPopupVisible_error = false;
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        customer_id: "",
        customer_name: "",
        customer_address: "",
        customer_tel: "",
        cus_email: "",
        cus_tax: "",
        cus_purchase: "",
        status: "",
      };
      this.isEmpty.customer_name = false;
      this.isEmpty.customer_address = false;
      this.isEmpty.customer_tel = false;
      this.isEmpty.cus_email = false;
      this.isEmpty.cus_purchase = false;
      this.isEmpty.cus_tax = false;

      this.category_file = "";
      this.inputError = false;
      this.isPopupVisible_error = false;
    },
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    handleEdit(item) {
      console.log("Edit item:", item);
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formData = {
        customer_id: item.ID,
        status: item.status,
        customer_name: item["Customer Name"],
        customer_address: item["Customer Address"],
        customer_tel: item["Customer Tel"],
        cus_email: item["Customer Email"],
        cus_tax: item["Customer Tax"],
        cus_purchase: item["Purchase by"],
      };
    },
    async handleEdit2(item) {
      console.log("Edit item:", item);
      this.isPopupOpen2 = true;
      this.isAddingMode = false;
      this.isEditMode = true;

      const response = await fetch(`${API_CALL}/Quotation/getCustomer`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();

      this.CustomerDropown = json.data;
      const customer = this.CustomerDropown.find(
        (customer) => customer.customer_name === item["Customer Company"]
      );

      this.formDataCustomer = {
        company_person_id: item.ID,
        company_person_name: item["Customer Name"],
        company_person_address: item["Customer Address"],
        company_person_tel: item["Customer Tel"],
        company_person_email: item["Customer Email"],
        company_person_customer: customer ? customer.customer_id : null,
      };
    },
    handleDelete(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formData = {
        customer_id: item.ID,
      };
      this.formDataCustomer = {
        company_person_id: item.ID,
      };
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

      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible_error = false;
      }, 2000);
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    async importCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
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
          this.getCustomer();
          console.log("Category imported successfully");
          this.category_file = "";
        } else {
          console.log("Import category error:", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getCustomer`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        console.log("json", json);

        if (json.statusCode === 200) {
          if (this.selectedType === "A") {
            this.CompanyPerson = [];
            this.Customers = json.data.map((item) => {
              let initialTableData = {
                ID: item.customer_id,
                customer_status: item.customer_status,
                "Customer Name": item.customer_name,
                "Customer Address": item.customer_address,
                "Customer Tel": item.customer_tel,
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
            this.CompanyPerson = json.data.map((item) => {
              let initialTableData = {
                ID: item.company_person_id,
                status: item.company_person_status,
                "Customer Name": item.company_person_name,
                "Customer Tel": item.company_person_tel,
                "Customer Email": item.company_person_email,
                "Customer Company": item.customer_name,
              };
              return initialTableData;
            });
          }
        } else {
          this.showPopup_error(json.data);
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async addCompany() {
      const accessToken = localStorage.getItem("@accessToken");

      if (!(await this.validateFormData2())) return;
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/addCompany`, {
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
          this.getCustomer();
          this.showPopup(this.$t("validation.AddSucc"));
          this.formDataCustomer = {
            company_person_id: "",
            company_person_name: "",
            company_person_address: "",
            company_person_tel: "",
            company_person_email: "",
            company_person_customer: "",
          };
          this.isPopupOpen2 = false;
        }
      } catch (error) {
        console.error("Error adding customer:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async addCustomer() {
      const accessToken = localStorage.getItem("@accessToken");

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
          this.getCustomer();
          this.showPopup(this.$t("validation.AddSucc"));
          this.formData = {
            customer_id: "",
            customer_name: "",
            customer_address: "",
            customer_tel: "",
            cus_email: "",
            cus_tax: "",
            cus_purchase: "",
            status: "",
          };
          this.isPopupOpen = false;
        } else {
          this.errorMessages = [];
          if (json.data.includes("tax")) {
            this.errorMessages.push(this.$t("validation.cus_tax_already"));
            this.isEmpty.cus_tax = true;
          } else if (json.data.includes("Contact")) {
            this.errorMessages.push(this.$t("validation.cus_name_Contact"));
            this.isEmpty.customer_tel = true;
          } else if (json.data.includes("Customer")) {
            this.errorMessages.push(this.$t("validation.cus_name_already"));
            this.isEmpty.customer_name = true;
          }
          this.showPopup_error(json.data);
          console.log("Add customer error:", json);
        }
      } catch (error) {
        console.error("Error adding customer:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async editCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessages = [];

      this.isLoading = true;
      const cusID = this.formData.customer_id;
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
          this.getCustomer();
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup();
        } else {
          if (json.data.includes("tax")) {
            this.errorMessages.push(this.$t("validation.cus_tax_already"));
            this.isEmpty.cus_tax = true;
          } else if (json.data.includes("Contact")) {
            this.errorMessages.push(this.$t("validation.cus_name_Contact"));
            this.isEmpty.customer_tel = true;
          } else if (json.data.includes("Customer")) {
            this.errorMessages.push(this.$t("validation.cus_name_already"));
            this.isEmpty.customer_name = true;
          }
          this.showPopup_error(json.data);
          console.log("Edit customer error:", json);
        }
      } catch (error) {
        console.error("Error editing customer:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      let cusID = null;
      this.isLoading = true;

      try {
        if (this.selectedType === "A") {
          cusID = this.formData.customer_id;
        } else {
          cusID = this.formDataCustomer.company_person_id;
        }

        const endpoint =
          this.selectedType === "A"
            ? `${API_CALL}/Quotation/deleteCustomer/${cusID}`
            : `${API_CALL}/Quotation/deleteCompany/${cusID}`;

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
            (item) => item.customer_id !== cusID
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
        this.isLoading = false;
      }
    },
  },
  created() {
    this.setTabCompany("A");
    this.getCustomer();
  },
};
</script>
