<template>
  <div class="main-page">
    <div class="page-body">
      <div class="mb-4">
        <h2>{{ t("headerExpenses") }}</h2>
      </div>

      <div class="col-md-12">
        <Card class="bg-light">
          <div class="card-body">
            <div class="card-body-p">
              <div class="row">
                <div class="col-12 col-md-7 text-end">
                  <p class="">
                    {{ t("sentenceSummaryYear") }} {{ startDate }} -
                    {{ endDate }}
                  </p>
                </div>
                <div class="col-12 col-md-3">
                  <div
                    class="div-for-formControl custome-filter-date pr-3"
                    v-if="toggleCustomDate"
                  >
                    <div class="mb-3 div-for-formControl form-filter-home">
                      <v-date-picker
                        v-model="custom_filter_start_date"
                        locale="th-TH"
                        :format="formatDatePicker"
                      >
                        <template v-slot="{ inputEvents }">
                          <input
                            class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                            :value="formatDatePicker(custom_filter_start_date)"
                            v-on="inputEvents"
                            placeholder="เลือกวันที่"
                            style="width: 100%"
                          />
                        </template>
                      </v-date-picker>
                    </div>
                    <span class="mdi mdi-minus" style="padding: 10px"></span>
                    <div class="mb-3 div-for-formControl form-filter-home">
                      <v-date-picker
                        v-model="custom_filter_end_date"
                        locale="th-TH"
                        :format="formatDatePicker"
                      >
                        <template v-slot="{ inputEvents }">
                          <input
                            class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                            :value="formatDatePicker(custom_filter_end_date)"
                            v-on="inputEvents"
                            placeholder="เลือกวันที่"
                            style="width: 100%"
                          />
                        </template>
                      </v-date-picker>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-2 mb-2">
                  <div class="select-date-period-dash">
                    <select
                      class="form-control col-sm-9 col-md-6 form-select"
                      @change="filterDataByOption"
                      v-model="selectedOption"
                    >
                      <option value="all">{{ $t("filterDate.all") }}</option>
                      <option value="last7Days">
                        {{ t("filterDate.last7Days") }}
                      </option>
                      <option value="last14Days">
                        {{ t("filterDate.last14Days") }}
                      </option>
                      <option value="last30Days">
                        {{ t("filterDate.last30Days") }}
                      </option>
                      <option value="thisMonth">
                        {{ t("filterDate.thisMonth") }}
                      </option>
                      <option value="lastMonth">
                        {{ t("filterDate.lastMonth") }}
                      </option>
                      <option value="thisQuarter">
                        {{ t("filterDate.thisQuarter") }}
                      </option>
                      <option value="lastQuarter">
                        {{ t("filterDate.lastQuarter") }}
                      </option>
                      <option value="thisYear">
                        {{ t("filterDate.thisYear") }}
                      </option>
                      <option value="lastYear">
                        {{ t("filterDate.lastYear") }}
                      </option>
                      <option value="customDate">
                        {{ t("filterDate.customDate") }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div class="row mb-3 mt-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <select
            class="form-control form-select size-font-sm"
            v-model="searchQuery"
            aria-label="Expense Category select"
          >
            <option value="" selected hidden>
              {{ t("expense.selectCategory") }}
            </option>
            <option value="เงินเดือน">{{ t("expense.salary") }}</option>
            <option value="ต้นทุนสินค้า">{{ t("expense.stock") }}</option>
            <option value="ค่าจ้าง">{{ t("expense.wages") }}</option>
            <option value="ค่าการตลาด">{{ t("expense.marketing") }}</option>
            <option value="อุปกรณ์สํานักงาน">{{ t("expense.office") }}</option>
            <option value="ค่าเช่า">{{ t("expense.rentals") }}</option>
            <option value="อื่นๆ">{{ t("expense.others") }}</option>
          </select>
          
        </div>
        <div class="col-6 col-sm-6 col-md-9 col-lg-9 text-end">
          <a
            class="btn btn-success me-3 size-font-sm me-2"
            @click="openPopup"
            >{{ t("addExpenses") }}</a
          >
          <a
            class="btn btn-outline-secondary mdi mdi-export-variant size-font-sm"
            @click="exportExpense"
          ></a>
        </div>
      </div>

      <div class="expenseTable">
        <tableList
          :tableHeaders="tableHeaders"
          :initialTableData="filteredExpenses"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          v-if="Expenses"
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
  <div class="mb-4">
    <h3 v-if="isAddingMode">{{ t("headerPopupAddExpenses") }}</h3>
    <h3 v-if="isEditMode">{{ t("headerPopupEditExpenses") }}</h3>
  </div>

  <div v-for="field in fieldConfig" :key="field.key" class="mb-3 div-for-formControl">
    <label class="col-sm-5 col-md-6">
      <span v-if="field.required" style="color: red">*</span>
      {{ t(field.label) }}
    </label>

    <div class="col-sm-9 col-md-6" style="display: inline-block; width: 50%;">
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

      <Dropdown
        v-else-if="field.componentType === 'Dropdown'"
        v-model="formData[field.key]"
        :options="this[field.optionsKey]"
        :error="isEmpty[field.key]"
        :placeholder="t(field.placeholder)"
      />

      <textarea
        v-else-if="field.componentType === 'Textarea'"
        v-model="formData[field.key]"
        class="form-control"
        rows="3"
        :maxlength="field.maxlength"
        :class="{ error: isEmpty[field.key] }"
      ></textarea>

      <div v-else-if="field.componentType === 'Upload'">
        <div class="input-group input-upload-custom">
          <label class="input-group-text btn btn-primary">
            {{ t("SelectImage") }}
            <input type="file" hidden @change="previewImage" />
          </label>
          <input
            type="text"
            class="form-control"
            :value="fileName || t('FileImageName')"
            readonly
          />
        </div>
        <div v-if="imageSrc" class="image-preview mt-3">
          <img :src="imageSrc" alt="Preview" style="max-width: 200px; max-height: 200px" />
        </div>
      </div>

      <TextField
        v-else
        v-model="formattedPrice"
        :type="field.type"
        @input="updatePrice"
        @keypress="field.isNumeric ? onlyNumber($event) : null"
        :class="{ error: isEmpty[field.key] }"
      />
    </div>
  </div>

   <div class="modal-footer mb-3">
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addExpense"
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
          @click="editExpense"
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
        <div class="modal-footer mb-3">
          <Button
            :disabled="isLoading"
            customClass="btn btn-danger me-3"
            @click="deleteExpenses"
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
import Popup from "../components/popup.vue";
import tableList from "../components/tableList.vue";
import Button from "../components/button.vue"; // 1. นำเข้า component
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import jsPDF from "jspdf";
import moment from "moment";
moment.locale("th");
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { computed, watch, ref } from "vue";
import "moment/locale/th";
import Card from "../components/Card.vue";
import TextField from "../components/TextField.vue";
import Dropdown from "../components/dropdown.vue";
import formConfig from '../config/field_config/expenses/form_empenses.json';

const API_CALL = config["url"];
const access_token = localStorage.getItem("@access_token");

import th from "vue-datepicker-next/locale/th.es";
import en from "vue-datepicker-next/locale/en.es";

export default {
  name: "Expenses",
  components: {
    Navigate,
    Popup,
    tableList,
    DatePicker,
    Button,
    Card,
    TextField,
    Dropdown
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

    const date = ref(null);

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

    const documentName = computed(() => t("dontHaveExpenses"));

    return {
      date,
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
        // fieldConfig: {
        //   keys: [
        //     "DateExpense",     "cateExpense",     "priceExpense",
        //     "remarkExpense",   "uploadImage"
        //   ],
        //   labels: [
        //     "dateHeaderTable", "cateHeaderTable", "amountmoneyHeaderTable",
        //     "remarkHeaderTable", "FileLabel"
        //   ],
        //   types: [
        //     "date",            "dropdown",        "text",
        //     "textarea",        "upload"
        //   ],
        //   componentTypes: [
        //     "date",            "dropdown",        "text",
        //     "textarea",        "upload"
        //   ]
        // },
      categoryOptions: [
        { value: "salary", text: this.t("expense.salary") },
        { value: "stock", text: this.t("expense.stock") },
        { value: "wages", text: this.t("expense.wages") },
        { value: "marketing", text: this.t("expense.marketing") },
        { value: "office", text: this.t("expense.office") },
        { value: "rentals", text: this.t("expense.rentals") },
        { value: "others", text: this.t("expense.others") },
      ],
      fileName: "",
      Image_pd: [],
      imageSrc: null,
      searchQuery: "",
      Expenses: [],
      startDate: [],
      endDate: [],
      custom_filter_start_date: new Date(),
      custom_filter_end_date: new Date(),
      toggleCustomDate: false,
      BusinessJson: [],
      selectedOption: "all",
      filteredData: [],
      errorMessages: [],
      isPopupVisible_error: false,
      isPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isManagePositionPopupOpen: false,
      isAddPositionPopupOpen: false,
      isLoading: false,
      isPopupVisible: false,
      inputError: false,
      ExportData: [],
      formData: {
        expense_id: "",
        DateExpense: new Date(),
        remarkExpense: "",
        cateExpense: "",
        priceExpense: "",
      },
      isEmpty: {
        expense_id: "",
        DateExpense: "",
        remarkExpense: "",
        cateExpense: "",
        priceExpense: "",
      },
    };
  },

  computed: {
    filteredExpenses() {
      const lang = this.$t("headerLang");
      const query = this.searchQuery.toLowerCase();

      let filteredData = this.Expenses.map((item) => {
        let formattedDate = item.expense_date;
        let realDateObj = null;

        const translatedCategory =
          lang === "TH"
            ? this.$t(`expense.${item.expense_category}`)
            : this.$t(`expense.${item.expense_category}`);

        if (formattedDate.includes("/")) {
          const [day, month, year] = formattedDate.split("/").map(Number);
          const isBuddhistYear = year > 2500;
          const realYear = isBuddhistYear ? year - 543 : year;

          realDateObj = new Date(realYear, month - 1, day);

          const m = moment(`${realYear}-${month}-${day}`).locale(
            lang === "TH" ? "th" : "en"
          );

          if (lang === "TH") {
            const buddhistYear = realYear + 543;
            const monthsInThai = [
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
            ];
            const thaiMonth = monthsInThai[month - 1];

            formattedDate = `${day} ${thaiMonth} ${buddhistYear}`;
          } else {
            formattedDate = m.format("D MMMM YYYY");
          }
        }

        return {
          expense_date_new2: formattedDate,
          expense_date_new: formattedDate,
          expense_category_new: translatedCategory,
          expense_amount_new: item.expense_amount,
          expense_amount_new2: item.expense_amount.toLocaleString(),
          quantity_remark_new: item.quantity_remark,
          realDateObj,
          ...item,
          realDateObj,
        };
      });

      if (this.startDate && this.endDate) {
        let dateStart, dateEnd;

        if (lang === "TH") {
          dateStart = this.parseThaiDate(this.startDate);
          dateEnd = this.parseThaiDate(this.endDate);
        } else {
          dateStart = new Date(this.startDate);
          dateEnd = new Date(this.endDate);
        }

        if (this.selectedOption !== "all") {
          filteredData = filteredData.filter((item) => {
            if (!item.realDateObj) return false;
            return item.realDateObj >= dateStart && item.realDateObj <= dateEnd;
          });
        }
      }

      if (this.searchQuery) {
        filteredData = filteredData.filter((item) =>
          item.expense_category_new.toLowerCase().includes(query)
        );
      }

      console.log(filteredData);
      this.ExportData = filteredData;

      return filteredData;
    },

    formattedPrice: {
      get() {
        return this.formData.priceExpense
          ? new Intl.NumberFormat("en-US").format(this.formData.priceExpense)
          : "";
      },
      set(value) {
        this.formData.priceExpense = Number(value.replace(/,/g, ""));
      },
    },

    tableHeaders() {
      return [
        { label: this.t("expense_id"), key: "expense_id" },
        { label: this.t("dateHeaderTable"), key: "expense_date_new" },
        { label: this.t("cateHeaderTable"), key: "expense_category_new" },
        { label: this.t("amountmoneyHeaderTable"), key: "expense_amount_new" },
        { label: this.t("amountmoneyHeaderTable"), key: "expense_amount_new2" },

        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new" },
        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new66" },
        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new2" },
        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new66" },
        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new3" },
        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new4" },
        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new5" },
        { label: this.t("remarkHeaderTable"), key: "quantity_remark_new6" },
      ];
    },
  },
  watch: {
    "$i18n.locale"(newLocale, oldLocale) {
      this.filterDataByOption();
    },
    custom_filter_start_date() {
      this.filterDataByOption();
    },
    custom_filter_end_date() {
      this.filterDataByOption();
    },
  },
  methods: {
    async previewImage(event) {
      const file = event.target.files[0];
      this.Image_pd = event.target.files[0];
      this.fileName = file ? file.name : "";
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(file);
        this.newImg = true;
      } else {
        this.imageSrc = null;
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
    parseThaiDate(dateStr) {
      if (
        typeof dateStr !== "string" ||
        dateStr.trim() === "" ||
        dateStr.split(" ").length !== 3
      ) {
        return null;
      }
      const monthsInThai = {
        มกราคม: 0,
        กุมภาพันธ์: 1,
        มีนาคม: 2,
        เมษายน: 3,
        พฤษภาคม: 4,
        มิถุนายน: 5,
        กรกฎาคม: 6,
        สิงหาคม: 7,
        กันยายน: 8,
        ตุลาคม: 9,
        พฤศจิกายน: 10,
        ธันวาคม: 11,
      };

      const [dayStr, monthThai, yearStr] = dateStr.split(" ");
      const day = parseInt(dayStr);
      const month = monthsInThai[monthThai.trim()];
      const buddhistYear = parseInt(yearStr);
      const gregorianYear = buddhistYear - 543;

      if (!isNaN(day) && month !== undefined && !isNaN(gregorianYear)) {
        return new Date(gregorianYear, month, day);
      }
      return null;
    },
    exportExpense() {
      const lang = this.$t("headerLang");
      const exportData = this.ExportData.map((item) => {
        const translatedCategory =
          lang === "TH"
            ? this.$t(`expense.${item.expense_category}`)
            : this.$t(`expense.${item.expense_category}`);
        return {
          วันที่:
            lang === "TH"
              ? item.expense_date
              : this.formatDateToThai(item.expense_date),
          หมวดหมู่ค่าใช้จ่าย: translatedCategory,
          "จำนวนเงิน (บาท)": item.expense_amount,
          "หมายเหตุ ": item.quantity_remark,
        };
      });

      const header = Object.keys(exportData[0]).join(",");
      const rows = exportData.map((row) => Object.values(row).join(","));
      const csvContent = "\uFEFF" + [header, ...rows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "รายงานค่าใช้จ่าย.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    formatDateToThai(dateStr) {
      const [day, month, year] = dateStr.split("/").map(Number);
      const thaiMonths = [
        "",
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
      ];
      const thaiYear = year - 543;
      const thaiMonth = thaiMonths[month];
      return `${day} ${thaiMonth} ${thaiYear}`;
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
    parseThaiDateTime(thaiDateTimeStr) {
      const [datePart, timePart] = thaiDateTimeStr.split(" ");
      const [day, month, yearBE] = datePart.split("/");
      const year = parseInt(yearBE) - 543;
      const isoDateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T${timePart}`;
      return new Date(isoDateStr);
    },
    formatDate(date) {
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const monthName = this.t(`months.${this.getMonthKey(monthIndex)}`);
      const formattedYear = this.$i18n.locale === "th" ? year + 543 : year;
      return `${date.getDate()} ${monthName} ${formattedYear}`;
    },
    getMonthKey(monthIndex) {
      const monthKeys = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      return monthKeys[monthIndex];
    },
    filterDataByOption() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor((currentMonth + 3) / 3);
      const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
      const lastQuarterYear =
        currentQuarter === 1 ? currentYear - 1 : currentYear;
      let startDate, endDate;

      switch (this.selectedOption) {
        case "last7Days":
          startDate = new Date();
          startDate.setDate(now.getDate() - 6);
          endDate = now;
          this.toggleCustomDate = false;
          break;
        case "last14Days":
          startDate = new Date();
          startDate.setDate(now.getDate() - 13);
          endDate = now;
          this.toggleCustomDate = false;
          break;
        case "last30Days":
          startDate = new Date();
          startDate.setDate(now.getDate() - 29);
          endDate = now;
          this.toggleCustomDate = false;
          break;
        case "thisMonth":
          startDate = new Date(currentYear, currentMonth, 1);
          endDate = new Date(currentYear, currentMonth + 1, 0);
          this.toggleCustomDate = false;
          break;
        case "lastMonth":
          startDate = new Date(currentYear, currentMonth - 1, 1);
          endDate = new Date(currentYear, currentMonth, 0);
          this.toggleCustomDate = false;
          break;
        case "thisQuarter":
          startDate = new Date(currentYear, (currentQuarter - 1) * 3, 1);
          endDate = new Date(currentYear, currentQuarter * 3, 0);
          this.toggleCustomDate = false;
          break;
        case "lastQuarter":
          startDate = new Date(lastQuarterYear, (lastQuarter - 1) * 3, 1);
          endDate = new Date(lastQuarterYear, lastQuarter * 3, 0);
          this.toggleCustomDate = false;
          break;
        case "thisYear":
          startDate = new Date(currentYear, 0, 1);
          endDate = new Date(currentYear, 11, 31);
          this.toggleCustomDate = false;
          break;
        case "lastYear":
          startDate = new Date(currentYear - 1, 0, 1);
          endDate = new Date(currentYear - 1, 11, 31);
          this.toggleCustomDate = false;
          break;
        case "customDate":
          startDate = this.custom_filter_start_date;
          endDate = this.custom_filter_end_date;
          this.toggleCustomDate = true;
          break;
        default:
          startDate = new Date(
            this.parseThaiDateTime(localStorage.TokenCreate)
          );
          endDate = now;
          this.toggleCustomDate = false;
      }

      this.startDate = this.formatDate(startDate);
      this.endDate = this.formatDate(endDate);
    },
    async getBusiness() {
      const access_token = localStorage.getItem("@access_token");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getBusinessByID`, {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const json = await response.json();
        this.BusinessJson = json.data;
        console.log(this.BusinessJson.TokenCreate);
      } catch (error) {
        console.error("Error fetching data:", error);
        this.showPopup_error("Error fetching data");
      } finally {
        this.isLoading = false;
      }
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages;
        this.isPopupVisible_error = true;
      } else {
        this.showPopup_error(messages);
      }
    },
    openPopup() {
      this.isEmpty = {
        DateExpense: false,
        cateExpense: false,
        priceExpense: false,
      };
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
      this.formData = {
        DateExpense: new Date(),
        expense_id: "",
        remarkExpense: "",
        cateExpense: "",
        priceExpense: "",
      };
      this.clearFile();
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = { department_id: "", department_name: "" };
      this.inputError = false;
      this.isPopupVisible_error = false;
    },
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    openManagePositionPopup() {
      this.isManagePositionPopupOpen = true;
    },
    closeManagePositionPopup() {
      this.isManagePositionPopupOpen = false;
    },
    openAddPositionPopup() {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
    },
    closeAddPositionPopup() {
      this.isAddPositionPopupOpen = false;
      this.formPosition = { position_id: "", position_name: "" };
      this.inputError = false;
    },
    handleEdit(item) {
      this.isEmpty = {
        DateExpense: false,
        cateExpense: false,
        priceExpense: false,
      };
      console.log("item", item);
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      const thaiDate = item.expense_date;
      const [day, month, year] = thaiDate.split("/");
      const convert_expense_date = new Date(year - 543, month - 1, day);
      this.formData = {
        expense_id: item.expense_id,
        DateExpense: convert_expense_date,
        remarkExpense: item.quantity_remark,
        cateExpense: item.expense_category,
        priceExpense: item.expense_amount,
      };
      if (!item.expense_image) {
        this.clearFile();
      } else {
        this.imageSrc = item.expense_image;
      }
      this.getExpense();
    },
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { expense_id: item.expense_id };
    },
    handleEditPosition(item) {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formPosition = { position_id: item.ID, position_name: item.position_name };
    },
    handleDeletePosition(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formPosition = { position_id: item.ID };
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
    async getPosition() {
      try {
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    validateFormData() {
      this.isEmpty = {
        DateExpense: false,
        cateExpense: false,
        priceExpense: false,
      };
      const errorMessages = [];
      if (this.formData.DateExpense === "") {
        this.isEmpty.DateExpense = true;
        errorMessages.push(this.$t("validation.DateExpense"));
      }
      if (this.formData.cateExpense === "") {
        this.isEmpty.cateExpense = true;
        errorMessages.push(this.$t("validation.cateExpense"));
      }
      if (this.formData.priceExpense === "") {
        this.isEmpty.priceExpense = true;
        errorMessages.push(this.$t("validation.priceExpense"));
      }
      if (errorMessages.length > 0) {
        this.showPopup_validate(errorMessages);
        return false;
      } else {
        return true;
      }
    },
    async getExpense() {
      const access_token = localStorage.getItem("@access_token");
      this.errorMessage = [];
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/getExpenses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
        const json = await response.json();
        this.Expenses = json.data.map((item) => ({
          expense_id: item.expense_id,
          expense_date: item.expense_date,
          expense_category: item.expense_category,
          expense_amount: item.expense_amount,
          quantity_remark: item.quantity_remark,
          expense_image: item.expense_image,
        }));
        if (json.statusCode !== 200) {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    clearFile() {
      this.fileName = "";
      this.Image_pd = [];
      this.imageSrc = null;
      this.newImg = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    formatDatePickerTH(date) {
      if (!date || isNaN(new Date(date))) return "";
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear() + 543;
      return `${day}/${month}/${year}`;
    },
    async addExpense() {
      const access_token = localStorage.getItem("@access_token");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;
      this.formData.DateExpense = this.formatDatePickerTH(
        this.formData.DateExpense
      );
      try {
        const response = await fetch(`${API_CALL}/product/addExpenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            expense_date: this.formData.DateExpense,
            expense_category: this.formData.cateExpense,
            expense_amount: parseInt(this.formData.priceExpense),
            quantity_remark: this.formData.remarkExpense,
          }),
        });
        const json = await response.json();
        console.log(json);
        if (json.statusCode === 201) {
          this.isPopupVisible_error = false;
          this.showPopup(this.$t("validation.AddSucc"));
          this.isPopupOpen = false;
          this.formData = {
            DateExpense: "",
            cateExpense: "",
            priceExpense: "",
            remarkExpense: "",
          };
          const formDataImage = new FormData();
          formDataImage.append("expense_id", json.data.expense_id);
          formDataImage.append("file", this.Image_pd);
          console.log("json.data.expense_id", json.data.expense_id);
          const imageExpense = await fetch(
            `${API_CALL}/Quotation/AddExpense_img`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${access_token}` },
              body: formDataImage,
            }
          );
          this.getExpense();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async editExpense() {
      const access_token = localStorage.getItem("@access_token");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;
      const date = new Date(this.formData.DateExpense);
      const DateExpense = `${date.getDate()}/${date.getMonth() + 1}/${
        date.getFullYear() + 543
      }`;
      try {
        const response = await fetch(
          `${API_CALL}/product/editExpenses/${this.formData.expense_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
              expense_date: DateExpense,
              expense_category: this.formData.cateExpense,
              expense_amount: parseInt(this.formData.priceExpense),
              quantity_remark: this.formData.remarkExpense,
            }),
          }
        );
        const json = await response.json();
        console.log(json);
        if (json.statusCode === 200) {
          this.showPopup(this.$t("validation.AddSucc"));
          this.isPopupOpen = false;
          this.formData = {
            DateExpense: "",
            cateExpense: "",
            priceExpense: "",
            remarkExpense: "",
          };
          const formDataImage = new FormData();
          console.log("edit succ", json.data);
          formDataImage.append("expense_id", json.data);
          formDataImage.append("file", this.Image_pd);
          const imageExpense = await fetch(
            `${API_CALL}/Quotation/AddExpense_img`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${access_token}` },
              body: formDataImage,
            }
          );
          console.log("imageExpense", imageExpense);
          this.getExpense();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteExpenses() {
      const access_token = localStorage.getItem("@access_token");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;
      try {
        const response = await fetch(
          `${API_CALL}/product/deleteExpenses/${this.formData.expense_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const json = await response.json();
        console.log(json);
        if (json.statusCode === 200) {
          this.showPopup(this.$t("validation.DelateSucc"));
          this.closeDeleteConfirmPopup();
          this.getExpense();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    await this.getBusiness();
    await this.filterDataByOption();
    await this.getExpense();
  },
};
</script>

