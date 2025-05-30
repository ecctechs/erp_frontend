<template>
  <div class="main-page">
    <div class="page-body">
      <div class="mb-4">
        <h2>{{ t("headerExpenses") }}</h2>
      </div>

      <div class="col-md-12">
        <div class="card bg-light">
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
                      <!-- <DatePicker
                        v-model:value="custom_filter_start_date"
                        format="DD/MM/YYYY"
                        value-type="date"
                        placeholder="DD/MM/YYYY"
                        class="form-control"
                        :formatter="momentFormat"
                        :lang="currentLocale"
                        @change="filterDataByOption"
                      /> -->
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
                      <!-- <DatePicker
                        v-model:value="custom_filter_end_date"
                        format="DD/MM/YYYY"
                        value-type="date"
                        placeholder="DD/MM/YYYY"
                        class="form-control"
                        :formatter="momentFormat"
                        :lang="currentLocale"
                        @change="filterDataByOption"
                      /> -->
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
        </div>
      </div>
      <div class="row mb-3 mt-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <!-- <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          /> -->
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
        <!-- <div class="col-1 col-sm-1 col-md-7 col-lg-7"></div> -->
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
      <div class="mb-3">
        <label class="col-sm-5 col-md-6 mb-3"
          ><span style="color: red">*</span>{{ t("dateHeaderTable") }}</label
        >
        <!-- <DatePicker
          v-model:value="formData.DateExpense"
          format="DD/MM/YYYY"
          value-type="format"
          placeholder="DD/MM/YYYY"
          class="form-control"
          :formatter="momentFormat"
          :lang="currentLocale"
          :class="{ error: isEmpty.DateExpense }"
        /> -->

        <v-date-picker
          v-model="formData.DateExpense"
          locale="th-TH"
          :format="formatDatePicker"
        >
          <template v-slot="{ inputEvents }">
            <input
              class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
              :value="formatDatePicker(formData.DateExpense)"
              v-on="inputEvents"
              placeholder="เลือกวันที่"
              style="width: 100%"
            />
          </template>
        </v-date-picker>
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6 mb-3"
          ><span style="color: red">*</span>{{ t("cateHeaderTable") }}</label
        >
        <select
          class="form-control form-select size-font-sm"
          v-model="formData.cateExpense"
          aria-label="Expense Category select"
          :class="{ error: isEmpty.cateExpense }"
        >
          <option value="" selected hidden>
            {{ t("expense.selectCategory") }}
          </option>
          <option value="salary">{{ t("expense.salary") }}</option>
          <option value="stock">{{ t("expense.stock") }}</option>
          <option value="wages">{{ t("expense.wages") }}</option>
          <option value="marketing">{{ t("expense.marketing") }}</option>
          <option value="office">{{ t("expense.office") }}</option>
          <option value="rentals">{{ t("expense.rentals") }}</option>
          <option value="others">{{ t("expense.others") }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6 mb-3"
          ><span style="color: red">*</span
          >{{ t("amountmoneyHeaderTable") }}</label
        >
        <input
          class="form-control col-sm-7 col-md-6"
          v-model="formattedPrice"
          type="text"
          id="price"
          @input="updatePrice"
          @keypress="onlyNumber"
          :class="{ error: isEmpty.priceExpense }"
        />
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6 mb-3">{{
          t("remarkHeaderTable")
        }}</label>
        <textarea
          v-model="formData.remarkExpense"
          class="form-control"
          rows="3"
          @input="onInput"
          maxlength="220"
          :class="{ error: isEmpty.remarkExpense }"
        ></textarea>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("FileLabel") }}</label>
        <div class="input-group input-upload-custom">
          <label class="input-group-text btn btn-primary">
            {{ t("SelectImage") }}
            <input type="file" hidden @change="previewImage" />
          </label>
          <input
            type="text"
            class="form-control"
            :value="fileName || t('FileImageName')"
            ref="fileInput"
            readonly
          />
        </div>
      </div>
      <div class="mb-5 div-for-formControl-textarea">
        <label class="col-sm-5 col-md-6 label-textarea"></label>
        <div class="text-editor">
          <div v-if="imageSrc" class="image-preview mt-3">
            <img
              :src="imageSrc"
              alt="Preview"
              style="max-width: 200px; max-height: 200px"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer mb-3">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
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
        </button>
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
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
        <div class="modal-footer mb-3">
          <button
            :disabled="isLoading"
            class="btn btn-danger me-3"
            @click="deleteExpenses"
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
import tableList from "../components/tableList.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import jsPDF from "jspdf";
import moment from "moment";
moment.locale("th");
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { computed, watch, ref } from "vue";
import "moment/locale/th";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

