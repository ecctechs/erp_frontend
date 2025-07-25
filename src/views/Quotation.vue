<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body" :isLoading="isLoading">
      <div class="mb-3">
        <h2>{{ t("headerQuotation") }}</h2>
      </div>
      <!-- <div class="add-btn mb-3" style="flex: 1">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control me-3 col-sm-4"
          style="width: 20%"
          :placeholder="$t('Search')"
        />

        <a class="btn btn-success" @click="openPopup">{{
          t("addQuotation")
        }}</a>
      </div> -->

      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-6 col-lg-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <div class="col-6 col-sm-6 col-md-6 col-lg-9">
          <a
            class="btn btn-success float-right size-font-sm"
            @click="openPopup"
            >{{ t("addQuotation") }}</a
          >
        </div>
      </div>

      <div class="card-view-customs" style="display: none">
        <!-- ปุ่ม Expand/Collapse All -->
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
            v-for="quotation in filteredQuo"
            :key="quotation.sale_id"
          >
            <div class="card d-flex flex-column" style="font-size: 12px">
              <div class="card-header d-flex">
                <div class="col-6">{{ quotation.sale_number }}</div>
                <div
                  class="col-3 text-end"
                  :class="{
                    'text-success': ['อนุมัติ', 'Allowed'].includes(
                      quotation.status
                    ),
                    'text-danger': quotation.status === 'ยกเลิก',
                  }"
                >
                  {{ quotation.status }}
                </div>
                <div class="col-1 text-end">
                  <Icon
                    v-if="
                      quotation.status === 'ยังไม่มีใบวางบิล' ||
                      quotation.status === 'Invoice not Issued'
                    "
                    name="mdi-check-circle"
                    @click="handleAllow(quotation)"
                    style="cursor: pointer"
                  ></Icon>
                </div>
                <div class="col-1 text-end">
                  <Icon
                    name="mdi mdi-pencil-outline"
                    @click="handleEdit(quotation)"
                    style="cursor: pointer"
                  ></Icon>
                </div>
                <div class="col-1 text-end">
                  <Icon
                    v-if="
                      quotation.status === 'ยังไม่มีใบวางบิล' ||
                      quotation.status === 'Invoice not Issued'
                    "
                    name="mdi mdi-trash-can-outline"
                    style="color: red; cursor: pointer"
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
                        {{ t("saleDateHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.sale_date }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("creditdateHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">
                        {{ quotation.credit_date_number }}
                      </p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("expiredHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">
                        {{ quotation.credit_expired_date }}
                      </p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text">
                        {{ t("invoiceStatusHeaderTable") }}
                      </p>
                    </div>
                    <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <p class="card-text">{{ quotation.invoice }}</p>
                    </div>
                    <div class="col-6" v-if="isExpanded(quotation.sale_id)">
                      <p class="card-text"></p>
                    </div>
                    <!-- <div
                      class="col-6 text-end"
                      v-if="isExpanded(quotation.sale_id)"
                    >
                      <div class="icon-table d-flex justify-content-end">
                        <div class="icon-table">
                          <div
                            class="icon-preview me-4"
                            @click="handlePreview(quotation)"
                          ></div>
                          <div
                            class="icon-download"
                            @click="handleDownload(quotation)"
                          ></div>
                        </div>
                      </div>
                    </div> -->
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
                <div class="col-1 text-end" @click="handlePreview(quotation)">
                  <Icon name="mdi-eye-outline" style="cursor: pointer" />
                </div>
                <div class="col-1 text-end" @click="handleDownload(quotation)">
                  <Icon name="mdi-tray-arrow-down" style="cursor: pointer" />
                </div>
              </div>

              <!-- Footer (กดแล้วขยายเฉพาะ Card ที่กด) -->
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

      <div class="quotataion-show-only-desktop sale_hide">
        <QuotationList
          :tableHeaders="tableHeaders"
          :initialTableData="filteredQuo"
          :columnforExport="true"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          @handleExport="handleDownload"
          @handlePreview="handlePreview"
          @handleAllow="handleAllow"
          v-if="Quotations"
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
  <div>
    <popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <h2 style="margin-top: -30px">{{ t("headerQuotation") }}</h2>

      <div class="border p-4 mb-3">
        <h5 style="text-decoration: underline">{{ t("HeaderPart") }}</h5>
        <div v-for="field in headerFields" :key="field.key" class="mb-3 div-for-formControl">
          <label class="col-sm-5 col-md-6">
            <span v-if="field.required" style="color:red;">*</span>{{ t(field.label) }}
          </label>
          <TextField v-if="field.componentType === 'TextField'" v-model="formData[field.key]" :readonly="field.readonly" disabled />
          <Dropdown v-if="field.componentType === 'Dropdown' && isEditMode" v-model="formData[field.key]" :options="this[field.options]" :disabled="field.readonly" />
          <v-autocomplete v-if="field.componentType === 'Autocomplete'" :items="this[field.items]" :item-title="field.itemTitle" :item-value="field.itemValue" variant="outlined" v-model="formData[field.key]" :class="{ error: isEmpty[field.key] }" />
        </div>
      </div>

      <div class="border p-4 mb-3">
        <h5 style="text-decoration: underline">{{ t("customerPart") }}</h5>
        <div v-for="field in customerFields" :key="field.key" class="mb-3 div-for-formControl">
            <label class="col-sm-5 col-md-6"><span v-if="field.required" style="color:red;">*</span>{{ t(field.label) }}</label>
            <div v-if="field.componentType === 'Datalist'" style="position: relative; width: 50%;">
                <input list="browsers" class="form-control" v-model="selectedCusName" @input="getDetailCustomer()" :class="{ error: isEmpty.cus_name }" autoComplete="off" />
                <datalist id="browsers">
                    <option v-for="item in Customers" :key="item.cus_id" :value="item.cus_name"></option>
                </datalist>
            </div>
            <TextField v-else v-model="formData[field.key]" :readonly="isReadonly" :disabled="isDisabled" :maxlength="field.maxlength" @keypress="field.isNumeric ? validateInput($event) : null" :class="{ error: isEmpty[field.key] }" />
        </div>
      </div>

      <div class="border p-4 mb-3">
         <div
          class="Register-contain"
          :class="{ error: isEmpty.productForms }"
          style="padding: 20px; width: unset"
        >
          <h5 style="text-decoration-line: underline">
            <span style="color: red">*</span>{{ t("product") }}
          </h5>
          <div class="mb-3">
            <button
              class="round-button btn btn-primary"
              @click="showingAddProduct"
            >
              +
            </button>
          </div>
          <div>
            <table class="table" style="width: 100%">
              <thead>
                <tr>
                  <th class="product-name-column">{{ t("productName") }}</th>
                  <th class="price-column">{{ t("price") }}</th>
                  <th class="quantity-column">{{ t("quantity") }}</th>
                  <th class="unit-column">{{ t("pro_unit") }}</th>
                  <th class="discount-column">{{ t("discount") }}</th>
                  <th class="total-price-column">{{ t("totalPrice") }}</th>
                  <th class="action-column"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(form, index) in productForms" :key="index">
                  <td class="product-name-column">
                    <div class="relative-wrapper">
                      <label>
                        <input
                          list="browsers2"
                          name="myBrowser2"
                          class="form-control"
                          v-model="form.productName"
                          @input="getDetailProduct(form, index)"
                          :class="{ error: inputError }"
                          autoComplete="off"
                      /></label>
                      <datalist id="browsers2">
                        <option
                          v-for="item in filteredProducts"
                          :key="item.productID"
                          :value="item.productname"
                        ></option>
                      </datalist>
                      <!-- <v-autocomplete
                        label=""
                        :items="Products"
                        item-title="productname"
                        item-value="productID"
                        variant="outlined"
                        v-model="form.productID"
                        :class="{ error: inputError }"
                        @update:modelValue="updatePrice(form, index)"
                      >
                      </v-autocomplete> -->

                      <a
                        class="text-muted ng-star-inserted text-start"
                        href="javascript:void(0)"
                        @click="toggleProductDetail(form, index)"
                        ><div _ngcontent-vfm-c67="" class="description-row">
                          เพิ่มรายละเอียดสินค้า
                        </div></a
                      >
                      <textarea
                        v-if="form.showDetails || form.product_detail !== ''"
                        class="form-control"
                        v-model="form.product_detail"
                        rows="3"
                      ></textarea>
                    </div>
                    <!-- <select
                      class="form-control form-select"
                      v-model="form.productID"
                      @change="updatePrice(form)"
                    >
                      <option
                        v-for="product in Products"
                        :key="product.productID"
                        :value="product.productID"
                      >
                        {{ product.productname }}
                      </option>
                    </select> -->
                  </td>
                  <td class="price-column">
                    <input
                      class="form-control readonly"
                      v-model="form.price"
                      :readonly="form.isReadonly2"
                      :disabled="form.isDisabled2"
                    />
                  </td>
                  <td class="quantity-column">
                    <input
                      class="form-control"
                      v-model="form.sale_qty"
                      @keypress="validatePaste"
                      @input="updatePrice(form, index)"
                    />
                  </td>
                  <td class="unit-column">
                    <input
                      class="form-control"
                      v-model="form.pro_unti"
                      maxlength="30"
                    />
                  </td>

                  <td class="discount-column">
                    <div class="discount-type">
                      <!-- <select
                        class="form-control form-select"
                        v-model="form.discounttype"
                        @change="updatePrice2(form, index)"
                        style="
                          border-top-right-radius: 0px;
                          border-bottom-right-radius: 0px;
                          width: 20px !important;
                          min-width: 125px;
                        "
                      >
                        <option value="amount">
                          {{ t("productDiscountTypeAmount") }}
                        </option>
                        <option value="percent">
                          {{ t("productDiscountTypePercent") }}
                        </option>
                      </select> -->
                      <Dropdown
                        v-model="form.discounttype"
                        :options="discountTypeOptions"
                        @change="updatePrice2(form, index)"
                        style="
                          border-top-right-radius: 0px;
                          border-bottom-right-radius: 0px;
                          width: 20px !important;
                          min-width: 155px;
                        "
                      />

                      <input
                        style="
                          min-width: 100px;
                          border-top-left-radius: 0px;
                          border-bottom-left-radius: 0px;
                          border-left: 1px solid rgba(0, 0, 0, 0) !important;
                        "
                        class="form-control"
                        v-model="form.sale_discount"
                        min="0"
                        @input="
                          (event) => {
                            limitDiscount(form);
                            updatePrice(form, index);
                          }
                        "
                        @keypress="validatePaste"
                      />
                    </div>
                  </td>
                  <td class="total-price-column">
                    <input
                      class="form-control readonly"
                      v-model="form.sale_price"
                      readonly
                      disabled
                    />
                  </td>
                  <td class="action-column">
                    <Button
                      customClass="btn btn-danger mdi mdi-trash-can-outline"
                      @click="closingProduct(index)"
                    ></Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

            <div class="border p-4 mb-3">
        <h5 style="text-decoration: underline">{{ t("Condition") }}</h5>
        <div v-for="field in conditionFields" :key="field.key" class="mb-3 div-for-formControl">
            <label class="col-sm-5 col-md-6">{{ t(field.label) }}</label>
            <v-date-picker v-if="field.componentType === 'DatePicker'" v-model="formData[field.key]" locale="th-TH" :format="formatDatePicker" :disabled="field.readonly">
                <template #default="{ inputEvents }">
                    <input :value="formatDatePicker(formData[field.key])" v-on="inputEvents" class="form-control" />
                </template>
            </v-date-picker>
            <Dropdown v-else v-model="formData[field.key]" :options="this[field.options]" :error="isEmpty[field.key]" />
        </div>
        <div v-for="field in summaryFields" :key="field.key" class="mb-3 div-for-formControl">
            <label class="col-sm-5 col-md-6">{{ t(field.label) }}</label>
            <TextField v-if="field.componentType === 'TextField'" v-model="formData[field.key]" @input="calculateNat(formData.discount_quotation)" @keypress="field.isNumeric ? validateInput($event) : null" />
            <textarea v-else-if="field.componentType === 'Textarea'" v-model="formData[field.key]" :maxlength="field.maxlength" class="form-control" rows="3"></textarea>
        </div>
        </div>

          <div class="border p-4 mb-3">
      <h5 style="text-decoration: underline">{{ t("Infernal") }}</h5>
      <div v-for="field in internalFields" :key="field.key" class="mb-5 div-for-formControl-textarea">
          <label class="col-sm-5 col-md-6 label-textarea">{{ t(field.label) }}</label>
          <div v-if="field.componentType === 'Upload'" class="col-6 col-sm-6 col-md-6">
              <div class="input-group input-upload-custom">
                  <label class="input-group-text btn btn-primary">{{ t("SelectImage") }}<input type="file" hidden @change="previewImage" /></label>
                  <input type="text" class="form-control" :value="fileName || t('FileImageName')" readonly />
              </div>
              <div v-if="imageSrc" class="image-preview mt-3"><img :src="imageSrc" alt="Preview" style="max-width: 200px;" /></div>
          </div>
          <textarea v-else-if="field.componentType === 'Textarea'" v-model="formData[field.key]" :maxlength="field.maxlength" class="form-control" rows="3"></textarea>
      </div>
  </div>

      <div class="modal-footer">
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addQuotation"
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
          @click="editQuotation"
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
  </div>
  <div class="delete-popup">
    <Popup
      :isOpen="isDeleteConfirmPopupOpen"
      :closePopup="closeDeleteConfirmPopup"
    >
      <div class="mb-5">
        <a>{{ t("deleteConfirmSentence") }}</a>
      </div>
      <div class="modal-footer mb-5">
        <Button customClass="btn btn-danger me-2" @click="deleteQuotation">
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
    <transition name="fade">
      <div v-if="openPopupAllow" class="popup-overlay">
        <div class="popup-content-custome alert alert-light" role="alert">
          <span v-if="formData.status === 'Allowed'">
            <i class="fa-solid fa-ban"></i> {{ t("popupCancelInvoic") }}
          </span>
          <span v-else-if="formData.status === 'Pending'">
            <i class="fa-solid fa-check"></i> {{ t("popupCreatedInvoic") }}
          </span>
        </div>
      </div>
    </transition>

    <!-- <div v-if="openPopupAllow"> -->
    <!-- <div class="text-end">
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="closePopupAllow"
          style="color: #9f9999"
        ></button>
      </div>
      <div class="popup-content-error2">
        <ul>
          <li v-for="(msg, index) in errorMessages" :key="index">
            {{ msg }}
          </li>
        </ul>
      </div> -->
    <!-- </div> -->
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
        <Button customClass="btn btn-success me-2" @click="editQuotation2">
          {{ t("buttonConfirm") }}
        </Button>
        <Button customClass="btn btn-warning me-2" @click="editQuotation3">
          {{ t("PendingLG") }}
        </Button>
        <Button customClass="btn btn-secondary" @click="closeAllowConfirmPopup">
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
  <div
    v-if="isLoading"
    class="d-flex justify-content-center align-items-center"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>
<script>
import Navigate from "../components/Navigation.vue";
import jsPDF from "jspdf";
import thSarabunFont from "../font/THSarabunNew-normal.js"; // ฟอนต์ที่แปลงแล้ว
import PromptBold from "../font/Prompt-Bold-bold.js"; // ฟอนต์ที่แปลงแล้ว
import PromptRegular from "../font/Prompt-Regular-normal.js"; // ฟอนต์ที่แปลงแล้ว
import PromptRegularLight from "../font/Prompt-Light-normal.js"; // ฟอนต์ที่แปลงแล้ว
import PromptThinnormal from "../font/Prompt-Thin-normal.js"; // ฟอนต์ที่แปลงแล้ว
import "jspdf-autotable";
import { config } from "../../constant.js";
import QuotationList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import moment from "moment";
moment.locale("th");
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useI18n } from "vue-i18n";
import Department from "./Department.vue";
import { reactive } from "vue";
import { computed, watch, ref } from "vue";
const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");
import Button from "../components/button.vue";
import Dropdown from "../components/dropdown.vue";
import Icon from "../components/icon.vue";
import TextField from "../components/textField.vue";

// ✅ นำเข้า locale ภาษาไทยและอังกฤษ
import th from "vue-datepicker-next/locale/th.es";
import en from "vue-datepicker-next/locale/en.es";

export default {
  name: "Quotation",
  components: {
    Navigate,
    QuotationList,
    Popup,
    DatePicker,
    Department,
    Button,
    Dropdown,
    Icon,
    TextField
  },
  setup() {
    const { t } = useI18n();
    const { locale } = useI18n();
    // ✅ สร้าง computed property ให้ใช้งาน t("lang") ได้ตลอด
    const lang = computed(() => t("lang"));

    // const currentLocale = computed(() => (locale.value === "th" ? th : en));
    // ✅ currentLocale คำนวณ locale ปัจจุบัน
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

    const documentName = computed(() => t("dontHaveQuotataion"));

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
      fieldConfig: [
        // Group: header
        { key: 'sale_number', label: 'numberQuotation', componentType: 'TextField', readonly: true, group: 'header' },
        { key: 'status', label: 'statusQuotation', componentType: 'Dropdown', readonly: true, group: 'header', options: 'statusOptions' },
        { key: 'employeeID', label: 'employeeName', componentType: 'Autocomplete', required: true, group: 'header', items: 'Employees', itemTitle: 'Name', itemValue: 'employeeID' },

        // Group: customer
        { key: 'cus_name', label: 'customerName', componentType: 'Datalist', required: true, group: 'customer', items: 'Customers' },
        { key: 'cus_address', label: 'customerAddress', componentType: 'TextField', required: true, group: 'customer', readonly: true },
        { key: 'cus_tel', label: 'phoneNum', componentType: 'TextField', required: true, group: 'customer', readonly: true, maxlength: 10, isNumeric: true },
        { key: 'cus_email', label: 'email', componentType: 'TextField', required: true, group: 'customer', readonly: true },
        { key: 'cus_tax', label: 'taxID', componentType: 'TextField', required: true, group: 'customer', readonly: true, maxlength: 13, isNumeric: true },
        { key: 'cus_purchase', label: 'customerPurchaseBy', componentType: 'TextField', required: true, group: 'customer', readonly: true },

        // Group: conditions
        { key: 'sale_date', label: 'quotationDate', componentType: 'DatePicker', group: 'conditions' },
        { key: 'credit_date_number', label: 'creditDate', componentType: 'Dropdown', group: 'conditions', options: 'creditDayOptions' },
        { key: 'credit_expired_date', label: 'expireDate', componentType: 'DatePicker', group: 'conditions', readonly: true },
        
        // Group: summary
        { key: 'discount_quotation', label: 'totalDiscount', componentType: 'TextField', group: 'summary', isNumeric: true },
        { key: 'remark', label: 'quotationRemark', componentType: 'Textarea', group: 'summary', maxlength: 220 },

        // Group: internal
        { key: 'file', label: 'FileLabel', componentType: 'Upload', group: 'internal' },
        { key: 'remarkInfernal', label: 'InternalRemark', componentType: 'Textarea', group: 'internal', maxlength: 220 },
      ],
      showAllowButton: true,
      openPopupAllow: false,
      shortcutAllow: false,
      Categorys: [],
      CategoryIDFormAddNewProduct: "",
      isAllowConfirmPopupOpen: false,
      expandedItems: new Set(), 
      selectedDate: null,
      value: null,
      fileName: "",
      number: "",
      icon_warning: '<span class="mdi mdi-alert-box"></span>',
      NotCustomerExit: false,
      isReadonly: true, // กำหนดให้ readonly หรือไม่
      isDisabled: true, // กำหนดให้ disabled หรือไม่
      isReadonly2: true, // กำหนดให้ readonly หรือไม่
      isDisabled2: true, // กำหนดให้ disabled หรือไม่
      selectedCusName: "",
      selectedProName: "",
      newImg: false,
      Image_pd: [],
      imageSrc: null, // สำหรับเก็บ URL ของรูปภาพที่แสดง
      showErrorPopup: false,
      errorMessages: [],
      lang: "",
      isDropdownOpen: false,
      pdfUrl: null,
      isDeleteConfirmPopupOpen: false,
      selectedRow: "",
      toggleFontWeight: false,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: "10",
      textColor: "#000000",
      content: "",
      result: false,
      quotations_number: [],
      filteredItems: [],
      isPopupVisible_error: false,
      inputError: false,
      isPopupVisible: false,
      isLoading: false,
      isPopupOpen: false,
      isPopupPDFOpen: false,
      Quotations: [],
      Customers: [],
      Employees: [],
      Products: [],
      productForms: [],
      originalQuotations: [],
      AllBanks: [],
      Business: [],
      creditDay: ["7  Days", "14 Days", "30 Days", "60 Days", "90 Days"],
      creditDayTH: ["7  วัน", "14 วัน", "30 วัน", "60 วัน", "90 วัน"],
      currentCode: "",
      newSaleNumber: "",
      cus_drop_down: "",
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
        discounttype: "",
        sale_price: 0, //total price before cal discount but *qty
        total_price: 0, ////////////cal all product
        total_discount: 0, ///////////////
        Net_price: 0, //cal after cal discount
        vat: 0, //price not percentage
        price: "", //price per product
        remark: "",
        status: "",
        pdfname: "",
        file: "",
        discount_quotation: "",
        vatType: "",
        remarkInfernal: "",
      },
      isEmpty: {
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
        discounttype: "",
        sale_price: 0, //total price before cal discount but *qty
        total_price: 0, ////////////cal all product
        total_discount: 0, ///////////////
        Net_price: 0, //cal after cal discount
        vat: 0, //price not percentage
        price: "", //price per product
        remark: "",
        status: "",
        pdfname: "",
        file: "",
        discount_quotation: "",
        vatType: "",
        remarkInfernal: "",
      },
      searchQuery: "",
    };
  },
  computed: {
    // ใน computed
      headerFields() {
        return this.fieldConfig.filter(f => f.group === 'header');
      },
      customerFields() {
        return this.fieldConfig.filter(f => f.group === 'customer');
      },
      conditionFields() {
        return this.fieldConfig.filter(f => f.group === 'conditions');
      },
      summaryFields() {
        return this.fieldConfig.filter(f => f.group === 'summary');
      },
      internalFields() {
        return this.fieldConfig.filter(f => f.group === 'internal');
      },
      // เพิ่ม options สำหรับ dropdown
      statusOptions() {
          return [
              { value: 'Allowed', text: this.t('AllowLG') },
              { value: 'Cancel', text: this.t('cancelStatus') },
          ];
      },
    discountTypeOptions() {
      return [
        { value: "amount", text: this.t("productDiscountTypeAmount") },
        { value: "percent", text: this.t("productDiscountTypePercent") },
      ];
    },
    creditDayOptions() {
      // creditDay เป็น array of strings ["7 Days", "14 Days", ...]
      if (!this.creditDay) return [];
      return this.creditDay.map((day) => ({
        value: day,
        text: day,
      }));
    },
    filteredProducts() {
      return this.Products.filter((item) => item.Status !== "not active");
    },
    allExpanded() {
      return this.expandedItems.size === this.Quotations.length; // ถ้าทั้งหมดขยาย ให้ return true
    },
    buddhistDate: {
      get() {
        if (this.date) {
          const date = new Date(this.date);
          date.setFullYear(date.getFullYear() + 543);
          return date;
        }
        return null;
      },
      set(value) {
        if (value) {
          const date = new Date(value);
          date.setFullYear(date.getFullYear() - 543);
          this.date = date;
        }
        this.date = null;
      },
    },
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
    tableHeaders() {
      return [
        { label: this.t("statusHeaderTable"), key: "status" },
        { label: this.t("salenumberHeaderTable"), key: "sale_number" },
        { label: this.t("employeeNameHeaderTable"), key: "employeeName" },
        { label: this.t("cusNameHeaderTable"), key: "cus_name" },
        { label: this.t("cusAddressHeaderTable"), key: "cus_address" },
        { label: this.t("cusTelHeaderTable"), key: "cus_tel" },
        { label: this.t("cusEmailHeaderTable"), key: "cus_email" },
        { label: this.t("cusTaxHeaderTable"), key: "cus_tax" },
        { label: this.t("cusPurchaseHeaderTable"), key: "cus_purchase" },
        { label: this.t("saleDateHeaderTable"), key: "sale_date" },
        { label: this.t("creditdateHeaderTable"), key: "credit_date_number" },
        { label: this.t("expiredHeaderTable"), key: "credit_expired_date" },
        { label: this.t("saleTotalpriceHeaderTable"), key: "sale_totalprice" },
        { label: this.t("netpriceHeaderTable"), key: "net_price" },
        { label: this.t("remarkHeaderTable"), key: "remark" },
        { label: this.t("statusHide"), key: "statusHide" },
        { label: this.t("invoiceStatusHeaderTable"), key: "invoice" },
      ];
    },
    // filteredQuo() {
    //   // กรองข้อมูล Categories โดยเปรียบเทียบกับ searchQuery
    //   if (this.searchQuery.trim()) {

    //     return this.Quotations.filter((sale) =>
    //       sale["sale_number"]
    //         .toLowerCase()
    //         .includes(this.searchQuery.toLowerCase())
    //     );
    //   }
    //   return this.Quotations; // ถ้าไม่มีการค้นหาแสดงทั้งหมด
    // },
    filteredQuo() {
      const { t } = useI18n();

      let data = this.Quotations.map((sale) => ({
        ...sale,
        showAllowButton: sale.deleted_at === "" || sale.deleted_at === null, // true ถ้า Pending, false ถ้าไม่ใช่
        status:
          sale.status === "Allowed" || sale.status === "Allow"
            ? t("AllowLG")
            : sale.status === "Pending"
            ? t("PendingLG")
            : sale.status === "Cancel"
            ? t("CancelLG")
            : sale.status,

        // invoice:
        //   sale.invoice === "Pending"
        //     ? t("PendingLG")
        //     : sale.invoice === "Cancel"
        //     ? t("CancelLG")
        //     : sale.invoice,
      }));

      if (this.searchQuery.trim()) {
        data = data.filter((sale) =>
          sale["sale_number"]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }

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

      const monthMappingTHtoEN = {
        "ม.ค.": "Jan",
        "ก.พ.": "Feb",
        "มี.ค.": "Mar",
        "เม.ย.": "Apr",
        "พ.ค.": "May",
        "มิ.ย.": "Jun",
        "ก.ค.": "Jul",
        "ส.ค.": "Aug",
        "ก.ย.": "Sep",
        "ต.ค.": "Oct",
        "พ.ย.": "Nov",
        "ธ.ค.": "Dec",
      };

      if (this.t("headerLang") === "EN") {
        data = data
          .map((sale) => ({
            ...sale,
            credit_date_number: sale.credit_date_number.replace("วัน", "Days"),
            sale_date: String(sale.sale_date).replace(
              /\b(ม.ค.|ก.พ.|มี.ค.|เม.ย.|พ.ค.|มิ.ย.|ก.ค.|ส.ค.|ก.ย.|ต.ค.|พ.ย.|ธ.ค.)\b/g,
              (match) => monthMappingTHtoEN[match]
            ),
            credit_expired_date: String(sale.credit_expired_date).replace(
              /\b(ม.ค.|ก.พ.|มี.ค.|เม.ย.|พ.ค.|มิ.ย.|ก.ค.|ส.ค.|ก.ย.|ต.ค.|พ.ย.|ธ.ค.)\b/g,
              (match) => monthMappingTHtoEN[match]
            ),
          }))
          .filter((sale) => sale.credit_date_number.includes("Days"));
      } else {
        data = data
          .map((sale) => {
            let convertedSaleDate = String(sale.sale_date).replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            );
            let convertedExpiredDate = String(sale.credit_expired_date).replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            );

            // ✅ เพิ่มการแปลงปี ค.ศ. เป็น พ.ศ.
            convertedSaleDate = convertedSaleDate.replace(/(\d{4})/, (match) =>
              (parseInt(match) + 543).toString()
            );
            convertedExpiredDate = convertedExpiredDate.replace(
              /(\d{4})/,
              (match) => (parseInt(match) + 543).toString()
            );

            return {
              ...sale,
              credit_date_number: sale.credit_date_number.replace(
                "Days",
                "วัน"
              ),
              sale_date: convertedSaleDate,
              credit_expired_date: convertedExpiredDate,
            };
          })
          .filter((sale) => sale.credit_date_number.includes("วัน"));
      }

      return data;
    },
  },
  watch: {
    "formData.discount_quotation"(newValue) {
      if (!newValue || isNaN(newValue)) {
        this.formData.discount_quotation = 0; // ตั้งค่าเป็น 0 เมื่อว่าง
      }
    },
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
    cus_drop_down(newVal, oldVal) {
      // Filter and sort data
      let items = []; // This is the data received from the API
      // console.log(items);

      items = this.Customers.filter((item) => item.cus_id === newVal);

      this.formData.cus_id = items[0].cus_id;
      this.formData.cus_name = items[0].cus_name;
      this.formData.cus_address = items[0].cus_address;
      this.formData.cus_tel = items[0].cus_tel;
      this.formData.cus_email = items[0].cus_email;
      this.formData.cus_tax = items[0].cus_tax;
      this.formData.cus_purchase = items[0].cus_purchase;
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
    closePopupAllow() {
      this.openPopupAllow = false;
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
      // alert(this.isPopupVisible_error);
    },
    toggleAll() {
      if (this.allExpanded) {
        this.expandedItems.clear(); // ถ้าทุกอันถูกขยาย → ย่อทั้งหมด
      } else {
        this.expandedItems = new Set(this.Quotations.map((q) => q.sale_id)); // ถ้ายังขยายไม่หมด → ขยายทั้งหมด
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
    validatePaste(event) {
      let inputValue = event.target.value;
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }

      // กรองเฉพาะตัวเลข
      inputValue = inputValue.replace(/[^0-9]/g, ""); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
      inputValue = inputValue.replace(/^0+/, ""); // ลบเลข 0 ที่อยู่ด้านหน้า

      event.target.value = inputValue; // อัปเดตค่าในฟิลด์
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email); // Return true if email is valid
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // อนุญาตเฉพาะตัวเลข (0-9)
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
      // ลบเลข 0 ข้างหน้า
      // this.form.sale_qty = tthis.form.sale_qty.replace(/^0+/, "") || "0";
      // this.form.sale_discount =
      //   this.form.sale_discoun.replace(/^0+/, "") || "0";
    },

    getDetailProduct(form, index) {
      // const selectedProductId = form.productID;
      const selectedProductName = form.productName;

      const selectedProduct = this.Products.find(
        (product) => product.productname === selectedProductName
      );

      console.log("=====================>>", form);

      // form.productID = selectedProduct.productID;
      if (selectedProduct !== undefined) {
        form.productID = selectedProduct.productID;
        form.price = this.formatDecimal(
          parseFloat(selectedProduct.price.toFixed(2))
        );
        form.sale_price = this.formatDecimal(
          form.sale_qty * parseFloat(form.price.replace(/,/g, ""))
        );
        form.productname = selectedProduct.productname;
        form.productImg = selectedProduct.productImg;
        if (form.discounttype === "percent") {
          // const salePriceValue =
          //   parseFloat(form.sale_price.replace(/,/g, "")) || 0;
          let discountPercent = parseFloat(form.sale_discount) || 0;
          discountPercent = Math.max(0, Math.min(discountPercent, 100));
          // alert(discountPercent);

          form.sale_price = this.formatDecimal(
            parseFloat(form.sale_qty * parseFloat(form.price.replace(/,/g, "")))
          );

          if (discountPercent > 0) {
            form.sale_price = this.formatDecimal(
              form.sale_qty * parseFloat(form.price.replace(/,/g, "")) -
                form.sale_qty *
                  parseFloat(form.price.replace(/,/g, "")) *
                  (discountPercent / 100)
            );
          }
        } else {
          form.sale_discount = parseFloat(form.sale_discount) || 0;

          form.sale_price = this.formatDecimal(
            parseFloat(
              form.sale_price.replace(/,/g, "") - parseFloat(form.sale_discount)
            )
          );

          if (form.sale_price.replace(/,/g, "") < 0) {
            form.sale_discount = this.formatDecimal(
              form.sale_qty * parseFloat(form.price.replace(/,/g, ""))
            );
            form.sale_price = "0.00";
          } else {
            form.sale_price = this.formatDecimal(
              parseFloat(
                form.sale_qty * parseFloat(form.price.replace(/,/g, "")) -
                  parseFloat(form.sale_discount)
              )
            );
          }
        }
        this.updateTotalDiscount();
        this.totalNetPrice();
        this.vat_price();
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
              parseFloat(this.formData.vat.replace(/,/g, ""))
          );
        }
        // this.isReadonly2 = true;
        // this.isDisabled2 = true;
        form.isReadonly2 = true;
        form.isDisabled2 = true;
      } else {
        // this.isReadonly2 = false;
        // this.isDisabled2 = false;
        form.isReadonly2 = false;
        form.isDisabled2 = false;
        form.sale_price = "0.00";
        form.sale_qty = "0";
        form.price = "0";
      }
      if (form.productName.trim() === "") {
        form.productID = "";
        form.productName = "";
        form.price = "";
        form.sale_qty = 0;
        form.sale_price = 0.0;
        form.sale_discount = 0;
        form.discounttype = "amount"; // ค่าเริ่มต้น
        form.productImg = null;
        form.product_detail = "";
        form.pro_unit = "";
        form.showDetails = false;
        form.isReadonly2 = false;
        form.isDisabled2 = false;
      }

      if (selectedProduct === undefined) {
        form.productID = "";
      }
    },
    getDetailCustomer() {
      let items = [];

      items = this.Customers.filter(
        (item) => item.cus_name === this.selectedCusName
      );
      if (items.length > 0) {
        this.formData.cus_id = items[0].cus_id;
        this.formData.cus_name = items[0].cus_name;
        this.formData.cus_address = items[0].cus_address;
        this.formData.cus_tel = items[0].cus_tel;
        this.formData.cus_email = items[0].cus_email;
        this.formData.cus_tax = items[0].cus_tax;
        this.formData.cus_purchase = items[0].cus_purchase;

        this.isReadonly = true;
        this.isDisabled = true;
        this.NotCustomerExit = false;
      } else {
        this.formData.cus_id = "";
        this.formData.cus_name = "";
        this.formData.cus_address = "";
        this.formData.cus_tel = "";
        this.formData.cus_email = "";
        this.formData.cus_tax = "";
        this.formData.cus_purchase = "";

        this.isReadonly = false;
        this.isDisabled = false;
        this.NotCustomerExit = true;

        this.formData.cus_name = this.selectedCusName;
      }
    },
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
    clearFile() {
      this.fileName = "";
      this.Image_pd = null;
      this.imageSrc = null;
      this.newImg = false;

      // ใช้ ref เพื่อเคลียร์ input[type="file"]
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    toggleProductDetail(index, form) {
      // Toggle แสดง/ซ่อน textarea
      index.showDetails = !index.showDetails;
    },
    vatTypeChange() {
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
            parseFloat(this.formData.vat.replace(/,/g, ""))
        );
        // if (this.formData.vatType === "VATincluding") {
        //   this.formData.sale_totalprice = this.formatDecimal(
        //     parseFloat(this.formData.Net_price.replace(/,/g, "")) * 1.07
        //   );
        //   this.formData.vat = this.formatDecimal(
        //     parseFloat(
        //       this.formData.sale_totalprice.replace(/,/g, "") -
        //         parseFloat(this.formData.total_price.replace(/,/g, ""))
        //     )
        //   );
        //   this.formData.vat = this.formatDecimal(
        //     parseFloat(this.formData.Net_price.replace(/,/g, "")) * 1.07 -
        //       parseFloat(this.formData.Net_price.replace(/,/g, ""))
        //   );
        //   // this.formData.vat = "555";
        // } else {
        //   this.formData.vat = this.formatDecimal(
        //     parseFloat(this.formData.Net_price.replace(/,/g, "")) * 0.07
        //   );
        //   this.formData.sale_totalprice = this.formatDecimal(
        //     parseFloat(this.formData.Net_price.replace(/,/g, "")) +
        //       parseFloat(this.formData.vat)
        //   );
      }
    },
    calculateNat(discount) {
      const totalNet = this.productForms.reduce((total, form) => {
        const salePrice = parseFloat(form.sale_price.replace(/,/g, "")); // แปลง formatDecimal เป็นตัวเลข
        return total + salePrice;
      }, 0);

      if (discount > totalNet) {
        this.formData.discount_quotation = totalNet;
        this.formData.Net_price = 0;
        // alert("1");
      } else {
        this.formData.Net_price = totalNet - discount;
      }

      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
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
            parseFloat(this.formData.vat.replace(/,/g, ""))
        );
      }
    },
    toggleDropdown(isOpen) {
      this.isDropdownOpen = isOpen; // เปลี่ยนสถานะเปิด/ปิด dropdown
    },
    onCustomerSelect(selectedItem) {
      console.log("Selected Customer ID:", selectedItem);
      // ทำอย่างอื่นกับ selectedItem ตามต้องการ
    },
    filterItems() {
      if (this.formData.cus_name.trim() === "") {
        this.filteredItems = [];
        return; // ไม่ต้องกรองรายการถ้าช่อง input ว่างเปล่า
      }

      this.filteredItems = this.Customers.filter((cus) =>
        cus.cus_name
          .toLowerCase()
          .includes(this.formData.cus_name.toLowerCase())
      );
    },
    onInput(event) {
      // ตรวจสอบว่ามีค่า remark หรือไม่
      const lines = this.formData.remark
        ? this.formData.remark.split("\n")
        : [];
      if (lines.length && lines[lines.length - 1].length > 35) {
        this.formData.remark += "\n";
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
              Status: item.Status,
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
    async getCustomer() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/quotation/getCustomer`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Customers = json.data.map((item) => {
            let initialTableData = {
              cus_id: item.cus_id,
              cus_name: item.cus_name,
              cus_address: item.cus_address,
              cus_tel: item.cus_tel,
              cus_email: item.cus_email,
              cus_tax: item.cus_tax,
              cus_purchase: item.cus_purchase,
              Status: item.Status,
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
    async loadImageAndAddToPDF(doc, imageUrl, x, y, maxWidth, maxHeight) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = function () {
          let imgWidth = img.width;
          let imgHeight = img.height;

          // คำนวณอัตราส่วนของภาพ
          if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const aspectRatio = imgWidth / imgHeight;

            if (imgWidth > imgHeight) {
              imgWidth = maxWidth; // ปรับความกว้างให้ตรงกับความกว้างสูงสุด
              imgHeight = maxWidth / aspectRatio; // ปรับความสูงตามอัตราส่วน
            } else {
              imgHeight = maxHeight; // ปรับความสูงให้ตรงกับความสูงสูงสุด
              imgWidth = maxHeight * aspectRatio; // ปรับความกว้างตามอัตราส่วน
            }
          }

          // เพิ่มภาพลงใน PDF ด้วยขนาดที่ปรับแล้ว
          doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);
          resolve(); // เรียก resolve เมื่อเพิ่มภาพสำเร็จ
        };
        img.onerror = reject; // ถ้าโหลดภาพไม่สำเร็จ
      });
    },
    async viewformpdf(action, row) {
      // console.log("Preview Item: ", row)
      const productForms = row.productForms || [];
      const doc = new jsPDF();

      const quotationData = await this.getQuotationByID(row.sale_id);
      console.log(">>>>>>>>>>>>>>>>>", quotationData);

      const formatDate = { day: "2-digit", month: "short", year: "numeric" };
      const Qdate = new Date(quotationData.quotation_start_date);
      const Quo_date = Qdate.toLocaleDateString("en-GB", formatDate);

      const Expdate = new Date(quotationData.quotation_expired_date);
      const ExpiredDate = Expdate.toLocaleDateString("en-GB", formatDate);
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
        // const product = this.Products.find(
        //   (p) => p.productID === form.productID.toString()
        // );
        const product = this.Products.find(
          (product) => product.productID === form.productID
        );

        return [
          index + 1,
          product && product.productImg ? product.productImg : "---", // ดึงรูปภาพสินค้าถ้ามี
          product
            ? product.productname +
              (form.product_detail ? "\n" + form.product_detail : "")
            : "",
          form.sale_qty.toLocaleString(),
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

        // doc.addPage();
        if (i > 0) {
          // ตรวจสอบหน้า PDF ที่ไม่ใช่หน้าแรกหรือ action เป็น 'download'
          doc.addPage();
        }

        // doc.setFont("helvetica", "bold");
        // doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(16);

        doc.addFileToVFS("Prompt-Bold.ttf", PromptBold);
        doc.addFont("Prompt-Bold.ttf", "PromptBold", "bold");
        // ตั้งค่าฟอนต์ที่ต้องการ
        doc.setTextColor(0, 0, 0); // ตั้งสีดำสนิท (RGB 0,0,0)
        doc.setFont("PromptBold", "bold");
        doc.setFontSize(20);
        doc.text("Quotation", 167, 40);

        doc.addFileToVFS("Prompt-Regular.ttf", PromptRegular);
        doc.addFont("Prompt-Regular.ttf", "PromptRegular", "normal");
        doc.setFontSize(16);

        // ตั้งค่าฟอนต์ที่ต้องการ
        doc.setFont("PromptRegular", "normal");

        //{text, x,y}
        doc.text(`${this.Business.bus_name}`, 10, 12);
        // doc.text("Quotation", 160, 40);

        // console.log("this.Business", this.Business.bank_id);

        const bank_detail = this.AllBanks.filter(
          (bank) => bank.bank_id === this.Business.bank_id
        );
        // console.log("bank_detail", bank_detail);

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
        // เพิ่มฟอนต์
        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        // ตั้งค่าฟอนต์ที่ต้องการ
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

        // //line width
        // doc.setLineWidth(0.2);
        // //[start(x,y), end(x,y)]
        // doc.line(130, 265, 200, 265);
        // doc.line(130, 275, 200, 275);
        // doc.line(130, 285, 200, 285);

        // doc.setLineWidth(0.5);
        // doc.line(10, 35, 120, 35);
        // doc.line(10, 72, 200, 72);
        // doc.line(10, 210, 200, 210);
        // doc.line(10, 250, 200, 250);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        doc.text(`Customer Name: ` + row.cus_name, 10, 50);
        // doc.text(`Number: ${row.sale_number}`, 150, 50);
        doc.text(`Address: ` + row.cus_address, 10, 55);
        // doc.text(`Date:     ${Quo_date}`, 150, 55);
        doc.text(`Contact: ` + row.cus_tel, 10, 60);
        doc.text(`E-mail: ` + row.cus_email, 10, 65);
        doc.text(`Contact No: ` + row.cus_tel, 10, 70);
        doc.text(`Tax ID: ` + row.cus_tax, 10, 75);

        // doc.addFileToVFS("Prompt-Regular.ttf", PromptRegular);
        // doc.addFont("Prompt-Regular.ttf", "PromptRegular", "normal");
        // doc.setFontSize(12);

        // // ตั้งค่าฟอนต์ที่ต้องการ
        // doc.setFont("PromptRegular", "normal");
        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        // ตั้งค่าฟอนต์ที่ต้องการ
        doc.setFont("PromptRegularLight", "normal");
        const startX_header = 140; // ตำแหน่งเริ่มต้นของข้อความ
        const valueX_header = 180; // ตำแหน่งค่าของตัวแปร (จัดให้อยู่แนวเดียวกัน)
        const startY_header = 50; // จุดเริ่มต้นแนวตั้ง
        const lineHeight_header = 5; // ระยะห่างระหว่างบรรทัด

        doc.text(`Number:`, startX_header, startY_header);
        doc.text(`${row.sale_number}`, valueX_header - 5.5, startY_header);

        doc.text(`Date:`, startX_header, startY_header + lineHeight_header);
        doc.text(
          `${Quo_date}`,
          valueX_header,
          startY_header + lineHeight_header
        );

        doc.text(
          `Payment:`,
          startX_header,
          startY_header + lineHeight_header * 4
        );
        doc.text(
          `${row.credit_date_number
            .replace("Days", "")
            .replace("วัน", "")
            .trim()} Days`,
          valueX_header + 7.5,
          startY_header + lineHeight_header * 4
        );

        doc.text(
          `Valid until:`,
          startX_header,
          startY_header + lineHeight_header * 5
        );
        doc.text(
          `${ExpiredDate}`,
          valueX_header + 1,
          startY_header + lineHeight_header * 5
        );
        // doc.text(`Number:             ${row.sale_number}`, 140, 50);
        // doc.text(`    Date:                ${Quo_date}`, 140, 55);
        // doc.text(
        //   ` Payment:                  ${row.credit_date_number}`,
        //   140,
        //   70
        // );
        // doc.text(`Valid until:            ${ExpiredDate}`, 140, 75);

        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        // ตั้งค่าฟอนต์ที่ต้องการ
        doc.setFont("PromptRegularLight", "normal");
        const employ = this.Employees.find(
          (p) => p.employeeID === row.employeeID
        );

        // doc.text(`${employ.position}`, 10, 255);
        doc.text(`Name: `, 10, 255);
        doc.text(row.employeeName, 40, 255);
        doc.text(`Email: `, 10, 260);
        doc.text(employ.Email, 40, 260);
        doc.text(`Contact No.: `, 10, 265);
        doc.text(employ.Phone_num, 40, 265);
        doc.text(`Remark: `, 10, 215);

        // const FormEmployee_sale = [
        //   `${row.employeeName}`,
        //   // `${employ.Email}`,
        //   // `${employ.Phone_num}`,
        // ];
        // doc.text(FormEmployee_sale, 40, 255, {
        //   align: "left",
        //   valign: "middle",
        //   lineGap: 5,
        // });

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

        // const discount_pdf =
        //   parseFloat(net_price) - parseFloat(row.discount_quotation);
        // alert(discount_pdf);
        let netCal = this.formatDecimal(total_price * 0.07);
        let sale_data = this.formatDecimal(total_price + netCal);
        // alert(netCal);
        // const FormTotalprice = [];

        if (quotationData.vatType === "VATincluding") {
          //           this.formData.sale_totalprice = this.formatDecimal(
          //   parseFloat(this.formData.Net_price.replace(/,/g, "")) / 1.07
          // );
          // this.formData.vat = this.formatDecimal(
          //   parseFloat(this.formData.total_price.replace(/,/g, "")) -
          //     parseFloat(this.formData.sale_totalprice.replace(/,/g, ""))
          // );

          let FormTotalprice = [
            `${this.formatDecimal(total_price)}`,
            `${this.formatDecimal((total_price * 100) / 107)}`,
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
          // doc.text(FormTotalprice, 200, 215, {
          //   align: "right",
          //   valign: "middle",
          //   lineGap: 5,
          // });
          let startY = 215;
          const lineSpacing = 5; // ระยะห่างระหว่างบรรทัด

          FormTotalprice.forEach((line) => {
            doc.text(line, 200, startY, {
              align: "right",
              valign: "middle",
            });
            startY += lineSpacing; // เพิ่มพิกัด Y สำหรับแต่ละบรรทัด
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
          // doc.text(FormTotalprice, 200, 215, {
          //   align: "right",
          //   valign: "middle",
          //   lineGap: 7,
          // });

          let startY = 215;
          const lineSpacing = 5; // ระยะห่างระหว่างบรรทัด

          FormTotalprice.forEach((line) => {
            doc.text(line, 200, startY, {
              align: "right",
              valign: "middle",
            });
            startY += lineSpacing; // เพิ่มพิกัด Y สำหรับแต่ละบรรทัด
          });
        }

        // doc.setFont("helvetica", "bold");
        // doc.addFileToVFS("Prompt-Bold.ttf", PromptBold);
        // doc.addFont("Prompt-Bold.ttf", "PromptBold", "bold");
        doc.addFileToVFS("Prompt-Regular.ttf", PromptRegular);
        doc.addFont("Prompt-Regular.ttf", "PromptRegular", "normal");
        doc.setFontSize(16);

        // //line width
        // doc.setLineWidth(0.2);
        // //[start(x,y), end(x,y)]
        // doc.line(130, 265, 200, 265);
        // doc.line(130, 275, 200, 275);
        // doc.line(130, 285, 200, 285);

        doc.setLineWidth(0.5);
        doc.line(10, 210, 200, 210);
        doc.line(10, 238, 200, 238);
        doc.line(130, 265, 200, 265);
        doc.line(130, 275, 200, 275);
        doc.line(130, 285, 200, 285);

        // ตั้งค่าฟอนต์ที่ต้องการ
        doc.setFont("PromptRegular", "normal");
        doc.text("Confirm order", 110, 250);
        doc.text("Customer Detail", 10, 42);
        doc.setFontSize(14);
        doc.text(`Quote by`, 10, 248);
        // เพิ่มฟอนต์
        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        const maxWidth = 90;
        const maxWidth2 = 20;
        const maxHeight = 20;

        // ตั้งค่าฟอนต์ที่ต้องการ
        doc.setFont("PromptRegularLight", "normal");
        //set image (image , x,y,w,h)

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

          // คำนวณสัดส่วนให้ fit ภายในกล่อง 20x20 โดยไม่เสียสัดส่วน
          const widthRatio = maxBoxWidth / imgWidth;
          const heightRatio = maxBoxHeight / imgHeight;
          const scaleRatio = Math.min(widthRatio, heightRatio);

          // คำนวณขนาดใหม่ที่ fit
          const scaledWidth = imgWidth * scaleRatio;
          const scaledHeight = imgHeight * scaleRatio;

          // พิกัดกรอบบนขวา
          const boxX = doc.internal.pageSize.width - 10 - maxBoxWidth; // ขอบขวา - margin - boxWidth
          const boxY = 12; // ขอบบน

          // วางรูปในกรอบ โดยชิดขวา-บนของกล่อง (แต่ต้องเว้นให้ไม่เกินขอบ)
          const imgX = boxX + (maxBoxWidth - scaledWidth); // ชิดขวาภายในกรอบ
          const imgY = boxY; // ชิดบน

          // วาดภาพ
          doc.addImage(img, "JPEG", imgX, imgY, scaledWidth, scaledHeight);
        }

        // doc.addImage(`${this.Business.bus_logo}`, "JPEG", 165, 12, 20, 20);

        doc.setFont("helvetica", "normal");
        // เพิ่มฟอนต์
        // doc.addFileToVFS("THSarabunNew-normal.ttf", thSarabunFont);
        // doc.addFont("THSarabunNew-normal.ttf", "THSarabunNew", "normal");

        // // ตั้งค่าฟอนต์ที่ต้องการ
        // doc.setFont("THSarabunNew", "normal");
        doc.addFileToVFS("Prompt-RegularLight.ttf", PromptRegularLight);
        doc.addFont("Prompt-RegularLight.ttf", "PromptRegularLight", "normal");
        doc.setFontSize(10);

        // ตั้งค่าฟอนต์ที่ต้องการ
        doc.setFont("PromptRegularLight", "normal");
        // console.log("PDF-->",row)
        this.shortcutAllow = true;
        await this.handleEdit(row);
        // doc.text(`${row.remark}`, 40, 235);
        doc.text(`${this.formData.remark}`, 40, 215, { maxWidth });
        this.drawHeader(doc, headerText, startY, margin);
        this.drawTable(doc, currentPageData, startY, margin, lineHeight);
      }

      if (action === "view") {
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = pdfUrl;
        // this.isPopupPDFOpen = true;
        // เปิดในแท็บใหม่
        window.open(pdfUrl, "_blank");
      } else if (action === "download") {
        doc.save(`quotation-${row.cus_name}-${row.sale_number}.pdf`);
      }
      this.shortcutAllow = false;
    },
    drawHeader(doc, headerText, startY, margin) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // สีข้อความ (สีดำ)

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
    // drawTable(doc, data, startY, margin, lineHeight) {
    //   const startX = margin;

    //   let y = startY + 5;
    //   doc.setFontSize(10);

    //   const cellWidths = data[0].map((_, index) => {
    //     if (index === 0) {
    //       return 10; // กำหนดความยาวเซลล์สำหรับ column แรกเป็น 10
    //     } else if (index === 1) {
    //       return 30;
    //     } else if (index === 2) {
    //       return (doc.internal.pageSize.width - margin * 2) * 0.3;
    //     } else {
    //       return (
    //         (doc.internal.pageSize.width -
    //           margin * 2 -
    //           (doc.internal.pageSize.width - margin * 2) * 0.4 -
    //           20) /
    //         (data[0].length - 3)
    //       );
    //     }
    //   });
    //   data.forEach((row) => {
    //     let x = startX;
    //     row.forEach((cell, index) => {
    //       const currentCellWidth = cellWidths[index];
    //       doc.rect(x, y, currentCellWidth, lineHeight, "S");

    //       if (index === 1 && cell) {
    //         // ถ้าเป็น cell ที่ index เท่ากับ 1 (คอลัมน์ที่เป็น productImg) และมีรูปภาพใน cell

    //         const imgHeight = lineHeight * 0.5; // ความสูงของรูปภาพจะเท่ากับความสูงของบรรทัด
    //         const imgWidth = imgHeight * 2; // กำหนดความกว้างของรูปภาพให้เล็กกว่า cellWidth เพื่อไม่ให้รูปภาพเกินขอบเขตของเซลล์
    //         doc.addImage(
    //           cell,
    //           x + (currentCellWidth - imgWidth) / 2,
    //           y + (lineHeight - imgHeight) / 2 + 2,
    //           imgWidth,
    //           imgHeight
    //         );
    //       } else {
    //         doc.text(
    //           String(cell),
    //           x + currentCellWidth / 2,
    //           y + lineHeight / 2 + 2,
    //           { align: "center", valign: "middle" }
    //         );
    //       }
    //       x += currentCellWidth;
    //     });
    //     y += lineHeight;
    //   });
    // },
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

      // วนลูปแต่ละแถวของข้อมูล
      data.forEach((row) => {
        // คำนวณหาความสูงที่มากที่สุดของแถวปัจจุบัน
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

        // วนลูปแต่ละเซลล์เพื่อวาด
        row.forEach((cell, index) => {
          const currentCellWidth = cellWidths[index];
          // วาดกรอบของเซลล์โดยใช้ความสูงที่คำนวณได้
          doc.rect(x, y, currentCellWidth, maxRowHeight, "S");

          if (index === 1 && cell && cell !== "---") {
            // คอลัมน์รูปภาพ
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
            // คอลัมน์ชื่อสินค้า + รายละเอียด
            const lines = cell.split("\n");

            // --- ส่วนที่แก้ไขตามความต้องการล่าสุด ---
            if (lines.length > 1) {
              // ถ้ามีหลายบรรทัด (มี detail) ให้จัดชิดซ้าย
              doc.text(lines, x + 2, y + 4, { align: "left" });
            } else {
              // ถ้ามีบรรทัดเดียว (ไม่มี detail) ให้จัดกึ่งกลาง
              const textY = y + maxRowHeight / 2;
              doc.text(lines[0], x + currentCellWidth / 2, textY, {
                align: "center",
                valign: "middle",
              });
            }
            // --- จบส่วนที่แก้ไข ---
          } else {
            // เซลล์อื่นๆ
            // วาดข้อความให้อยู่กึ่งกลางแนวตั้งของเซลล์
            const textY = y + maxRowHeight / 2;
            doc.text(String(cell), x + currentCellWidth / 2, textY, {
              align: "center",
              valign: "middle",
            });
          }
          x += currentCellWidth;
        });

        // เพิ่มค่า y ตามความสูงจริงของแถวที่เพิ่งวาดไป
        y += maxRowHeight;
      });
    },
    // drawTable(doc, data, startY, margin, lineHeight) {
    //   const startX = margin;
    //   let y = startY + 5;
    //   doc.setFontSize(10);

    //   const cellWidths = data[0].map((_, index) => {
    //     if (index === 0) return 10;
    //     else if (index === 1) return 30;
    //     else if (index === 2)
    //       return (doc.internal.pageSize.width - margin * 2) * 0.3;
    //     else {
    //       return (
    //         (doc.internal.pageSize.width -
    //           margin * 2 -
    //           (doc.internal.pageSize.width - margin * 2) * 0.4 -
    //           20) /
    //         (data[0].length - 3)
    //       );
    //     }
    //   });

    //   data.forEach((row) => {
    //     let x = startX;

    //     row.forEach((cell, index) => {
    //       const currentCellWidth = cellWidths[index];
    //       doc.rect(x, y, currentCellWidth, lineHeight, "S");

    //       if (index === 1 && cell) {
    //         try {
    //           // ให้รูปเต็มเซลล์ โดยเหลือ margin เล็กน้อย
    //           const padding = 1; // ความเว้นขอบรูปเล็กน้อย
    //           const imgWidth = currentCellWidth - padding * 2;
    //           const imgHeight = lineHeight - padding * 2;

    //           doc.addImage(
    //             cell,
    //             x + padding,
    //             y + padding,
    //             imgWidth,
    //             imgHeight,
    //             undefined,
    //             "FAST"
    //           );
    //         } catch (e) {
    //           console.warn("ไม่สามารถโหลดรูปภาพ:", e);
    //         }
    //       } else if (index === 2 && typeof cell === "string") {
    //         // กรณีคอลัมน์ชื่อสินค้า + รายละเอียด
    //         const [productName, productDetail] = cell.split("\n");
    //         if (productDetail !== "") {
    //           const [productName, productDetail] = cell.split("\n");

    //           doc.setFontSize(10);
    //           doc.setTextColor(0, 0, 0);
    //           doc.text(
    //             productName,
    //             x + currentCellWidth / 2,
    //             y + lineHeight / 2 - 1,
    //             {
    //               align: "center",
    //             }
    //           );

    //           if (productDetail && productDetail.trim() !== "") {
    //             doc.setFontSize(8);
    //             doc.setTextColor(150, 150, 150);
    //             doc.text(
    //               productDetail,
    //               x + currentCellWidth / 2,
    //               y + lineHeight / 2 + 3,
    //               {
    //                 align: "center",
    //               }
    //             );
    //           }
    //           //  alert(productDetail);
    //         } else {
    //           // ถ้าไม่มี \n หรือ product_detail ว่าง
    //           doc.setFontSize(10);
    //           doc.setTextColor(0, 0, 0);
    //           doc.text(cell, x + currentCellWidth / 2, y + lineHeight / 2 + 2, {
    //             align: "center",
    //           });
    //         }

    //         // รีเซ็ตค่าหลังใช้
    //         doc.setFontSize(10);
    //         doc.setTextColor(0, 0, 0);
    //       } else {
    //         doc.setFontSize(10);
    //         doc.setTextColor(0, 0, 0);
    //         doc.text(
    //           String(cell),
    //           x + currentCellWidth / 2,
    //           y + lineHeight / 2 + 2,
    //           {
    //             align: "center",
    //             valign: "middle",
    //           }
    //         );
    //       }

    //       x += currentCellWidth;
    //     });

    //     y += lineHeight;
    //   });
    // },

    ClosePDFview() {
      this.isPopupPDFOpen = false;
    },
    async getQuotationImg(id) {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/Quotation/getQuotation_img`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          const quotations = json.data;

          // ใช้ filter เพื่อหาข้อมูลที่ตรงกับ id
          const filteredData = quotations.filter(
            (quotation) => quotation.quotation_id === id
          );

          return filteredData[0].quotation_img; // ส่งคืนรายการแรกหรือ null ถ้าไม่มี
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
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

    async getQuotation() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/quotation/getQuotation`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        console.log("------>>", json);

        if (json.statusCode === 200) {
          console.log(json.data);
          this.Quotations = json.data.map((item) => {
            const QTDate = new Date(item.quotation_start_date);
            const EXPD = new Date(item.quotation_expired_date);

            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            // ฟังก์ชันสำหรับจัดรูปแบบตัวเลข
            const formatNumber = (number) => {
              return new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(number);
            };
            const Quotationdate = QTDate.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const ExpiredDate = EXPD.toLocaleDateString("en-GB", formatDate);

            // วันที่ปัจจุบัน
            const currentDate = new Date();
            const currentDateString = currentDate.toLocaleDateString(
              "en-GB",
              formatDate
            );

            if (new Date(EXPD) < currentDate) {
              item.status = this.t("quotatation_excess");
            } else {
              item.status = item.status;
            }

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

            // จัดรูปแบบตัวเลขให้อยู่ในรูปแบบลูกน้ำ
            total_before_vat = formatNumber(total_before_vat);
            vat_in = formatNumber(vat_in);

            let initialTableData = {
              status: item.status,
              sale_id: item.sale_id,
              sale_number: item.quotation_num,
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
              sale_totalprice: total_before_vat,
              net_price: vat_in,
              remark: item.remark || "",
              deleted_at: item.deleted_at,

              // invoice: item.invoice,
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
    async validateFormData() {
      this.isEmpty.cus_name = false;
      this.isEmpty.employeeID = false;
      this.isEmpty.sale_date = false;
      this.isEmpty.credit_date_number = false;
      this.isEmpty.productForms = false;
      this.isEmpty.cus_address = false;
      this.isEmpty.cus_tel = false;
      this.isEmpty.cus_email = false;
      this.isEmpty.cus_purchase = false;
      this.isEmpty.cus_tax = false;

      const errorMessages = [];

      if (this.formData.cus_name === "") {
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
      } else if (this.formData.cus_tel.length !== 10) {
        this.isEmpty.cus_tel = true;
        errorMessages.push(this.$t("validation.cus_tel_length"));
      }

      if (this.formData.cus_email.trim() === "") {
        this.isEmpty.cus_email = true;
        errorMessages.push(this.$t("validation.cus_email"));
      } else if (!this.validateEmail(this.formData.cus_email.trim())) {
        this.isEmpty.cus_email = true;
        errorMessages.push(this.$t("validation.cus_email2"));
      }

      if (this.formData.cus_tax.trim() === "") {
        this.isEmpty.cus_tax = true;
        errorMessages.push(this.$t("validation.cus_tax"));
      } else if (this.formData.cus_tax.trim().length !== 13) {
        this.isEmpty.cus_tax = true;
        errorMessages.push(this.$t("validation.cus_tax_length"));
      }

      if (this.formData.cus_purchase.trim() === "") {
        this.isEmpty.cus_purchase = true;
        errorMessages.push(this.$t("validation.cus_purchase"));
      }

      if (
        this.formData.employeeID === "" ||
        this.formData.employeeID === null
      ) {
        this.isEmpty.employeeID = true;
        errorMessages.push(this.$t("validation.employeeID"));
        console.log(errorMessages);
      }

      if (this.productForms.length !== 0) {
        this.productForms.forEach((productForm, index) => {
          if (
            !productForm.productName ||
            !productForm.price ||
            !productForm.sale_qty
          ) {
            // ตรวจสอบว่า field `someField` ของแต่ละ productForm ว่าง
            this.isEmpty.productForms = true;
            errorMessages.push(
              `${this.$t("validation.productForms")} ${index + 1}`
            );
          } else if (
            productForm.sale_qty === "0" ||
            productForm.sale_qty === 0
          ) {
            // ตรวจสอบว่า field `someField` ของแต่ละ productForm ว่าง
            this.isEmpty.productForms = true;
            errorMessages.push(`${this.$t("checkProductformQTY")} `);
          }
        });
      } else {
        this.isEmpty.productForms = true;
        errorMessages.push(this.$t("validation.productForms"));
      }
      if (this.formData.sale_date === "") {
        this.isEmpty.sale_date = true;
        errorMessages.push(this.$t("validation.sale_date"));
      }
      if (this.formData.credit_date_number === "") {
        this.isEmpty.credit_date_number = true;
        errorMessages.push(this.$t("validation.credit_date_number"));
      }
      // alert(errorMessages.length);
      if (errorMessages.length > 0) {
        this.showPopup_validate(errorMessages);
        this.isLoading = false;
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
    createFormDataList(cate_id, productForms) {
      return productForms.map((product) => {
        const formData = new FormData();
        formData.append("file", product.file || ""); // ไฟล์ถ้ามี
        formData.append("productTypeID", 1);
        formData.append("productname", product.productName);
        formData.append("productdetail", product.product_detail);
        formData.append("amount", 0);
        formData.append("price", parseInt(product.price));
        formData.append("productcost", 0);
        formData.append("categoryID", cate_id);
        formData.append("Status", "active");
        return formData;
      });
    },

    async addProductQuotataion() {
      const isIncomplete = this.productForms.some(
        (productForm) =>
          !productForm.productName ||
          !productForm.price ||
          !productForm.sale_qty
      );

      if (isIncomplete) {
        return 0; // หยุดการทำงานหากข้อมูลไม่สมบูรณ์
      }
      const response = await fetch(`${API_CALL}/product/getCategory`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();
      // console.log("addProductQuotataion",json)
      this.Categorys = json.data;

      // ค้นหาหมวดหมู่ที่ชื่อเป็น "categoryName"
      const matchedCategory = this.Categorys.find(
        (category) => category.categoryName === "ไม่มีหมวดหมู่"
      );

      // ถ้าเจอ หมวดหมู่ ให้กำหนด categoryID
      if (matchedCategory) {
        this.CategoryIDFormAddNewProduct = matchedCategory.categoryID;

        const formDataList = this.createFormDataList(
          this.CategoryIDFormAddNewProduct,
          this.productForms
        );
        const addedProductIDs = [];

        for (const formData of formDataList) {
          const res = await fetch(`${API_CALL}/product/AddProduct`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });
          const json = await res.json();
          console.log("AddProductQuotataion ", json);

          if (json.statusCode == 200 && json.data && json.data.productID) {
            addedProductIDs.push(json.data.productID); // สมมติว่าตอบกลับ API มี field `data.productID`
            console.warn("เพิ่มสินค้าไม่สำเร็จ", json.message || json);
            this.getEmployee();
            this.getCustomer();
            this.getProduct();
            this.getBusiness();
            this.getQuotation();
          }
        }
        return addedProductIDs; // ส่งคืน productID ทั้งหมด
      } else {
        console.warn("ไม่พบหมวดหมู่ชื่อ ไม่มีหมวดหมู่");
      }
    },
    async addQuotation() {
      if (!(await this.validateFormData())) return;
      const addedProductIDs = await this.addProductQuotataion(); // ดึง productIDs ที่เพิ่มสำเร็จ

      if (addedProductIDs.length > 0) {
        let addedIndex = 0; // ตัวชี้ตำแหน่งใน addedProductIDs
        this.productForms.forEach((form) => {
          // ตรวจสอบว่าสินค้านี้เป็นสินค้าที่เพิ่งเพิ่มใหม่
          if (!form.productID) {
            if (addedIndex < addedProductIDs.length) {
              form.productID = addedProductIDs[addedIndex];
              addedIndex++;
            } else {
              console.warn(
                "จำนวน addedProductIDs ไม่เพียงพอสำหรับอัปเดต productForms"
              );
            }
          }
        });
      }

      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      this.formData.sale_date = new Date(this.formData.sale_date)
        .toISOString()
        .split("T")[0];
      if (!this.formData.sale_number) {
        console.error(
          "Sale number is undefined or empty. Please check the sale number generation."
        );
        this.showPopup_error("Sale number is not generated. Please try again.");
        return;
      }
      console.log(
        "Sale Number before sending API request:",
        this.formData.sale_number
      );
      try {
        if (this.NotCustomerExit) {
          await fetch(`${API_CALL}/Quotation/addCustomer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              cus_name: this.formData.cus_name,
              cus_address: this.formData.cus_address,
              cus_tel: this.formData.cus_tel,
              cus_email: this.formData.cus_email,
              cus_tax: this.formData.cus_tax,
              cus_purchase: this.formData.cus_purchase,
              bus_id: this.formData.bus_id,
              Status: "active",
            }),
          });
          await this.getCustomer();

          const dataStorage = this.Customers.find(
            (customer) => customer.cus_name === this.formData.cus_name
          );

          if (dataStorage) {
            this.formData.cus_id = dataStorage.cus_id; // เก็บค่า cus_id
            // alert("GG");
            console.log("dataStorage", dataStorage);
          } else {
            console.error("Customer not found.");
          }
        }
        const toYYYYMMDD = (date) => {
          if (!date) return null;
          const year = date.getFullYear();
          const adYear = year > 2500 ? year - 543 : year;
          return `${adYear}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;
        };
        const originalDate = new Date(this.formData.credit_expired_date);

        const response = await fetch(`${API_CALL}/quotation/addQuotationSale`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            sale_number: this.formData.sale_number,
            sale_date: this.formData.sale_date,
            // sale_date:
            //   this.t("lang") === "en"
            //     ? (() => {
            //         let dateParts = this.formData.sale_date.split("-"); // แยกเป็น ["2568", "02", "26"]
            //         let buddhistYear = parseInt(dateParts[0]); // ดึงปี พ.ศ.
            //         let adYear = buddhistYear - 543; // แปลงเป็น ค.ศ.
            //         return new Date(
            //           `${adYear}-${dateParts[1]}-${dateParts[2]}`
            //         ); // คืนค่าเป็น Date Object
            //       })()
            //     : this.formData.sale_date,

            credit_date_number: this.formData.credit_date_number,
            // credit_expired_date: this.formData.credit_expired_date,
            credit_expired_date:
              this.t("lang") === "en"
                ? toYYYYMMDD(originalDate)
                : this.formData.credit_expired_date,

            sale_totalprice: parseFloat(
              this.formData.sale_totalprice.replace(/,/g, "")
            ),
            bus_id: this.Business.bus_id,
            cus_id: this.formData.cus_id,
            employeeID: this.formData.employeeID,
            status: "Pending",
            remark: this.formData.remark,
            remarkInfernal: this.formData.remarkInfernal,
            discount_quotation: this.formData.discount_quotation,
            vatType: this.formData.vatType,
            products: this.productForms.map((form) => ({
              productID: form.productID, // กรณีเพิ่มสินค้าใน quotaion จะหาตัวนี้ไม่เจอ
              sale_price: parseFloat(form.sale_price.replace(/,/g, "")),
              discounttype: form.discounttype,
              sale_discount: parseFloat(form.sale_discount),
              sale_qty: parseFloat(form.sale_qty),
              product_detail: form.product_detail,
              pro_unti: form.pro_unti.trim(),
            })),
          }),
        });

        const formDataImage = new FormData();
        formDataImage.append("quotation_id", this.formData.sale_number);
        formDataImage.append("file", this.Image_pd);

        await fetch(`${API_CALL}/Quotation/AddQuotation_img`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataImage,
        });

        const json = await response.json();
        if (json.statusCode === 200) {
          this.quoForms = json.data;
          this.getQuotation();
          this.showPopup(this.$t("validation.AddSucc"));
          console.log("API result: " + this.result);
          this.closePopup();
        } else {
          this.showPopup_error(`${json.data}`);
          console.log("Employee ", json);
          this.result = false;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
    async editQuotation() {
      if (!(await this.validateFormData())) return;
      const addedProductIDs = await this.addProductQuotataion(); // ดึง productIDs ที่เพิ่มสำเร็จ

      if (addedProductIDs.length > 0) {
        let addedIndex = 0; // ตัวชี้ตำแหน่งใน addedProductIDs
        this.productForms.forEach((form) => {
          // ตรวจสอบว่าสินค้านี้เป็นสินค้าที่เพิ่งเพิ่มใหม่
          if (!form.productID) {
            if (addedIndex < addedProductIDs.length) {
              form.productID = addedProductIDs[addedIndex];
              addedIndex++;
            } else {
              console.warn(
                "จำนวน addedProductIDs ไม่เพียงพอสำหรับอัปเดต productForms"
              );
            }
          }
        });
      }
      this.isLoading = true;
      const accessToken = localStorage.getItem("@accessToken");
      try {
        if (this.NotCustomerExit) {
          await fetch(`${API_CALL}/Quotation/addCustomer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              cus_name: this.formData.cus_name,
              cus_address: this.formData.cus_address,
              cus_tel: this.formData.cus_tel,
              cus_email: this.formData.cus_email,
              cus_tax: this.formData.cus_tax,
              cus_purchase: this.formData.cus_purchase,
              bus_id: this.formData.bus_id,
              Status: "active",
            }),
          });
          await this.getCustomer();

          const dataStorage = this.Customers.find(
            (customer) => customer.cus_name === this.formData.cus_name
          );

          if (dataStorage) {
            this.formData.cus_id = dataStorage.cus_id; // เก็บค่า cus_id

            console.log("dataStorage", dataStorage);
          } else {
            console.error("Customer not found.");
          }
        }

        if (this.formData.status === "Allowed") {
          // เช็คว่า status === comfime order ถ้ามี ให้ alert message
          let errorMessages = [];

          this.productForms.forEach((form) => {
            if (form.sale_qty === "0" || form.sale_qty === 0) {
              this.isEmpty.productForms = true;
              errorMessages.push(this.$t("sale_qty_zero"));
            }

            // ค้นหา Product ที่ตรงกับ form.productID
            const matchedProduct = this.Products.find(
              (product) => product.productname === form.productID
            );
            // console.log("matchedProduct",matchedProduct)
            if (matchedProduct && matchedProduct.Status === "not active") {
              errorMessages.push(this.$t("productActive"));
            }
          });

          if (errorMessages.length > 0) {
            this.showPopup_validate(errorMessages);
            return;
          }
        }
        const qt_id = this.formData.sale_id;

        if (this.formData.status === "รอดําเนินการ") {
          this.formData.status = "Pending";
        }

        const toYYYYMMDD = (date) => {
          if (!date) return null;
          const year = date.getFullYear();
          const adYear = year > 2500 ? year - 543 : year;
          return `${adYear}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;
        };
        const sale_date_originalDate = new Date(this.formData.sale_date);
        const date_exp = new Date(this.formData.credit_expired_date); // ค่าที่ได้
        date_exp.setFullYear(date_exp.getFullYear() - 543); // ลบ 543 ปี

        const response = await fetch(
          `${API_CALL}/quotation/editQuotationSale/${qt_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              sale_number: this.formData.sale_number,
              sale_date: this.formData.sale_date,
              // sale_date:
              //   this.t("lang") === "en"
              //     ? toYYYYMMDD(sale_date_originalDate)
              //     : this.formData.sale_date,
              credit_date_number: this.formData.credit_date_number,
              // credit_expired_date:
              //   this.t("lang") === "en"
              //     ? date_exp
              //     : this.formData.credit_expired_date,
              // sale_totalprice: parseFloat(
              //   this.formData.sale_totalprice.replace(/,/g, "")
              // ),
              credit_expired_date: this.formData.credit_expired_date,
              sale_totalprice:
                this.formData.vatType !== "VATexcluding"
                  ? parseFloat(this.formData.sale_totalprice.replace(/,/g, ""))
                  : parseFloat(this.formData.sale_totalprice.replace(/,/g, "")),
              bus_id: this.Business.bus_id,
              cus_id: this.formData.cus_id,
              employeeID: this.formData.employeeID,
              status: this.formData.status,
              remark: this.formData.remark,
              remarkInfernal: this.formData.remarkInfernal,
              discount_quotation: this.formData.discount_quotation,
              vatType: this.formData.vatType,
              products: this.productForms.map((form) => ({
                productID: form.productID,
                sale_price: parseFloat(form.sale_price.replace(/,/g, "")),
                discounttype: form.discounttype,
                sale_discount: parseFloat(form.sale_discount),
                sale_qty: parseFloat(form.sale_qty),
                product_detail: form.product_detail,
                pro_unti: form.pro_unti.trim(),
              })),
            }),
          }
        );
        const json = await response.json();

        if (this.newImg) {
          const formDataImage = new FormData();
          formDataImage.append("quotation_id", this.formData.sale_number);
          formDataImage.append("file", this.Image_pd);

          await fetch(`${API_CALL}/Quotation/AddQuotation_img`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formDataImage,
          });
        }

        // alert(this.Image_pd != "");
        if (json.statusCode === 200) {
          this.getQuotation();
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup();
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
    async editQuotation2() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      if (!(await this.validateFormData())) return;

      try {
        if (this.NotCustomerExit) {
          await fetch(`${API_CALL}/Quotation/addCustomer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              cus_name: this.formData.cus_name,
              cus_address: this.formData.cus_address,
              cus_tel: this.formData.cus_tel,
              cus_email: this.formData.cus_email,
              cus_tax: this.formData.cus_tax,
              cus_purchase: this.formData.cus_purchase,
              bus_id: this.formData.bus_id,
              Status: "active",
            }),
          });
          await this.getCustomer();

          const dataStorage = this.Customers.find(
            (customer) => customer.cus_name === this.formData.cus_name
          );

          if (dataStorage) {
            this.formData.cus_id = dataStorage.cus_id; // เก็บค่า cus_id

            console.log("dataStorage", dataStorage);
          } else {
            console.error("Customer not found.");
          }
        }

        if (this.formData.status === "Allowed") {
          // เช็คว่า status === comfime order ถ้ามี ให้ alert message
          let errorMessages = [];

          this.productForms.forEach((form) => {
            if (form.sale_qty === "0" || form.sale_qty === 0) {
              this.isEmpty.productForms = true;
              errorMessages.push(this.$t("sale_qty_zero"));
            }

            // ค้นหา Product ที่ตรงกับ form.productID
            const matchedProduct = this.Products.find(
              (product) => product.productname === form.productID
            );
            // console.log("matchedProduct", matchedProduct);
            if (matchedProduct && matchedProduct.Status === "not active") {
              errorMessages.push(this.$t("productActive"));
            }
          });

          if (errorMessages.length > 0) {
            this.showPopup_validate(errorMessages);
            return;
          }
        }
        const qt_id = this.formData.sale_id;

        if (this.formData.status === "รอดําเนินการ") {
          this.formData.status = "Pending";
        }
        let errorMessages = [];
        this.productForms.forEach((form) => {
          if (form.sale_qty === "0" || form.sale_qty === 0) {
            this.isEmpty.productForms = true;
            errorMessages.push(this.$t("sale_qty_zero"));
          }

          // ค้นหา Product ที่ตรงกับ form.productID
          const matchedProduct = this.Products.find(
            (product) => product.productname === form.productID
          );
          console.log("matchedProduct", matchedProduct);
          if (matchedProduct && matchedProduct.Status === "not active") {
            errorMessages.push(this.$t("productActive"));
          }
        });

        if (errorMessages.length > 0) {
          this.showPopup_validate(errorMessages);
          this.openPopupAllow = false;
          return;
        }

        this.openPopupAllow = true;

        const toYYYYMMDD = (date) => {
          if (!date) return null;
          const year = date.getFullYear();
          const adYear = year > 2500 ? year - 543 : year;
          return `${adYear}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;
        };
        const sale_date_originalDate = new Date(this.formData.sale_date);
        const date_exp = new Date(this.formData.credit_expired_date); // ค่าที่ได้
        date_exp.setFullYear(date_exp.getFullYear() - 543); // ลบ 543 ปี

        const response = await fetch(
          `${API_CALL}/quotation/editQuotationSale/${qt_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              sale_number: this.formData.sale_number,
              sale_date: this.formData.sale_date,
              // sale_date:
              //   this.t("lang") === "en"
              //     ? toYYYYMMDD(sale_date_originalDate)
              //     : this.formData.sale_date,
              credit_date_number: this.formData.credit_date_number,
              // credit_expired_date:
              //   this.t("lang") === "en"
              //     ? date_exp
              //     : this.formData.credit_expired_date,
              // sale_totalprice: parseFloat(
              //   this.formData.sale_totalprice.replace(/,/g, "")
              // ),
              credit_expired_date: this.formData.credit_expired_date,
              sale_totalprice:
                this.formData.vatType !== "VATexcluding"
                  ? parseFloat(this.formData.sale_totalprice.replace(/,/g, ""))
                  : parseFloat(this.formData.sale_totalprice.replace(/,/g, "")),
              bus_id: this.Business.bus_id,
              cus_id: this.formData.cus_id,
              employeeID: this.formData.employeeID,
              status: "Allowed",
              remark: this.formData.remark,
              remarkInfernal: this.formData.remarkInfernal,
              discount_quotation: this.formData.discount_quotation,
              vatType: this.formData.vatType,
              products: this.productForms.map((form) => ({
                productID: form.productID,
                sale_price: parseFloat(form.sale_price.replace(/,/g, "")),
                discounttype: form.discounttype,
                sale_discount: parseFloat(form.sale_discount),
                sale_qty: parseFloat(form.sale_qty),
                product_detail: form.product_detail,
                pro_unti: form.pro_unti.trim(),
              })),
            }),
          }
        );
        const json = await response.json();

        if (this.newImg) {
          const formDataImage = new FormData();
          formDataImage.append("quotation_id", this.formData.sale_number);
          formDataImage.append("file", this.Image_pd);

          await fetch(`${API_CALL}/Quotation/AddQuotation_img`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formDataImage,
          });
        }

        // alert(this.Image_pd != "");
        if (json.statusCode === 200) {
          this.getQuotation();
          // this.showPopup(this.$t("validation.EditSucc"));
          // this.closePopup();
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      this.closeAllowConfirmPopup();
      // }
    },
    async editQuotation3() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      if (!(await this.validateFormData())) return;

      try {
        if (this.NotCustomerExit) {
          await fetch(`${API_CALL}/Quotation/addCustomer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              cus_name: this.formData.cus_name,
              cus_address: this.formData.cus_address,
              cus_tel: this.formData.cus_tel,
              cus_email: this.formData.cus_email,
              cus_tax: this.formData.cus_tax,
              cus_purchase: this.formData.cus_purchase,
              bus_id: this.formData.bus_id,
              Status: "active",
            }),
          });
          await this.getCustomer();

          const dataStorage = this.Customers.find(
            (customer) => customer.cus_name === this.formData.cus_name
          );

          if (dataStorage) {
            this.formData.cus_id = dataStorage.cus_id; // เก็บค่า cus_id

            console.log("dataStorage", dataStorage);
          } else {
            console.error("Customer not found.");
          }
        }

        if (this.formData.status === "Allowed") {
          // เช็คว่า status === comfime order ถ้ามี ให้ alert message
          let errorMessages = [];

          this.productForms.forEach((form) => {
            if (form.sale_qty === "0" || form.sale_qty === 0) {
              this.isEmpty.productForms = true;
              errorMessages.push(this.$t("sale_qty_zero"));
            }

            // ค้นหา Product ที่ตรงกับ form.productID
            const matchedProduct = this.Products.find(
              (product) => product.productname === form.productID
            );

            console.log("matchedProduct", matchedProduct);
            if (matchedProduct && matchedProduct.Status === "not active") {
              errorMessages.push(this.$t("productActive"));
            }
          });

          if (errorMessages.length > 0) {
            this.showPopup_validate(errorMessages);
            return;
          }
        }
        const qt_id = this.formData.sale_id;

        if (this.formData.status === "รอดําเนินการ") {
          this.formData.status = "Pending";
        }

        const toYYYYMMDD = (date) => {
          if (!date) return null;
          const year = date.getFullYear();
          const adYear = year > 2500 ? year - 543 : year;
          return `${adYear}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;
        };
        const sale_date_originalDate = new Date(this.formData.sale_date);
        const date_exp = new Date(this.formData.credit_expired_date); // ค่าที่ได้
        date_exp.setFullYear(date_exp.getFullYear() - 543); // ลบ 543 ปี

        const response = await fetch(
          `${API_CALL}/quotation/editQuotationSale/${qt_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              sale_number: this.formData.sale_number,
              sale_date: this.formData.sale_date,
              // sale_date:
              //   this.t("lang") === "en"
              //     ? toYYYYMMDD(sale_date_originalDate)
              //     : this.formData.sale_date,
              credit_date_number: this.formData.credit_date_number,
              // credit_expired_date:
              //   this.t("lang") === "en"
              //     ? date_exp
              //     : this.formData.credit_expired_date,
              // sale_totalprice: parseFloat(
              //   this.formData.sale_totalprice.replace(/,/g, "")
              // ),
              credit_expired_date: this.formData.credit_expired_date,
              sale_totalprice:
                this.formData.vatType !== "VATexcluding"
                  ? parseFloat(this.formData.sale_totalprice.replace(/,/g, ""))
                  : parseFloat(this.formData.sale_totalprice.replace(/,/g, "")),
              bus_id: this.Business.bus_id,
              cus_id: this.formData.cus_id,
              employeeID: this.formData.employeeID,
              status: "Pending",
              remark: this.formData.remark,
              remarkInfernal: this.formData.remarkInfernal,
              discount_quotation: this.formData.discount_quotation,
              vatType: this.formData.vatType,
              products: this.productForms.map((form) => ({
                productID: form.productID,
                sale_price: parseFloat(form.sale_price.replace(/,/g, "")),
                discounttype: form.discounttype,
                sale_discount: parseFloat(form.sale_discount),
                sale_qty: parseFloat(form.sale_qty),
                product_detail: form.product_detail,
                pro_unti: form.pro_unti.trim(),
              })),
            }),
          }
        );
        const json = await response.json();

        if (this.newImg) {
          const formDataImage = new FormData();
          formDataImage.append("quotation_id", this.formData.sale_number);
          formDataImage.append("file", this.Image_pd);

          await fetch(`${API_CALL}/Quotation/AddQuotation_img`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formDataImage,
          });
        }

        // alert(this.Image_pd != "");
        if (json.statusCode === 200) {
          this.getQuotation();
          // this.showPopup(this.$t("validation.EditSucc"));
          // this.closePopup();
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      this.closeAllowConfirmPopup();
      // }
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

        if (!response.ok) {
          const errorData = await response.json();
          this.showPopup_error(
            errorData.message || "An error occurred while fetching products."
          );
          console.error("HTTP Error:", response.status, errorData);
          return;
        }

        const json = await response.json();

        if (json.statusCode === 200) {
          this.Products = json.data
            // Filter only products with "Active" status
            // Include only products with active status
            .map((item) => ({
              productID: item.productID,
              Category: item.product_category?.categoryName || "N/A",
              productname: item.productname,
              Detail: item.productdetail,
              price: item.price,
              Cost: item.productcost,
              Amount: item.amount,
              productImg: item.productImg,
              productTypeID: item.productTypeID,
              categoryID: item.categoryID,
              Status: item.Status,
            }));
        } else {
          this.showPopup_error(json.data || "Unexpected error");
          console.log("API Response:", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        this.showPopup_error(
          "Failed to fetch product data. Please try again later."
        );
      } finally {
        this.isLoading = false;
      }
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
    async getBusiness() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/quotation/getBusinessByID`, {
          method: "GET", // เปลี่ยน method เป็น 'POST'
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // เพิ่ม header Content-Type
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
    // async checkLastestQuotationNumber() {
    //   const accessToken = localStorage.getItem("@accessToken");
    //   try {
    //     const response = await fetch(
    //       `${API_CALL}/quotation/checkLastestQuotation`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //       }
    //     );
    //     const json = await response.json();
    //     if (json.statusCode === 200) {
    //       this.currentCode = json.data.sale_number;
    //       console.log("currentCode:", this.currentCode.sale_number);
    //       let currentNumber = parseInt(this.currentCode.slice(3));
    //       let nextNumber = currentNumber + 1;
    //       let nextNumberStr = nextNumber.toString().padStart(8, "0");

    //       this.formData.sale_number = `QT-${nextNumberStr}`;
    //     } else if (json.statusCode === 400) {
    //       this.formData.sale_number = `QT-00000001`;
    //     } else {
    //       console.log(json);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // },
    async checkLastestQuotationNumber() {
      const accessToken = localStorage.getItem("@accessToken");

      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2); // ปี ค.ศ. 2 หลัก
      const mm = String(now.getMonth() + 1).padStart(2, "0"); // เดือน 2 หลัก
      const dd = String(now.getDate()).padStart(2, "0"); // วันที่ 2 หลัก
      const todayPrefix = `${yy}${mm}${dd}`; // ตัวอย่าง: 250424

      try {
        const response = await fetch(
          `${API_CALL}/quotation/checkLastestQuotation`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();

        if (json.statusCode === 200 && json.data.sale_number) {
          const lastCode = json.data.sale_number; // ตัวอย่าง: QT-2504240005
          const lastDatePart = lastCode.slice(3, 9); // เอาเฉพาะวันที่ 6 หลัก
          const lastNumberPart = lastCode.slice(9); // เอาเลขรัน 4 หลัก

          let nextNumber = 1;

          if (lastDatePart === todayPrefix) {
            nextNumber = parseInt(lastNumberPart) + 1;
          }

          const nextNumberStr = String(nextNumber).padStart(4, "0");
          this.formData.sale_number = `QT-${todayPrefix}${nextNumberStr}`;
        } else {
          // ถ้าไม่มีข้อมูลล่าสุด หรือสถานะเป็น 400 → เริ่มรันใหม่
          this.formData.sale_number = `QT-${todayPrefix}0001`;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async deleteQuotation() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const qty_id = this.formData.sale_id;
      try {
        const response = await fetch(
          `${API_CALL}/Quotation/DeleteQuotation/${qty_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              sale_id: qty_id,
            }),
          }
        );

        await fetch(`${API_CALL}/quotation/deleteQuotataion_img`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            quotation_id: this.formData.sale_number,
          }),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getQuotation();
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
    async deleteInvoice(qty_id) {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      // const qty_id = this.formData.invoice_id;
      try {
        const response = await fetch(
          `${API_CALL}/quotation/deleteInvoice/${qty_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              sale_id: qty_id,
            }),
          }
        );
        const json = await response.json();
        console.log("-------------------------------->>>>", json);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    openPopup() {
      this.isReadonly2 = true;
      this.isDisabled2 = true;
      this.imageSrc = null;
      this.selectedCusName = "";
      const currentDate = new Date();

      // เพิ่ม 1 เดือน
      const nextMonthDate = new Date(currentDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

      this.checkLastestQuotationNumber();
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
      this.cus_drop_down;
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
        sale_number: "",
        // sale_date: currentDate,
        // credit_date_number: "30 Days",
        sale_date:
          this.t("lang") === "en"
            ? new Date(
                new Date(currentDate).setFullYear(currentDate.getFullYear())
              )
            : currentDate,
        credit_date_number: "30 Days",
        credit_expired_date:
          this.t("lang") === "en"
            ? new Date(
                new Date(nextMonthDate).setFullYear(nextMonthDate.getFullYear())
              )
            : nextMonthDate,
        discounttype: "",
        sale_discount: 0,
        sale_totalprice: 0, // total price cal discount and vat
        sale_price: 0, //total price before cal discount but *qty
        total_price: 0, ////////////cal all product
        total_discount: 0, ///////////////
        Net_price: 0, //cal after cal discount
        vat: 0, //price not percentage
        price: "", //price per product
        remark: "",
        status: "",
        pdfname: "",
        file: "",
        discount_quotation: "0",
        vatType: "VATexcluding",
      };
      this.clearFile();
      // this.fileName = [];
      if (this.t("lang") === "en") {
        this.creditDay = ["7  วัน", "14 วัน", "30 วัน", "60 วัน", "90 วัน"];
        this.formData.credit_date_number = "30 วัน";
      } else {
        this.creditDay = [
          "7  Days",
          "14 Days",
          "30 Days",
          "60 Days",
          "90 Days",
        ];
      }
      this.productForms = [];
      this.showingAddProduct();
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      //   this.cus_drop_down = ""
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
        sale_number: "",
        sale_date: "",
        credit_date_number: "",
        credit_expired_date: "",
        sale_discount: 0,
        sale_totalprice: 0, // total price cal discount and vat
        sale_price: 0, //total price before cal discount but *qty
        discounttype: "",
        total_price: 0, ////////////cal all product
        total_discount: 0, ///////////////
        Net_price: 0, //cal after cal discount
        vat: 0, //price not percentage
        price: "", //price per product
        remark: "",
        status: "",
        pdfname: "",
        file: "",
      };
      this.isEmpty.cus_name = false;
      this.isEmpty.cus_address = false;
      this.isEmpty.email = false;
      this.isEmpty.cus_tax = false;
      this.isEmpty.cus_purchase = false;
      this.isEmpty.employeeID = false;
      this.isEmpty.sale_date = false;
      this.isEmpty.credit_date_number = false;
      this.isEmpty.productForms = false;

      this.productForms = [];
      this.getQuotation();
      this.isPopupVisible_error = false;
    },
    updateEmployee() {
      const selectedEmptId = this.formData.employeeID;
      const selectedEmp = this.Employees.find(
        (emp) => emp.employeeID === selectedEmptId
      );
      if (selectedEmp) {
        this.formData.employeeName = selectedEmp.Name;
        this.formData.position = selectedEmp.position;
        this.formData.employeeEmail = selectedEmp.Email;
        (this.formData.employeeTel = selectedEmp.Phone_num),
          console.log("Select employee: " + this.formData.employeeName);
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
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
      // this.formData.total_discount = "0.00";
    },
    totalNetPrice() {
      const totalNet = this.productForms.reduce((total, form) => {
        const salePrice = parseFloat(form.sale_price.replace(/,/g, "")); // แปลง formatDecimal เป็นตัวเลข
        return total + salePrice;
      }, 0);
      const saleDiscount = this.formData.total_discount.replace(/,/g, "");
      // this.formData.Net_price = this.formatDecimal(totalNet - saleDiscount);
      // this.formData.Net_price = this.formatDecimal(totalNet);

      this.formData.Net_price = this.formatDecimal(
        parseFloat(totalNet) - parseFloat(this.formData.discount_quotation)
      );
    },
    vat_price() {
      this.formData.vat = this.formatDecimal(
        (7 / 100) * parseFloat(this.formData.Net_price.replace(/,/g, ""))
      );
    },
    total_priceBeforeDiscount() {
      const totalNet = this.productForms.reduce((total, form) => {
        const salePrice = parseFloat(form.sale_price.replace(/,/g, "")); // แปลง formatDecimal เป็นตัวเลข
        return total + salePrice;
      }, 0);
      this.formData.total_price = this.formatDecimal(totalNet);
    },
    total_pricesale() {
      const vat = parseFloat(this.formData.vat.replace(/,/g, ""));
      const net = parseFloat(this.formData.Net_price.replace(/,/g, ""));
      this.formData.sale_totalprice = this.formatDecimal(net + vat);
    },
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      // setTimeout(() => {
      //   this.isPopupVisible = false;
      //   this.isPopupVisible_error = false;
      // }, 2000); // 2 seconds
    },
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000); // 2 seconds
    },
    showingAddProduct() {
      this.productForms.push({
        productID: "",
        price: 0,
        sale_qty: 0,
        sale_price: 0,
        sale_discount: 0,
        discounttype: "amount",
        productname: "",
        productImg: "",
        product_detail: "",
        pro_unti: "",
        showDetails: false,
      });
      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();
    },
    closingProduct(index) {
      this.productForms.splice(index, 1);
      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();
    },
    limitDiscount(form) {
      if (form.discounttype === "percent") {
        if (form.sale_discount > 100) {
          form.sale_discount = 100;
        } else if (form.sale_discount < 0) {
          form.sale_discount = 0;
        }
      } else {
        if (form.sale_discount < 0) {
          form.sale_discount = 0;
        }
      }
    },
    updatePrice2(form, index) {
      form.sale_discount = 0;
      const selectedProductId = form.productID;
      const selectedProduct = this.Products.find(
        (product) => product.productname === selectedProductId
      );
      if (!selectedProduct) {
        // ใช้ form.price เดิมในการคำนวณ sale_price
        const price = parseFloat(form.price.toString().replace(/,/g, ""));
        const sale_qty = parseFloat(form.sale_qty) || 0;

        if (form.discounttype === "percent") {
          let discountPercent = parseFloat(form.sale_discount) || 0;
          discountPercent = Math.max(0, Math.min(discountPercent, 100));

          form.sale_price = this.formatDecimal(
            sale_qty * price * (1 - discountPercent / 100)
          );
        } else {
          let discountValue = parseFloat(form.sale_discount) || 0;
          let total = sale_qty * price - discountValue;
          if (total < 0) {
            discountValue = sale_qty * price;
            total = 0;
          }
          form.sale_discount = this.formatDecimal(discountValue);
          form.sale_price = this.formatDecimal(total);
        }

        // เรียกฟังก์ชันสรุปผลลัพธ์
        this.updateTotalDiscount();
        this.totalNetPrice();
        this.vat_price();
        this.total_pricesale();
        this.total_priceBeforeDiscount();

        // VAT Calculation
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
              parseFloat(this.formData.vat.replace(/,/g, ""))
          );
        }

        return; // ออกจากฟังก์ชันเพื่อไม่ให้ไปทำส่วนของ selectedProduct ด้านล่าง
      }

      if (selectedProduct) {
        form.price = this.formatDecimal(
          parseFloat(selectedProduct.price.toFixed(2))
        );
        form.sale_price = this.formatDecimal(
          form.sale_qty * parseFloat(form.price.replace(/,/g, ""))
        );
        form.productname = selectedProduct.productname;
        form.productImg = selectedProduct.productImg;
        if (form.discounttype === "percent") {
          // const salePriceValue =
          //   parseFloat(form.sale_price.replace(/,/g, "")) || 0;
          let discountPercent = parseFloat(form.sale_discount) || 0;
          discountPercent = Math.max(0, Math.min(discountPercent, 100));
          // alert(discountPercent);

          form.sale_price = this.formatDecimal(
            parseFloat(form.sale_qty * parseFloat(form.price.replace(/,/g, "")))
          );

          if (discountPercent > 0) {
            form.sale_price = this.formatDecimal(
              form.sale_qty * parseFloat(form.price.replace(/,/g, "")) -
                form.sale_qty *
                  parseFloat(form.price.replace(/,/g, "")) *
                  (discountPercent / 100)
            );
          }
        } else {
          form.sale_discount = parseFloat(form.sale_discount) || 0;

          form.sale_price = this.formatDecimal(
            parseFloat(
              form.sale_price.replace(/,/g, "") - parseFloat(form.sale_discount)
            )
          );

          if (form.sale_price.replace(/,/g, "") < 0) {
            form.sale_discount = this.formatDecimal(
              form.sale_qty * parseFloat(form.price.replace(/,/g, ""))
            );
            form.sale_price = "0.00";
          } else {
            form.sale_price = this.formatDecimal(
              parseFloat(
                form.sale_qty * parseFloat(form.price.replace(/,/g, "")) -
                  parseFloat(form.sale_discount)
              )
            );
          }
        }
        // this.updateTotalDiscount();
        // this.totalNetPrice();
        // this.vat_price();
        // this.total_pricesale();
        // this.total_priceBeforeDiscount();

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
              parseFloat(this.formData.vat.replace(/,/g, ""))
          );
        }
      }
    },
    updatePrice(form, index, event) {
      const selectedProductId = form.productID;
      const selectedProduct = this.Products.find(
        (product) => product.productname === selectedProductId
      );

      if (!selectedProduct) {
        // ใช้ form.price เดิมในการคำนวณ sale_price
        const price = parseFloat(form.price.toString().replace(/,/g, ""));
        const sale_qty = parseFloat(form.sale_qty) || 0;

        if (form.discounttype === "percent") {
          let discountPercent = parseFloat(form.sale_discount) || 0;
          discountPercent = Math.max(0, Math.min(discountPercent, 100));

          form.sale_price = this.formatDecimal(
            sale_qty * price * (1 - discountPercent / 100)
          );
        } else {
          let discountValue = parseFloat(form.sale_discount) || 0;
          let total = sale_qty * price - discountValue;
          if (total < 0) {
            discountValue = sale_qty * price;
            total = 0;
          }
          form.sale_discount = this.formatDecimal(discountValue);
          form.sale_price = this.formatDecimal(total);
        }

        // เรียกฟังก์ชันสรุปผลลัพธ์
        this.updateTotalDiscount();
        this.totalNetPrice();
        this.vat_price();
        this.total_pricesale();
        this.total_priceBeforeDiscount();

        // VAT Calculation
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
              parseFloat(this.formData.vat.replace(/,/g, ""))
          );
        }

        return; // ออกจากฟังก์ชันเพื่อไม่ให้ไปทำส่วนของ selectedProduct ด้านล่าง
      }

      if (selectedProduct) {
        form.price = this.formatDecimal(
          parseFloat(selectedProduct.price.toFixed(2))
        );
        form.sale_price = this.formatDecimal(
          form.sale_qty * parseFloat(form.price.replace(/,/g, ""))
        );
        form.productname = selectedProduct.productname;
        form.productImg = selectedProduct.productImg;
        if (form.discounttype === "percent") {
          // const salePriceValue =
          //   parseFloat(form.sale_price.replace(/,/g, "")) || 0;
          let discountPercent = parseFloat(form.sale_discount) || 0;
          discountPercent = Math.max(0, Math.min(discountPercent, 100));
          // alert(discountPercent);

          form.sale_price = this.formatDecimal(
            parseFloat(form.sale_qty * parseFloat(form.price.replace(/,/g, "")))
          );

          if (discountPercent > 0) {
            form.sale_price = this.formatDecimal(
              form.sale_qty * parseFloat(form.price.replace(/,/g, "")) -
                form.sale_qty *
                  parseFloat(form.price.replace(/,/g, "")) *
                  (discountPercent / 100)
            );
          }
        } else {
          form.sale_discount = parseFloat(form.sale_discount) || 0;

          form.sale_price = this.formatDecimal(
            parseFloat(
              form.sale_price.replace(/,/g, "") - parseFloat(form.sale_discount)
            )
          );

          if (form.sale_price.replace(/,/g, "") < 0) {
            form.sale_discount = this.formatDecimal(
              form.sale_qty * parseFloat(form.price.replace(/,/g, ""))
            );
            form.sale_price = "0.00";
          } else {
            form.sale_price = this.formatDecimal(
              parseFloat(
                form.sale_qty * parseFloat(form.price.replace(/,/g, "")) -
                  parseFloat(form.sale_discount)
              )
            );
          }
        }

        this.updateTotalDiscount();
        this.totalNetPrice();
        this.vat_price();
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
              parseFloat(this.formData.vat.replace(/,/g, ""))
          );
        }
      }
    },
    async companySelected(selectedCus) {
      console.log(selectedCus);
      this.formData.cus_id = selectedCus.cus_id;
      this.formData.cus_name = selectedCus.cus_name;
      this.formData.cus_address = selectedCus.cus_address;
      this.formData.cus_tel = selectedCus.cus_tel;
      this.formData.cus_email = selectedCus.cus_email;
      this.formData.cus_tax = selectedCus.cus_tax;
      this.formData.cus_purchase = selectedCus.cus_purchase;
      console.log(this.formData.cus_address);
      this.filteredItems = [];
    },
    updateCreditExpiredDate() {
      if (this.formData.sale_date && this.formData.credit_date_number) {
        const saleDate = this.formData.sale_date; // ได้ค่าเป็น Date Object อยู่แล้ว
        const creditDateNumber = parseInt(this.formData.credit_date_number);
        const creditExpiredDate = new Date(
          saleDate.getTime() + creditDateNumber * 24 * 60 * 60 * 1000
        );
        this.formData.credit_expired_date = creditExpiredDate;
      }
    },
    async handleEdit(row) {
      this.getQuotation();
      console.log("Edit item:", row);
      if (!this.shortcutAllow) {
        this.isPopupOpen = true;
      }
      this.isAddingMode = false;
      this.isEditMode = true;
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง

        // 🔹 ถ้าภาษาเป็น "th" (ไทย) ให้เพิ่ม 543 ปี
        if (this.t("lang") === "en") {
          d.setFullYear(d.getFullYear());
        }

        return d;
      };

      const quotationData = await this.getQuotationByID(row.sale_id);
      const quotation_img = await this.getQuotationImg(row.sale_number);

      console.log("quotation_img", quotation_img);

      if (!quotation_img || typeof quotation_img !== "string") {
        this.imageSrc = null;
        this.clearFile();
      } else {
        this.imageSrc = quotation_img; // มีรูป ก็แสดงได้เลย
      }

      // const formattedStart = formatDateForPicker(row.sale_date);
      // const formattedExpired = formatDateForPicker(row.credit_expired_date);

      const formattedStart = formatDateForPicker(
        quotationData.quotation_start_date
      );
      const formattedExpired = formatDateForPicker(
        quotationData.quotation_expired_date
      );

      this.cus_drop_down = row.cus_id;
      this.selectedCusName = row.cus_name;
      this.formData = {
        sale_id: row.sale_id,
        sale_number: row.sale_number,
        status: quotationData.status,
        employeeID: row.employeeID,
        employeeName: row.employee_name,
        cus_id: row.cus_id,
        cus_name: row.cus_name,
        cus_address: row.cus_address,
        cus_tel: row.cus_tel,
        cus_email: row.cus_email,
        cus_tax: row.cus_tax,
        cus_purchase: row.cus_purchase,
        sale_date: formattedStart,
        credit_date_number: row.credit_date_number,
        credit_expired_date: formattedExpired,
        sale_totalprice: row.sale_totalprice,
        remark: row.remark || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        remarkInfernal: row.remarkInfernal || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        discount_quotation: quotationData.discount_quotation,
        vatType: quotationData.vatType,
        remarkInfernal: quotationData.remarkInfernal,
      };

      if (this.t("lang") === "en") {
        this.creditDay = ["7  วัน", "14 วัน", "30 วัน", "60 วัน", "90 วัน"];
        this.formData.credit_date_number = row.credit_date_number.replace(
          "Days",
          "วัน"
        );
      } else {
        this.creditDay = [
          "7  Days",
          "14 Days",
          "30 Days",
          "60 Days",
          "90 Days",
        ];
        this.formData.credit_date_number = row.credit_date_number.replace(
          "วัน",
          "Days"
        );
      }
      this.productForms = (row.productForms || []).map((detail) => {
        const selectedProduct = this.Products.find(
          (product) => product.productID === detail.productID
        );
        console.log("selectedProduct", selectedProduct);
        let price = 0;

        if (selectedProduct) {
          price = this.formatDecimal(
            parseFloat(selectedProduct.price.toFixed(2))
          );
        }

        const salePrice = detail.sale_qty * parseFloat(price.replace(/,/g, ""));
        let saleDiscount = detail.sale_discount;
        if (detail.discounttype === "percent") {
          // sale_price = (detail.sale_discount / 100) * salePrice;
          saleDiscount = (detail.sale_discount / 100) * salePrice;
        }
        if (detail.product_detail !== "") {
          // detail.showDetails = true;
        }
        return {
          productID: detail.productID,
          price: price,
          sale_qty: detail.sale_qty,
          sale_price: this.formatDecimal(salePrice - saleDiscount),
          sale_discount: detail.sale_discount,
          discounttype: detail.discounttype,
          product_detail: detail.product_detail,
          pro_unti: detail.pro_unti,
          productName: selectedProduct.productname,
        };
      });

      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();

      // if (this.formData.vatType === "VATincluding") {
      //   this.formData.sale_totalprice = this.formatDecimal(
      //     parseFloat(this.formData.Net_price.replace(/,/g, "")) / 1.07
      //   );
      // }
      // if (this.formData.vatType === "VATincluding") {
      //   this.formData.sale_totalprice = this.formatDecimal(
      //     parseFloat(this.formData.Net_price.replace(/,/g, "")) * 1.07
      //   );
      //   this.formData.vat = this.formatDecimal(
      //     parseFloat(
      //       this.formData.sale_totalprice.replace(/,/g, "") -
      //         parseFloat(this.formData.total_price.replace(/,/g, ""))
      //     )
      //   );
      //   this.formData.vat = this.formatDecimal(
      //     parseFloat(this.formData.Net_price.replace(/,/g, "")) * 1.07 -
      //       parseFloat(this.formData.Net_price.replace(/,/g, ""))
      //   );
      //   // this.formData.vat = "555";
      // } else {
      //   this.formData.vat = this.formatDecimal(
      //     parseFloat(this.formData.Net_price.replace(/,/g, "")) * 0.07
      //   );
      //   this.formData.sale_totalprice = this.formatDecimal(
      //     parseFloat(this.formData.Net_price.replace(/,/g, "")) +
      //       parseFloat(this.formData.vat)
      //   );
      // }

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
            parseFloat(this.formData.vat.replace(/,/g, ""))
        );
      }
      this.isReadonly = true;
      this.isDisabled = true;
    },
    handlePreview(row) {
      console.log("Preview item:", row);
      this.viewformpdf("view", row);
      // this.isPopupPDFOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;

      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง
        return d;
      };
      const formattedStart = formatDateForPicker(row.quotation_start_date);
      const formattedExpired = formatDateForPicker(row.quotation_expired_date);
      this.cus_drop_down = row.cus_id;
      this.formData = {
        sale_id: row.sale_id,
        sale_number: row.sale_number,
        status: row.status,
        employeeID: row.employeeID,
        employeeName: row.employee_name,
        cus_id: row.cus_id,
        cus_name: row.cus_name,
        cus_address: row.cus_address,
        cus_tel: row.cus_tel,
        cus_email: row.cus_email,
        cus_tax: row.cus_tax,
        cus_purchase: row.cus_purchase,
        sale_date: formattedStart,
        credit_date_number: row.credit_date,
        credit_expired_date: formattedExpired,
        sale_totalprice: row.sale_totalprice,
        remark: row.remark || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        discount_quotation: row.discount_quotation,
      };

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
          discounttype: detail.discounttype,
        };
      });
      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();
    },
    handleDownload(row) {
      console.log("Edit item:", row);
      this.viewformpdf("download", row);
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง
        return d;
      };
      const formattedStart = formatDateForPicker(row.quotation_start_date);
      const formattedExpired = formatDateForPicker(row.quotation_expired_date);
      this.cus_drop_down = row.cus_id;
      this.formData = {
        sale_id: row.sale_id,
        sale_number: row.quotation_num,
        status: row.status,
        employeeID: row.employeeID,
        employeeName: row.employee_name,
        cus_id: row.cus_id,
        cus_name: row.cus_name,
        cus_address: row.cus_address,
        cus_tel: row.cus_tel,
        cus_email: row.cus_email,
        cus_tax: row.cus_tax,
        cus_purchase: row.cus_purchase,
        sale_date: formattedStart,
        credit_date_number: row.credit_date,
        credit_expired_date: formattedExpired,
        sale_totalprice: row.sale_totalprice,
        remark: row.remark || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
      };
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
          discounttype: detail.discounttype,
        };
      });

      this.updateTotalDiscount();
      this.totalNetPrice();
      this.vat_price();
      this.total_pricesale();
      this.total_priceBeforeDiscount();
    },
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = {
        sale_id: item.sale_id,
        sale_number: item.sale_number,
      };
    },
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    async handleAllow(row) {
      this.shortcutAllow = true;
      await this.handleEdit(row);
      // return false;
      if (this.formData.status === "Allowed") {
        const saleNumber = this.formData.sale_id; // "QT-2505080001"

        await this.deleteInvoice(saleNumber);
        await this.editQuotation3();
        this.openPopupAllow = true;
        this.showAllowButton = false;
        setTimeout(() => {
          this.openPopupAllow = false;
        }, 3000);
      } else if (this.formData.status === "expired") {
        alert("Quotation หมดอายุ");
      } else {
        await this.editQuotation2();
        setTimeout(() => {
          this.openPopupAllow = false;
        }, 3000);
      }
      this.shortcutAllow = false;
      return false;
      // this.isAllowConfirmPopupOpen = true;

      this.getQuotation();
      console.log("Edit item:", row);
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง

        // 🔹 ถ้าภาษาเป็น "th" (ไทย) ให้เพิ่ม 543 ปี
        if (this.t("lang") === "en") {
          d.setFullYear(d.getFullYear());
        }

        return d;
      };

      const quotationData = await this.getQuotationByID(row.sale_id);
      const quotation_img = await this.getQuotationImg(row.sale_number);

      console.log("quotationData", quotationData);

      if (quotation_img !== "") {
        this.imageSrc = quotation_img;
      }

      // const formattedStart = formatDateForPicker(row.sale_date);
      // const formattedExpired = formatDateForPicker(row.credit_expired_date);

      const formattedStart = formatDateForPicker(
        quotationData.quotation_start_date
      );
      const formattedExpired = formatDateForPicker(
        quotationData.quotation_expired_date
      );

      this.cus_drop_down = row.cus_id;
      this.selectedCusName = row.cus_name;
      this.formData = {
        sale_id: row.sale_id,
        sale_number: row.sale_number,
        status: quotationData.status,
        employeeID: row.employeeID,
        employeeName: row.employee_name,
        cus_id: row.cus_id,
        cus_name: row.cus_name,
        cus_address: row.cus_address,
        cus_tel: row.cus_tel,
        cus_email: row.cus_email,
        cus_tax: row.cus_tax,
        cus_purchase: row.cus_purchase,
        sale_date: formattedStart,
        credit_date_number: row.credit_date_number,
        credit_expired_date: formattedExpired,
        sale_totalprice: row.sale_totalprice,
        remark: row.remark || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        remarkInfernal: row.remarkInfernal || "", // จัดการค่า remark ให้เป็น string ว่างถ้าเป็น null
        discount_quotation: quotationData.discount_quotation,
        vatType: quotationData.vatType,
        remarkInfernal: quotationData.remarkInfernal,
      };

      if (this.t("lang") === "en") {
        this.creditDay = ["7  วัน", "14 วัน", "30 วัน", "60 วัน", "90 วัน"];
        this.formData.credit_date_number = row.credit_date_number.replace(
          "Days",
          "วัน"
        );
      } else {
        this.creditDay = [
          "7  Days",
          "14 Days",
          "30 Days",
          "60 Days",
          "90 Days",
        ];
        this.formData.credit_date_number = row.credit_date_number.replace(
          "วัน",
          "Days"
        );
      }
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
          // sale_price = (detail.sale_discount / 100) * salePrice;
          saleDiscount = (detail.sale_discount / 100) * salePrice;
        }
        if (detail.product_detail !== "") {
          // detail.showDetails = true;
        }
        return {
          productID: detail.productID,
          price: price,
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
      this.vat_price();
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
            parseFloat(this.formData.vat.replace(/,/g, ""))
        );
      }

      await this.editQuotation2();
    },
    closeAllowConfirmPopup() {
      this.isAllowConfirmPopupOpen = false;
    },
  },
  created() {
    this.getEmployee();
    this.getCustomer();
    this.getProduct();
    this.getBusiness();
    this.getQuotation();
    this.getBanks();
  },
};
</script>

