<template>
  <div class="main-page">
    <div class="page-body">
      <div class="mb-4">
        <h2>{{ t("headerEmployee") }}</h2>
      </div>
      <div class="row mb-3">
        <div class="col-4 col-sm-4 col-md-2 col-lg-2">
          <select
            class="form-control form-select size-font-sm"
            v-model="dropDownStatus"
            aria-label="Status select"
            hidden
          >
            <option value="">{{ t("filter") }}</option>
            <option value="active">{{ t("statusActive") }}</option>
            <option value="not_active">{{ t("statusNotActive") }}</option>
          </select>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-5 col-sm-6 col-md-3 col-lg-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <div class="col-7 col-sm-6 col-md-9 col-lg-9 text-end">
          <a
            class="btn btn-success me-3 size-font-sm me-2"
            @click="openPopup"
            >{{ t("addEmployee") }}</a
          >
          <Button
            customClass="btn btn-outline-secondary mdi mdi-export-variant size-font-sm"
            @click="exportEmployee"
          ></Button>
        </div>
      </div>
      <div class="employee-show-only-desktop">
        <employeeList
          :initialTableData="filteredEmp"
          :tableHeaders="tableHeaders"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          v-if="employees"
          :isLoading="isLoading"
          :documentName="documentName"
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
  <div class="mb-3">
    <h2 v-if="isAddingMode">{{ t("headerPopupAddEmployee") }}</h2>
    <h2 v-if="isEditMode">{{ t("headerPopupEditEmployee") }}</h2>
  </div>

  <div v-for="field in fieldConfig" :key="field.key">
    <h5 v-if="field.componentType === 'heading'" style="text-decoration: underline" class="mt-3 mb-3">
      {{ t(field.label) }}
    </h5>

    <div v-else class="mb-3 div-for-formControl">
      <label class="col-sm-5 col-md-6">
        <span v-if="field.required" style="color: red">*</span>
        {{ t(field.label) }}
      </label>

      <div class="col-sm-9 col-md-6" style="display: inline-block; width: 50%;">
        <TextField
          v-if="field.componentType === 'TextField'"
          v-model="formData[field.key]"
          :type="field.type"
          :error="isEmpty[field.key]"
          :maxlength="field.maxlength"
          @keypress="field.isNumeric ? validateInput($event) : null"
        />

        <Dropdown
          v-if="field.componentType === 'Dropdown'"
          v-model="formData[field.key]"
          :error="isEmpty[field.key]"
          :options="getOptionsByKey(field.optionsKey)"
        />

        <v-date-picker
          v-if="field.componentType === 'DatePicker'"
          v-model="formData[field.key]"
          locale="th-TH"
          :format="formatDatePicker"
        >
          <template #default="{ inputEvents }">
            <input class="form-control" :value="formatDatePicker(formData[field.key])" v-on="inputEvents" :class="{ 'border-danger': isEmpty[field.key] }" />
          </template>
        </v-date-picker>

        <div v-if="(field.key === 'department_id' && Departments.length === 0) || (field.key === 'position_id' && Positions.length === 0)" class="text-danger mt-1">
          {{ field.key === 'department_id' ? t("pleaseDepartment") : t("pleasePosition") }}
        </div>
      </div>
    </div>
  </div>

  <div class="mb-3 modal-footer">
     <Button
    :disabled="isLoading"
    customClass="btn btn-primary me-3"
    v-if="isAddingMode"
    @click="addEmployee"
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
    @click="editEmployee"
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
        <div class="modal-footer mb-5">
          <Button customClass="btn btn-danger me-2" @click="deleteEmployee">
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
    <div class="delete-popup">
      <Popup
        :isOpen="isDeleteLeaveConfirmPopupOpen"
        :closePopup="closeDeleteLeaveConfirmPopup"
      >
        <div class="mb-5">
          <a>{{ t("deleteConfirmSentence") }}</a>
        </div>
        <div class="modal-footer mb-5">
          <Button customClass="btn btn-danger me-2" @click="deleteLeave">
            {{ t("buttonDelete") }}
          </Button>
          <Button
            customClass="btn btn-secondary"
            @click="closeDeleteLeaveConfirmPopup"
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
    <div v-if="isPopupVisible_error2" class="popup-error2">
      <div class="text-end">
        <Button
          type="button"
          customClass="btn-close"
          aria-label="Close"
          @click="closeErrorPopup2"
        />
      </div>
      <div class="popup-content-error2">
        <ul>
          <li v-for="(msg, index) in errorMessages2" :key="index">
            {{ msg }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import Navigate from "../components/Navigation.vue";
import employeeList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import Button from "../components/button.vue"; // 1. นำเข้า component
import { config } from "../../constant.js";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useI18n } from "vue-i18n";
import th from "vue-datepicker-next/locale/th.es";
import en from "vue-datepicker-next/locale/en.es";
import moment from "moment";
import Dropdown from "../components/Dropdown.vue";
import TextField from "../components/textField.vue";
import formConfig from '../config/field_config/employee/form_employee.json';
import monthMappings from '../config/global/month_mapping.json';

