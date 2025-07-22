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
    <!-- <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <div class="mb-3">
        <h2 v-if="isAddingMode">{{ t("headerPopupAddEmployee") }}</h2>
        <h2 v-if="isEditMode">{{ t("headerPopupEditEmployee") }}</h2>
      </div>
      <h5 style="text-decoration: underline">{{ t("employeeInformation") }}</h5> -->
      <!-- <div class="mb-3 div-for-formControl"> -->
        <!-- <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("title") }}</label
        >
        <Dropdown
          v-model="formData.title"
          :options="titleOptions"
          class="col-sm-9 col-md-6"
          :error="isEmpty.title"
        />
      </div> -->
      <!-- <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("firstname") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.F_name"
          type="text"
          required
          :class="{ error: isEmpty.F_name }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("lastname") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.L_name"
          type="text"
          required
          :class="{ error: isEmpty.L_name }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <div class="col-6 col-sm-6 col-md-6">
          <label class="col-sm-6 col-md-6"
            ><span style="color: red">*</span>{{ t("birthdate") }}</label
          >
        </div>
        <div class="col-6 col-sm-6 col-md-6">
          <v-date-picker
            v-model="formData.Birthdate"
            locale="th-TH"
            :format="formatDatePicker"
          >
            <template v-slot="{ inputEvents }">
              <input
                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                :value="formatDatePicker(formData.Birthdate)"
                v-on="inputEvents"
                placeholder="เลือกวันที่"
                style="width: 100%"
              />
            </template>
          </v-date-picker>
        </div>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("address") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Address"
          type="text"
          required
          :class="{ error: isEmpty.Address }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("phoneNum") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Phone_num"
          type="text"
          required
          :class="{ error: isEmpty.Phone_num }"
          @keypress="validateInput"
          maxlength="10"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("NID") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.NID_num"
          type="text"
          required
          :class="{ error: isEmpty.NID_num }"
          @keypress="validateInput"
          maxlength="13"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("email") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Email"
          type="text"
          required
          :class="{ error: isEmpty.Email }"
        />
      </div>
      <h5 style="text-decoration: underline">{{ t("headerAboutJob") }}</h5>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("empType") }}</label
        >
        <Dropdown
          v-model="formData.employeeType"
          :options="employeeTypeOptions"
          class="col-sm-9 col-md-6"
          :error="isEmpty.employeeType"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("department") }}</label
        >
        <div class="col-sm-9 col-md-6">
          <Dropdown
            v-model="formData.departmentID"
            :options="departmentOptions"
            :error="isEmpty.departmentID || Departments.length === 0"
            :disabled="Departments.length === 0"
            style="width: 100%"
          />

          <div v-if="Departments.length === 0" class="text-danger mt-1">
            {{ t("pleaseDepartment") }}
          </div>
        </div>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("position") }}</label
        >
        <div class="col-sm-9 col-md-6">
          <Dropdown
            v-model="formData.PositionID"
            :options="positionOptions"
            :error="isEmpty.PositionID || Positions.length === 0"
            :disabled="Positions.length === 0"
            style="width: 100%"
          />
          <div v-if="Positions.length === 0" class="text-danger mt-1">
            {{ t("pleasePosition") }}
          </div>
        </div>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("salary") }}</label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Salary"
          type="text"
          required
          :class="{ error: isEmpty.Salary }"
          @keypress="validateInput"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <div class="col-6 col-sm-6 col-md-6">
          <label class="col-sm-6 col-md-6">{{ t("startWorking") }}</label>
        </div>
        <div class="col-6 col-sm-6 col-md-6">
          <v-date-picker
            v-model="formData.start_working_date"
            locale="th-TH"
            :format="formatDatePicker"
          >
            <template v-slot="{ inputEvents }">
              <input
                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                :value="formatDatePicker(formData.start_working_date)"
                v-on="inputEvents"
                placeholder="เลือกวันที่"
                style="width: 100%"
              />
            </template>
          </v-date-picker>
        </div>
      </div>
      <h5 style="text-decoration: underline">{{ t("headerAboutBank") }}</h5>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("bankname") }}</label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.bankName"
          type="text"
          required
          :class="{ error: isEmpty.bankName }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("bankaccount") }}</label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.bankAccountID"
          type="text"
          required
          :class="{ error: isEmpty.bankAccountID }"
          maxlength="15"
          @keypress="validateInput"
        />
      </div> -->
      <!-- <div class="mb-3 modal-footer">
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
    </Popup> -->
    <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
  <div class="mb-3">
    <h2 v-if="isAddingMode">{{ t("headerPopupAddEmployee") }}</h2>
    <h2 v-if="isEditMode">{{ t("headerPopupEditEmployee") }}</h2>
  </div>

  <div v-for="(key, index) in employeeFieldConfig.keys" :key="key">
    <h5 v-if="employeeFieldConfig.components[index] === 'heading'" style="text-decoration: underline" class="mt-3 mb-3">
      {{ t(employeeFieldConfig.labels[index]) }}
    </h5>

    <div v-else class="mb-3 div-for-formControl">
      <label class="col-sm-5 col-md-6">
        <span v-if="key !== 'Salary' && key !== 'bankName' && key !== 'bankAccountID' && key !== 'start_working_date'" style="color: red">*</span>
        {{ t(employeeFieldConfig.labels[index]) }}
      </label>

      <div class="col-sm-9 col-md-6" style="display: inline-block; width: 50%;">
        <TextField
          v-if="employeeFieldConfig.components[index] === 'text' || employeeFieldConfig.components[index] === 'email'"
          v-model="formData[key]"
          :type="employeeFieldConfig.components[index]"
          :error="isEmpty[key]"
          :maxlength="key === 'Phone_num' ? 10 : key === 'NID_num' ? 13 : key === 'bankAccountID' ? 15 : null"
          @keypress="['Phone_num', 'NID_num', 'Salary', 'bankAccountID'].includes(key) ? validateInput($event) : null"
        />

        <Dropdown
          v-if="employeeFieldConfig.components[index] === 'dropdown'"
          v-model="formData[key]"
          :error="isEmpty[key]"
          :options="getDropdownOptions(key)"
          style="width: 100%"
          :disabled="(key === 'departmentID' && Departments.length === 0) || (key === 'PositionID' && Positions.length === 0)"
        />

        <v-date-picker
          v-if="employeeFieldConfig.components[index] === 'datepicker'"
          v-model="formData[key]"
          locale="th-TH"
          :format="formatDatePicker"
        >
          <template v-slot="{ inputEvents }">
            <input
              class="form-control"
              :value="formatDatePicker(formData[key])"
              v-on="inputEvents"
              placeholder="เลือกวันที่"
              style="width: 100%"
              :class="{ 'border-danger': isEmpty[key] }"
            />
          </template>
        </v-date-picker>

        <div v-if="(key === 'departmentID' && Departments.length === 0) || (key === 'PositionID' && Positions.length === 0)" class="text-danger mt-1">
          {{ key === 'departmentID' ? t("pleaseDepartment") : t("pleasePosition") }}
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
    <Popup :isOpen="isPopupOpenLeave" :closePopup="closePopupLeave">
      <div class="mb-3">
        <h2>จัดการวันลา</h2>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("empname") }}</label>
        <!-- <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formDataLeave.employeeID"
          type="text"
          required
          :class="{ error: isEmpty.employeeID }"
        >
          <option
            v-for="employ in employeesSalaries"
            :key="employ.ID"
            :value="employ.ID"
          >
            {{ employ.Name }}
          </option>
        </select> -->
        <Dropdown
          v-model="formDataLeave.employeeID"
          :options="employeeLeaveOptions"
          class="col-sm-9 col-md-6"
          :error="isEmpty.employeeID"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("leavetype") }}</label>
        <!-- <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formDataLeave.detail"
          type="text"
          required
          :class="{ error: isEmpty.detail }"
        >
          <option>ลาป่วย</option>
          <option>ลากิจ</option>
          <option>ลาพักร้อน</option>
          <option>ลาครอด</option>
        </select> -->
        <Dropdown
          v-model="formDataLeave.detail"
          :options="leaveTypeOptions"
          class="col-sm-9 col-md-6"
          :error="isEmpty.detail"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-6 col-sm-6 col-md-6">{{ t("date") }}</label>
        <div class="row">
          <div class="col-md-5">
            <DatePicker
              v-model:value="formDataLeave.date"
              format="DD/MM/YYYY"
              value-type="date"
              placeholder="DD/MM/YYYY"
              class="form-control"
              :class="{ error: isEmpty.date }"
              :formatter="momentFormat"
              :lang="currentLocale"
            />
          </div>
          -
          <div class="col-md-5">
            <DatePicker
              v-model:value="formDataLeave.dateEnd"
              format="DD/MM/YYYY"
              value-type="date"
              placeholder="DD/MM/YYYY"
              class="form-control"
              :class="{ error: isEmpty.dateEnd }"
              :formatter="momentFormat"
              :lang="currentLocale"
            />
          </div>
        </div>
      </div>
      <div class="mb-3 modal-footer">
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
          @click="AddLeave"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </Button>
        <Button customClass="btn btn-secondary" @click="closePopupLeave">
          {{ t("buttonCancel") }}
        </Button>
      </div>
    </Popup>
    <Popup :isOpen="isPopupOpenOvertime" :closePopup="closePopupOvertime">
      <div class="mb-3">
        <h2>จัดการการทำงานล่วงเวลา</h2>
      </div>

      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("empname") }}</label>
        <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formDataOvertime.employeeID"
          type="text"
          required
          :class="{ error: inputError }"
        >
          <option
            v-for="employ in employeesSalaries"
            :key="employ.ID"
            :value="employ.ID"
          >
            {{ employ.Name }}
          </option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("quotationRemark") }}</label>
        <textarea
          class="col-sm-5 col-md-6 label-textarea"
          v-model="formDataOvertime.detail"
          type="text"
          required
          :class="{ error: inputError }"
          maxlength="255"
        />
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
        <label class="col-sm-5 col-md-6">จำนวนชั่วโมง: </label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formDataOvertime.hours"
          type="text"
          required
          :class="{ error: inputError }"
        />
      </div>

      <div class="mb-3 modal-footer">
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
          @click="AddOvertime"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </Button>
        <Button customClass="btn btn-secondary" @click="closePopupOvertime">
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

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");
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

    const months = computed(() => monthList[locale.value] || monthList.en);
    const documentName = computed(() => t("dontHaveEmployee"));

    return {
      momentFormat,
      currentLocale,
      months,
      t,
      lang,
      documentName,
    };
  },
  // ... The rest of your script remains unchanged
  data() {
    return {
      employeeFieldConfig: {
        keys: [
          'HEADING_1', // Key สำหรับหัวข้อ "ข้อมูลพนักงาน"
          'title', 'F_name', 'L_name', 'Birthdate', 'Address', 'Phone_num', 'NID_num', 'Email',
          'HEADING_2', // Key สำหรับหัวข้อ "ข้อมูลเกี่ยวกับงาน"
          'employeeType', 'departmentID', 'PositionID', 'Salary', 'start_working_date',
          'HEADING_3', // Key สำหรับหัวข้อ "ข้อมูลเกี่ยวกับธนาคาร"
          'bankName', 'bankAccountID'
        ],
        labels: [
          'employeeInformation',
          'title', 'firstname', 'lastname', 'birthdate', 'address', 'phoneNum', 'NID', 'email',
          'headerAboutJob',
          'empType', 'department', 'position', 'salary', 'startWorking',
          'headerAboutBank',
          'bankname', 'bankaccount'
        ],
        components: [
          'heading',
          'dropdown', 'text', 'text', 'datepicker', 'text', 'text', 'text', 'email',
          'heading',
          'dropdown', 'dropdown', 'dropdown', 'text', 'datepicker',
          'heading',
          'text', 'text'
        ],
      },
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
        employeeID: "",
        title: "",
        F_name: "",
        L_name: "",
        Address: "",
        Birthdate: new Date(),
        NID_num: "",
        Phone_num: "",
        Email: "",
        departmentID: "",
        PositionID: "",
        start_working_date: new Date(),
        Salary: "",
        employeeType: "",
        bankName: "",
        bankAccountID: "",
        positions: "",
        status: "active",
      },
      isEmpty: {
        employeeID: "",
        title: false,
        F_name: false,
        L_name: false,
        Address: false,
        Birthdate: false,
        NID_num: false,
        Phone_num: false,
        Email: false,
        departmentID: false,
        PositionID: false,
        start_working_date: false,
        Salary: false,
        employeeType: false,
        bankName: false,
        bankAccountID: false,
        positions: false,
        status: "active",
      },
      formDataLeave: {
        ID: "",
        employeeID: "",
        detail: "",
        date: "",
        dateEnd: "",
      },
      formDataOvertime: {
        ID: "",
        employeeID: "",
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
        value: dep.departmentID,
        text: dep.departmentName,
      }));
    },
    positionOptions() {
      if (!this.Positions) return [];
      return this.Positions.map((pos) => ({
        value: pos.PositionID,
        text: pos.Position,
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
        { label: this.t("addressHeaderTable"), key: "Address" },
        { label: this.t("birthdateHeaderTable"), key: "Birthdate" },
        { label: this.t("NIDHeaderTable"), key: "National ID" },
        { label: this.t("telHeaderTable"), key: "Tel." },
        { label: this.t("emailHeaderTable"), key: "Email" },
        {
          label: this.t("startworkingdateHeaderTable"),
          key: "Start Working Date",
        },
        { label: this.t("salaryHeaderTable"), key: "Salary" },
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
          key: "employeeID",
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

      const monthMapping = {
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

      const titleMapping = {
        Miss: "นางสาว",
        "Mr.": "นาย",
        "Mrs.": "นาง",
      };

      if (this.t("headerLang") === "TH") {
        console.log("filteredEmployees++", filteredEmployees);
        filteredEmployees = filteredEmployees.map((emp) => ({
          ...emp,
          Birthdate: emp.Birthdate
            ? String(emp.Birthdate)
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
            emp["Position"]
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
        const monthMapping = {
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
     getDropdownOptions(key) {
    switch (key) {
      case 'title':
        return this.titleOptions;
      case 'employeeType':
        return this.employeeTypeOptions;
      case 'departmentID':
        return this.departmentOptions;
      case 'PositionID':
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
      this.formData.Birthdate =
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
      this.formDataLeave.employeeID = employee.ID;
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
        employeeID: "",
        title: "",
        F_name: "",
        L_name: "",
        Address: "",
        Birthdate: "",
        NID_num: "",
        Phone_num: "",
        Email: "",
        departmentID: "",
        PositionID: "",
        start_working_date: "",
        Salary: "",
        employeeType: "",
        bankName: "",
        bankAccountID: "",
        positions: "",
        status: "",
      };
      this.isEmpty = {
        title: false,
        F_name: false,
        L_name: false,
        Address: false,
        Birthdate: false,
        NID_num: false,
        Phone_num: false,
        Email: false,
        departmentID: false,
        PositionID: false,
        start_working_date: false,
        Salary: false,
        employeeType: false,
        bankName: false,
        bankAccountID: false,
      };
      this.formData.status = "active";
      this.inputError = false;
      this.isPopupVisible_error = false;
    },
    closePopupLeave() {
      this.isPopupOpenLeave = false;
      this.formDataLeave = { ID: "", employeeID: "", detail: "", date: "" };
      this.isEmpty = {
        employeeID: false,
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
        employeeID: "",
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
        ? item.department.map((department) => department.departmentName)
        : [];
      let positions = Array.isArray(item.position)
        ? item.position.map((position) => position.Position)
        : [];
      if (item.Title === "นาย") {
        item.Title = "Mr.";
      } else if (item.Title === "นาง") {
        item.Title = "Mrs.";
      } else if (item.Title === "นางสาว") {
        item.Title = "Miss";
      }
      const filteredEmp = this.employees.filter((emp) => emp.ID === item.ID);
      let Birthdate = [];
      let startingworkdate = [];
      if (filteredEmp[0].Birthdate) {
        Birthdate = new Date(filteredEmp[0].Birthdate + " GMT+0700");
        Birthdate.toString();
      } else {
        Birthdate = new Date();
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
        employeeID: item.ID,
        title: item.Title,
        F_name: item.Name.split(" ")[0],
        L_name: item.Name.split(" ")[1],
        Address: item.Address,
        Birthdate: Birthdate,
        NID_num: item["National ID"],
        Phone_num: item["Tel."],
        Email: item.Email,
        departmentID: item.departmentID,
        PositionID: item.PositionID,
        start_working_date: startingworkdate,
        Salary: item.Salary,
        employeeType: item["Emp. type"],
        bankName: item["Bank Name"],
        bankAccountID: item["Bank Account ID"],
        departments: departments.join(", "),
        positions: positions.join(", "),
        status: item.status,
      };
      this.getEmployee();
    },
    handleDelete(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { employeeID: item.ID };
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
          item.Address || "",
          this.formatDateToThai(item.Birthdate),
          item["National ID"] || "",
          item["Tel."] || "",
          item.Email || "",
          item.Department || "",
          item.Position || "",
          this.formatDateToThai(item["Start Working Date"]),
          String(item.Salary).replace(/,/g, "") || "",
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
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployee`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          console.log("-----", json.data);
          this.employees = json.data.map((item) => {
            let departments = item.department
              ? [item.department.departmentName]
              : [];
            let positions = item.position ? [item.position.Position] : [];
            const BD = new Date(item.Birthdate);
            const startWorkingDate = new Date(item.start_working_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Birthdate =
              item.Birthdate && item.Birthdate !== ""
                ? new Date(item.Birthdate).toLocaleDateString(
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
              ID: item.employeeID,
              Title: item.title,
              Name: item.F_name + " " + item.L_name,
              Address: item.Address,
              Birthdate: Birthdate,
              "National ID": item.NID_num,
              "Tel.": item.Phone_num,
              Email: item.Email,
              "Start Working Date": startWorking,
              Salary: formatSalary(item.Salary),
              "Emp. type": item.employeeType,
              "Bank Name": item.bankName,
              "Bank Account ID": item.bankAccountID,
              Department: departments.join(", "),
              Position: positions.join(", "),
              departmentID: item.departmentID,
              PositionID: item.PositionID,
              status: item.Status,
            };
            return initialTableData;
          });
          this.getLeave();
          this.getOvertime();
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
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployeeSalary`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          console.log("+++++", json.data);
          this.employeesSalaries = json.data.map((item) => {
            let departments = item.department
              ? [item.department.departmentName]
              : [];
            let positions = item.position ? [item.position.Position] : [];
            const BD = new Date(item.Birthdate);
            const startWorkingDate = new Date(item.start_working_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Birthdate = BD.toLocaleDateString("en-GB", formatDate);
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
            let initialTableData = { ID: item.employeeID, Name: item.name };
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
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getDepartment`, {
          headers: { Authorization: `Bearer ${accessToken}` },
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
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getPosition`, {
          headers: { Authorization: `Bearer ${accessToken}` },
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
    async getLeave() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getLeave`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Leaving = json.data.map((item) => {
            const DateLeave = new Date(item.date);
            const DateLeaveEnd = new Date(item.dateEnd);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const DateLeaving = DateLeave.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const DateLeavingEnd = DateLeaveEnd.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const employee = this.employees.find(
              (emp) => emp.ID === item.employeeID
            );
            const employeeName = employee ? employee.Name : "Unknown";
            let initialTableData = {
              ID: item.leaving_id,
              Name: employeeName,
              detail: item.detail,
              date: DateLeaving,
              dateEnd: DateLeavingEnd,
            };
            return initialTableData;
          });
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getOvertime() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getOvertime`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Overtimes = json.data.map((item) => {
            const DateLeave = new Date(item.date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const DateLeaving = DateLeave.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const employeeName = `${item.employee.F_name} ${item.employee.L_name}`;
            let initialTableData = {
              ID: item.leaving_id,
              Name: employeeName,
              detail: item.detail,
              date: DateLeaving,
              hours: item.hours,
            };
            return initialTableData;
          });
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    validateLeave() {
      this.isEmpty.employeeID = false;
      this.isEmpty.detail = false;
      this.isEmpty.date = false;
      this.isEmpty.dateEnd = false;
      let errorMessages2 = [];
      if (this.formDataLeave.employeeID === "") {
        this.isEmpty.employeeID = true;
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
        F_name: false,
        L_name: false,
        Address: false,
        Birthdate: false,
        NID_num: false,
        Phone_num: false,
        Email: false,
        departmentID: false,
        PositionID: false,
        start_working_date: false,
        Salary: false,
        employeeType: false,
        bankName: false,
        bankAccountID: false,
      };
      let errorMessages = [];
      if (this.formData.title === "") {
        this.isEmpty.title = true;
        errorMessages.push(this.$t("validation.title"));
      }
      if (this.formData.F_name === "") {
        this.isEmpty.F_name = true;
        errorMessages.push(this.$t("validation.F_name"));
      }
      if (this.formData.L_name === "") {
        this.isEmpty.L_name = true;
        errorMessages.push(this.$t("validation.L_name"));
      }
      if (this.formData.Address === "") {
        this.isEmpty.Address = true;
        errorMessages.push(this.$t("validation.Address"));
      }
      if (this.formData.Birthdate === "") {
        this.isEmpty.Birthdate = true;
        errorMessages.push(this.$t("validation.Birthdate"));
      }
      if (this.formData.NID_num === "") {
        this.isEmpty.NID_num = true;
        errorMessages.push(this.$t("validation.NID_num"));
      } else if (this.formData.NID_num.length !== 13) {
        this.isEmpty.NID_num = true;
        errorMessages.push(this.$t("validation.NID_num_length"));
      }
      const isDuplicateNID_num = this.employees.some(
        (item) =>
          item["National ID"].trim() === this.formData.NID_num.trim() &&
          item.ID !== this.formData.employeeID
      );
      if (isDuplicateNID_num) {
        this.isEmpty.NID_num = true;
        errorMessages.push(this.$t("validation.duplicateNID_num"));
      }
      if (this.formData.Phone_num === "") {
        this.isEmpty.Phone_num = true;
        errorMessages.push(this.$t("validation.Phone_num"));
      } else if (
        !this.formData.Phone_num ||
        this.formData.Phone_num.length < 9 ||
        this.formData.Phone_num.length > 10
      ) {
        this.isEmpty.Phone_num = true;
        errorMessages.push(this.$t("validation.Phone_num_length"));
      }
      const isDuplicatePhone = this.employees.some(
        (item) =>
          item["Tel."].trim() === this.formData.Phone_num.trim() &&
          item.ID !== this.formData.employeeID
      );
      if (isDuplicatePhone) {
        this.isEmpty.Phone_num = true;
        errorMessages.push(this.$t("validation.duplicatePhone"));
      }
      if (this.formData.Email === "") {
        this.isEmpty.Email = true;
        errorMessages.push(this.$t("validation.Email"));
      }
      if (
        this.formData.departmentID === "" ||
        this.formData.departmentID === null
      ) {
        this.isEmpty.departmentID = true;
        errorMessages.push(this.$t("validation.departmentID"));
      }
      if (
        this.formData.PositionID === "" ||
        this.formData.PositionID === null
      ) {
        this.isEmpty.PositionID = true;
        errorMessages.push(this.$t("validation.PositionID"));
      }
      if (this.formData.start_working_date === "") {
        this.isEmpty.start_working_date = true;
        errorMessages.push(this.$t("validation.start_working_date"));
      }
      if (this.formData.employeeType === "") {
        this.isEmpty.employeeType = true;
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
      const accessToken = localStorage.getItem("@accessToken");
      if (!this.validateFormData()) return;
      this.isLoading = true;
      const date_Birthdate = new Date(this.formData.Birthdate);
      date_Birthdate.setFullYear(date_Birthdate.getFullYear() - 543);
      try {
        const response = await fetch(`${API_CALL}/employee/AddEmployee`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: this.formData.title,
            F_name: this.formData.F_name,
            L_name: this.formData.L_name,
            Address: this.formData.Address,
            Birthdate: this.formData.Birthdate,
            NID_num: this.formData.NID_num,
            Phone_num: this.formData.Phone_num,
            Email: this.formData.Email,
            departmentID: this.formData.departmentID,
            PositionID: this.formData.PositionID,
            start_working_date: this.formData.start_working_date,
            Salary: this.formData.Salary,
            employeeType: this.formData.employeeType,
            bankName: this.formData.bankName,
            bankAccountID: this.formData.bankAccountID,
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
            employeeID: "",
            title: "",
            F_name: "",
            L_name: "",
            Address: "",
            Birthdate: "",
            NID_num: "",
            Phone_num: "",
            Email: "",
            departmentID: "",
            PositionID: "",
            start_working_date: "",
            Salary: "",
            employeeType: "",
            bankName: "",
            bankAccountID: "",
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
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateLeave())) return;
      this.isLoading = true;
      if (this.isEditMode === false) {
        try {
          const response = await fetch(`${API_CALL}/employee/AddLeave`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              employeeID: this.formDataLeave.employeeID,
              detail: this.formDataLeave.detail,
              date: this.formDataLeave.date,
              dateEnd: this.formDataLeave.dateEnd,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getLeave();
            console.log("Manage successfully");
            this.showPopup(this.$t("validation.AddSucc"));
            this.formDataLeave = {
              employeeID: "",
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
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                employeeID: this.formDataLeave.employeeID,
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
            this.getLeave();
            this.closePopupLeave();
            this.formDataLeave = {
              employeeID: "",
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
      const accessToken = localStorage.getItem("@accessToken");
      if (
        this.formDataOvertime.employeeID === "" ||
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
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              employeeID: this.formDataOvertime.employeeID,
              detail: this.formDataOvertime.detail,
              date: this.formDataOvertime.date,
              hours: this.formDataOvertime.hours,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getOvertime();
            console.log("Manage successfully");
            this.showPopup(this.$t("validation.AddSucc"));
            this.formDataOvertime = {
              employeeID: "",
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
      const accessToken = localStorage.getItem("@accessToken");
      function parseSalary(salaryString) {
        if (salaryString !== null && typeof salaryString !== "undefined") {
          return parseFloat(salaryString.replace(/,/g, ""));
        }
        return null;
      }
      const employee = this.formData.employeeID;
      const date_Birthdate = new Date(this.formData.Birthdate);
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
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              title: this.formData.title,
              F_name: this.formData.F_name,
              L_name: this.formData.L_name,
              Address: this.formData.Address,
              Birthdate: this.formData.Birthdate,
              NID_num: this.formData.NID_num,
              Phone_num: this.formData.Phone_num,
              Email: this.formData.Email,
              departmentID: this.formData.departmentID,
              PositionID: this.formData.PositionID,
              start_working_date: this.formData.start_working_date,
              Salary: parseSalary(this.formData.Salary),
              employeeType: this.formData.employeeType,
              bankName: this.formData.bankName,
              bankAccountID: this.formData.bankAccountID,
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
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const employeeID = this.formData.employeeID;
      try {
        const response = await fetch(
          `${API_CALL}/employee/DeleteEmployee/${employeeID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ employeeID: employeeID }),
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getEmployee();
          this.employees = this.employees.filter(
            (item) => item.employeeID !== employeeID
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
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const id = this.leaving_id;
      try {
        const response = await fetch(`${API_CALL}/employee/DeleteLeave/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ leaving_id: id }),
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getLeave();
          this.getOvertime();
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
    this.getOvertime();
  },
};
</script>