// ✅ นำเข้า locale ภาษาไทยและอังกฤษ
import th from "vue-datepicker-next/locale/th.es";
import en from "vue-datepicker-next/locale/en.es";

export default {
  name: "Expenses",
  components: {
    Navigate, // Navigation component
    Popup, // Popup component
    tableList,
    DatePicker, // Table component to display departments and positions
  },
  setup() {
    const { t } = useI18n();
    const { locale } = useI18n();
    const lang = computed(() => t("lang"));

    const currentLocale = computed(() => {
      return {
        ...(locale.value === "th" ? th : en), // ✅ ใช้ค่าจาก locale ปัจจุบัน
        yearFormat:
          locale.value === "en" ? moment().year() : moment().year() + 543, // ✅ แปลงปี พ.ศ. หรือ ค.ศ.
      };
    });

    const date = ref(null); // ✅ ค่าที่เก็บเป็น YYYY-MM-DD (ค.ศ.)

    const momentFormat = computed(() => ({
      // 📌 Date → String (แสดงผลเป็น พ.ศ. ถ้าภาษาเป็นไทย)
      stringify: (date) => {
        if (!date) return "";
        const yearOffset = lang.value === "en" ? 543 : 0; // ✅ ตรวจสอบภาษาผ่าน computed
        return moment(date).add(yearOffset, "years").format("DD/MM/YYYY");
      },
      // 📌 String → Date (แปลงกลับเป็น ค.ศ. ถ้าภาษาเป็นไทย)
      parse: (value) => {
        if (!value) return null;
        const yearOffset = lang.value === "en" ? 543 : 0;
        return moment(value, "DD/MM/YYYY")
          .subtract(yearOffset, "years")
          .toDate();
      },
      // 📌 ใช้ moment คำนวณเลขสัปดาห์ (ถ้าจำเป็น)
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
      lang, // ✅ นำ lang ไปใช้ใน template ได้
      documentName,
    };
  },
  data() {
    return {
      fileName: "",
      Image_pd: [],
      imageSrc: null, // สำหรับเก็บ URL ของรูปภาพที่แสดง
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
      isPopupVisible_error: false, // For error message popups
      isPopupOpen: false, // For department add/edit popup
      isDeleteConfirmPopupOpen: false, // For delete confirmation popup
      isManagePositionPopupOpen: false, // For managing positions popup
      isAddPositionPopupOpen: false, // For add/edit position popup
      isLoading: false, // Loading state
      isPopupVisible: false, // For success message popup
      inputError: false, // Validation flag for inputs
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

        // แปลหมวดหมู่รายจ่าย
        const translatedCategory =
          lang === "TH"
            ? this.$t(`expense.${item.expense_category}`)
            : this.$t(`expense.${item.expense_category}`);

        if (formattedDate.includes("/")) {
          const [day, month, year] = formattedDate.split("/").map(Number);
          const isBuddhistYear = year > 2500;
          const realYear = isBuddhistYear ? year - 543 : year;

          // สร้าง Date object ไว้สำหรับเปรียบเทียบช่วงวันที่
          realDateObj = new Date(realYear, month - 1, day);

          const m = moment(`${realYear}-${month}-${day}`).locale(
            lang === "TH" ? "th" : "en"
          );

          if (lang === "TH") {
            const buddhistYear = realYear + 543;
            // แปลงเดือนเป็นภาษาไทย
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
            const thaiMonth = monthsInThai[month - 1]; // เดือน 1 ถึง 12

            formattedDate = `${day} ${thaiMonth} ${buddhistYear}`;
          } else {
            formattedDate = m.format("D MMMM YYYY");
          }
        }

        return {
          expense_date_new2: formattedDate,
          expense_date_new: formattedDate,
          expense_category_new: translatedCategory, // ใช้ field ใหม่สำหรับ
          expense_amount_new: item.expense_amount,
          expense_amount_new2: item.expense_amount.toLocaleString(),
          quantity_remark_new: item.quantity_remark,
          realDateObj, // เพิ่มไว้ใช้ตอน filter
          ...item,
          realDateObj,
        };
      });

      // 📅 Filter ด้วยช่วงวันที่
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

      // console.log(filteredData);
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
        this.formData.priceExpense = Number(value.replace(/,/g, "")); // ลบ , ออกก่อนบันทึกค่า
      },
    },
    // Define table headers for department table
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
      // เรียกฟังก์ชันกรองข้อมูลหรืออัปเดตวันที่เมื่อภาษามีการเปลี่ยนแปลง
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
          this.imageSrc = e.target.result; // อัปเดต URL รูปภาพสำหรับ preview
        };
        reader.readAsDataURL(file);
        this.newImg = true;
      } else {
        this.imageSrc = null; // หากไม่ใช่ไฟล์รูปภาพ ให้ลบตัวอย่าง
      }
    },
    formatDatePicker(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const buddhistYear = d.getFullYear() + 543;

      return `${day}/${month}/${buddhistYear}`; // 🔸 แสดงเป็น พ.ศ.
    },
    parseThaiDate(dateStr) {
      if (
        typeof dateStr !== "string" ||
        dateStr.trim() === "" ||
        dateStr.split(" ").length !== 3
      ) {
        return null; // ❌ ไม่ใช่ string หรือมีส่วนไม่ครบ
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

      return null; // ถ้าแปลงไม่ได้
    },
    exportExpense() {
      // console.log(this.ExportData)
      //export จาก this.Expenses;
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
          "จำนวนเงิน (บาท)": item.expense_amount, // ใส่ลูกน้ำ
          "หมายเหตุ ": item.quantity_remark,
        };
      });

      const header = Object.keys(exportData[0]).join(",");
      const rows = exportData.map((row) => Object.values(row).join(","));

      const csvContent = "\uFEFF" + [header, ...rows].join("\n"); // ✅ Add BOM for UTF-8

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
        event.preventDefault(); // ป้องกันการพิมพ์อักขระที่ไม่ใช่ตัวเลข
      }
    },
    updatePrice(event) {
      const rawValue = event.target.value.replace(/,/g, ""); // ลบ , ออกก่อนแปลงเป็นตัวเลข
      this.formData.price = Number(rawValue); // แปลงเป็นตัวเลขแล้วบันทึก
    },
    parseThaiDateTime(thaiDateTimeStr) {
      // แยกวันที่ เวลา
      const [datePart, timePart] = thaiDateTimeStr.split(" "); // "7/4/2568", "15:46:12"
      const [day, month, yearBE] = datePart.split("/"); // "7", "4", "2568"

      const year = parseInt(yearBE) - 543; // แปลง พ.ศ. -> ค.ศ.

      // สร้าง string ให้ JS เข้าใจ: "2025-04-07T15:46:12"
      const isoDateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T${timePart}`;

      return new Date(isoDateStr);
    },
    formatDate(date) {
      const monthIndex = date.getMonth(); // ดึงเดือนเป็นตัวเลข
      const year = date.getFullYear(); // ดึงปี ค.ศ.

      // เรียกชื่อเดือนตามภาษาที่เลือก
      const monthName = this.t(`months.${this.getMonthKey(monthIndex)}`);

      // แปลงปี ค.ศ. เป็น พ.ศ. ถ้าภาษาไทยถูกเลือก
      const formattedYear = this.$i18n.locale === "th" ? year + 543 : year;

      // แสดงวันที่แบบ "เดือน ปี" พร้อมกับการแปล
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
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getBusinessByID`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
    async validateFormData() {
      // this.isEmpty.Position = false;
      // const errorMessages = [];
      // if (this.formPosition.Position.trim() === "") {
      //   this.isEmpty.Position = true;
      //   errorMessages.push(this.$t("validation.Position"));
      // }
      // const isDuplicate = this.Positions.some(
      //   (item) =>
      //     item["Position"].trim() === this.formPosition.Position.trim() &&
      //     item.ID !== this.formPosition.Position // ตรวจสอบว่าข้อมูลไม่ได้เป็นตัวเอง
      // );
      // if (isDuplicate) {
      //   this.isEmpty.Position = true;
      //   errorMessages.push(this.$t("validation.positionDup"));
      // }
      // if (errorMessages.length > 0) {
      //   this.showPopup_validate(errorMessages);
      //   return false;
      // } else {
      //   return true;
      // }
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
    // Opens the department add/edit popup
    openPopup() {
      this.isEmpty.DateExpense = false;
      this.isEmpty.cateExpense = false;
      this.isEmpty.priceExpense = false;
      this.isPopupOpen = true;
      this.isAddingMode = true; // Add mode
      this.isEditMode = false; // Disable edit mode
      this.formData.DateExpense = new Date();
      this.formData.expense_id = "";
      this.formData.remarkExpense = "";
      this.formData.cateExpense = "";
      this.formData.priceExpense = "";

      this.clearFile();
    },
    // Closes the department add/edit popup
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        // Reset form data
        departmentID: "",
        departmentName: "",
      };
      this.inputError = false; // Reset validation errors
      this.isPopupVisible_error = false;
    },
    // Closes the delete confirmation popup
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    // Opens the manage position popup
    openManagePositionPopup() {
      this.isManagePositionPopupOpen = true;
    },
    // Closes the manage position popup
    closeManagePositionPopup() {
      this.isManagePositionPopupOpen = false;
    },
    // Opens the position add/edit popup
    openAddPositionPopup() {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = true; // Add mode
      this.isEditMode = false; // Disable edit mode
    },
    // Closes the position add/edit popup
    closeAddPositionPopup() {
      this.isAddPositionPopupOpen = false;
      this.formPosition = {
        // Reset form data
        PositionID: "",
        Position: "",
      };
      this.inputError = false; // Reset validation errors
    },
    // Opens the edit popup with selected department data
    handleEdit(item) {
      this.isEmpty.DateExpense = false;
      this.isEmpty.cateExpense = false;
      this.isEmpty.priceExpense = false;
      console.log("item", item);
      this.isPopupOpen = true;
      this.isAddingMode = false; // Edit mode
      this.isEditMode = true; // Enable edit mode

      const thaiDate = item.expense_date;
      const [day, month, year] = thaiDate.split("/");
      const convert_expense_date = new Date(year - 543, month - 1, day); // แปลง พ.ศ. เป็น ค.ศ.

      // const formatDateForPicker = (date) => {
      //   if (!date) return null;
      //   const d = new Date(date);
      //   if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง
      //   return d;
      // };
      // const formattedexpense_date = formatDateForPicker(item.expense_date);

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
        this.imageSrc = item.expense_image; // มีรูป ก็แสดงได้เล
      }
      this.getExpense();
    },
    // Opens the delete confirmation popup for department
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { expense_id: item.expense_id }; // Store department ID for deletion
    },
    // Opens the edit popup with selected position data
    handleEditPosition(item) {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = false; // Edit mode
      this.isEditMode = true; // Enable edit mode
      this.formPosition = {
        // Fill form with selected data
        PositionID: item.ID,
        Position: item.Position,
      };
    },
    // Opens the delete confirmation popup for position
    handleDeletePosition(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formPosition = { PositionID: item.ID }; // Store position ID for deletion
    },
    // Displays a success popup message
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false; // Auto-hide after 2 seconds
      }, 2000);
    },
    // Displays an error popup message
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible_error = false; // Auto-hide after 2 seconds
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
    // Adds a new position via API call
    validateFormData() {
      // ตั้งค่า isEmpty ของทุกฟิลด์เป็น false ก่อนเริ่มการตรวจสอบ
      this.isEmpty.DateExpense = false;
      this.isEmpty.cateExpense = false;
      this.isEmpty.priceExpense = false;
      // this.isEmpty.remarkExpense = false;

      const errorMessages = [];

      // ตรวจสอบฟิลด์ productTypeID
      if (this.formData.DateExpense === "") {
        this.isEmpty.DateExpense = true;
        errorMessages.push(this.$t("validation.DateExpense"));
      }

      // ตรวจสอบฟิลด์ categoryID
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
      const accessToken = localStorage.getItem("@accessToken");
      this.errorMessage = [];
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/getExpenses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        // this.Expenses = json.data;
        this.Expenses = json.data.map((item) => ({
          expense_id: item.expense_id,
          expense_date: item.expense_date,
          expense_category: item.expense_category,
          expense_amount: item.expense_amount,
          quantity_remark: item.quantity_remark,
          expense_image: item.expense_image,
        }));
        if (json.statusCode === 200) {
        } else {
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

      // ใช้ ref เพื่อเคลียร์ input[type="file"]
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    formatDatePickerTH(date) {
      if (!date || isNaN(new Date(date))) return "";
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth() + 1; // เดือนนับจาก 0
      const year = d.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.
      return `${day}/${month}/${year}`;
    },

    async addExpense() {
      const accessToken = localStorage.getItem("@accessToken");
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
            Authorization: `Bearer ${accessToken}`,
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

          // if (!this.Image_pd || this.Image_pd !== []) {
          const imageExpense = await fetch(
            `${API_CALL}/Quotation/AddExpense_img`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body: formDataImage,
            }
          );

          this.getExpense();

          // }
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    // Edits an existing position via API call
    async editExpense() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessage = [];
      this.isLoading = true;

      const date = new Date(this.formData.DateExpense); // ตัวอย่างวันที่
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
              Authorization: `Bearer ${accessToken}`,
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

          // console.log("json.data.expense_id", json.data);

          // if (!this.Image_pd || this.Image_pd !== []) {
          const imageExpense = await fetch(
            `${API_CALL}/Quotation/AddExpense_img`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
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

    // Deletes a position via API call
    async deleteExpenses() {
      const accessToken = localStorage.getItem("@accessToken");
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
              Authorization: `Bearer ${accessToken}`,
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
  // Fetches department and position data when the component is created
  async created() {
    await this.getBusiness();
    await this.filterDataByOption();
    await this.getExpense();
  },
};
</script>

<style>
.expenseTable table thead tr th:nth-child(3),
.expenseTable table tbody tr td:nth-child(3) {
  display: none;
}
.expenseTable table thead tr th:nth-child(8),
.expenseTable table tbody tr td:nth-child(8) {
  display: none;
}
.expenseTable table thead tr th:nth-child(9),
.expenseTable table tbody tr td:nth-child(9) {
  display: none;
}
.expenseTable table thead tr th:nth-child(10),
.expenseTable table tbody tr td:nth-child(10) {
  display: none;
}
.expenseTable table thead tr th:nth-child(11),
.expenseTable table tbody tr td:nth-child(11) {
  display: none;
}
.expenseTable table thead tr th:nth-child(12),
.expenseTable table tbody tr td:nth-child(12) {
  display: none;
}
.expenseTable table thead tr th:nth-child(13),
.expenseTable table tbody tr td:nth-child(13) {
  display: none;
}
.expenseTable table thead tr th:nth-child(6),
.expenseTable table tbody tr td:nth-child(6) {
  display: none;
}
.expenseTable table thead tr th:nth-child(15),
.expenseTable table tbody tr td:nth-child(15) {
  display: none;
}
</style>
