<template>
  <div class="border p-4 mb-3">
    <div class="Register-contain" style="padding: 20px; width: unset">
      <h5 style="text-decoration-line: underline">
        <span v-if="isEditable" style="color: red">*</span>{{ t("product") }}
      </h5>
      <div v-if="isEditable" class="mb-3">
        <button class="round-button btn btn-primary" @click="addProductRow">+</button>
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
              <th v-if="isEditable" class="action-column"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(form, index) in modelValue" :key="index">
              <td class="product-name-column">
                <div class="relative-wrapper">
                  <label>
                    <input
                      list="browsers2"
                      class="form-control"
                      v-model="form.productName"
                      @input="emitProductChange(form, index)"
                      :disabled="!isEditable"
                      autoComplete="off"
                    />
                  </label>
                  <datalist id="browsers2">
                    <option
                      v-for="item in productsList"
                      :key="item.product_id"
                      :value="item.productname"
                    ></option>
                  </datalist>
                  <a v-if="isEditable" class="text-muted" href="javascript:void(0)" @click="form.showDetails = !form.showDetails">
                    <div>เพิ่มรายละเอียดสินค้า</div>
                  </a>
                  <textarea
                    v-if="form.showDetails || form.product_detail"
                    class="form-control"
                    v-model="form.product_detail"
                    :disabled="!isEditable"
                    rows="3"
                  ></textarea>
                </div>
              </td>

              <td class="price-column">
                <input
                  class="form-control"
                  :class="{ 'readonly': isPriceLocked(form.productName) }"
                  :value="priceBeingEditedIndex === index ? form.price : getFormattedPrice(form.price)"
                  @input="updatePrice($event, form)"
                  @focus="priceBeingEditedIndex = index"
                  @blur="priceBeingEditedIndex = null"
                  @keypress="validateNumeric($event)"
                  :readonly="isPriceLocked(form.productName)"
                  :disabled="!isEditable || isPriceLocked(form.productName)"
                  type="number"
                />
              </td>

              <td class="quantity-column">
                <input
                  class="form-control"
                  v-model="form.sale_qty"
                  @input="emitProductChange(form, index)"
                  @keypress="validateNumeric($event)"
                  :disabled="!isEditable"
                  type="number"
                />
              </td>

              <td class="unit-column">
                <input
                  class="form-control"
                  v-model="form.pro_unti"
                  maxlength="30"
                  :disabled="!isEditable"
                />
              </td>

              <td class="discount-column">
                <div class="discount-type">
                  <Dropdown
                    v-model="form.discounttype"
                    :options="discountTypeOptions"
                    @change="emitProductChange(form, index)"
                    :disabled="!isEditable"
                    style="border-top-right-radius: 0px; border-bottom-right-radius: 0px; min-width: 155px;"
                  />
                  <input
                    style="min-width: 100px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
                    class="form-control"
                    v-model="form.sale_discount"
                    min="0"
                    @input="emitProductChange(form, index)"
                    @keypress="validateNumeric($event)"
                    :disabled="!isEditable"
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

              <td v-if="isEditable" class="action-column">
                <Button
                  customClass="btn btn-danger mdi mdi-trash-can-outline"
                  @click="removeProductRow(index)"
                ></Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Dropdown from './dropdown.vue';
import Button from './button.vue';

const { t } = useI18n();

const props = defineProps({
  modelValue: { type: Array, required: true },
  productsList: { type: Array, default: () => [] },
  isEditable: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'product-change']);

const priceBeingEditedIndex = ref(null);

const discountTypeOptions = computed(() => [
    { value: "amount", text: t("productDiscountTypeAmount") },
    { value: "percent", text: t("productDiscountTypePercent") },
]);

function validateNumeric(event) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode === 46 && event.target.value.includes('.')) {
      event.preventDefault();
  }
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault();
  }
}

function isPriceLocked(productName) {
  if (!productName || !props.productsList) return false;
  return props.productsList.some(p => p.productname === productName);
}

function getFormattedPrice(value) {
  if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
    return '';
  }
  return Number(value).toLocaleString('en-US');
}

function updatePrice(event, form) {
  const rawValue = event.target.value.replace(/,/g, '');
  form.price = rawValue;
  emit('product-change', form);
}

function emitProductChange(form, index) {
    emit('product-change', form, index);
}

function addProductRow() {
  const newProduct = {
    product_id: "", price: 0, sale_qty: 1, sale_price: "0.00",
    sale_discount: 0, discounttype: "amount", productName: "",
    product_detail: "", pro_unti: "", showDetails: false,
  };
  const updatedValue = [...props.modelValue, newProduct];
  emit('update:modelValue', updatedValue);
}

function removeProductRow(index) {
  const updatedValue = [...props.modelValue];
  updatedValue.splice(index, 1);
  emit('update:modelValue', updatedValue);
  // ✅ ส่ง event แจ้ง Parent component ว่าข้อมูลเปลี่ยน
  emit('product-change', {}, -1); 
}
</script>