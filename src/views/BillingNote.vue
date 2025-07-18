<template>
  <div class="main-page">
    <div class="page-body" :isLoading="isLoading">
      <div class="mb-3">
        <h2>{{ t("headerBilling") }}</h2>
      </div>
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-6 col-lg-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <div class="col-6 col-sm-6 col-md-6 col-lg-9"></div>
      </div>
      <div class="card-view-customs" style="display: none">
        <div class="container">
          <div class="text-start">
            {{ allExpanded ? t("CollapseItemsAll") : t("expandedItemsAll") }}
            <span
              :class="
                allExpanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'
              "
              @click="toggleAll"
            >
            </span>
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-4 mt-3"
            v-for="quotation in filteredBill"
            :key="quotation.sale_id"
          >
            <div class="card d-flex flex-column" style="font-size: 12px">
              <div class="card-header d-flex">
                <div class="col-5">{{ quotation.billing_number }}</div>
                <div
                  class="col-5 text-end"
                  :class="{
                    'text-success': ['Complete', 'สมบูรณ์'].includes(
                      quotation.billing_status
                    ),
                    'text-danger': quotation.billing_status === 'ยกเลิก',
                  }"
                >
                  {{ quotation.billing_status }}
                </div>
                <div class="col-1 text-end">
                  <Icon
                    name="mdi mdi-pencil-outline"
                    @click="handleEdit(quotation)"
                  ></Icon>
                </div>
                <div class="col-1 text-end">
                  <Icon
                    name="mdi mdi-trash-can-outline"
                    style="color: red"
                    @click="handleDelete(quotation)"
                  ></Icon>
                </div>
              </div>
              <div class="card-body" style="line-height: 1.75">
                <div class="container">
                  <div class="row">
                    <div class="col-6">
                      <p class="card-text">{{ t("cusNameHeaderTable") }}</p>
                    </div>
                    <div class="col-6 text-end">
                      <p class="card-text">{{ quotation.cus_name }}</p>
                    </div>
                    <div class="col-6">
                      <p class="card-text">
                        {{ t("employeeNameHeaderTable") }}
                      </p>
                    </div>
                    <div class="col-6 text-end">
                      <p class="card-text">{{ quotation.employeeName }}</p>
                    </div>
                    <div class="col-6">
                      <p class="card-text">
                        {{ t("saleTotalpriceHeaderTable") }}
                      </p>
                    </div>
                    <div class="col-6 text-end">
                      <p class="card-text">{{ quotation.sale_totalprice }}</p>
                    </div>

                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">{{ t("netpriceHeaderTable") }}</p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.net_price }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("cusAddressHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.cus_address }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("cusTelHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.cus_tel }}</p>
                    </div>
                    <div class="col-5" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("cusEmailHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-7 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.cus_email }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("cusTaxHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.cus_tax }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("cusPurchaseHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.cus_purchase }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("billingDateHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.billing_date }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("paymentsHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">
                        {{ quotation.payments }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="card-header d-flex"
                style="background: white; border: none; margin-top: -15px"
                v-if="isExpanded(quotation.sale_id)"
              >
                <div class="col-7"></div>
                <div class="col-3 text-end"></div>
                <!-- <div class="col-1 text-end">
                  <span
                    class="mdi mdi-eye-outline"
                    @click="handlePreview(quotation)"
                  ></span>
                </div> -->
                <div class="col-1 text-end" @click="handlePreview(quotation)">
                  <Icon name="mdi-eye-outline" style="cursor: pointer" />
                </div>
                <!-- <div class="col-1 text-end">
                  <span
                    class="mdi mdi-tray-arrow-down"
                    @click="handleDownload(quotation)"
                  ></span>
                </div> -->
                <div class="col-1 text-end" @click="handleDownload(quotation)">
                  <Icon name="mdi-tray-arrow-down" style="cursor: pointer" />
                </div>
              </div>

              <div
                class="card-footer text-center"
                style="padding-bottom: 0.75rem !important"
              >
                <!-- <span
                  :class="
                    isExpanded(quotation.sale_id)
                      ? 'mdi mdi-chevron-up'
                      : 'mdi mdi-chevron-down'
                  "
                  class="icon-toggle"
                  @click="toggleCollapse(quotation.sale_id)"
                >
                </span> -->
                <Icon
                  :name="
                    isExpanded(quotation.sale_id)
                      ? 'mdi-chevron-up'
                      : 'mdi-chevron-down'
                  "
                  class="icon-toggle"
                  @click="toggleCollapse(quotation.sale_id)"
                  style="cursor: pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="show-only-desktop sale_hide">
        <BillingList
          :initialTableData="filteredBill"
          :tableHeaders="tableHeaders"
          :columnforExport="true"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          @handleExport="handleDownload"
          @handlePreview="handlePreview"
          @handleAllow="handleAllow"
          :isLoading="isLoading"
          :documentName="documentName"
          :showAllowButton="false"
        />
      </div>
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
  <popup :isOpen="isPopupOpen" :closePopup="closePopup">
    <h2>{{ t("headerBilling") }}</h2>
    <div class="border p-4 mb-3">
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("numberBilling") }}</label>
        <input
          class="form-control readonly"
          v-model="formData.billing_number"
          readonly
          disabled
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-6 col-md-6">{{ t("dateBilling") }}</label>
        <v-date-picker
          v-model="formData.billing_date"
          locale="th-TH"
          :format="formatDatePicker"
        >
          <template v-slot="{ inputEvents }">
            <input
              class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
              :value="formatDatePicker(formData.billing_date)"
              v-on="inputEvents"
              placeholder="เลือกวันที่"
              style="width: 100%"
            />
          </template>
        </v-date-picker>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-2">{{ t("employeeName") }}</label>
        <input
          class="form-control dropdown_selector readonly"
          v-model="formData.employeeName"
          readonly
          disabled
        />
      </div>
    </div>
    <div class="border p-4 mb-3">
      <div>
        <h5 style="text-decoration-line: underline">{{ t("customerPart") }}</h5>
      </div>
      <div class="mb-3 div-for-InputDropdown">
        <label class="col-sm-6 col-md-6">{{ t("customerName") }}</label>
        <div class="relative-wrapper">
          <input
            class="form-control readonly"
            v-model="formData.cus_name"
            :class="{ error: inputError }"
            readonly
            disabled
          />
        </div>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("customerAddress") }}</label>
        <input
          class="form-control readonly"
          v-model="formData.cus_address"
          readonly
          disabled
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("phoneNum") }}</label>
        <input
          class="form-control readonly"
          v-model="formData.cus_tel"
          readonly
          disabled
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("email") }}</label>
        <input
          class="form-control readonly"
          v-model="formData.cus_email"
          readonly
          disabled
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("taxID") }}</label>
        <input
          class="form-control readonly"
          v-model="formData.cus_tax"
          readonly
          disabled
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("customerPurchaseBy") }}</label>
        <input
          class="form-control readonly"
          v-model="formData.cus_purchase"
          readonly
          disabled
        />
      </div>
    </div>
    <div class="mb-3">
      <div class="Register-contain" style="padding: 20px; width: unset">
        <div>
          <h5 style="text-decoration-line: underline">{{ t("product") }}</h5>
          <table class="table">
            <thead>
              <tr>
                <th class="product-name-column">{{ t("productName") }}</th>
                <th class="price-column">{{ t("price") }}</th>
                <th class="quantity-column">{{ t("quantity") }}</th>
                <th class="unit-column">{{ t("pro_unit") }}</th>
                <th class="discount-column">{{ t("discount") }}</th>
                <th class="total-price-column">{{ t("totalPrice") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(form, index) in productForms" :key="index">
                <td>
                  <input
                    class="form-control readonly"
                    v-model="form.productname"
                    readonly
                    disabled
                  />
                  <textarea
                    v-if="form.showDetails || form.product_detail !== ''"
                    class="form-control"
                    v-model="form.product_detail"
                    rows="3"
                    readonly
                    disabled
                  ></textarea>
                </td>
                <td>
                  <input
                    class="form-control readonly"
                    v-model="form.price"
                    readonly
                    disabled
                  />
                </td>
                <td>
                  <input
                    class="form-control readonly"
                    v-model="form.sale_qty"
                    @input="updatePrice(form)"
                    readonly
                    disabled
                  />
                </td>
                <td>
                  <input
                    class="form-control"
                    v-model="form.pro_unti"
                    readonly
                    disabled
                  />
                </td>

                <td>
                  <div class="discount-type">
                    <select
                      class="form-control form-select"
                      v-model="form.discounttype"
                      @change="updatePrice(form)"
                      :disabled="true"
                      style="
                        border-top-right-radius: 0px;
                        border-bottom-right-radius: 0px;
                      "
                    >
                      <option value="amount">
                        {{ t("productDiscountTypeAmount") }}
                      </option>
                      <option value="percent">
                        {{ t("productDiscountTypePercent") }}
                      </option>
                    </select>
                    <input
                      style="
                        min-width: 100px;
                        border-top-left-radius: 0px;
                        border-bottom-left-radius: 0px;
                        border-left: 1px solid rgba(0, 0, 0, 0) !important;
                      "
                      class="form-control"
                      v-model="form.sale_discount"
                      readonly
                      disabled
                      min="0"
                      @input="limitDiscount(form)"
                      @change="updatePrice(form)"
                    />
                  </div>
                </td>
                <td>
                  <input
                    class="form-control readonly"
                    v-model="form.sale_price"
                    readonly
                    disabled
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="border p-4 mb-3">
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("totalDiscount") }}</label>
        <input
          class="form-control readonly"
          v-model="formData.total_discount"
          readonly
          disabled
          :class="{ error: inputError }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label
          v-if="this.formData.vatType === 'VATincluding'"
          class="col-sm-5 col-md-6"
          >{{ t("consluPrice") }}</label
        >
        <label v-else class="col-sm-5 col-md-6">{{ t("consluPrice") }}</label>
        <input
          v-if="this.formData.vatType === 'VATincluding'"
          class="form-control readonly"
          v-model="formData.sale_totalprice"
          readonly
          :class="{ error: inputError }"
          disabled
        />
        <input
          v-else
          class="form-control readonly"
          v-model="formData.Net_price"
          readonly
          :class="{ error: inputError }"
          disabled
        />
      </div>
      <div class="row mb-3">
        <label class="col-sm-5 col-md-6">{{ t("typeVat") }}</label>
        <div class="col-md-6">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              value="VATexcluding"
              v-model="formData.vatType"
              @change="vatTypeChange()"
              disabled
            />
            <label class="form-check-label" for="inlineCheckbox1">{{
              t("vatType1")
            }}</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              value="VATincluding"
              v-model="formData.vatType"
              @change="vatTypeChange()"
              disabled
            />
            <label class="form-check-label" for="inlineCheckbox2">{{
              t("vatType2")
            }}</label>
          </div>
        </div>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("vatPrice") }}</label>
        <input
          placeholder="vat price 7%"
          v-model="formData.vat"
          class="form-control readonly"
          readonly
          disabled
          :class="{ error: inputError }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label
          v-if="this.formData.vatType === 'VATincluding'"
          class="col-sm-5 col-md-6"
          >{{ t("netPrice") }}</label
        >
        <label v-else class="col-sm-5 col-md-6">{{ t("netPrice") }}</label>
        <input
          v-if="this.formData.vatType === 'VATincluding'"
          class="form-control readonly"
          v-model="formData.Net_price"
          readonly
          :class="{ error: inputError }"
          disabled
        />
        <input
          v-else
          class="form-control readonly"
          v-model="formData.sale_totalprice"
          readonly
          :class="{ error: inputError }"
          disabled
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("payments") }}</label>
        <select
          class="form-control form-select"
          v-model="formData.payments"
          :class="{ error: inputError }"
        >
          <option value="Cash">{{ t("cash") }}</option>
          <option value="Card">{{ t("credit") }}</option>
          <option value="MobileBank">{{ t("mobileBanking") }}</option>
        </select>
      </div>
      <div class="mb-5 div-for-formControl-textarea">
        <label class="col-sm-6 col-md-6 label-textarea">{{
          t("quotationRemark")
        }}</label>
        <div class="text-editor">
          <textarea
            v-model="formData.remark"
            class="form-control"
            maxlength="105"
            rows="3"
            @input="onInput"
          ></textarea>
          <p>
            {{ 105 - (formData.remark ? formData.remark.length : 0) }}
            {{ t("characters") }}
          </p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <Button
        :disabled="isLoading"
        customClass="btn btn-primary me-3"
        v-if="isEditMode"
        @click="editBilling"
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
  </popup>
  <popup :isOpen="isPopupPDFOpen" :closePopup="ClosePDFview">
    <embed :src="pdfUrl" type="application/pdf" width="100%" height="600px" />
    <div class="modal-footer">
      <Button customClass="btn btn-secondary" @click="ClosePDFview">
        {{ t("buttonClose") }}
      </Button>
    </div>
  </popup>
  <div class="delete-popup">
    <Popup
      :isOpen="isDeleteConfirmPopupOpen"
      :closePopup="closeDeleteConfirmPopup"
    >
      <div class="mb-5">
        <a>{{ t("deleteConfirmSentence") }}</a>
      </div>
      <div class="modal-footer mb-5">
        <Button customClass="btn btn-danger me-2" @click="deleteBilling">
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
      :isOpen="isAllowConfirmPopupOpen"
      :closePopup="closeAllowConfirmPopup"
    >
      <div class="mb-5">
        <a>{{ t("AllowConfirmSentence") }}</a>
      </div>
      <div class="modal-footer mb-5">
        <Button customClass="btn btn-success me-2" @click="editInvoice2">
          {{ t("issueReceipt") }}
        </Button>
        <Button customClass="btn btn-secondary" @click="closeAllowConfirmPopup">
          {{ t("buttonCancel") }}
        </Button>
      </div>
    </Popup>
  </div>
  <div class="delete-popup">
    <Popup
      :isOpen="isCutStockConfirmPopupOpen"
      :closePopup="closeCutStockConfirmPopup"
    >
      <div
        v-if="formData.deleted_at === '' || formData.deleted_at === null"
        class="mb-5"
      >
        <a>{{ t("CutStockConfirmSentence") }}</a>
      </div>
      <div v-else-if="formData.deleted_at !== ''" class="mb-5">
        <a>{{ t("CancalCutStockConfirmSentence") }}</a>
      </div>
      <div class="modal-footer mb-5">
        <Button customClass="btn btn-danger me-2" @click="cutStock">
          {{ t("buttonConfirm") }}
        </Button>
        <Button
          customClass="btn btn-secondary"
          @click="closeCutStockConfirmPopup"
        >
          {{ t("buttonCancel") }}
        </Button>
      </div>
    </Popup>
  </div>

  <div>
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
          style="color: #9f9999"
        />
      </div>
      <div class="popup-content-error2">
        <a>{{ popupMessage_error }}</a>
      </div>
    </div>
  </div>
  <div
    v-if="isLoading"
    class="d-flex justify-content-center align-items-center"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <transition name="fade">
    <div v-if="openPopupAllow" class="popup-overlay">
      <div class="popup-content-custome alert alert-light" role="alert">
        <span v-if="formData.deleted_at === '' || formData.deleted_at === null">
          <i class="fa-solid fa-check"></i> {{ t("popupCutBilling") }}
        </span>
        <span v-else-if="formData.deleted_at !== ''">
          <i class="fa-solid fa-ban"></i> {{ t("popupCancalCutBilling") }}
        </span>
      </div>
    </div>
  </transition>
  <div v-if="isPopupVisible_error" class="popup-error2">
    <div class="text-end">
      <Button
        type="button"
        customClass="btn-close"
        aria-label="Close"
        @click="closeErrorPopup"
        style="color: #9f9999"
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
</template>

