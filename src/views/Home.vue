<template>
  <div class="main-page">
    <div class="page-body">
      <div class="row text-center">
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
                        <v-date-picker
                          v-model="custom_filter_start_date"
                          locale="th-TH"
                          :format="formatDatePicker"
                        >
                          <template v-slot="{ inputEvents }">
                            <input
                              class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                              :value="
                                formatDatePicker(custom_filter_start_date)
                              "
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
              <div class="card-body-detail" style="white-space: nowrap">
                <div class="card-body-left">
                  <div class="card-body-left-sale">
                    <div class="sale-card">
                      <p>{{ t("incomeDash") }}</p>
                    </div>
                    <p>
                      {{
                        totalSalescon.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      }}
                    </p>
                  </div>
                  <div class="card-body-left-cost">
                    <div class="cost-card">
                      <p>{{ t("costallDash") }}</p>
                    </div>
                    <p>
                      {{ ConvertTo2DigitCost }}
                    </p>
                  </div>
                </div>
                <div class="card-body-right">
                  <div class="card-body-right-profit">
                    <div class="profit-card">
                      <p>{{ t("profitallDAsh") }}</p>
                    </div>
                    <p>
                      {{ ConvertTo2DigitProfit }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-md-7 body-dashboard">
          <div class="card bg-light" style="height: 100%">
            <div class="card-body">
              <p class="card-body-p">{{ t("fastaccess") }}</p>
              <div class="card-body-access">
                <div
                  class="custom-card-home"
                  style="display: flex; flex-direction: column"
                >
                  <div
                    class="fast-access-button"
                    style="cursor: pointer"
                    @click="accessProduct"
                  >
                    <div class="icon_product_access"></div>
                    <p>{{ t("headerProduct") }}</p>
                  </div>
                </div>
                <div
                  class="custom-card-home"
                  style="display: flex; flex-direction: column"
                >
                  <div
                    class="fast-access-button"
                    style="cursor: pointer"
                    @click="accessProductStock"
                  >
                    <div class="icon_product_stock_access"></div>
                    <p>{{ t("headerStockManage") }}</p>
                  </div>
                </div>
              </div>
              <div class="card-body-access">
                <div
                  class="custom-card-home"
                  style="display: flex; flex-direction: column"
                >
                  <div
                    class="fast-access-button"
                    style="cursor: pointer"
                    @click="accessQuotation"
                  >
                    <div class="icon_quotation_access"></div>
                    <p>{{ t("headerQuotation") }}</p>
                  </div>
                </div>
                <div
                  class="custom-card-home"
                  style="display: flex; flex-direction: column"
                >
                  <div
                    class="fast-access-button"
                    style="cursor: pointer"
                    @click="accessReportSales"
                  >
                    <div class="icon_sale_report_access"></div>
                    <p>{{ t("salesreport") }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-5 body-dashboard">
          <div class="card bg-light">
            <div class="card-body">
              <p class="card-body-p">{{ t("salestatus") }}</p>

              <div class="row g-2">
                <div class="col-12">
                  {{ t("sentenceSummaryYear") }} {{ startDate2 }} -
                  {{ endDate2 }}
                </div>
                <div class="col-1 col-sm-4 col-md-2 col-lg-2"></div>
                <div class="col-3" v-if="toggleCustomDate2">
                  <v-date-picker
                    v-model="custom_filter_start_date2"
                    locale="th-TH"
                    :format="formatDatePicker"
                  >
                    <template v-slot="{ inputEvents }">
                      <input
                        class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                        :value="formatDatePicker(custom_filter_start_date2)"
                        v-on="inputEvents"
                        placeholder="เลือกวันที่"
                        style="width: 100%"
                      />
                    </template>
                  </v-date-picker>
                </div>

                <span
                  class="mdi mdi-minus"
                  v-if="toggleCustomDate2"
                  style="padding: 10px; width: 30px"
                ></span>
                <div class="col-12 form-filter-home">
                  <v-date-picker
                    v-if="toggleCustomDate2"
                    v-model="custom_filter_end_date2"
                    locale="th-TH"
                    :format="formatDatePicker"
                  >
                    <template v-slot="{ inputEvents }">
                      <input
                        class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                        :value="formatDatePicker(custom_filter_end_date2)"
                        v-on="inputEvents"
                        placeholder="เลือกวันที่"
                        style="width: 100%"
                      />
                    </template>
                  </v-date-picker>
                </div>
                <div
                  class="mb-3 col-12 col-sm-12 col-md-3 col-lg-3 form-filter-home"
                >
                  <select
                    class="form-control col-sm-9 col-md-6 form-select"
                    @change="filterDataByOption2"
                    v-model="selectedOption2"
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
              <div
                class="card-body-barchart-detail"
                style="justify-content: space-between"
              >
                <div>
                  {{ t("waitingcustomer") }} ({{ pendingQuotationCount }})
                </div>
                <div>{{ pendingQuotationTotal.toLocaleString() }}</div>
              </div>
              <div
                class="card-body-barchart-detail"
                style="justify-content: space-between"
              >
                <div>{{ t("waitingpay") }} ({{ pendingInvoiceCount }})</div>
                <div>{{ pendingInvoiceTotal.toLocaleString() }}</div>
              </div>
              <div
                class="card-body-barchart-detail"
                style="justify-content: space-between"
              >
                <div>{{ t("salessuccess") }} ({{ paidBillCount }})</div>
                <div>{{ paidBillTotal.toLocaleString() }}</div>
              </div>
              <div
                class="card-body-barchart-detail"
                style="justify-content: space-between"
              >
                <div>{{ t("saleexpired") }} ({{ expiredQuotationCount }})</div>
                <div>{{ expiredQuotationTotal.toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row text-center"></div>
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
import navigate from "../components/Navigation.vue";
import Button from "../components/button.vue"; // 1. นำเข้า component
import * as echarts from "echarts";
import { config } from "../../constant.js";

import "vue-datepicker-next/index.css";
import moment from "moment";
moment.locale("th");
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useI18n } from "vue-i18n";
import { computed, watch, ref } from "vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

import th from "vue-datepicker-next/locale/th.es";
import en from "vue-datepicker-next/locale/en.es";

export default {
  name: "HomePage",
  components: {
    navigate,
    DatePicker,
    Button, // 2. ลงทะเบียน component
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

    return {
      date,
      momentFormat,
      currentLocale,
      t,
      lang,
    };
  },
  // ... The rest of your script remains unchanged
  data() {
    return {
      date: new Date(),
      date2: new Date(),
      Expenses: [],
      custom_filter_start_date: new Date(),
      custom_filter_end_date: new Date(),
      custom_filter_start_date2: new Date(),
      custom_filter_end_date2: new Date(),
      toggleCustomDate: false,
      toggleCustomDate2: false,
      BusinessJson: [],
      selectedOption: "all",
      selectedOption2: "all",
      filteredData: [],
      filteredProductData: [],
      filteredPaySalaryData: [],
      filteredQuoData: [],
      filteredInvData: [],
      startDate: [],
      endDate: [],
      startDate2: [],
      endDate2: [],
      Profile: [],
      payments: [],
      Billings: [],
      salesCount: 1,
      salesData: [],
      totalSalesData: [],
      profitData: [],
      salesDataMonth: [],
      totalSalesDataMonth: [],
      totalOvertime: [],
      profitDataMonth: [],
      totalSalescon: "",
      ProductFilter: [],
      totalProductCost: "",
      productTypeA: "",
      productTypeB: "",
      totalSalaryPaid: "",
      Invoices: [],
      Quotations: [],
      pendingQuotationCount: [],
      pendingQuotationTotal: [],
      expiredQuotationCount: [],
      expiredQuotationTotal: [],
      pendingInvoiceCount: [],
      pendingInvoiceTotal: [],
      paidBillCount: [],
      paidBillTotal: [],
      isPopupVisible_error: false,
      formData: {
        bus_id: "",
        cus_id: "",
        productID: "",
        employeeID: "",
        employeeName: "",
        position: "",
        employeeEmail: "",
        employeeTel: "",
        cus_name: "",
        cus_address: "",
        cus_tel: "",
        cus_email: "",
        cus_tax: "",
        cus_purchase: "",
        sale_qty: "",
        sale_number: "",
        sale_date: "",
        credit_date_number: "",
        credit_expired_date: "",
        sale_discount: 0,
        sale_totalprice: 0,
        sale_price: 0,
        total_price: 0,
        total_discount: 0,
        Net_price: 0,
        vat: 0,
        price: "",
        remark: "",
        invoice_id: "",
        invoice_number: "",
        invoice_status: "",
        invoice_date: "",
        billing_id: "",
        billing_number: "",
        billing_status: "",
        billing_date: "",
        payments: "",
        status: "",
        pdfname: "",
        file: "",
      },
      Overtimes: [],
      filterOvertime: [],
    };
  },
  methods: {
    formatDatePicker(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const buddhistYear = d.getFullYear() + 543;

      return `${day}/${month}/${buddhistYear}`;
    },
    custom_filter(data) {
      const formattedDate = moment(data)
        .add(543, "years")
        .format("D MMMM YYYY");
      alert(formattedDate);
      this.st;
    },
    getDateBusinessCreate() {},
    accessProduct() {
      this.$router.push("/product");
    },
    accessProductStock() {
      this.$router.push("/stockmanage");
    },
    accessQuotation() {
      this.$router.push("/quotation");
    },
    accessReportSales() {
      this.$router.push("/salesreport");
    },
    TestToken() {
      const token = localStorage.getItem("@accessToken");
      const userRole = localStorage.getItem("RoleName");
      const userID = localStorage.getItem("user_id");
      if (token) {
        console.log("Token in Home page", token);
        console.log("User Role : ", userRole);
        console.log("User ID : ", userID);
      } else {
        console.log("No token found in Home page");
      }
    },
    renderChart() {
      const chartDom = this.$refs.donutChart;
      if (!chartDom) return;
      const chart = echarts.init(chartDom);
      const option = {
        title: { text: this.t("inventoryVolume"), left: "center" },
        series: [
          {
            name: this.t("inventoryVolume"),
            type: "pie",
            radius: ["50%", "70%"],
            data: [
              { value: this.productTypeA, name: this.t("product") },
              { value: this.productTypeB, name: this.t("service") },
            ],
          },
        ],
      };
      chart.setOption(option);
    },
    renderBarChart(data) {
      const chartDom = this.$refs.barChart;
      if (!chartDom) return;
      const chart = echarts.init(chartDom);
      const option = {
        xAxis: {
          type: "category",
          data: [
            this.t("jan"),
            this.t("feb"),
            this.t("mar"),
            this.t("apr"),
            this.t("may"),
            this.t("jun"),
            this.t("jul"),
            this.t("aug"),
            this.t("sep"),
            this.t("oct"),
            this.t("nov"),
            this.t("dec"),
          ],
        },
        yAxis: { type: "value" },
        series: [{ data: data, type: "bar", itemStyle: { color: "#007bff" } }],
      };
      chart.setOption(option);
    },
    onMenuClick(type) {
      if (type === "sales") {
        this.renderBarChart(this.salesDataMonth);
      } else if (type === "totalSales") {
        this.renderBarChart(this.totalSalesDataMonth);
      } else if (type === "profit") {
        this.renderBarChart(this.profitDataMonth);
      }
    },
    destroyCharts() {
      if (this.$refs.donutChart) {
        const donutChart = echarts.getInstanceByDom(this.$refs.donutChart);
        if (donutChart) donutChart.dispose();
      }
      if (this.$refs.barChart) {
        const barChart = echarts.getInstanceByDom(this.$refs.barChart);
        if (barChart) barChart.dispose();
      }
    },
    async getBilling() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/quotation/getBilling`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          console.log(json.data);
          this.Billings = json.data.map((item) => {
            const QTDate = new Date(item.quotation_start_date);
            const EXPD = new Date(item.quotation_expired_date);
            const IND = new Date(item.invoice_date);
            const BILL = new Date(item.billing_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Quotationdate = QTDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const ExpiredDate = EXPD.toLocaleDateString("en-GB", formatDate);
            const InvoiceDate = IND.toLocaleDateString("en-GB", formatDate);
            const BillingDate = BILL.toLocaleDateString("en-GB", formatDate);
            return {
              billing_number: item.billing_number,
              employeeID: item.employeeID,
              employeeName: item.employee_name,
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              sale_totalprice: item.sale_totalprice,
              invoice_id: item.invoice_id,
              remark: item.remark || "",
              billing_id: item.billing_id,
              billing_date: BillingDate,
              billing_status: item.billing_status,
              payments: item.payments,
              productForms: item.details.map((detail) => ({
                productID: detail.productID,
                sale_price: detail.sale_price,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty,
              })),
            };
          });
          this.filteredData = json.data.map((item) => {
            const QTDate = new Date(item.quotation_start_date);
            const EXPD = new Date(item.quotation_expired_date);
            const IND = new Date(item.invoice_date);
            const BILL = new Date(item.billing_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Quotationdate = QTDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const ExpiredDate = EXPD.toLocaleDateString("en-GB", formatDate);
            const InvoiceDate = IND.toLocaleDateString("en-GB", formatDate);
            const BillingDate = BILL.toLocaleDateString("en-GB", formatDate);
            return {
              billing_number: item.billing_number,
              employeeID: item.employeeID,
              employeeName: item.employee_name,
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              sale_totalprice: item.sale_totalprice,
              invoice_id: item.invoice_id,
              remark: item.remark || "",
              billing_id: item.billing_id,
              billing_date: BillingDate,
              billing_status: item.billing_status,
              payments: item.payments,
              productForms: item.details.map((detail) => ({
                productID: detail.productID,
                sale_price: detail.sale_price,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty,
              })),
            };
          });
          this.renderBarChart(this.totalSalesDataMonth);
        } else {
          this.showPopup_error(json.data);
          console.log("Error fetching billings:", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
          console.log("Product", json.data);
          this.ProductFilter = json.data.map((item) => {
            const PD = new Date(item.product_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const ProductDate = PD.toLocaleDateString("en-GB", formatDate);
            let product = {
              ID: item.ID,
              Category: item.product_category.categoryName,
              "Product Name": item.productname,
              Detail: item.productdetail,
              Price: item.price,
              Cost: item.productcost,
              "Product Image": item.productImg,
              productTypeID: item.productTypeID,
              categoryID: item.categoryID,
              product_date: ProductDate,
              productTypeName: item.product_type.productTypeName,
              Amount: item.amount,
            };
            console.log(item.product_type.productTypeName);
            return product;
          });
          this.filteredProductData = json.data.map((item) => {
            const PD = new Date(item.product_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const ProductDate = PD.toLocaleDateString("en-GB", formatDate);
            let product = {
              ID: item.ID,
              Category: item.product_category.categoryName,
              "Product Name": item.productname,
              Detail: item.productdetail,
              Price: item.price,
              Cost: item.productcost,
              "Product Image": item.productImg,
              productTypeID: item.productTypeID,
              categoryID: item.categoryID,
              product_date: ProductDate,
              productTypeName: item.product_type.productTypeName,
              Amount: item.amount,
            };
            console.log(item.product_type.productTypeName);
            return product;
          });
          this.productTypeA = this.ProductFilter.filter(
            (product) => product.productTypeID === 1
          ).length;
          this.productTypeB = this.ProductFilter.filter(
            (product) => product.productTypeID !== 1
          ).length;
          console.log("Product Type A count:", this.productTypeA);
          console.log("Product Type B count:", this.productTypeB);
          this.renderChart();
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
    async getPaymentTable() {
      this.isLoading = true;
      const accessToken = localStorage.getItem("@accessToken");
      const userRole = localStorage.getItem("RoleName");
      console.log("User Role : ", userRole);
      try {
        const response = await fetch(`${API_CALL}/employee/getPayment`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        if (json.statusCode === 200) {
          console.log("++++++++++++++", json.data);
          this.payments = json.data.map((item) => {
            const PayDate = new Date(item.date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const PaymentDate = PayDate.toLocaleDateString("en-GB", formatDate);
            let initialTableData = {
              ID: item.payment_id,
              Date: PaymentDate,
              Round: item.round,
              Month: item.month,
              Year: item.year,
              "Employee Name": item.employeeName,
              Salary: item.salary,
            };
            return initialTableData;
          });
          this.filteredPaySalaryData = json.data.map((item) => {
            const PayDate = new Date(item.date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const PaymentDate = PayDate.toLocaleDateString("en-GB", formatDate);
            let initialTableData = {
              ID: item.payment_id,
              Date: PaymentDate,
              Round: item.round,
              Month: item.month,
              Year: item.year,
              "Employee Name": item.employeeName,
              Salary: item.salary,
            };
            return initialTableData;
          });
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
    async getQuotation() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/quotation/getQuotation`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Quotations = json.data.map((item) => {
            const QTDate = new Date(item.quotation_start_date);
            const EXPD = new Date(item.quotation_expired_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Quotationdate = QTDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const ExpiredDate = EXPD.toLocaleDateString("en-GB", formatDate);
            let initialTableData = {
              sale_id: item.sale_id,
              sale_number: item.quotation_num,
              status: item.status,
              employeeID: item.employeeID,
              employeeName: item.employee_name,
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              sale_date: Quotationdate,
              credit_date_number: item.credit_date,
              credit_expired_date: ExpiredDate,
              sale_totalprice: item.sale_totalprice,
              remark: item.remark || "",
              invoice: item.invoice,
              productForms: item.details.map((detail) => ({
                productID: detail.productID,
                sale_price: detail.sale_price,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty,
              })),
            };
            return initialTableData;
          });
          this.filteredQuoData = json.data.map((item) => {
            const QTDate = new Date(item.quotation_start_date);
            const EXPD = new Date(item.quotation_expired_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Quotationdate = QTDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const ExpiredDate = EXPD.toLocaleDateString("en-GB", formatDate);
            let initialTableData = {
              sale_id: item.sale_id,
              sale_number: item.quotation_num,
              status: item.status,
              employeeID: item.employeeID,
              employeeName: item.employee_name,
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              sale_date: Quotationdate,
              credit_date_number: item.credit_date,
              credit_expired_date: ExpiredDate,
              sale_totalprice: item.sale_totalprice,
              remark: item.remark || "",
              invoice: item.invoice,
              productForms: item.details.map((detail) => ({
                productID: detail.productID,
                sale_price: detail.sale_price,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty,
              })),
            };
            return initialTableData;
          });
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getInvoice() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/quotation/getInvoice`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Invoices = json.data.map((item) => {
            const QTDate = new Date(item.quotation_start_date);
            const EXPD = new Date(item.quotation_expired_date);
            const IND = new Date(item.invoice_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Quotationdate = QTDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const ExpiredDate = EXPD.toLocaleDateString("en-GB", formatDate);
            const InvoiceDate = IND.toLocaleDateString("en-GB", formatDate);
            let initialTableData = {
              invoice_number: item.invoice_number,
              employeeID: item.employeeID,
              employeeName: item.employee_name,
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              sale_totalprice: item.sale_totalprice,
              invoice_id: item.invoice_id,
              invoice_status: item.invoice_status,
              invoice_date: InvoiceDate,
              remark: item.invoice_remark || "",
              billing: item.billing,
              productForms: item.details.map((detail) => ({
                productID: detail.productID,
                sale_price: detail.sale_price,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty,
              })),
            };
            return initialTableData;
          });
          this.filteredInvData = json.data.map((item) => {
            const QTDate = new Date(item.quotation_start_date);
            const EXPD = new Date(item.quotation_expired_date);
            const IND = new Date(item.invoice_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Quotationdate = QTDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const ExpiredDate = EXPD.toLocaleDateString("en-GB", formatDate);
            const InvoiceDate = IND.toLocaleDateString("en-GB", formatDate);
            let initialTableData = {
              invoice_number: item.invoice_number,
              employeeID: item.employeeID,
              employeeName: item.employee_name,
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              sale_totalprice: item.sale_totalprice,
              invoice_id: item.invoice_id,
              invoice_status: item.invoice_status,
              invoice_date: InvoiceDate,
              remark: item.invoice_remark || "",
              billing: item.billing,
              productForms: item.details.map((detail) => ({
                productID: detail.productID,
                sale_price: detail.sale_price,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty,
              })),
            };
            return initialTableData;
          });
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
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
              rate: item.rate,
              total: item.total,
            };
            return initialTableData;
          });
          this.filterOvertime = json.data.map((item) => {
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
              rate: item.rate,
              total: item.total,
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
      const isInRange = (date) => {
        const d = new Date(date);
        return d >= startDate && d <= endDate;
      };
      this.filteredData = this.Billings.filter((item) =>
        isInRange(item.billing_date)
      );
      console.log("+++this.filteredData", this.Billings);
      this.filteredProductData = this.ProductFilter.filter((item) =>
        isInRange(item.product_date)
      );
      this.filteredPaySalaryData = this.payments.filter((item) =>
        isInRange(item.Date)
      );
      this.filteredQuoData = this.Quotations.filter((item) =>
        isInRange(item.sale_date)
      );
      this.filteredInvData = this.Invoices.filter((item) =>
        isInRange(item.invoice_date)
      );
      this.filterOvertime = this.Overtimes.filter((item) =>
        isInRange(item.date)
      );
      this.startDate = this.formatDate(startDate);
      this.endDate = this.formatDate(endDate);
      this.totalSalescon = this.filteredData.reduce((sum, item) => {
        return sum + (item.sale_totalprice || 0);
      }, 0);
      this.totalOvertime = this.filterOvertime.reduce((sum, item) => {
        return sum + (item.total || 0);
      }, 0);
      this.totalProductCost = this.filteredProductData.reduce(
        (sum, product) => {
          if (product.productTypeID === 1) {
            return sum + product.Cost * (product.Amount || 1);
          } else {
            return sum + (product.Cost || 0);
          }
        },
        0
      );
      console.log("test cost: ", this.totalProductCost);
      this.totalSalaryPaid = this.filteredPaySalaryData.reduce(
        (total, payment) => {
          return total + (payment.Salary || 0);
        },
        0
      );
    },
    filterDataByOption2() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor((currentMonth + 3) / 3);
      const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
      const lastQuarterYear =
        currentQuarter === 1 ? currentYear - 1 : currentYear;
      let startDate2, endDate2;
      switch (this.selectedOption2) {
        case "last7Days":
          startDate2 = new Date();
          startDate2.setDate(now.getDate() - 6);
          endDate2 = now;
          this.toggleCustomDate2 = false;
          break;
        case "last14Days":
          startDate2 = new Date();
          startDate2.setDate(now.getDate() - 13);
          endDate2 = now;
          this.toggleCustomDate2 = false;
          break;
        case "last30Days":
          startDate2 = new Date();
          startDate2.setDate(now.getDate() - 29);
          endDate2 = now;
          this.toggleCustomDate2 = false;
          break;
        case "thisMonth":
          startDate2 = new Date(currentYear, currentMonth, 1);
          endDate2 = new Date(currentYear, currentMonth + 1, 0);
          this.toggleCustomDate2 = false;
          break;
        case "lastMonth":
          startDate2 = new Date(currentYear, currentMonth - 1, 1);
          endDate2 = new Date(currentYear, currentMonth, 0);
          this.toggleCustomDate2 = false;
          break;
        case "thisQuarter":
          startDate2 = new Date(currentYear, (currentQuarter - 1) * 3, 1);
          endDate2 = new Date(currentYear, currentQuarter * 3, 0);
          this.toggleCustomDate2 = false;
          break;
        case "lastQuarter":
          startDate2 = new Date(lastQuarterYear, (lastQuarter - 1) * 3, 1);
          endDate2 = new Date(lastQuarterYear, lastQuarter * 3, 0);
          this.toggleCustomDate2 = false;
          break;
        case "thisYear":
          startDate2 = new Date(currentYear, 0, 1);
          endDate2 = new Date(currentYear, 11, 31);
          this.toggleCustomDate2 = false;
          break;
        case "lastYear":
          startDate2 = new Date(currentYear - 1, 0, 1);
          endDate2 = new Date(currentYear - 1, 11, 31);
          this.toggleCustomDate2 = false;
          break;
        case "customDate":
          startDate2 = this.custom_filter_start_date2;
          endDate2 = this.custom_filter_end_date2;
          this.toggleCustomDate2 = true;
          break;
        default:
          startDate2 = new Date(
            this.parseThaiDateTime(localStorage.TokenCreate)
          );
          endDate2 = now;
          this.toggleCustomDate2 = false;
      }
      const isInRange = (date) => {
        const d = new Date(date);
        return d >= startDate2 && d <= endDate2;
      };
      this.filteredData = this.Billings.filter((item) =>
        isInRange(item.billing_date)
      );
      this.filteredProductData = this.ProductFilter.filter((item) =>
        isInRange(item.product_date)
      );
      this.filteredPaySalaryData = this.payments.filter((item) =>
        isInRange(item.Date)
      );
      this.filteredQuoData = this.Quotations.filter((item) =>
        isInRange(item.sale_date)
      );
      this.filteredInvData = this.Invoices.filter((item) =>
        isInRange(item.invoice_date)
      );
      this.filterOvertime = this.Overtimes.filter((item) =>
        isInRange(item.date)
      );
      this.startDate2 = this.formatDate(startDate2);
      this.endDate2 = this.formatDate(endDate2);
      const paidBills = this.filteredData.filter(
        (item) => item.billing_status === "Complete"
      );
      this.paidBillCount = paidBills.length;
      this.paidBillTotal = paidBills.reduce(
        (sum, item) => sum + item.sale_totalprice,
        0
      );
      const pendingQuotations = this.filteredQuoData.filter(
        (item) => item.status === "pending" || "Pending"
      );
      const expiredQuotations = this.filteredQuoData.filter(
        (item) => item.status === "expired"
      );
      this.pendingQuotationCount = pendingQuotations.length;
      this.pendingQuotationTotal = pendingQuotations.reduce(
        (sum, item) => sum + item.sale_totalprice,
        0
      );
      this.expiredQuotationCount = expiredQuotations.length;
      this.expiredQuotationTotal = expiredQuotations.reduce(
        (sum, item) => sum + item.sale_totalprice,
        0
      );
      console.log("pendingInvoices", this.filteredInvData);
      const pendingInvoices = this.filteredInvData.filter(
        (item) => item.invoice_status === "Pending"
      );
      this.pendingInvoiceCount = pendingInvoices.length;
      this.pendingInvoiceTotal = pendingInvoices.reduce(
        (sum, item) => sum + item.sale_totalprice,
        0
      );
    },
    parseThaiDateTime(thaiDateTimeStr) {
      if (thaiDateTimeStr && thaiDateTimeStr !== null) {
        const [datePart, timePart] = thaiDateTimeStr.split(" ");
        const [day, month, yearBE] = datePart.split("/");
        const year = parseInt(yearBE) - 543;
        const isoDateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}T${timePart}`;
        return new Date(isoDateStr);
      }
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
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000);
    },
    async getBusiness() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getBusinessByID`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        this.BusinessJson = json.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.showPopup_error("Error fetching data");
      } finally {
        this.isLoading = false;
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
        this.Expenses = json.data.map((item) => ({
          expense_id: item.expense_id,
          expense_date: item.expense_date,
          expense_category: item.expense_category,
          expense_amount: item.expense_amount,
          quantity_remark: item.quantity_remark,
        }));
        console.log(json.data);
        if (json.statusCode !== 200) {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  watch: {
    locale() {
      this.destroyCharts();
      this.$nextTick(() => {
        this.renderChart();
        this.renderBarChart(this.salesDataMonth);
      });
    },
    "$i18n.locale"(newLocale, oldLocale) {
      this.filterDataByOption();
    },
    custom_filter_start_date() {
      this.filterDataByOption();
    },
    custom_filter_end_date() {
      this.filterDataByOption();
    },
    custom_filter_start_date2() {
      this.filterDataByOption2();
    },
    custom_filter_end_date_2() {
      this.filterDataByOption2();
    },
  },
  async created() {
    this.getOvertime();
    await this.getBilling();
    await this.getInvoice();
    await this.getQuotation();
    this.getProduct();
    this.getExpense();
    this.getPaymentTable();
    this.filterDataByOption();
    this.filterDataByOption2();
    this.$nextTick(() => {
      this.renderChart();
      this.renderBarChart();
    });
  },
  computed: {
    ConvertTo2DigitCost() {
      if (!Array.isArray(this.Expenses)) {
        return "0.00";
      }
      const totalCost = this.Expenses.reduce((sum, item) => {
        const amount = parseFloat(item.expense_amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      return totalCost.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    ConvertTo2DigitProfit() {
      const totalSales = this.totalSalescon || 0;
      const totalExpense = Array.isArray(this.Expenses)
        ? this.Expenses.reduce((sum, item) => {
            const amount = parseFloat(item.expense_amount);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0)
        : 0;
      const profit = totalSales - totalExpense;
      if (isNaN(profit)) {
        return "0.00";
      }
      return profit.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
};
</script>