const API_CALL = config["url"];
const access_token = localStorage.getItem("@access_token");
export default {
  name: "Employee",
  components: {
    Navigate,
    employeeList,
    Popup,
    DatePicker,
    Button, // 2. ลงทะเบียน component
    Dropdown,
    TextField
  },
  setup() {
    const { t } = useI18n();
    const { locale } = useI18n();
    const lang = computed(() => t("lang"));
    const currentLocale = computed(() => {
      return {
        ...(locale.value === "th" ? th : en),
        yearFormat:
          locale.value === "en" ? moment().year() : moment().year() + 543,
      };
    });

    const momentFormat = computed(() => ({
      stringify: (date) => {
        if (!date) return "";
        const yearOffset = lang.value === "en" ? 543 : 0;
        return moment(date).add(yearOffset, "years").format("DD/MM/YYYY");
      },
      parse: (value) => {
        if (!value) return null;
        const yearOffset = lang.value === "en" ? 543 : 0;
        return moment(value, "DD/MM/YYYY")
          .subtract(yearOffset, "years")
          .toDate();
      },
      getWeek: (date) => {
        return moment(date).week();
      },
    }));

    const documentName = computed(() => t("dontHaveEmployee"));

    return {
      momentFormat,
      currentLocale,
      t,
      lang,
      documentName,
    };
  },
  data() {
    return {
      fieldConfig: formConfig,
      dropDownStatus: "active",
      errorMessages: [],
      errorMessages2: [],
      isPopupVisible_error: false,
      isPopupVisible_error2: false,
      isPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isDeleteLeaveConfirmPopupOpen: false,
      isPopupOpenLeave: false,
      isPopupOpenOvertime: false,
      isEditMode: false,
      EditIdLeaveHandle: "",
      employees: [],
      Departments: [],
      Positions: [],
      selectedMonthFilter: [],
      selectedYearFilter: [],
      isLoading: false,
      isPopupVisible: false,
      inputValue: "",
      inputError: false,
      Leaving: [],
      Overtimes: [],
      employeesSalaries: [],
      leaving_id: "",
      formData: {
        employee_id: "",
        title: "",
       first_name: "",
        last_name: "",
        address: "",
        birth_date: new Date(),
        national_id_number: "",
        phone_number: "",
        email: "",
        department_id: "",
        position_id: "",
        start_working_date: new Date(),
        salary: "",
        employee_type: "",
        bank_name: "",
        bank_account_id: "",
        positions: "",
        status: "active",
      },
      isEmpty: {
        employee_id: "",
        title: false,
       first_name: false,
        last_name: false,
        address: false,
        birth_date: false,
        national_id_number: false,
        phone_number: false,
        email: false,
        department_id: false,
        position_id: false,
        start_working_date: false,
        salary: false,
        employee_type: false,
        bank_name: false,
        bank_account_id: false,
        positions: false,
        status: "active",
      },
      formDataLeave: {
        ID: "",
        employee_id: "",
        detail: "",
        date: "",
        dateEnd: "",
      },
      formDataOvertime: {
        ID: "",
        employee_id: "",
        detail: "",
        date: "",
        hours: "",
      },
      years: this.generateYears(1900, 2100),
      searchQuery: "",
      searchQueryLeave: "",
    };
  },
  computed: {
    titleOptions() {
      return [
        { value: "Mr.", text: this.t("mister") },
        { value: "Mrs.", text: this.t("missis") },
        { value: "Miss", text: this.t("miss") },
      ];
    },
    employeeTypeOptions() {
      return [
        { value: "Full-time", text: this.t("fulltime") },
        { value: "Part-time", text: this.t("parttime") },
        { value: "Contract", text: this.t("contract") },
      ];
    },
    departmentOptions() {
      if (!this.Departments) return [];
      return this.Departments.map((dep) => ({
        value: dep.department_id,
        text: dep.department_name,
      }));
    },
    positionOptions() {
      if (!this.Positions) return [];
      return this.Positions.map((pos) => ({
        value: pos.position_id,
        text: pos.position_name,
      }));
    },
    employeeLeaveOptions() {
      if (!this.employeesSalaries) return [];
      return this.employeesSalaries.map((emp) => ({
        value: emp.ID,
        text: emp.Name,
      }));
    },
    leaveTypeOptions() {
      return [
        { value: "ลาป่วย", text: this.t("SickLeave") },
        { value: "ลากิจ", text: this.t("BusinessLeave") },
        { value: "ลาพักร้อน", text: this.t("AnnualLeave") },
        { value: "ลาคลอด", text: this.t("MaternityLeave") },
      ];
    },
    tableHeaders() {
      return [
        { label: this.t("titleHeaderTable"), key: "Title" },
        { label: this.t("employeeNameFirstandLastHeaderTable"), key: "Name" },
        { label: this.t("addressHeaderTable"), key: "address" },
        { label: this.t("birthdateHeaderTable"), key: "birth_date" },
        { label: this.t("NIDHeaderTable"), key: "National ID" },
        { label: this.t("telHeaderTable"), key: "Tel." },
        { label: this.t("emailHeaderTable"), key: "email" },
        {
          label: this.t("startworkingdateHeaderTable"),
          key: "Start Working Date",
        },
        { label: this.t("salaryHeaderTable"), key: "salary" },
        { label: this.t("emptypeHeaderTable"), key: "Emp. type" },
        { label: this.t("bankNameHeaderTable"), key: "Bank Name" },
        { label: this.t("bankaccHeaderTable"), key: "Bank Account ID" },
        { label: this.t("departNameHeaderTable"), key: "Department" },
        { label: this.t("positionHeaderTable"), key: "Position" },
        { label: this.t("onlystatusHeaderTable"), key: "status" },
      ];
    },
    tableHeadersLeave() {
      return [
        { label: this.t("employeeNameFirstandLastHeaderTable"), key: "Name" },
        { label: this.t("productDetailHeaderTable"), key: "detail" },
        { label: this.t("datepaysalaryHeaderTable"), key: "date" },
        { label: this.t("dateEnd"), key: "dateEnd" },
      ];
    },
    tableHeadersOvertime() {
      return [
        {
          label: this.t("employeeNameFirstandLastHeaderTable"),
          key: "employee_id",
        },
        { label: this.t("productDetailHeaderTable"), key: "detail" },
        { label: this.t("datepaysalaryHeaderTable"), key: "date" },
        { label: this.t("hours"), key: "hours" },
      ];
    },
    filteredEmp() {
      let filteredEmployees = [...this.employees];
      console.log("filteredEmployees");
      console.log(filteredEmployees);

      const monthMapping = monthMappings.eng_to_th;

      const titleMapping = {
        Miss: "นางสาว",
        "Mr.": "นาย",
        "Mrs.": "นาง",
      };

      if (this.t("headerLang") === "TH") {
        console.log("filteredEmployees++", filteredEmployees);
        filteredEmployees = filteredEmployees.map((emp) => ({
          ...emp,
          birth_date: emp.birth_date
            ? String(emp.birth_date)
                .replace(
                  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
                  (match) => monthMapping[match]
                )
                .replace(/(\d{4})/, (match) =>
                  (parseInt(match) + 543).toString()
                )
            : "",
          ["Start Working Date"]: String(emp["Start Working Date"])
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()),

          Title: titleMapping[emp.Title] || emp.Title,
        }));
      }

      if (this.searchQuery.trim()) {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp["Name"]
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            emp["position_name"]
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        );
      }
      filteredEmployees.forEach((cus) => {
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
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.status.toLowerCase() === "active" ||
            emp.status.toLowerCase() === "เปิดใช้งาน"
        );
      } else if (this.dropDownStatus === "not_active") {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.status.toLowerCase() === "not active" ||
            emp.status.toLowerCase() === "ปิดใช้งาน"
        );
      }

      return filteredEmployees;
    },
    filteredleave() {
      let filteredLeaving = [...this.Leaving];

      if (this.searchQueryLeave.trim()) {
        filteredLeaving = filteredLeaving.filter((emp) =>
          emp["Name"]
            .toLowerCase()
            .includes(this.searchQueryLeave.toLowerCase())
        );
      }

      if (this.t("headerLang") === "TH") {
        const monthMapping = monthMappings.eng_to_th;

        filteredLeaving = filteredLeaving.map((sale) => ({
          ...sale,
          date: String(sale.date)
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()),

          dateEnd: String(sale.dateEnd)
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()),
        }));
      }

      return filteredLeaving;
    },
  },
  methods: {
        getOptionsByKey(key) {
        switch (key) {
            case 'titleOptions':
                return this.titleOptions;
            case 'employeeTypeOptions':
                return this.employeeTypeOptions;
            case 'departmentOptions':
                return this.departmentOptions;
            case 'positionOptions':
                return this.positionOptions;
            default:
                return [];
        }
    },
     getDropdownOptions(key) {
    switch (key) {
      case 'title':
        return this.titleOptions;
      case 'employee_type':
        return this.employeeTypeOptions;
      case 'department_id':
        return this.departmentOptions;
      case 'position_id':
        return this.positionOptions;
      default:
        return [];
    }
  },
    formatDatePicker(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const buddhistYear = d.getFullYear() + 543;

      return `${day}/${month}/${buddhistYear}`;
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    closeErrorPopup2() {
      this.isPopupVisible_error2 = false;
    },
    generateYears(start, end) {
      const years = [];
      for (let year = start; year <= end; year++) {
        years.push(year);
      }
      return years;
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    disabledBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let inputDate = new Date(date);
      if (inputDate.getFullYear() > 2500) {
        inputDate.setFullYear(inputDate.getFullYear() - 543);
      }
      return inputDate > today;
    },
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
      const currentDate = new Date();
      this.formData.birth_date =
        this.t("lang") === "en"
          ? new Date(
              new Date(currentDate).setFullYear(currentDate.getFullYear())
            )
          : currentDate;
      this.formData.start_working_date =
        this.t("lang") === "en"
          ? new Date(
              new Date(currentDate).setFullYear(currentDate.getFullYear())
            )
          : currentDate;
    },
    openPopupLeave() {
      this.isPopupOpenLeave = true;
      this.isEditMode = false;
      const currentDate = new Date();
      this.formDataLeave.date =
        this.t("lang") === "en"
          ? new Date(
              new Date(currentDate).setFullYear(currentDate.getFullYear())
            )
          : currentDate;
      this.formDataLeave.dateEnd = (() => {
        let newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        if (this.t("lang") === "en") {
          newDate.setFullYear(newDate.getFullYear());
        }
        return newDate;
      })();
    },
    openPopupLeaveEdit(item) {
      console.log(item);
      this.isPopupOpenLeave = true;
      this.isEditMode = true;
      this.EditIdLeaveHandle = item.ID;
      this.formDataLeave.ID = item.ID;
      const employee = this.employees.find((emp) => emp.Name === item.Name);
      this.formDataLeave.employee_id = employee.ID;
      this.formDataLeave.detail = item.detail;
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        if (this.t("lang") === "en") {
          d.setFullYear(d.getFullYear());
        }
        return d;
      };
      const filteredLevea = this.Leaving.filter((emp) => emp.ID === item.ID);
      const formattedDateStart = formatDateForPicker(filteredLevea[0]["date"]);
      const formattedDateEnd = formatDateForPicker(filteredLevea[0]["dateEnd"]);
      this.formDataLeave.date = formattedDateStart;
      this.formDataLeave.dateEnd = formattedDateEnd;
    },
    openPopupOvertime() {
      this.isPopupOpenOvertime = true;
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        employee_id: "",
        title: "",
       first_name: "",
        last_name: "",
        address: "",
        birth_date: "",
        national_id_number: "",
        phone_number: "",
        email: "",
        department_id: "",
        position_id: "",
        start_working_date: "",
        salary: "",
        employee_type: "",
        bank_name: "",
        bank_account_id: "",
        positions: "",
        status: "",
      };
      this.isEmpty = {
        title: false,
        first_name: false,
        last_name: false,
        address: false,
        birth_date: false,
        national_id_number: false,
        phone_number: false,
        email: false,
        department_id: false,
        position_id: false,
        start_working_date: false,
        salary: false,
        employee_type: false,
        bank_name: false,
        bank_account_id: false,
      };
      this.formData.status = "active";
      this.inputError = false;
      this.isPopupVisible_error = false;
    },
    closePopupLeave() {
      this.isPopupOpenLeave = false;
      this.formDataLeave = { ID: "", employee_id: "", detail: "", date: "" };
      this.isEmpty = {
        employee_id: false,
        detail: false,
        date: false,
        dateEnd: false,
      };
      this.inputError = false;
    },
    closePopupOvertime() {
      this.isPopupOpenOvertime = false;
      this.formDataOvertime = {
        ID: "",
        employee_id: "",
        detail: "",
        date: "",
        hours: "",
      };
      this.inputError = false;
    },
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
      this.formData.status = "active";
    },
    closeDeleteLeaveConfirmPopup() {
      this.isDeleteLeaveConfirmPopupOpen = false;
    },
    handleEdit(item) {
      let departments = Array.isArray(item.department)
        ? item.department.map((department) => department.department_name)
        : [];
      let positions = Array.isArray(item.position)
        ? item.position.map((position) => position.position_name)
        : [];
      if (item.Title === "นาย") {
        item.Title = "Mr.";
      } else if (item.Title === "นาง") {
        item.Title = "Mrs.";
      } else if (item.Title === "นางสาว") {
        item.Title = "Miss";
      }
      const filteredEmp = this.employees.filter((emp) => emp.ID === item.ID);
      let birth_date = [];
      let startingworkdate = [];
      if (filteredEmp[0].birth_date) {
        birth_date = new Date(filteredEmp[0].birth_date + " GMT+0700");
        birth_date.toString();
      } else {
        birth_date = new Date();
      }
      if (filteredEmp[0]["Start Working Date"]) {
        startingworkdate = new Date(
          filteredEmp[0]["Start Working Date"] + " GMT+0700"
        );
        startingworkdate.toString();
      } else {
        startingworkdate = new Date();
      }
      console.log("Edit item:", filteredEmp);
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formData = {
        employee_id: item.ID,
        title: item.Title,
       first_name: item.Name.split(" ")[0],
        last_name: item.Name.split(" ")[1],
        address: item.address,
        birth_date: birth_date,
        national_id_number: item["National ID"],
        phone_number: item["Tel."],
        email: item.email,
        department_id: item.department_id,
        position_id: item.position_id,
        start_working_date: startingworkdate,
        salary: item.salary,
        employee_type: item["Emp. type"],
        bank_name: item["Bank Name"],
        bank_account_id: item["Bank Account ID"],
        departments: departments.join(", "),
        positions: positions.join(", "),
        status: item.status,
      };
      this.getEmployee();
    },
    handleDelete(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { employee_id: item.ID };
    },
    handleDeleteLeave(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteLeaveConfirmPopupOpen = true;
      this.leaving_id = item.ID;
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
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000);
    },
    exportEmployee() {
      this.isLoading = true;
      try {
        if (this.formData.status === "") {
          this.formData.status = "active";
        }
        const activeEmployees = this.employees.filter(
          (employee) => employee.status === this.formData.status
        );
        const csvContent = this.convertToCSV(activeEmployees);
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "รายงานพนักงาน.csv");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error exporting data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    convertToCSV(data) {
      if (!data || data.length === 0) return "";
      const headers = [
        "คำนำหน้า",
        "ชื่อ-นามสกุล",
        "ที่อยู่",
        "วันเกิด",
        "เลขบัตรประชาชน",
        "เบอร์โทรศัพท์",
        "อีเมล",
        "แผนก",
        "ตำแหน่ง",
        "วันเริ่มงาน",
        "เงินเดือน (บาท)",
        "ประเภทพนักงาน",
        "ธนาคาร",
        "เลขบัญชีธนาคาร",
      ];
      console.log("item", data);
      const rows = data.map((item) => {
        if (item.Title === "Mr.") {
          item.Title = "นาย";
        } else if (item.Title === "Mrs.") {
          item.Title = "นาง";
        } else if (item.Title === "Miss") {
          item.Title = "นางสาว";
        }
        return [
          item.Title || "",
          item.Name || "",
          item.address || "",
          this.formatDateToThai(item.birth_date),
          item["National ID"] || "",
          item["Tel."] || "",
          item.email || "",
          item.Department || "",
          item.position_name || "",
          this.formatDateToThai(item["Start Working Date"]),
          String(item.salary).replace(/,/g, "") || "",
          this.translateEmpType(item["Emp. type"]),
          item["Bank Name"] || "",
          item["Bank Account ID"] || "",
        ];
      });
      const csvRows = [headers.join(","), ...rows.map((r) => r.join(","))];
      return "\uFEFF" + csvRows.join("\n");
    },
    translateEmpType(type) {
      switch (type) {
        case "Full-time":
          return "พนักงานประจำ";
        case "Part-time":
          return "พนักงานพาร์ทไทม์";
        case "Contract":
          return "พนักงานสัญญาจ้าง";
        default:
          return "ไม่ระบุ";
      }
    },
    formatDateToThai(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear() + 543;
      return `${day}/${month}/${year}`;
    },
    async getEmployee() {
      const access_token = localStorage.getItem("@access_token");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployee`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          console.log("-----", json.data);
          this.employees = json.data.map((item) => {
            let departments = item.department
              ? [item.department.department_name]
              : [];
            let positions = item.position ? [item.position.position_name] : [];
            const BD = new Date(item.birth_date);
            const startWorkingDate = new Date(item.start_working_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const birth_date =
              item.birth_date && item.birth_date !== ""
                ? new Date(item.birth_date).toLocaleDateString(
                    "en-GB",
                    formatDate
                  )
                : "";
            const startWorking =
              item.start_working_date && item.start_working_date !== ""
                ? new Date(item.start_working_date).toLocaleDateString(
                    "en-GB",
                    formatDate
                  )
                : "";
            function formatSalary(salary) {
              if (salary !== null && typeof salary !== "undefined") {
                return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              return "";
            }
            let initialTableData = {
              ID: item.employee_id,
              Title: item.title,
              Name: item.first_name + " " + item.last_name,
              address: item.address,
              birth_date: birth_date,
              "National ID": item.national_id_number,
              "Tel.": item.phone_number,
              email: item.email,
              "Start Working Date": startWorking,
              salary: formatSalary(item.salary),
              "Emp. type": item.employee_type,
              "Bank Name": item.bank_name,
              "Bank Account ID": item.bank_account_id,
              Department: departments.join(", "),
              position_name: positions.join(", "),
              department_id: item.department_id,
              position_id: item.position_id,
              status: item.employee_status,
            };
            return initialTableData;
          });
        } else {
          console.log("Employee ", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getemployeesSalary() {
      const access_token = localStorage.getItem("@access_token");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployeeSalary`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          console.log("+++++", json.data);
          this.employeesSalaries = json.data.map((item) => {
            let departments = item.department
              ? [item.department.department_name]
              : [];
            let positions = item.position ? [item.position.position_name] : [];
            const BD = new Date(item.birth_date);
            const startWorkingDate = new Date(item.start_working_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const birth_date = BD.toLocaleDateString("en-GB", formatDate);
            const startWorking = startWorkingDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            function formatSalary(salary) {
              if (salary !== null && typeof salary !== "undefined") {
                return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              return "";
            }
            let initialTableData = { ID: item.employee_id, Name: item.name };
            return initialTableData;
          });
        } else {
          console.log("Employee ", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getDepartment() {
      const access_token = localStorage.getItem("@access_token");
      try {
        const response = await fetch(`${API_CALL}/employee/getDepartment`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Departments = json.data;
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getPosition() {
      const access_token = localStorage.getItem("@access_token");
      try {
        const response = await fetch(`${API_CALL}/employee/getPosition`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Positions = json.data;
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    // async getLeave() {
    //   const access_token = localStorage.getItem("@access_token");
    //   try {
    //     const response = await fetch(`${API_CALL}/employee/getLeave`, {
    //       headers: { Authorization: `Bearer ${access_token}` },
    //     });
    //     const json = await response.json();
    //     if (json.statusCode === 200) {
    //       this.Leaving = json.data.map((item) => {
    //         const DateLeave = new Date(item.date);
    //         const DateLeaveEnd = new Date(item.dateEnd);
    //         const formatDate = {
    //           day: "2-digit",
    //           month: "short",
    //           year: "numeric",
    //         };
    //         const DateLeaving = DateLeave.toLocaleDateString(
    //           "en-GB",
    //           formatDate
    //         );
    //         const DateLeavingEnd = DateLeaveEnd.toLocaleDateString(
    //           "en-GB",
    //           formatDate
    //         );
    //         const employee = this.employees.find(
    //           (emp) => emp.ID === item.employee_id
    //         );
    //         const employeeName = employee ? employee.Name : "Unknown";
    //         let initialTableData = {
    //           ID: item.leaving_id,
    //           Name: employeeName,
    //           detail: item.detail,
    //           date: DateLeaving,
    //           dateEnd: DateLeavingEnd,
    //         };
    //         return initialTableData;
    //       });
    //     } else {
    //       console.log(json);
    //       this.showPopup_error(json.data);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // },
    // async getOvertime() {
    //   const access_token = localStorage.getItem("@access_token");
    //   try {
    //     const response = await fetch(`${API_CALL}/employee/getOvertime`, {
    //       headers: { Authorization: `Bearer ${access_token}` },
    //     });
    //     const json = await response.json();
    //     if (json.statusCode === 200) {
    //       this.Overtimes = json.data.map((item) => {
    //         const DateLeave = new Date(item.date);
    //         const formatDate = {
    //           day: "2-digit",
    //           month: "short",
    //           year: "numeric",
    //         };
    //         const DateLeaving = DateLeave.toLocaleDateString(
    //           "en-GB",
    //           formatDate
    //         );
    //         const employeeName = `${item.employee.F_name} ${item.employee.L_name}`;
    //         let initialTableData = {
    //           ID: item.leaving_id,
    //           Name: employeeName,
    //           detail: item.detail,
    //           date: DateLeaving,
    //           hours: item.hours,
    //         };
    //         return initialTableData;
    //       });
    //     } else {
    //       console.log(json);
    //       this.showPopup_error(json.data);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // },
    validateLeave() {
      this.isEmpty.employee_id = false;
      this.isEmpty.detail = false;
      this.isEmpty.date = false;
      this.isEmpty.dateEnd = false;
      let errorMessages2 = [];
      if (this.formDataLeave.employee_id === "") {
        this.isEmpty.employee_id = true;
        errorMessages2.push(this.$t("validation.employeeID"));
      }
      if (this.formDataLeave.detail === "") {
        this.isEmpty.detail = true;
        errorMessages2.push(this.$t("validation.detail"));
      }
      if (this.formDataLeave.date === "") {
        this.isEmpty.date = true;
        errorMessages2.push(this.$t("validation.date"));
      }
      if (this.formDataLeave.dateEnd === "") {
        this.isEmpty.dateEnd = true;
        errorMessages2.push(this.$t("validation.dateEnd"));
      } else {
        const dateStart = new Date(this.formDataLeave.date);
        const dateEnd = new Date(this.formDataLeave.dateEnd);
        if (dateEnd < dateStart) {
          this.isEmpty.dateEnd = true;
          errorMessages2.push(this.$t("validation.dateEnd_invalid"));
        }
      }
      console.log(errorMessages2);
      if (errorMessages2.length > 0) {
        this.showPopup_validate2(errorMessages2);
        return false;
      } else {
        return true;
      }
    },
    showPopup_validate2(messages) {
      if (Array.isArray(messages)) {
        this.isPopupVisible_error2 = true;
        this.errorMessages2 = messages;
        console.log(" this.errorMessages2", this.errorMessages2);
      } else {
        this.showPopup_error(messages);
      }
    },
    validateFormData() {
      this.isEmpty = {
        title: false,
       first_name: false,
        last_name: false,
        address: false,
        birth_date: false,
        national_id_number: false,
        phone_number: false,
        email: false,
        department_id: false,
        position_id: false,
        start_working_date: false,
        salary: false,
        employee_type: false,
        bank_name: false,
        bank_account_id: false,
      };
      let errorMessages = [];
      if (this.formData.title === "") {
        this.isEmpty.title = true;
        errorMessages.push(this.$t("validation.title"));
      }
      if (this.formData.first_name === "") {
        this.isEmpty.first_name = true;
        errorMessages.push(this.$t("validation.F_name"));
      }
      if (this.formData.last_name === "") {
        this.isEmpty.last_name = true;
        errorMessages.push(this.$t("validation.L_name"));
      }
      if (this.formData.address === "") {
        this.isEmpty.address = true;
        errorMessages.push(this.$t("validation.Address"));
      }
      if (this.formData.birth_date === "") {
        this.isEmpty.birth_date = true;
        errorMessages.push(this.$t("validation.Birthdate"));
      }
      if (this.formData.national_id_number === "") {
        this.isEmpty.national_id_number = true;
        errorMessages.push(this.$t("validation.NID_num"));
      } else if (this.formData.national_id_number.length !== 13) {
        this.isEmpty.national_id_number = true;
        errorMessages.push(this.$t("validation.NID_num_length"));
      }
      const isDuplicateNID_num = this.employees.some(
        (item) =>
          item["National ID"].trim() === this.formData.national_id_number.trim() &&
          item.ID !== this.formData.employee_id
      );
      if (isDuplicateNID_num) {
        this.isEmpty.national_id_number = true;
        errorMessages.push(this.$t("validation.duplicateNID_num"));
      }
      if (this.formData.phone_number === "") {
        this.isEmpty.phone_number = true;
        errorMessages.push(this.$t("validation.Phone_num"));
      } else if (
        !this.formData.phone_number ||
        this.formData.phone_number.length < 9 ||
        this.formData.phone_number.length > 10
      ) {
        this.isEmpty.phone_number = true;
        errorMessages.push(this.$t("validation.Phone_num_length"));
      }
      const isDuplicatePhone = this.employees.some(
        (item) =>
          item["Tel."].trim() === this.formData.phone_number.trim() &&
          item.ID !== this.formData.employee_id
      );
      if (isDuplicatePhone) {
        this.isEmpty.phone_number = true;
        errorMessages.push(this.$t("validation.duplicatePhone"));
      }
      if (this.formData.email === "") {
        this.isEmpty.email = true;
        errorMessages.push(this.$t("validation.Email"));
      }
      if (
        this.formData.department_id === "" ||
        this.formData.department_id === null
      ) {
        this.isEmpty.department_id = true;
        errorMessages.push(this.$t("validation.departmentID"));
      }
      if (
        this.formData.position_id === "" ||
        this.formData.position_id === null
      ) {
        this.isEmpty.position_id = true;
        errorMessages.push(this.$t("validation.PositionID"));
      }
      if (this.formData.start_working_date === "") {
        this.isEmpty.start_working_date = true;
        errorMessages.push(this.$t("validation.start_working_date"));
      }
      if (this.formData.employee_type === "") {
        this.isEmpty.employee_type = true;
        errorMessages.push(this.$t("validation.employeeType"));
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
    async addEmployee() {
      const access_token = localStorage.getItem("@access_token");
      if (!this.validateFormData()) return;
      this.isLoading = true;
      const date_Birthdate = new Date(this.formData.birth_date);
      date_Birthdate.setFullYear(date_Birthdate.getFullYear() - 543);
      try {
        const response = await fetch(`${API_CALL}/employee/AddEmployee`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            title: this.formData.title,
           first_name: this.formData.first_name,
            last_name: this.formData.last_name,
            address: this.formData.address,
            birth_date: this.formData.birth_date,
            national_id_number: this.formData.national_id_number,
            phone_number: this.formData.phone_number,
            email: this.formData.email,
            department_id: this.formData.department_id,
            position_id: this.formData.position_id,
            start_working_date: this.formData.start_working_date,
            salary: this.formData.salary,
            employee_type: this.formData.employee_type,
            bank_name: this.formData.bank_name,
            bank_account_id: this.formData.bank_account_id,
          }),
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.isPopupVisible_error = false;
          this.getEmployee();
          this.closePopup();
          this.showPopup(this.$t("validation.AddSucc"));
          console.log("Add employee success");
          this.formData = {
            employee_id: "",
            title: "",
           first_name: "",
            last_name: "",
            address: "",
            birth_date: "",
            national_id_number: "",
            phone_number: "",
            email: "",
            department_id: "",
            position_id: "",
            start_working_date: "",
            salary: "",
            employee_type: "",
            bank_name: "",
            bank_account_id: "",
            status: "",
          };
        } else {
          console.log("Add employee error", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async AddLeave() {
      const access_token = localStorage.getItem("@access_token");
      if (!(await this.validateLeave())) return;
      this.isLoading = true;
      if (this.isEditMode === false) {
        try {
          const response = await fetch(`${API_CALL}/employee/AddLeave`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
              employee_id: this.formDataLeave.employee_id,
              detail: this.formDataLeave.detail,
              date: this.formDataLeave.date,
              dateEnd: this.formDataLeave.dateEnd,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            // this.getLeave();
            console.log("Manage successfully");
            this.showPopup(this.$t("validation.AddSucc"));
            this.formDataLeave = {
              employee_id: "",
              date: "",
              detail: "",
              dateEnd: "",
            };
          } else {
            this.isPopupVisible_error2 = true;
            this.errorMessages2.push(this.$t("validation.duplicateLeaveDate"));
            setTimeout(() => {
              this.isPopupVisible_error2 = false;
            }, 3000);
            console.log("Manage Leave error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false;
        }
      } else {
        try {
          const response = await fetch(
            `${API_CALL}/employee/EditLeave/` + this.EditIdLeaveHandle,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify({
                employee_id: this.formDataLeave.employee_id,
                detail: this.formDataLeave.detail,
                date: this.formDataLeave.date,
                dateEnd: this.formDataLeave.dateEnd,
              }),
            }
          );
          const json = await response.json();
          if (json.statusCode === 200) {
            console.log("Edit successfully");
            this.showPopup(this.$t("validation.EditSucc"));
            // this.getLeave();
            this.closePopupLeave();
            this.formDataLeave = {
              employee_id: "",
              date: "",
              detail: "",
              dateEnd: "",
            };
          } else {
            this.showPopup_error(json.data);
            console.log("Edit Leave error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    async AddOvertime() {
      const access_token = localStorage.getItem("@access_token");
      if (
        this.formDataOvertime.employee_id === "" ||
        this.formDataOvertime.date === "" ||
        this.formDataOvertime.detail === "" ||
        this.formDataOvertime.hours === ""
      ) {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        try {
          const response = await fetch(`${API_CALL}/employee/AddOvertime`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
              employee_id: this.formDataOvertime.employee_id,
              detail: this.formDataOvertime.detail,
              date: this.formDataOvertime.date,
              hours: this.formDataOvertime.hours,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            // this.getOvertime();
            console.log("Manage successfully");
            this.showPopup(this.$t("validation.AddSucc"));
            this.formDataOvertime = {
              employee_id: "",
              date: "",
              detail: "",
              hours: "",
            };
          } else {
            this.showPopup_error(json.data);
            console.log("Manage Overtime error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    async editEmployee() {
      if (!this.validateFormData()) return;
      this.isLoading = true;
      const access_token = localStorage.getItem("@access_token");
      function parseSalary(salaryString) {
        if (salaryString !== null && typeof salaryString !== "undefined") {
          return parseFloat(salaryString.replace(/,/g, ""));
        }
        return null;
      }
      const employee = this.formData.employee_id;
      const date_Birthdate = new Date(this.formData.birth_date);
      date_Birthdate.setFullYear(date_Birthdate.getFullYear() - 543);
      const date_start_working_date = new Date(
        this.formData.start_working_date
      );
      date_start_working_date.setFullYear(
        date_start_working_date.getFullYear() - 543
      );
      try {
        const response = await fetch(
          `${API_CALL}/employee/EditEmployee/${employee}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
              title: this.formData.title,
             first_name: this.formData.first_name,
              last_name: this.formData.last_name,
              address: this.formData.address,
              birth_date: this.formData.birth_date,
              national_id_number: this.formData.national_id_number,
              phone_number: this.formData.phone_number,
              email: this.formData.email,
              department_id: this.formData.department_id,
              position_id: this.formData.position_id,
              start_working_date: this.formData.start_working_date,
              salary: parseSalary(this.formData.salary),
              employee_type: this.formData.employee_type,
              bank_name: this.formData.bank_name,
              bank_account_id: this.formData.bank_account_id,
            }),
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getEmployee();
          this.showPopup(this.$t("validation.EditSucc"));
          console.log("Edit employee success");
          this.closePopup();
        } else {
          console.log("edit employee error", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteEmployee() {
      const access_token = localStorage.getItem("@access_token");
      this.isLoading = true;
      const employeeID = this.formData.employee_id;
      try {
        const response = await fetch(
          `${API_CALL}/employee/DeleteEmployee/${employeeID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({ employee_id: employeeID }),
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getEmployee();
          this.employees = this.employees.filter(
            (item) => item.employee_id !== employeeID
          );
          this.showPopup(this.$t("validation.DelateSucc"));
          console.log("delete employee success");
          this.closeDeleteConfirmPopup();
        } else {
          console.log("delete employee error", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteLeave() {
      const access_token = localStorage.getItem("@access_token");
      this.isLoading = true;
      const id = this.leaving_id;
      try {
        const response = await fetch(`${API_CALL}/employee/DeleteLeave/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({ leaving_id: id }),
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          // this.getLeave();
          // this.getOvertime();
          this.closeDeleteLeaveConfirmPopup();
          this.showPopup(this.$t("validation.DelateSucc"));
          console.log("delete Leave success");
        } else {
          console.log("delete Leave error", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getPosition();
    this.getDepartment();
    this.getEmployee();
    // this.getOvertime();
  },
};
</script>