<script>
import Navigate from "../components/Navigation.vue";
import BillingList from "../components/tableList.vue";
import { useI18n } from "vue-i18n";
import Popup from "../components/popup.vue";
import Button from "../components/button.vue";
import { config } from "../../constant.js";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import jsPDF from "jspdf";
import thSarabunFont from "../font/THSarabunNew-normal.js"; // ฟอนต์ที่แปลงแล้ว
import PromptBold from "../font/Prompt-Bold-bold.js"; // ฟอนต์ที่แปลงแล้ว
import PromptRegular from "../font/Prompt-Regular-normal.js"; // ฟอนต์ที่แปลงแล้ว
import PromptRegularLight from "../font/Prompt-Light-normal.js"; // ฟอนต์ที่แปลงแล้ว
import PromptThinnormal from "../font/Prompt-Thin-normal.js"; // ฟอนต์ที่แปลงแล้ว
import "jspdf-autotable";
import { computed, watch, ref } from "vue";
import moment from "moment";
import Icon from "../components/icon.vue";

// ✅ นำเข้า locale ภาษาไทยและอังกฤษ
import th from "vue-datepicker-next/locale/th.es";
import en from "vue-datepicker-next/locale/en.es";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "BillingNote",
  components: {
    Navigate,
    BillingList,
    Popup,
    DatePicker,
    Button,
    Icon,
  },
  setup() {
    const { t } = useI18n();
    const { locale } = useI18n();
    // ✅ สร้าง computed property ให้ใช้งาน t("lang") ได้ตลอด
    const lang = computed(() => t("lang"));
    const currentLocale = computed(() => {
      return {
        ...(locale.value === "th" ? th : en), // ✅ ใช้ค่าจาก locale ปัจจุบัน
        yearFormat:
          locale.value === "en" ? moment().year() : moment().year() + 543, // ✅ แปลงปี พ.ศ. หรือ ค.ศ.
      };
    });

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

    const documentName = computed(() => t("dontHaveBilling"));

    return {
      momentFormat,
      currentLocale,
      locale,
      t,
      documentName,
    };
  },
  data() {
    return {
      openPopupAllow: false,
      errorMessages: [],
      shortcutAllow: false,
      isCutStockConfirmPopupOpen: false,
      isAllowConfirmPopupOpen: false,
      expandedItems: new Set(), // ใช้ Set() แทน isExpanded,
      AllBanks: [],
      pdfUrl: null,
      isDeleteConfirmPopupOpen: false,
      Billings: [],
      isLoading: false,
      isPopupVisible_error: false,
      inputError: false,
      isPopupVisible: false,
      isPopupOpen: false,
      isPopupPDFOpen: false,
      Business: [],
      Products: [],
      Employees: [],
      productForms: [],
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
        sale_totalprice: 0, // total price cal discount and vat
        sale_price: 0, //total price before cal discount but *qty
        total_price: 0, ////////////cal all product
        total_discount: 0, ///////////////
        Net_price: 0, //cal after cal discount
        vat: 0, //price not percentage
        price: "", //price per product
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
      searchQuery: "",
    };
  },
  computed: {
    allExpanded() {
      return this.expandedItems.size === this.Billings.length; // ถ้าทั้งหมดขยาย ให้ return true
    },
    //for calculate data
    sale_totalprice() {
      return this.Net_price + this.vat;
    },
    sale_price() {
      return this, price * sale_qty;
    },
    total_price() {
      return this.productForms.reduce((total, form) => {
        return total + form.sale_qty * form.sale_price;
      }, 0);
    },
    total_discount() {
      return this.productForms.reduce((total, form) => {
        return total + parseFloat(form.sale_discount || 0);
      }, 0);
    },
    Net_price() {
      return this.total_price - this.total_discount;
    },
    vat() {
      return (7 / 100) * this.Net_price;
    },
    lines() {
      return this.formData.remark.split("\n");
    },
    //send header data to table, this for update switch lang
    tableHeaders() {
      return [
        //key of lang, key of data that get from API
        // { label: this.t("billingStatusHeaderTable"), key: "billing_status" },
        { label: this.t("billingNumberHeaderTable"), key: "billing_number" },
        { label: this.t("tax_invoice_number"), key: "tax_invoice_number" },
        { label: this.t("invoiceHeaderTable"), key: "sale_number" },
        { label: this.t("salenumberHeaderTable"), key: "invoice_number" },
        { label: this.t("employeeNameHeaderTable"), key: "employeeName" },
        { label: this.t("cusNameHeaderTable"), key: "cus_name" },
        { label: this.t("cusAddressHeaderTable"), key: "cus_address" },
        { label: this.t("cusTelHeaderTable"), key: "cus_tel" },
        { label: this.t("cusEmailHeaderTable"), key: "cus_email" },
        { label: this.t("cusTaxHeaderTable"), key: "cus_tax" },
        { label: this.t("cusPurchaseHeaderTable"), key: "cus_purchase" },
        { label: this.t("saleTotalpriceHeaderTable"), key: "sale_totalprice" },
        { label: this.t("netpriceHeaderTable"), key: "sale_totalprice" },
        // { label: this.t("invoiceDateHeaderTable"), key: "invoice_date" },
        { label: this.t("remarkHeaderTable"), key: "remark" },
        { label: this.t("billingDateHeaderTable"), key: "billing_date" },
        { label: this.t("paymentsHeaderTable"), key: "payments" },
      ];
    },
    filteredBill() {
      let filteredInvoices = [...this.Billings];
      // กรองข้อมูล Categories โดยเปรียบเทียบกับ searchQuery
      if (this.searchQuery.trim()) {
        filteredInvoices = filteredInvoices.filter((bll) =>
          bll["billing_number"]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.t("headerLang") === "TH") {
        filteredInvoices = filteredInvoices.map((inv) => ({
          ...inv,
          showAllowButton: true,
          // statusds: inv.deleted_at,
          billing_status:
            inv.billing_status === "Complete"
              ? this.t("CompleteLG")
              : inv.billing_status, // ถ้าไม่ตรงเงื่อนไขใด ๆ ใช้ค่าเดิม

          payments:
            inv.payments === "Cash"
              ? this.t("CashLG")
              : inv.payments === "Card"
              ? this.t("CardLG")
              : inv.payments === "MobileBank"
              ? this.t("MobileBankLG")
              : inv.payments, // ถ้าไม่ตรงเงื่อนไขใด ๆ ใช้ค่าเดิม
        }));

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

        // แปลง invoice_date ให้เป็นชื่อเดือนภาษาไทย
        filteredInvoices = filteredInvoices.map((sale) => ({
          ...sale,
          billing_date: String(sale.billing_date)
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()), // ✅ เพิ่มปี ค.ศ. + 543 (เป็น พ.ศ.),
        }));
      }

      return filteredInvoices; // ถ้าไม่มีการค้นหาแสดงทั้งหมด
    },
  },
  watch: {
    "formData.sale_qty": function (newQty, oldQty) {
      this.formData.sale_price = newQty * this.formData.price;
    },
    "formData.price": function (newPrice, oldPrice) {
      this.formData.sale_price = this.formData.sale_qty * newPrice;
    },
    formData: {
      deep: true,
      handler(newValue, oldValue) {
        console.log("formData has been updated:", newValue);
      },
    },
  },
  methods: {
    formatDatePicker(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const buddhistYear = d.getFullYear() + 543;

      return `${day}/${month}/${buddhistYear}`; // 🔸 แสดงเป็น พ.ศ.
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
      this.shortcutAllow = false;
      this.isPopupVisible_error = false;
    },
    closeCutStockConfirmPopup() {
      this.isCutStockConfirmPopupOpen = false;
      this.shortcutAllow = false;
      this.isPopupVisible_error = false;
    },
    async handleAllow(row) {
      this.shortcutAllow = true;
      await this.handleEdit(row);
      this.isCutStockConfirmPopupOpen = true;
    },
    async cutStock() {
      this.errorMessages = [];
      this.isLoading = true;
      this.shortcutAllow = false;

      const isAlreadyCut = !!this.formData.deleted_at;
      const transactionType = isAlreadyCut ? "Receive" : "Issue";

      try {
        // ✅ STEP 1: ตรวจสอบทั้งหมดก่อน
        for (const form of this.productForms) {
          const productData = this.Products.find(
            (p) => p.productID === form.productID
          );

          if (!productData) {
            alert(`ไม่พบข้อมูลสินค้า ${form.productID}`);
            return;
          }

          if (!form.sale_qty || form.sale_qty <= 0) {
            alert(
              `กรุณาระบุจำนวนของสินค้า "${productData.productname}" ให้มากกว่า 0`
            );
            return;
          }
          if (
            transactionType === "Issue" &&
            form.sale_qty > productData.Amount
          ) {
            this.errorMessages.push(
              `ไม่สามารถตัดสต็อกสินค้า "${productData.productname}" ได้\nจำนวนขาย (${form.sale_qty}) มากกว่าจำนวนในคลัง (${productData.Amount})`
            );
            this.showPopup_validate(this.errorMessages);
            // alert(
            //   `ไม่สามารถตัดสต็อกสินค้า "${productData.productname}" ได้\nจำนวนขาย (${form.sale_qty}) มากกว่าจำนวนในคลัง (${productData.Amount})`
            // );
            return;
          }
        }

        // ✅ STEP 2: ถ้าผ่านหมด → ค่อยส่ง API
        for (const form of this.productForms) {
          const response = await fetch(
            `${API_CALL}/product/cut_strock_product`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: form.productID,
                transactionType,
                quantity: form.sale_qty,
                billing_number: this.formData.billing_number,
              }),
            }
          );

          const json = await response.json();
          console.log(json);

          if (json.statusCode !== 200) {
            alert(
              `ไม่สามารถดำเนินการกับสินค้า ${form.productID} ได้: ${
                json.message || "เกิดข้อผิดพลาด"
              }`
            );
            // alert(
            //   `ไม่สามารถตัดสต็อกสินค้า "${productData.productname}" ได้\nจำนวนขาย (${form.sale_qty}) มากกว่าจำนวนในคลัง (${productData.Amount})`
            // );
            return;
          }
        }

        // 🎉 ทุกอย่างผ่าน
        await this.getBilling();
        await this.getProduct();
        this.isCutStockConfirmPopupOpen = false;
        this.openPopupAllow = true;
        setTimeout(() => {
          this.openPopupAllow = false;
        }, 3000);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("เกิดข้อผิดพลาดในการติดต่อกับเซิร์ฟเวอร์");
      } finally {
        this.isLoading = false;
        this.shortcutAllow = false;
      }
    },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages; // เก็บข้อความใน errorMessages
        // this.showErrorPopup = true; // แสดง Popup
        this.isPopupVisible_error = true;
      } else {
        this.showPopup_error(messages);
      }
    },

    closeAllowConfirmPopup() {
      this.isAllowConfirmPopupOpen = false;
    },
    toggleAll() {
      if (this.allExpanded) {
        this.expandedItems.clear(); // ถ้าทุกอันถูกขยาย → ย่อทั้งหมด
      } else {
        this.expandedItems = new Set(this.Billings.map((q) => q.sale_id)); // ถ้ายังขยายไม่หมด → ขยายทั้งหมด
      }
    },
    isExpanded(id) {
      return this.expandedItems.has(id);
    },
    toggleCollapse(id) {
      if (this.expandedItems.has(id)) {
        this.expandedItems.delete(id); // ถ้ากดซ้ำให้ซ่อน
      } else {
        this.expandedItems.add(id); // ถ้ากดใหม่ให้แสดง
      }
      this.expandedItems = new Set(this.expandedItems); // อัปเดต reactivity
    },
    async getBanks() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getBank`, {
          method: "GET", // เปลี่ยน method เป็น 'POST'
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // เพิ่ม header Content-Type
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.AllBanks = json.data;
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    //popup error message (set message where call this function)
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
    },
    //popup success message (set message where call this function)
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000); // 2 seconds
    },
    //function for edit data
    async getQuotationByID(id) {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/quotation/getQuotation`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          const quotations = json.data;

          // ใช้ filter เพื่อหาข้อมูลที่ตรงกับ id
          const filteredData = quotations.filter(
            (quotation) => quotation.sale_id === id
          );

          return filteredData.length > 0 ? filteredData[0] : null; // ส่งคืนรายการแรกหรือ null ถ้าไม่มี
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async handleEdit(row) {
      this.getBilling();
      console.log("Edit item:", row);
      if (this.shortcutAllow === false) {
        this.isPopupOpen = true;
      }
      this.isAddingMode = false;
      this.isEditMode = true;
      //set date format
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง
        return d;
      };
      let formattedBill; // ประกาศตัวแปรก่อน

      if (this.t("headerLang") === "TH") {
        const monthMapping = {
          "ม.ค.": 0,
          "ก.พ.": 1,
          "มี.ค.": 2,
          "เม.ย.": 3,
          "พ.ค.": 4,
          "มิ.ย.": 5,
          "ก.ค.": 6,
          "ส.ค.": 7,
          "ก.ย.": 8,
          "ต.ค.": 9,
          "พ.ย.": 10,
          "ธ.ค.": 11,
        };

        // ตรวจสอบว่า row.invoice_date มีค่า และเป็น string หรือไม่
        if (row.billing_date && typeof row.billing_date === "string") {
          const match = row.billing_date.match(
            /(\d{1,2})\s(ม.ค.|ก.พ.|มี.ค.|เม.ย.|พ.ค.|มิ.ย.|ก.ค.|ส.ค.|ก.ย.|ต.ค.|พ.ย.|ธ.ค.)\s(\d{4})/
          );

          if (match) {
            let [_, day, thaiMonth, year] = match;
            let month = monthMapping[thaiMonth];
            formattedBill = new Date(year, month, day);
          } else {
            formattedBill = null; // ถ้าตรงกับรูปแบบไม่ได้ ให้เป็น null
          }
        } else {
          formattedBill = null; // ถ้า invoice_date ไม่มีค่าหรือไม่ใช่ string ให้เป็น null
        }
      } else {
        formattedBill = formatDateForPicker(row.billing_date); // ใช้ฟังก์ชันที่กำหนดเอง
      }

      const quotationData = await this.getQuotationByID(row.sale_id);

      const filteredInvoice = this.Billings.filter(
        (inv) => inv.billing_number === row.billing_number
      );
      console.log("this.Billings->>", this.Billings);

      this.formData = {
        deleted_at: row.deleted_at,
        billing_number: row.billing_number,
        employeeID: row.employeeID,
        employeeName: row.employeeName,
        cus_id: row.cus_id,
        cus_name: row.cus_name,
        cus_address: row.cus_address,
        cus_tel: row.cus_tel,
        cus_email: row.cus_email,
        cus_tax: row.cus_tax,
        cus_purchase: row.cus_purchase,
        sale_totalprice: row.sale_totalprice,
        remark: row.remark || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        billing_id: row.ID,
        billing_status: row.billing_status,
        billing_date: formatDateForPicker(filteredInvoice[0].billing_date),
        payments: filteredInvoice[0].payments,
        discount_quotation: quotationData.discount_quotation,
        vatType: quotationData.vatType,
      };
      console.log("console.log(row.productForms)", this.Products);
      //loop of product
      this.productForms = (row.productForms || []).map((detail) => {
        const selectedProduct = this.Products.find(
          (product) => product.productID === detail.productID
        );
        let price = 0;
        let productname = "";
        if (selectedProduct) {
          price = this.formatDecimal(
            parseFloat(selectedProduct.price.toFixed(2))
          );
          productname = selectedProduct.productname;
        }
        const salePrice = detail.sale_qty * parseFloat(price.replace(/,/g, ""));
        let saleDiscount = detail.sale_discount;
        if (detail.discounttype === "percent") {
          saleDiscount = (detail.sale_discount / 100) * salePrice;
        }
        return {
          productID: detail.productID,
          price: price,
          productname: productname,
          sale_qty: detail.sale_qty,
          sale_price: this.formatDecimal(salePrice - saleDiscount),
          sale_discount: detail.sale_discount,
          discounttype: detail.discounttype,
          product_detail: detail.product_detail,
          pro_unti: detail.pro_unti,
        };
      });
      this.updateTotalDiscount();
      this.totalNetPrice();
      this.total_pricesale();
      this.total_priceBeforeDiscount();

      if (this.formData.vatType === "VATincluding") {
        this.formData.sale_totalprice = this.formatDecimal(
          parseFloat(this.formData.Net_price.replace(/,/g, "")) / 1.07
        );
        this.formData.vat = this.formatDecimal(
          parseFloat(this.formData.Net_price.replace(/,/g, "")) -
            parseFloat(this.formData.sale_totalprice.replace(/,/g, ""))
        );
      } else {
        this.formData.vat = this.formatDecimal(
          parseFloat(this.formData.Net_price.replace(/,/g, "")) * 0.07
        );
        this.formData.sale_totalprice = this.formatDecimal(
          parseFloat(this.formData.Net_price.replace(/,/g, "")) +
            parseFloat(this.formData.vat)
        );
      }
      this.calculateNat(quotationData.discount_quotation);
    },
    calculateNat(discount) {
      const totalNet = this.productForms.reduce((total, form) => {
        const salePrice = parseFloat(form.sale_price.replace(/,/g, "")); // แปลง formatDecimal เป็นตัวเลข
        return total + salePrice;
      }, 0);

      if (discount > totalNet) {
        this.formData.discount_quotation = totalNet;
        this.formData.Net_price = 0;
      } else {
        this.formData.Net_price = totalNet - discount;
      }

      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();
    },
    //function preview pdf call in table, the data in this function will send to pdfviewer for preview pdf
    handlePreview(row) {
      console.log("Preview item:", row);
      this.viewformpdf("view", row);
      this.isAddingMode = false;
      this.isEditMode = true;
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง
        return d;
      };
      const formattedBilling = formatDateForPicker(row.billing_date);
      this.formData = {
        billing_number: row.billing_number,
        employeeID: row.employeeID,
        employeeName: row.employeeName,
        cus_id: row.cus_id,
        cus_name: row.cus_name,
        cus_address: row.cus_address,
        cus_tel: row.cus_tel,
        cus_email: row.cus_email,
        cus_tax: row.cus_tax,
        cus_purchase: row.cus_purchase,
        sale_totalprice: row.sale_totalprice,
        remark: row.remark || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        billing_id: row.ID,
        billing_status: row.billing_status,
        billing_date: formattedBilling,
        payments: row.payments,
      };
      //loop of product
      this.productForms = (row.productForms || []).map((detail) => {
        const selectedProduct = this.Products.find(
          (product) => product.productname === detail.productID
        );
        let price = 0;
        if (selectedProduct) {
          price = this.formatDecimal(
            parseFloat(selectedProduct.price.toFixed(2))
          );
        }
        const salePrice = detail.sale_qty * parseFloat(price.replace(/,/g, ""));
        let saleDiscount = detail.sale_discount;
        if (detail.discounttype === "percent") {
          saleDiscount = (detail.sale_discount / 100) * salePrice;
        }
        return {
          productID: detail.productID,
          price: price,
          sale_qty: detail.sale_qty,
          sale_price: this.formatDecimal(salePrice - saleDiscount),
          sale_discount: saleDiscount,
          discounttype: detail.discounttype || "amount",
        };
      });
      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();
    },
    //function download pdf call in table, the data in this function will send to pdfviewer for download
    handleDownload(row) {
      console.log("Edit item:", row);
      this.viewformpdf("download", row);
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง
        return d;
      };
      this.formData = {
        billing_number: row.billing_number,
        employeeID: row.employeeID,
        employeeName: row.employeeName,
        cus_id: row.cus_id,
        cus_name: row.cus_name,
        cus_address: row.cus_address,
        cus_tel: row.cus_tel,
        cus_email: row.cus_email,
        cus_tax: row.cus_tax,
        cus_purchase: row.cus_purchase,
        sale_totalprice: row.sale_totalprice,
        remark: row.remark || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        billing_id: row.ID,
        billing_status: row.billing_status,
        billing_date: row.billing_date,
        payments: row.payments,
      };
      //loop of product
      this.productForms = (row.details || []).map((detail) => {
        const selectedProduct = this.Products.find(
          (product) => product.productID === detail.productID
        );
        let price = 0;
        if (selectedProduct) {
          price = this.formatDecimal(
            parseFloat(selectedProduct.price.toFixed(2))
          );
        }
        const salePrice = detail.sale_qty * parseFloat(price.replace(/,/g, ""));
        let saleDiscount = detail.sale_discount;
        if (detail.discounttype === "percent") {
          saleDiscount = (detail.sale_discount / 100) * salePrice;
        }
        return {
          productID: detail.productID,
          price: price,
          sale_qty: detail.sale_qty,
          sale_price: this.formatDecimal(salePrice - saleDiscount),
          sale_discount: saleDiscount,
          discounttype: detail.discounttype || "amount",
        };
      });
      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();
    },
    //handle delete call in table, data in this will send to popup delete
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = {
        billing_id: item.ID,
        invoice_id: item.invoice_id,
      };
    },
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    //this function for set date format
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    //this function for set number format
    formatDecimal(value) {
      const floatValue = parseFloat(value);
      if (Math.round(floatValue) === floatValue) {
        return floatValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
      }
      return floatValue
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    //calculate function total discount
    updateTotalDiscount() {
      const totalDiscount = this.productForms.reduce((total, form) => {
        let sumdiscount = "";
        if (form.sale_discount === "") {
          return 0;
        }

        if (form.discounttype === "percent") {
          sumdiscount =
            (parseFloat(form.sale_discount) *
              (parseFloat(form.sale_qty) * parseFloat(form.price))) /
            100;
        } else {
          sumdiscount = parseFloat(form.sale_discount);
        }

        const saleDiscount = parseFloat(sumdiscount);
        return total + saleDiscount;
      }, 0);
      this.formData.total_discount = this.formatDecimal(totalDiscount);
    },
    //calculate function Net
    totalNetPrice() {
      const totalNet = this.productForms.reduce((total, form) => {
        const salePrice = parseFloat(form.sale_price.replace(/,/g, "")); // แปลง formatDecimal เป็นตัวเลข
        return total + salePrice;
      }, 0);
      const saleDiscount = this.formData.total_discount.replace(/,/g, "");
      this.formData.Net_price = this.formatDecimal(
        parseFloat(totalNet) - parseFloat(this.formData.discount_quotation)
      );
    },
    //calculate function vat
    vat_price() {},
    //calculate function total price not include discount
    total_priceBeforeDiscount() {
      const totalNet = this.productForms.reduce((total, form) => {
        const salePrice = parseFloat(form.sale_price.replace(/,/g, "")); // แปลง formatDecimal เป็นตัวเลข
        return total + salePrice;
      }, 0);
      this.formData.total_price = this.formatDecimal(totalNet);
    },
    //calculate function total price
    total_pricesale() {},
    //function for set pdf view
    async viewformpdf(action, row) {
      const productForms = row.productForms || [];
      const doc = new jsPDF();

      const quotationData = await this.getQuotationByID(row.sale_id);
      console.log(">>>>>>>>>>>>>>>>>", quotationData);

      const filteredInvoicesPDF = this.Billings.filter(
        (invoice) => invoice.sale_id === row.sale_id
      );

      const formatDate = { day: "2-digit", month: "short", year: "numeric" };
      const Qdate = new Date(filteredInvoicesPDF[0].billing_date);
      const Quo_date = Qdate.toLocaleDateString("en-GB", formatDate);

      const Expdate = new Date(row.credit_expired_date);
      const ExpiredDate = Expdate.toLocaleDateString("en-GB", formatDate);
      const IN_date = Quo_date;
      //header of prodyct table
      const headerText = [
        "No.",
        "Image",
        "Product Name",
        "Qty",
        "Unit price",
        "Discount",
        "Total Price",
      ];

      const tableData = productForms.map((form, index) => {
        const product = this.Products.find(
          (product) => product.productID === form.productID
        );
        return [
          index + 1,
          product && product.productImg ? product.productImg : "---",
          product.productname +
            (form.product_detail ? "\n" + form.product_detail : ""),
          form.sale_qty,
          this.formatDecimal(product ? product.price : ""),
          this.formatDecimal(form.sale_discount),
          this.formatDecimal(form.sale_price),
        ];
      });

      console.log("Table:", tableData);

      const startY = 85;
      const margin = 10;
      const lineHeight = 15;
      const pageSize = 6;
      const pageCount = Math.ceil(tableData.length / pageSize);

      for (let i = 0; i < pageCount; i++) {
        const currentPageData = tableData.slice(
          i * pageSize,
          (i + 1) * pageSize
        );

        if (i > 0) {
          doc.addPage();
        }
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(16);

        doc.addFileToVFS("Prompt-Bold.ttf", PromptBold);
        doc.addFont("Prompt-Bold.ttf", "PromptBold", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setFont("PromptBold", "bold");
        doc.setFontSize(20);
        doc.text("Receipt", 174, 40);

        doc.addFileToVFS("Prompt-Regular.ttf", PromptRegular);
        doc.addFont("Prompt-Regular.ttf", "PromptRegular", "normal");
        doc.setFontSize(16);

        doc.setFont("PromptRegular", "normal");

        doc.text(`${this.Business.bus_name}`, 10, 12);

        const bank_detail = this.AllBanks.filter(
          (bank) => bank.bank_id === this.Business.bank_id
        );

        const FormBank = [
          `${bank_detail[0].bank_name}`,
          `${bank_detail[0].bank_account}`,
          `${bank_detail[0].bank_number}`,
        ];
        doc.setFontSize(14);
        doc.text(FormBank, 10, 275, {
          align: "left",
          valign: "left",
          lineGap: 8,
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        doc.setFont("PromptRegularLight", "normal");
        doc.text(
          `${this.Business.bus_name} ${this.Business.bus_website}`,
          10,
          19
        );
        doc.text(`${this.Business.bus_address}`, 10, 24);
        doc.text(`Tax ID.${this.Business.bus_tax}`, 10, 29);
        doc.text(`Tel.${this.Business.bus_tel}`, 10, 34);
        doc.text("Signature", 110, 265);
        doc.text("Name", 110, 275);
        doc.text("Position", 110, 285);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        doc.text(`Customer Name: ` + row.cus_name, 10, 50);
        doc.text(`Address: ` + row.cus_address, 10, 55);
        doc.text(`Contact: ` + row.cus_tel, 10, 60);
        doc.text(`E-mail: ` + row.cus_email, 10, 65);
        doc.text(`Contact No: ` + row.cus_tel, 10, 70);
        doc.text(`Tax ID: ` + row.cus_tax, 10, 75);

        const startX_header_custom = 130;
        const valueRightAlignX_custom = 200;
        const startY_header_custom = 50;
        const lineHeight_custom = 5;

        let currentY = startY_header_custom;

        function drawAlignedRow(label, value) {
          doc.text(label, startX_header_custom, currentY);

          const textWidth = doc.getTextWidth(value);
          doc.text(value, valueRightAlignX_custom - textWidth, currentY);

          currentY += lineHeight_custom;
        }

        drawAlignedRow("Date:", IN_date);
        drawAlignedRow(
          "Receipt Number:",
          row.billing_number || row.billing_number
        );
        drawAlignedRow(
          "Tax Number:",
          row.tax_invoice_number || row.tax_invoice_number
        );
        drawAlignedRow("Invoice Number:", row.invoice_number);
        drawAlignedRow("Quotation Number:", row.quotation_num);

        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        doc.setFont("PromptRegularLight", "normal");
        const employ = this.Employees.find(
          (p) => p.employeeID === row.employeeID
        );

        doc.text(`Name: `, 10, 255);
        doc.text(row.employeeName, 40, 255);
        doc.text(`Email: `, 10, 260);
        doc.text(employ.Email, 40, 260);
        doc.text(`Contact No.: `, 10, 265);
        doc.text(employ.Phone_num, 40, 265);
        doc.text(`Remark: `, 10, 215);

        doc.text(`Total Before Discount: `, 130, 215);
        doc.text(`Total Before VAT: `, 130, 220);
        doc.text(`Discount: `, 130, 225);
        doc.text(`VAT 7%: `, 130, 230);
        doc.text(`Net Price:  `, 130, 235);

        const total_price = productForms.reduce((total, form) => {
          return total + parseFloat(form.sale_price);
        }, 0);

        const total_discount = productForms.reduce((total, form) => {
          return total + parseFloat(form.sale_discount || 0);
        }, 0);

        const net_price = total_price - row.discount_quotation;
        const vat = (7 / 100) * net_price;
        let netCal = this.formatDecimal(total_price * 0.07);
        let sale_data = this.formatDecimal(total_price + netCal);

        if (quotationData.vatType === "VATincluding") {
          let FormTotalprice = [
            `${this.formatDecimal(total_price)}`,
            `${(
              this.formatDecimal(
                total_price - quotationData.discount_quotation
              ) / 1.07
            ).toFixed(2)}`,
            `${this.formatDecimal(quotationData.discount_quotation)}`,
            `${this.formatDecimal(
              total_price -
                quotationData.discount_quotation -
                (total_price - quotationData.discount_quotation) / 1.07
            )}`,
            `${this.formatDecimal(
              total_price - quotationData.discount_quotation
            )}`,
          ];
          let startY = 215;
          const lineSpacing = 5;

          FormTotalprice.forEach((line) => {
            doc.text(line, 200, startY, {
              align: "right",
              valign: "middle",
            });
            startY += lineSpacing;
          });
        } else {
          let FormTotalprice = [
            `${this.formatDecimal(total_price)}`,
            `${this.formatDecimal(
              total_price - quotationData.discount_quotation
            )}`,
            `${this.formatDecimal(quotationData.discount_quotation)}`,
            `${this.formatDecimal(
              (total_price - quotationData.discount_quotation) * 0.07
            )}`,
            `${this.formatDecimal(
              total_price -
                quotationData.discount_quotation +
                (total_price - quotationData.discount_quotation) * 0.07
            )}`,
          ];
          let startY = 215;
          const lineSpacing = 5;

          FormTotalprice.forEach((line) => {
            doc.text(line, 200, startY, {
              align: "right",
              valign: "middle",
            });
            startY += lineSpacing;
          });
        }

        doc.addFileToVFS("Prompt-Regular.ttf", PromptRegular);
        doc.addFont("Prompt-Regular.ttf", "PromptRegular", "normal");
        doc.setFontSize(16);

        doc.setLineWidth(0.5);
        doc.line(10, 210, 200, 210);
        doc.line(10, 238, 200, 238);
        doc.line(130, 265, 200, 265);
        doc.line(130, 275, 200, 275);
        doc.line(130, 285, 200, 285);

        doc.setFont("PromptRegular", "normal");
        doc.text("Receipt Receiver", 110, 250);
        doc.text("Buyer", 10, 42);
        doc.setFontSize(14);
        doc.text(`Sales Person`, 10, 248);
        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        const maxWidth = 90;
        const maxWidth2 = 20;
        const maxHeight = 20;

        doc.setFont("PromptRegularLight", "normal");

        if (this.Business.bus_logo != null) {
          const img = new Image();
          img.src = `${this.Business.bus_logo}`;

          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const maxBoxWidth = 35;
          const maxBoxHeight = 20;

          let imgWidth = img.width;
          let imgHeight = img.height;

          const widthRatio = maxBoxWidth / imgWidth;
          const heightRatio = maxBoxHeight / imgHeight;
          const scaleRatio = Math.min(widthRatio, heightRatio);

          const scaledWidth = imgWidth * scaleRatio;
          const scaledHeight = imgHeight * scaleRatio;

          const boxX = doc.internal.pageSize.width - 10 - maxBoxWidth;
          const boxY = 12;

          const imgX = boxX + (maxBoxWidth - scaledWidth);
          const imgY = boxY;

          doc.addImage(img, "JPEG", imgX, imgY, scaledWidth, scaledHeight);
        }

        doc.setFont("helvetica", "normal");
        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        doc.setFont("PromptRegularLight", "normal");

        doc.text(`${row.remark}`, 40, 215, { maxWidth });
        this.drawHeader(doc, headerText, startY, margin);
        this.drawTable(doc, currentPageData, startY, margin, lineHeight);
      }

      if (action === "view") {
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = pdfUrl;
        window.open(pdfUrl, "_blank");
      } else if (action === "download") {
        doc.save(`quotation-${row.cus_name}-${row.sale_number}.pdf`);
      }
    },
    drawHeader(doc, headerText, startY, margin) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const cellWidth =
        (doc.internal.pageSize.width - margin * 2) / headerText.length;
      const startX = margin;
      let x = margin;
      let y = startY;
      const lineHeight = 7;

      headerText.forEach((header) => {
        let cellWidth = 0;
        if (header === "No.") {
          cellWidth = 10;
        } else if (header === "Image") {
          cellWidth = 30;
        } else if (header === "Product Name") {
          cellWidth = (doc.internal.pageSize.width - margin * 2) * 0.3;
        } else {
          cellWidth =
            (doc.internal.pageSize.width -
              margin * 2 -
              (doc.internal.pageSize.width - margin * 2) * 0.4 -
              20) /
            (headerText.length - 3);
        }

        doc.text(header, x + cellWidth / 2, y + 3, {
          align: "center",
          valign: "middle",
        });
        x += cellWidth;
      });

      doc.setLineWidth(0.1);
      doc.rect(
        margin,
        startY - 2,
        doc.internal.pageSize.width - 2 * margin + 1,
        lineHeight
      );
    },
    drawTable(doc, data, startY, margin, lineHeight) {
      const startX = margin;
      let y = startY + 5;
      doc.setFontSize(10);

      const cellWidths = data[0].map((_, index) => {
        if (index === 0) return 10;
        else if (index === 1) return 30;
        else if (index === 2)
          return (doc.internal.pageSize.width - margin * 2) * 0.3;
        else {
          return (
            (doc.internal.pageSize.width -
              margin * 2 -
              (doc.internal.pageSize.width - margin * 2) * 0.4 -
              20) /
            (data[0].length - 3)
          );
        }
      });

      data.forEach((row) => {
        let maxRowHeight = lineHeight;
        const productDetailCell = row[2] || "";
        if (
          typeof productDetailCell === "string" &&
          productDetailCell.includes("\n")
        ) {
          const lines = productDetailCell.split("\n");
          const requiredHeight = lines.length * 5;
          if (requiredHeight > maxRowHeight) {
            maxRowHeight = requiredHeight;
          }
        }

        let x = startX;

        row.forEach((cell, index) => {
          const currentCellWidth = cellWidths[index];
          doc.rect(x, y, currentCellWidth, maxRowHeight, "S");

          if (index === 1 && cell && cell !== "---") {
            try {
              const padding = 1;
              const imgWidth = currentCellWidth - padding * 2;
              const imgHeight = maxRowHeight - padding * 2;
              doc.addImage(
                cell,
                x + padding,
                y + padding,
                imgWidth,
                imgHeight,
                undefined,
                "FAST"
              );
            } catch (e) {
              console.warn("Could not add image:", e);
            }
          } else if (index === 2 && typeof cell === "string") {
            const lines = cell.split("\n");

            if (lines.length > 1) {
              doc.text(lines, x + 2, y + 4, { align: "left" });
            } else {
              const textY = y + maxRowHeight / 2;
              doc.text(lines[0], x + currentCellWidth / 2, textY, {
                align: "center",
                valign: "middle",
              });
            }
          } else {
            const textY = y + maxRowHeight / 2;
            doc.text(String(cell), x + currentCellWidth / 2, textY, {
              align: "center",
              valign: "middle",
            });
          }
          x += currentCellWidth;
        });

        y += maxRowHeight;
      });
    },
    ClosePDFview() {
      this.isPopupPDFOpen = false;
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isEditMode = false;
      this.formData = {
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
        pdfname: "",
        file: "",
      };
      this.productForms = [];
      this.getBilling();
      this.isPopupVisible_error = false;
    },
    async getBilling() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/quotation/getBilling`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        console.log("--->", json.data);

        if (json.statusCode === 200) {
          console.log("---->", json.data);
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

            const formatNumber = (number) => {
              return new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(number);
            };
            let total_before_vat;
            let vat_in;

            if (item.vatType === "VATexcluding") {
              total_before_vat = (item.sale_totalprice * 100) / 107;
              vat_in = total_before_vat * 1.07;
            } else {
              total_before_vat = item.sale_totalprice;
              vat_in = (
                item.sale_totalprice +
                (item.sale_totalprice * 7) / 100
              ).toFixed(2);
            }

            total_before_vat = formatNumber(total_before_vat);
            vat_in = formatNumber(vat_in);

            let initialTableData = {
              sale_id: item.sale_id,
              billing_number: item.billing,
              tax_invoice_number: item.tax_invoice_number,
              invoice_number: item.invoice_number,
              quotation_num: item.quotation_num,
              employeeID: item.employeeID,
              employeeName: item.employee_name,
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              sale_totalprice: total_before_vat,
              net_price: vat_in,
              invoice_id: item.invoice_id,
              remark: item.remark || "",
              ID: item.billing_id,
              billing_date: BillingDate,
              payments: item.payments,
              deleted_at: item.deleted_at,
              productForms: item.details.map((detail) => ({
                productID: detail.productID,
                sale_price: detail.sale_price,
                discounttype: detail.discounttype,
                sale_discount: detail.sale_discount,
                sale_qty: detail.sale_qty,
                product_detail: detail.product_detail,
                pro_unti: detail.pro_unti,
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
    async editBilling() {
      const accessToken = localStorage.getItem("@accessToken");
      console.log("sale price: ", this.formData.remark);

      if (this.formData.billing_date === "" || this.formData.payments === "") {
        this.inputError = true;
        this.showPopup_error("Please fill all data");
        this.result = false;
      } else {
        console.log("Sale number: ", this.formData.billing_number);
        console.log("ID number: ", this.formData.billing_id);
        try {
          const in_id = this.formData.billing_id;
          const response = await fetch(
            `${API_CALL}/quotation/editBilling/${in_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                billing_date: this.formData.billing_date,
                billing_number: this.formData.billing_number,
                payments: this.formData.payments,
                remark: this.formData.remark,
              }),
            }
          );
          const json = await response.json();

          if (json.statusCode === 200) {
            this.getBilling();
            this.showPopup(this.$t("validation.EditSucc"));
            this.closePopup();
          } else {
            this.showPopup_error(json.data);
            console.log("Employee ", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    },
    async deleteBilling() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const qty_id = this.formData.invoice_id;

      try {
        const response = await fetch(
          `${API_CALL}/quotation/deleteBilling/${qty_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              billing_id: qty_id,
            }),
          }
        );
        const json = await response.json();
        console.log(json);

        if (json.statusCode === 200) {
          this.getBilling();
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
    async getEmployee() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(
          `${API_CALL}/employee/getEmployeeQuotation`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Employees = json.data.map((item) => {
            let initialTableData = {
              employeeID: item.employeeID,
              Name: item.name,
              Phone_num: item.phone,
              Email: item.email,
              Department: item.department,
              position: item.position,
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
    async getProduct() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/getProduct`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Products = json.data.map((item) => {
            return {
              productID: item.productID,
              Category: item.product_category.categoryName,
              productname: item.productname,
              Detail: item.productdetail,
              price: item.price,
              Cost: item.productcost,
              Amount: item.amount,
              productImg: item.productImg,
              productTypeID: item.productTypeID,
              categoryID: item.categoryID,
            };
          });
        } else {
          this.showPopup_error(json.data);
          console.log("Product: ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getBusiness() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/quotation/getBusinessByID`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Business = json.data.business;
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getBilling();
    this.getBusiness();
    this.getProduct();
    this.getEmployee();
    this.getBanks();
  },
};
</script>

<style scoped>
/* ปรับขนาดของแต่ละคอลัมน์ */
.product-name-column {
  width: 30%; /* กำหนดพื้นที่มากที่สุดสำหรับชื่อสินค้า */
  min-width: 150px !important;
}
.price-column {
  width: 15%; /* รองรับข้อมูลยาวสำหรับ Price */
  min-width: 130px !important;
}
.quantity-column {
  width: 5%;
  min-width: 100px !important;
}
.unit-column {
  width: 5%;
  min-width: 120px !important;
}
.discount-column {
  width: auto; /* ให้ขนาดปรับตามเนื้อหา */
  white-space: nowrap; /* บังคับให้ข้อความอยู่บรรทัดเดียว */
  text-align: center;
}
.total-price-column {
  width: 15%; /* รองรับข้อมูลยาวสำหรับ Price */
  min-width: 130px !important;
}
.action-column {
  width: 10%; /* คอลัมน์ปุ่มลบ */
  min-width: 10px !important;
}

.show-only-desktop table thead tr th:nth-child(7),
.show-only-desktop table tbody tr td:nth-child(7) {
  display: block !important;
}
</style>
