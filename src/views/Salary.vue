<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body">
      <div class="mb-3">
        <h2>{{ t("headerSalary") }}</h2>
      </div>
      <!-- <div class="add-btn mb-3">
        <a class="btn btn-success" @click="openPopup">{{
          t("addPaySalary")
        }}</a>
      </div> -->
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <label class="me-1 size-font-sm">{{ t("month") }}</label>
          <select
            v-model="selectedMonthFilter"
            class="me-3 form-control form-select size-font-sm"
            :class="{ error: inputError } + ' form-control'"
          >
            <option v-for="month in months" :value="month" :key="month">
              {{ month }}
            </option>
          </select>
        </div>

        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <label class="me-1 size-font-sm">{{ t("year") }}</label>

          <select
            v-model="selectedYearFilter"
            class="me-3 form-control form-select size-font-sm"
            :class="{ error: inputError } + ' form-control'"
          >
            <!-- <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option> -->
            <option v-for="year in years" :key="year" :value="year">
              {{ t("lang") === "en" ? year + 543 : year }}
            </option>
          </select>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <!-- <div class="col-1 col-sm-1 col-md-7 col-lg-7"></div> -->
        <div class="col-6 col-sm-6 col-md-9 col-lg-9 text-end">
          <a class="btn btn-success me-3 size-font-sm me-2" @click="openPopup">
            {{ t("addPaySalary") }}
          </a>
          <button
            class="btn btn-outline-secondary mdi mdi-export-variant size-font-sm"
            @click="exportSalary"
          ></button>
        </div>
      </div>
      <!-- <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <label class="me-1">{{ t("month") }}</label>
          <select
            v-model="selectedMonthFilter"
            class="me-3 form-control form-select"
            :class="{ error: inputError } + ' form-control'"
          >
            <option v-for="month in months" :value="month" :key="month">
              {{ month }}
            </option>
          </select>
          <label class="me-1">{{ t("year") }}</label>
          <select
            v-model="selectedYearFilter"
            class="me-3 form-control form-select"
            :class="{ error: inputError } + ' form-control'"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="d-flex align-items-center">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3"
            style="width: 200px"
            :placeholder="$t('Search')"
          />
          <button class="btn btn-outline-secondary me-2" @click="exportSalary">
            Export
          </button>
          <a class="btn btn-success" @click="openPopup">{{
            t("addPaySalary")
          }}</a>
        </div>
      </div> -->
      <div>
        <tableList
          :tableHeaders="tableHeaders"
          :initialTableData="filteredSalary"
          @employee-name-clicked="openPopupOvertime"
          v-if="payments"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          :isLoading="isLoading"
          :itemsPerPage="10"
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
      <div>
        <h2 class="mb-3">{{ t("headerpopupaddPayment") }}</h2>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-sm-4 col-md-4 col-lg-4">
          <label class="me-1">{{ t("month") }}</label>
          <select
            v-model="selectedMonth"
            class="me-3"
            :class="{ error: isEmpty.selectedMonth, 'form-control': true }"
          >
            <option v-for="month in months" :value="month" :key="month">
              {{ month }}
            </option>
          </select>
        </div>
        <div class="col-12 col-sm-4 col-md-4 col-lg-4">
          <label class="me-1">{{ t("year") }}</label>
          <select
            v-model="selectedYear"
            class="me-3"
            :class="{ error: isEmpty.selectedYear, 'form-control': true }"
          >
            <option
              v-for="year in years"
              :key="year"
              :value="year"
              :disabled="year !== currentYear"
            >
              {{ year }}
            </option>
          </select>
        </div>
        <div class="col-12 col-sm-4 col-md-4 col-lg-4">
          <label class="me-1">{{ t("round") }}</label>
          <select
            v-model="selectedRound"
            :class="{ error: isEmpty.selectedRound, 'form-control': true }"
          >
            <option v-for="round in rounds" :key="round" :value="round">
              {{ round }}
            </option>
          </select>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <input
            v-model="searchQuery2"
            type="text"
            class="form-control me-3"
            style="width: 200px"
            :placeholder="$t('Search')"
          />
        </div>
      </div>
      <!-- <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <label class="me-1">{{ t("month") }}</label>
          <select
            v-model="selectedMonth"
            class="me-3"
            :class="{ error: isEmpty.selectedMonth, 'form-control': true }"
          >
            <option v-for="month in months" :value="month" :key="month">
              {{ month }}
            </option>
          </select>
          <label class="me-1">{{ t("year") }}</label>
          <select
            v-model="selectedYear"
            class="me-3"
            :class="{ error: isEmpty.selectedYear, 'form-control': true }"
          >
            <option
              v-for="year in years"
              :key="year"
              :value="year"
              :disabled="year !== currentYear"
            >
              {{ year }}
            </option>
          </select>
          <label class="me-1">{{ t("round") }}</label>
          <select
            v-model="selectedRound"
            :class="{ error: isEmpty.selectedRound, 'form-control': true }"
          >
            <option v-for="round in rounds" :key="round" :value="round">
              {{ round }}
            </option>
          </select>
        </div>
        <div class="d-flex align-items-center">
          <input
            v-model="searchQuery2"
            type="text"
            class="form-control me-3"
            style="width: 200px"
            :placeholder="$t('Search')"
          />
        </div>
      </div> -->
      <div>
        <tableList
          :initialTableData="filteredEmployee"
          :tableHeaders="tableHeaderEmployees"
          :columnforCheckbox="true"
          @selectItem="selectItem"
          v-if="Employees && Employees.length > 0"
          :isLoading="isLoading"
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
      <div class="modal-footer">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          @click="addPayment"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonConfirm") }}</span>
        </button>
        <button class="btn btn-secondary" @click="closePopup">
          {{ t("buttonClose") }}
        </button>
      </div>
    </Popup>
    <Popup :isOpen="isovertimeopen" :closePopup="closePopupOvertime">
      <div class="mb-4">
        <h3>{{ t("manageOvertime") }}</h3>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("date") }}</label>
        <DatePicker
          v-model:value="formDataOvertime.date"
          format="DD/MM/YYYY"
          value-type="date"
          placeholder="DD/MM/YYYY"
          class="form-control"
          :class="{ error: inputError }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("starttoendtime") }}</label>
        <DatePicker
          v-model:value="formDataOvertime.startTime"
          format="hh:mm a"
          type="time"
          placeholder="hh:mm a"
          class="form-control"
          @change="updateOvertimeHours"
          :class="{ error: inputError }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"></label>
        <DatePicker
          v-model:value="formDataOvertime.endTime"
          format="hh:mm a"
          type="time"
          placeholder="hh:mm a"
          class="form-control"
          @change="updateOvertimeHours"
          :class="{ error: inputError }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("hoursovertime") }}</label>
        <input
          class="col-sm-9 col-md-6 form-control readonly"
          v-model="formDataOvertime.hours"
          type="text"
          id="input-text"
          @change="updateOvertimeTotal"
          :class="{ error: inputError }"
          disabled
        />
      </div>
      <div class="mb-3 div-for-formControl" style="align-items: flex-start">
        <label class="col-sm-5 col-md-6">{{ t("quotationRemark") }}</label>
        <textarea
          class="form-control"
          v-model="formDataOvertime.detail"
          type="text"
          required
          :class="{ error: inputError }"
          maxlength="255"
        ></textarea>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("rateperhour") }}</label>
        <input
          class="col-sm-9 col-md-6 form-control"
          v-model="formDataOvertime.rate"
          type="text"
          id="input-text"
          @change="updateOvertimeTotal"
          :class="{ error: inputError }"
          required
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("total") }}</label>
        <input
          class="col-sm-9 col-md-6 form-control"
          v-model="formDataOvertime.total"
          type="text"
          id="input-text"
          :class="{ error: inputError }"
          disabled
        />
      </div>
      <div class="modal-footer mb-3">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          @click="AddOvertime"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonAdd") }}</span>
        </button>
        <button class="btn btn-secondary" @click="closePopupOvertime">
          {{ t("buttonCancel") }}
        </button>
      </div>
    </Popup>
    <div v-if="isPopupVisible" class="popup-success">
      <div class="popup-content-success">
        <a>{{ popupMessage }}</a>
      </div>
    </div>
    <!-- <div v-if="isPopupVisible_error2" class="popup-success">
      <div class="popup-content-error">
        <h3>{{ $t("validate_popupError") }}</h3> -->
    <!-- <a v-if="this.popupMessage_error">{{ popupMessage_error }}</a> -->
    <!-- <a>{{ popupMessage_error2 }}</a>
      </div>
    </div> -->
    <div v-if="isPopupVisible_error2" class="popup-error2">
      <div class="text-end">
        fff
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="closeErrorPopup2"
          style="color: #9f9999"
        ></button>
      </div>
      <div class="popup-content-error2">{{ popupMessage_error2 }}</div>
    </div>
    <!-- <div v-if="isPopupVisible_error" class="popup-success">
      <div class="popup-content-error">
        <h3>{{ $t("validate_popupError") }}</h3> -->
    <!-- <a v-if="this.popupMessage_error">{{ popupMessage_error }}</a> -->
    <!-- <ul>
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
        <a v-if="this.popupMessage_error">{{ popupMessage_error }}</a>
        <ul>
          <li v-for="(msg, index) in errorMessages" :key="index">
            {{ msg }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <Popup :isOpen="isPopupOpenEdit" :closePopup="closeEditConfirmPopup">
    <div class="mb-4">
      <h2>{{ t("salaryEdit") }}</h2>
    </div>

    <div class="mb-3">
      <label class="col-sm-5 col-md-6 mb-3"
        >{{ t("employeeNameHeaderTable") }}
      </label>
      <input
        class="col-sm-9 col-md-6 form-control"
        v-model="formDataEdit.emp_name"
        type="text"
        id="input-text"
        :class="{ error: inputError }"
        disabled
      />
    </div>
    <div class="mb-3">
      <label class="col-sm-5 col-md-6 mb-3"
        >{{ t("positionHeaderTable") }}
      </label>
      <input
        class="col-sm-9 col-md-6 form-control"
        v-model="formDataEdit.position"
        type="text"
        id="input-text"
        :class="{ error: inputError }"
        disabled
      />
    </div>

    <div class="mb-3">
      <label class="col-sm-5 col-md-6 mb-3">{{ t("roundHeaderTable") }} </label>
      <select
        v-model="formDataEdit.round"
        :class="{ error: inputError } + ' form-control'"
      >
        <option v-for="round in rounds" :key="round" :value="round">
          {{ round }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label class="col-sm-5 col-md-6 mb-3">{{ t("monthHeaderTable") }} </label>
      <select
        v-model="formDataEdit.month"
        class="me-3"
        :class="{ error: inputError } + ' form-control'"
      >
        <option v-for="month in months" :value="month" :key="month">
          {{ month }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label class="col-sm-5 col-md-6 mb-3">{{ t("yearHeaderTable") }} </label>
      <select
        v-model="formDataEdit.year"
        class="me-3"
        :class="{ error: inputError } + ' form-control'"
      >
        <option
          v-for="year in years"
          :key="year"
          :value="year"
          :disabled="year !== currentYear"
        >
          {{ year }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label class="col-sm-5 col-md-6 mb-3"
        >{{ t("salaryHeaderTable") }}
      </label>
      <input
        class="col-sm-9 col-md-6 form-control"
        v-model="formDataEdit.salary"
        type="text"
        id="input-text"
        :class="{ error: inputError }"
        disabled
      />
    </div>
    <div class="modal-footer">
      <button
        :disabled="isLoading"
        class="btn btn-primary me-3"
        v-if="isAddingMode"
        @click="addDepartment"
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
        @click="editDepartment"
      >
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-else>{{ t("buttonSave") }}</span>
      </button>
      <button class="btn btn-primary mr-3" @click="comfrimEditSalary">
        {{ t("buttonSave") }}
      </button>
      <button class="btn btn-secondary" @click="closeEditConfirmPopup">
        {{ t("buttonCancel") }}
      </button>
    </div>
  </Popup>
  <div class="delete-popup">
    <Popup :isOpen="deleteopenpopup" :closePopup="closeDeleteConfirmPopup">
      <div class="mb-5">
        <a>{{ t("deleteConfirmSentence") }}</a>
      </div>
      <div class="modal-footer mb-3">
        <button
          :disabled="isLoading"
          class="btn btn-danger me-3"
          @click="deleteSalary"
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
</template>

<script>
import { computed } from "vue";
import Navigate from "../components/Navigation.vue";
import Popup from "../components/popup.vue";
import tableList from "../components/tableList.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Salary Management",
  components: {
    Navigate,
    tableList,
    Popup,
    DatePicker,
  },
  setup() {
    const { t } = useI18n(); // i18n function for translations
    const { locale } = useI18n(); // ดึงค่า locale จาก i18n
    // ✅ รายการเดือนแบบสองภาษา (อังกฤษ - ไทย)
    const monthList = {
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      th: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ],
    };

    // ✅ Computed สำหรับเปลี่ยนรายการเดือนตามภาษาที่เลือก
    const months = computed(() => monthList[locale.value] || monthList.en);

    const documentName = computed(() => t("dontHaveSalary"));
    return {
      months,
      t,
      documentName,
    };
  },
  data() {
    return {
      isEmpty: {
        selectedMonth: "",
        selectedYear: "",
        selectedRound: "",
      },
      errorMessages: [],
      isovertimeopen: false,
      paymentsSuccess: [],
      empDataformaintable: [],
      payments: [],
      inputError: false,
      isPopupOpen: false,
      isPopupOpenEdit: false,
      closePopupEdit: false,
      selectedMonth: [],
      selectedMonthFilter: [],
      selectedYear: [],
      selectedYearFilter: [],
      selectedRound: [],
      Employees: [],
      Sessions: [],
      filterSalaryExport: [],
      isLoading: false,
      isPopupVisible: false,
      isPopupVisible_error: false,
      isPopupVisible_error2: false,
      selectedEmployeeID: "",
      salary_id: "",
      formData: {
        payment_id: "",
        employeeID: "",
        Date: "",
        round: "",
        month: "",
        year: "",
      },
      formDataEdit: {
        emp_name: "",
        payment_id: "",
        employeeID: "",
        Date: "",
        round: "",
        month: "",
        year: "",
      },
      currentYear: new Date().getFullYear(), // Current year
      formEmployee: [], // Holds selected employee data for payment submission
      // months: [
      //   "January",
      //   "February",
      //   "March",
      //   "April",
      //   "May",
      //   "June",
      //   "July",
      //   "August",
      //   "September",
      //   "October",
      //   "November",
      //   "December",
      // ], // List of months for selection
      years: this.generateYears(1900, 2100), // Generates a list of years from 1900 to 2100
      rounds: this.generateYears(1, 12), // Generates a list of rounds from 1 to 12
      formDataOvertime: {
        startTime: "",
        endTime: "",
        date: "",
        detail: "",
        hours: "",
        rate: "",
        total: "",
      },
      searchQuery: "",
      searchQuery2: "",
      deleteclosepopup: false,
      deleteopenpopup: false,
    };
  },
  computed: {
    // set data header
    tableHeaders() {
      return [
        { label: this.t("employeeNameHeaderTable"), key: "Employee Name" },
        { label: this.t("positionHeaderTable"), key: "Position" },
        { label: this.t("datepaysalaryHeaderTable"), key: "Date" },
        { label: this.t("roundHeaderTable"), key: "Round" },
        { label: this.t("monthHeaderTable"), key: "Month" },
        { label: this.t("yearHeaderTable"), key: "Year" },
        { label: this.t("salaryHeaderTable"), key: "Salary" },
      ];
    },
    tableHeaderEmployees() {
      return [
        { label: this.t("employeeNameHeaderTable"), key: "Employee Name" },
        { label: this.t("empTypes"), key: "Emp. type" },
        // { label: this.t("telHeaderTable"), key: "Tel." },
        // { label: this.t("emailHeaderTable"), key: "Email" },
        { label: this.t("salaryHeaderTable"), key: "Salary" },
        { label: this.t("bankNameHeaderTable"), key: "Bank Name" },
        { label: this.t("bankaccHeaderTable"), key: "Bank Account ID" },
        { label: this.t("departNameHeaderTable"), key: "Department" },
        { label: this.t("positionHeaderTable"), key: "Position" },
      ];
    },
    filteredSalary() {
      // ตรวจสอบว่า this.payments มีค่าหรือไม่ ถ้าไม่มีให้กำหนดเป็นอาเรย์ว่าง
      let filteredSalary = this.payments ? [...this.payments] : [];

      // กรองตามการค้นหาชื่อ
      if (this.searchQuery.trim()) {
        filteredSalary = filteredSalary.filter((data) =>
          data["Employee Name"]
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }

      const monthMapping = {
        January: "มกราคม",
        February: "กุมภาพันธ์",
        March: "มีนาคม",
        April: "เมษายน",
        May: "พฤษภาคม",
        June: "มิถุนายน",
        July: "กรกฎาคม",
        August: "สิงหาคม",
        September: "กันยายน",
        October: "ตุลาคม",
        November: "พฤศจิกายน",
        December: "ธันวาคม",
      };
      const monthMappingshort = {
        Jan: "ม.ค.",
        Feb: "ก.พ.",
        Mar: "มี.ค.",
        Apr: "เม.ย.",
        May: "พ.ค.",
        Jun: "มิ.ย.",
        Jul: "ก.ค.",
        Aug: "ส.ค.",
        Sep: "ก.ย.",
        Oct: "ต.ค.",
        Nov: "พ.ย.",
        Dec: "ธ.ค.",
      };
      // แผนที่ชื่อเดือนภาษาอังกฤษเป็นไทย
      if (this.t("headerLang") === "TH") {
        // แปลงเดือนเป็นภาษาไทยและปี ค.ศ. เป็น พ.ศ.
        filteredSalary = filteredSalary.map((data) => ({
          ...data,
          Month: monthMapping[data["Month"]] || data["Month"], // แปลงชื่อเดือน
          Year: data["Year"]
            ? (parseInt(data["Year"]) + 543).toString()
            : data["Year"], // แปลง ค.ศ. เป็น พ.ศ.

          Date: String(data.Date)
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMappingshort[match] // ✅ แปลงชื่อเดือนเป็นไทย
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()), // ✅ เพิ่มปี ค.ศ. + 543 (เป็น พ.ศ.)
        }));
      }

      const yearToFilter =
        this.t("lang") === "en"
          ? (parseInt(this.selectedYearFilter) + 543).toString()
          : this.selectedYearFilter;

      // กรองตามปีและเดือนที่เลือก
      if (this.selectedYearFilter) {
        if (this.selectedMonthFilter) {
          // ถ้าเลือกทั้งปีและเดือน

          filteredSalary = filteredSalary.filter(
            (data) =>
              data["Year"]?.toString().includes(yearToFilter) &&
              data["Month"]?.toString().includes(this.selectedMonthFilter)
          );
        } else {
          // ถ้าเลือกแค่ปี
          filteredSalary = filteredSalary.filter((data) =>
            data["Year"]?.toString().includes(this.selectedYearFilter)
          );
        }
      } else if (this.selectedMonthFilter) {
        // ถ้ามีการเลือกเดือน แต่ไม่มีปี ให้คืนค่าเป็นอาเรย์ว่าง
        return [];
      }

      filteredSalary = filteredSalary.map((data) => ({
        ...data,
        salary: Number(data["salary"] ?? 0).toLocaleString(),
      }));

      console.log(filteredSalary);
      this.filterSalaryExport = filteredSalary;
      // คืนค่าเป็นอาเรย์ว่างหากไม่มีข้อมูลที่ตรงตามเงื่อนไข
      return filteredSalary.length > 0 ? filteredSalary : [];
    },
    filteredEmployee() {
      // ตรวจสอบว่า this.payments มีค่าหรือไม่ ถ้าไม่มีให้กำหนดเป็นอาเรย์ว่าง
      let filteredEmployee = this.Employees ? [...this.Employees] : [];

      if (this.searchQuery2.trim()) {
        filteredEmployee = filteredEmployee.filter((data) =>
          data["Employee Name"]
            ?.toLowerCase()
            .includes(this.searchQuery2.toLowerCase())
        );
      }

      return filteredEmployee.length > 0 ? filteredEmployee : [];
    },
  },
  methods: {
    setDefalueSeleteFliter() {
      const today = new Date();

      // สมมุติว่า `months` เป็น array เช่น ["January", "February", ..., "December"]
      const monthIndex = today.getMonth(); // 0-11
      this.selectedMonthFilter = this.months[monthIndex];
      this.selectedYearFilter = today.getFullYear();
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    closeErrorPopup2() {
      this.isPopupVisible_error2 = false;
    },
    async validateFormData() {
      this.isEmpty.selectedMonth = false;
      this.isEmpty.selectedRound = false;
      this.isEmpty.selectedYear = false;

      const errorMessages = [];

      if (this.selectedMonth === "" || this.selectedMonth === null) {
        this.isEmpty.selectedMonth = true;
        errorMessages.push(this.$t("validation.selectedMonth"));
      }

      if (this.selectedYear === "") {
        this.isEmpty.selectedYear = true;
        errorMessages.push(this.$t("validation.selectedYear"));
      }

      if (this.selectedRound === "") {
        this.isEmpty.selectedRound = true;
        errorMessages.push(this.$t("validation.selectedRound"));
      }
      if (this.formEmployee.length === 0) {
        errorMessages.push(this.$t("validation.formEmployee"));
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
    // exportSalary() {
    //   this.isLoading = true;

    //   try {
    //     // แปลงข้อมูลที่กรองแล้วเป็น CSV
    //     const csvContent = this.convertToCSV(this.filterSalaryExport);

    //     // สร้าง Blob และดาวน์โหลดไฟล์ CSV
    //     const blob = new Blob([csvContent], { type: "text/csv" });
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "Salary_export.csv");
    //     document.body.appendChild(link);
    //     link.click();
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error("Error exporting data:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    exportSalary() {
      this.isLoading = true;

      try {
        // ลบฟิลด์ ID ออกก่อนแปลงเป็น CSV
        const sanitizedData = this.filterSalaryExport.map(
          ({ ID, ...rest }) => rest
        );

        // แปลงเป็น CSV
        const csvContent = this.convertToCSV(sanitizedData);

        // เพิ่ม BOM เพื่อรองรับภาษาไทยใน Excel
        const utf8BOM = "\uFEFF";

        // สร้าง Blob และดาวน์โหลด
        const blob = new Blob([utf8BOM + csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Salary_export.csv");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error exporting data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // ฟังก์ชันแปลงข้อมูล JSON เป็น CSV
    convertToCSV(arr) {
      const header = Object.keys(arr[0]);
      const rows = arr.map((row) =>
        header
          .map((fieldName) =>
            JSON.stringify(row[fieldName], (key, value) =>
              value === null ? "" : value
            )
          )
          .join(",")
      );
      return [header.join(","), ...rows].join("\r\n");
    },
    async comfrimEditSalary() {
      const accessToken = localStorage.getItem("@accessToken");

      const payment_id = this.formDataEdit.payment_id;
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const formattedYear = String(this.formDataEdit.year);
      try {
        const response = await fetch(
          `${API_CALL}/employee/EditSalary/${payment_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              Date: formattedDate,
              round: parseInt(this.formDataEdit.round),
              month: this.formDataEdit.month,
              year: formattedYear,
            }),
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.isPopupOpenEdit = false;
          this.closePopup();
          this.showPopup(this.$t("validation.EditSucc"));
          this.getPaymentTable(); // Refresh department list
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error editing department:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteSalary() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const salary_id = this.salary_id;
      try {
        const response = await fetch(
          `${API_CALL}/employee/DeleteSalary/${salary_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getPaymentTable(); // Refresh department list
          this.showPopup(this.$t("validation.DelateSucc"));
          this.closeDeleteConfirmPopup();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error deleting department:", error);
      } finally {
        this.isLoading = false;
      }
    },
    handleDelete(item) {
      this.deleteopenpopup = true;
      this.salary_id = item.ID;
    },
    handleEdit(item) {
      this.isPopupOpenEdit = true;
      this.formDataEdit.payment_id = item["ID"];
      this.formDataEdit.emp_name = item["Employee Name"];
      this.formDataEdit.position = item["position"];
      this.formDataEdit.Date = item["Date"];
      this.formDataEdit.round = item["Round"];
      this.formDataEdit.month = item["Month"];
      this.formDataEdit.year = item["Year"];
      this.formDataEdit.salary = item["salary"];
    },
    closeEditConfirmPopup() {
      this.isPopupOpenEdit = false;
    },
    closeDeleteConfirmPopup() {
      this.deleteopenpopup = false;
    },
    async AddOvertime() {
      const accessToken = localStorage.getItem("@accessToken");
      console.log(this.selectedEmployeeID);
      if (
        this.selectedEmployeeID === "" ||
        this.formDataOvertime.date === "" ||
        this.formDataOvertime.detail === "" ||
        this.formDataOvertime.hours === "" ||
        this.formDataOvertime.rate === "" ||
        this.formDataOvertime.total === ""
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
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              employeeID: this.selectedEmployeeID,
              detail: this.formDataOvertime.detail,
              date: this.formDataOvertime.date,
              hours: this.formDataOvertime.hours,
              rate: this.formDataOvertime.rate,
              total: this.formDataOvertime.total,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            this.closePopupOvertime();
            console.log("Manage successfully");
            this.showPopup(this.$t("validation.AddSucc"));
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
    updateOvertimeHours() {
      if (this.formDataOvertime.startTime && this.formDataOvertime.endTime) {
        const startTime = new Date(this.formDataOvertime.startTime);
        const endTime = new Date(this.formDataOvertime.endTime);
        const differenceInMs = endTime - startTime;
        const hoursovertime = differenceInMs / (1000 * 60 * 60);
        this.formDataOvertime.hours = hoursovertime;
      }
    },
    updateOvertimeTotal() {
      if (this.formDataOvertime.hours && this.formDataOvertime.rate) {
        const hours = parseFloat(this.formDataOvertime.hours);
        const rate = parseFloat(this.formDataOvertime.rate);
        const totals = hours * rate;
        this.formDataOvertime.total = totals;
      }
    },
    openPopupOvertime(employeeID) {
      this.isovertimeopen = true; // แสดง popup
      this.selectedEmployeeID = employeeID.employeeID;
      console.log("Employee ID:", employeeID);
    },
    closePopupOvertime() {
      this.isovertimeopen = false; // ปิด popup
      this.formDataOvertime = {
        startTime: "",
        endTime: "",
        date: "",
        detail: "",
        hours: "",
        rate: "",
        total: "",
      };
      this.inputError = false;
    },
    // Opens the popup for adding a new payment
    openPopup() {
      this.isPopupOpen = true;
      this.selectedMonth = "";
      this.selectedRound = "";
      this.selectedYear = "";
    },
    // Closes the popup and resets the form data
    closePopup() {
      this.isPopupOpen = false;
      this.formData = {
        payment_id: "",
        employeeID: "",
        round: "",
        month: "",
        year: "",
      };
      this.isEmpty.selectedMonth = "";
      this.isEmpty.selectedRound = "";
      this.isEmpty.selectedYear = "";
      this.inputError = false;
    },
    // Generates a list of years within the given range
    generateYears(start, end) {
      const years = [];
      for (let year = start; year <= end; year++) {
        years.push(year);
      }
      return years;
    },
    // Handles the selection of an employee for payment
    selectItem(item) {
      const [firstName, lastName] = item["Employee Name"].split(" ");
      this.formEmployee.push({
        employeeID: item["Employee ID"],
        F_name: firstName,
        L_name: lastName,
        departmentID: item.departmentID,
        PositionID: item.PositionID,
      });
    },
    // Shows a success popup message
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000); // Popup stays visible for 2 seconds
    },
    // Shows an error popup message
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      // setTimeout(() => {
      //   this.isPopupVisible_error = false;
      // }, 2000); // Popup stays visible for 2 seconds
    },
    showPopup_error2(message) {
      this.popupMessage_error2 = message;
      this.isPopupVisible2 = false;
      this.isPopupVisible_error2 = true;
      // setTimeout(() => {
      //   this.isPopupVisible_error2 = false;
      // }, 2000); // Popup stays visible for 2 seconds
    },
    // Adds a payment record to the system
    async addPayment() {
      if (!(await this.validateFormData())) return;
      const accessToken = localStorage.getItem("@accessToken");
      // if (this.formEmployee.length === 0) {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill data");
      // } else {
      //   this.inputError = false;
      this.isLoading = true;
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const formattedYear = String(this.selectedYear);

      const thaiToFullEngMonthMapping = {
        มกราคม: "January",
        กุมภาพันธ์: "February",
        มีนาคม: "March",
        เมษายน: "April",
        พฤษภาคม: "May",
        มิถุนายน: "June",
        กรกฎาคม: "July",
        สิงหาคม: "August",
        กันยายน: "September",
        ตุลาคม: "October",
        พฤศจิกายน: "November",
        ธันวาคม: "December",
      };

      const selectedMonthEng =
        thaiToFullEngMonthMapping[this.selectedMonth] || this.selectedMonth;

      try {
        const response = await fetch(`${API_CALL}/employee/AddPayment2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            payments: this.formEmployee.map((form) => ({
              employeeID: form.employeeID,
              Date: formattedDate,
              round: this.selectedRound,
              month: selectedMonthEng,
              year: formattedYear,
            })),
          }),
        });
        const json = await response.json();
        if (response.ok) {
          console.log(json);
          this.getPaymentTable();
          this.showPopup(this.$t("validation.AddSucc"));
          this.selectedMonth = "";
          this.selectedYear = "";
          this.selectedRound = "";
          this.formEmployee.employeeID = "";
          this.closePopup();
          window.location.reload(); // รีโหลดหน้า
        } else {
          this.showPopup_error2(this.$t("validation.DuplicateSalary"));
          let catch_mouth = this.selectedMonth;
          let catch_round = this.selectedRound;
          let catch_year = this.selectedYear;
          this.formEmployee = [];
          await this.closePopup();
          await this.openPopup();
          this.selectedMonth = catch_mouth;
          this.selectedRound = catch_round;
          this.selectedYear = catch_year;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
    // Fetches employee data from the API
    async getEmployee() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployeeSalary`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Employees = json.data.map((item) => {
            function formatSalary(salary) {
              return salary
                ? salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "";
            }
            return {
              "Employee ID": item.employeeID,
              "Employee Name": item.name,
              "Emp. type": item.employeeType,
              "Tel.": item.phone,
              Email: item.email,
              Salary: formatSalary(item.salary),
              "Bank Name": item.bankName,
              "Bank Account ID": item.bankAccountID,
              Department: item.department,
              Position: item.position,
            };
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
    // Fetches the payment data from the API and updates the payment table
    async getPaymentTable() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getPayment`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();

        if (json.statusCode === 200) {
          this.payments = json.data.map((item) => {
            const PayDate = new Date(item.date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const PaymentDate = PayDate.toLocaleDateString("en-GB", formatDate);

            return {
              "Employee Name": item.employeeName || "-",
              position: item.position.Position,
              ID: item.payment_id,
              employeeID: item.employeeID,
              Date: PaymentDate,
              Round: item.round,
              Month: item.month,
              Year: item.year,
              salary: item.salary,
            };
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
    // Merges the payment data with the employee data for display in the table
    mergeAndDisplayData() {
      this.payments.forEach((payment) => {
        const employee = this.empDataformaintable.find(
          (emp) => emp.employeeID === payment.employeeID
        );
        if (employee) {
          payment["Employee Name"] = employee["Employee Name"];
        }
      });
    },
    // Fetches both employee and payment data, and merges them for display
    async fetchData() {
      await Promise.all([this.getEmployee(), this.getPaymentTable()]);
      this.mergeAndDisplayData();
    },
  },
  created() {
    this.fetchData();
    this.setDefalueSeleteFliter();
  },
};
</script>
