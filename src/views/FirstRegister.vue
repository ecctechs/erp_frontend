<template>
  <div class="forget-password-body">
    <div class="switch-lang-login">
      <Icon name="language_dark" class="me-4" />
      <div class="me-3">
        <div style="cursor: pointer" @click="toggleLanguage(t('headerLang'))">
          <a class="text-switch-lang-forgetpassword">{{ t("headerLang") }}</a>
        </div>
      </div>
    </div>
    <div class="expanded-content">
      <div
        v-if="isExpandedLanguage"
        class="dropdown-content"
        style="margin-top: 0px !important"
      >
        <p @click="setLanguage('th')">TH</p>
        <p @click="setLanguage('en')">EN</p>
      </div>
    </div>
    <div class="page-body-forgetpassword">
      <h2 style="width: 80%">{{ t("register") }}</h2>
      <!-- <div class="Register-contain">
        <h5 style="text-decoration: underline">{{ t("userform") }}</h5>
        <form class="row g-3">
          <div class="col-md-2">
            <Dropdown
              v-model="formData.user_title"
              :options="titleOptions"
              :label="t('title')"
              :error="isEmpty.user_title"
              :required="true"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label"
              ><span style="color: red">*</span>{{ t("firstname") }}</label
            >
            <input
              v-model="formData.userF_name"
              type="text"
              class="form-control"
              required
              maxlength="50"
              :class="{ error: isEmpty.userF_name }"
            />
          </div>
          <div class="col-md-6">
            <label for="inputPassword4" class="form-label"
              ><span style="color: red">*</span>{{ t("lastname") }}</label
            >
            <input
              v-model="formData.userL_name"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userL_name }"
            />
          </div>
          <div class="col-6">
            <label for="inputAddress" class="form-label"
              ><span style="color: red">*</span>{{ t("phoneNum") }}</label
            >
            <input
              v-model="formData.userPhone"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userPhone }"
              @keypress="validateInput"
              maxlength="10"
            />
          </div>
          <div class="col-6">
            <label class="form-label"
              ><span style="color: red">*</span>{{ t("email") }}</label
            >
            <input
              v-model="formData.userEmail"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userEmail }"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label"
              ><span style="color: red">*</span>{{ t("password") }}</label
            >
            <div class="input-group mb-3">
              <input
                :type="showPassword2 ? 'text' : 'password'"
                class="form-control"
                :class="{ error: isEmpty.userPassword }"
                aria-label="Password"
                aria-describedby="basic-addon2"
                v-model="formData.userPassword"
              />
              <Button
                customClass="btn btn-outline-secondary"
                type="button"
                @click="togglePassword2"
              >
                <Icon
                  :name="
                    showPassword2 ? 'mdi-eye-off-outline' : 'mdi-eye-circle'
                  "
                />
              </Button>
            </div>
          </div>
          <div class="col-md-6">
            <label for="inputCity" class="form-label"
              ><span style="color: red">*</span
              >{{ t("comfrimpassword") }}</label
            >
            <div class="input-group mb-3">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ error: isEmpty.userPassword2 }"
                aria-label="Comfirm Password"
                aria-describedby="basic-addon2"
                v-model="formData.userPassword2"
              />
              <Button
                customClass="btn btn-outline-secondary"
                type="button"
                @click="togglePassword"
              >
                <span
                  :class="
                    showPassword
                      ? 'mdi mdi-eye-off-outline'
                      : 'mdi mdi-eye-circle'
                  "
                ></span>
              </Button>
            </div>
          </div>
          <h5 style="text-decoration: underline">{{ t("businessform") }}</h5>
          <div class="col-md-6">
            <label class="form-label"
              ><span style="color: red">*</span>{{ t("customerName") }}</label
            >
            <input
              class="form-control"
              v-model="formData.bus_name"
              :class="{ error: isEmpty.bus_name }"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ t("companyWebsite") }}</label>
            <input
              class="form-control"
              v-model="formData.bus_website"
              :class="{ error: isEmpty.bus_website }"
            />
          </div>
          <div class="col-md-12">
            <label class="form-label"
              ><span style="color: red">*</span>{{ t("address") }}</label
            >
            <input
              class="form-control"
              v-model="formData.bus_address"
              :class="{ error: isEmpty.bus_address }"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label"
              ><span style="color: red">*</span>{{ t("companyPhone") }}</label
            >
            <input
              class="form-control"
              v-model="formData.bus_tel"
              :class="{ error: isEmpty.bus_tel }"
              @keypress="validateInput"
              maxlength="10"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ t("taxID") }}</label>
            <input
              class="form-control"
              v-model="formData.bus_tax"
              :class="{ error: isEmpty.bus_tax }"
              @keypress="validateInput"
              maxlength="13"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ t("companyPhone2") }}</label>
            <input
              class="form-control"
              :class="{ error: inputError }"
              @keypress="validateInput"
              maxlength="6"
            />
          </div>
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <label class="form-label">{{ t("companyLogo") }}</label>
            <input
              type="file"
              class="form-control"
              @change="handleFileUpload"
              ref="fileInput"
            />
            <img
              v-if="exp_files != ''"
              :src="exp_files"
              alt="Uploaded Image"
              class="image_exp"
            />
          </div>
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <Dropdown
              v-model="formData.bank_name"
              :options="bankOptions"
              :label="t('bankname')"
              :error="isEmpty.bank_name"
              placeholder="กรุณาเลือกธนาคาร"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ t("bankAccName") }}</label>
            <input
              class="form-control"
              v-model="formData.bank_account"
              :class="{ error: isEmpty.bank_account }"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ t("bankaccount") }}</label>
            <input
              class="form-control"
              v-model="formData.bank_number"
              :class="{ error: isEmpty.bank_number }"
              @keypress="validateInput"
              maxlength="15"
            />
          </div>
        </form>

        <div class="mt-3">
          <div class="row"></div>
          <div
            v-if="isLoading"
            class="d-flex justify-content-center align-items-center"
          >
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
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
        <div class="modal-footer top-table-for-filter">
          <Button customClass="btn btn-secondary" @click="BacktoLogin">
            {{ t("backtologinbutton") }}
          </Button>

          <Button
            :disabled="isLoading"
            customClass="btn btn-primary me-3"
            @click="RegisterNewUsers"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t("register") }}</span>
          </Button>
        </div>
      </div> -->
      <div class="Register-contain">
  <h5 style="text-decoration: underline">{{ t("userform") }}</h5>
  <form class="row g-3">
    <div v-for="field in userFields" :key="field.key" :class="field.col">
      
      <Dropdown
        v-if="field.componentType === 'Dropdown'"
        v-model="formData[field.key]"
        :options="this[field.options]"
        :label="t(field.label)"
        :error="isEmpty[field.key]"
        :required="field.required"
      />
      
      <div v-else-if="field.componentType === 'Password'">
        <label class="form-label">
          <span v-if="field.required" style="color: red">*</span>{{ t(field.label) }}
        </label>
        <div class="input-group">
          <TextField
            :type="field.key === 'userPassword' ? (showPassword2 ? 'text' : 'password') : (showPassword ? 'text' : 'password')"
            :class="{ error: isEmpty[field.key] }"
            v-model="formData[field.key]"
          />
          <Button
            customClass="btn btn-outline-secondary"
            type="button"
            @click="field.key === 'userPassword' ? togglePassword2() : togglePassword()"
          >
            <Icon v-if="field.key === 'userPassword'" :name="showPassword2 ? 'mdi-eye-off-outline' : 'mdi-eye-circle'" />
            <Icon v-else :name="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-circle'" />
          </Button>
        </div>
      </div>

      <div v-else>
        <label class="form-label">
          <span v-if="field.required" style="color: red">*</span>{{ t(field.label) }}
        </label>
        <TextField
          v-model="formData[field.key]"
          :type="field.type"
          :maxlength="field.maxlength"
          :class="{ error: isEmpty[field.key] }"
          @keypress="field.isNumeric ? validateInput($event) : null"
        />
      </div>
    </div>

    <h5 style="text-decoration: underline; width: 100%; margin-top: 1rem;">{{ t("businessform") }}</h5>
    
    <div v-for="field in businessFields" :key="field.key" :class="field.col">
        
        <Dropdown
            v-if="field.componentType === 'Dropdown'"
            v-model="formData[field.key]"
            :options="this[field.options]"
            :label="t(field.label)"
            :error="isEmpty[field.key]"
            :required="field.required"
            :placeholder="field.placeholder"
        />

        <div v-else-if="field.componentType === 'Upload'">
            <label class="form-label">{{ t(field.label) }}</label>
            <TextField
                type="file"
                @change="handleFileUpload"
                ref="fileInput"
            />
            <img
                v-if="exp_files != ''"
                :src="exp_files"
                alt="Uploaded Image"
                class="image_exp"
            />
        </div>

        <div v-else>
            <label class="form-label">
                <span v-if="field.required" style="color: red">*</span>{{ t(field.label) }}
            </label>
            <TextField
                v-model="formData[field.key]"
                :type="field.type"
                :maxlength="field.maxlength"
                :class="{ error: isEmpty[field.key] }"
                @keypress="field.isNumeric ? validateInput($event) : null"
            />
        </div>
    </div>
  </form>

        <div class="mt-3">
          <div class="row"></div>
          <div
            v-if="isLoading"
            class="d-flex justify-content-center align-items-center"
          >
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
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
        <div class="modal-footer top-table-for-filter">
          <Button customClass="btn btn-secondary" @click="BacktoLogin">
            {{ t("backtologinbutton") }}
          </Button>

          <Button
            :disabled="isLoading"
            customClass="btn btn-primary me-3"
            @click="RegisterNewUsers"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t("register") }}</span>
          </Button>
        </div>
  </div>

      <div v-if="isPopupVisible" class="popup-success">
        <div class="popup-content-success">
          <a>{{ popupMessage }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from "../../constant.js";
import UserList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import Button from "../components/button.vue"; // 1. นำเข้า component
import { useI18n } from "vue-i18n";
import { watchEffect } from "vue";
import Dropdown from "../components/dropdown.vue";
import Icon from "../components/icon.vue";
import TextField from "../components/textField.vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  components: {
    UserList,
    Popup,
    Button, // 2. ลงทะเบียน component
    Dropdown,
    Icon,
    TextField
  },
  setup() {
    const { t, locale } = useI18n();

    const setLanguage = (newLang) => {
      locale.value = newLang;
      localStorage.setItem("lang", newLang);
    };

    watchEffect(() => {
      const storedLang = localStorage.getItem("lang");
      if (storedLang) {
        locale.value = storedLang;
      }
    });

    return {
      t,
      setLanguage,
      locale,
    };
  },
  data() {
    return {
      fieldConfig: [
        { key: 'user_title', label: 'title', group: 'user', componentType: 'Dropdown', required: true, col: 'col-md-2', options: 'titleOptions' },
        { key: 'userF_name', label: 'firstname', group: 'user', componentType: 'TextField', type: 'text', required: true, col: 'col-md-4', maxlength: 50 },
        { key: 'userL_name', label: 'lastname', group: 'user', componentType: 'TextField', type: 'text', required: true, col: 'col-md-6' },
        { key: 'userPhone', label: 'phoneNum', group: 'user', componentType: 'TextField', type: 'tel', required: true, col: 'col-6', maxlength: 10, isNumeric: true },
        { key: 'userEmail', label: 'email', group: 'user', componentType: 'TextField', type: 'email', required: true, col: 'col-6' },
        { key: 'userPassword', label: 'password', group: 'user', componentType: 'Password', required: true, col: 'col-md-6' },
        { key: 'userPassword2', label: 'comfrimpassword', group: 'user', componentType: 'Password', required: true, col: 'col-md-6' },
        { key: 'bus_name', label: 'customerName', group: 'business', componentType: 'TextField', type: 'text', required: true, col: 'col-md-6' },
        { key: 'bus_website', label: 'companyWebsite', group: 'business', componentType: 'TextField', type: 'text', required: false, col: 'col-md-6' },
        { key: 'bus_address', label: 'address', group: 'business', componentType: 'TextField', type: 'text', required: true, col: 'col-md-12' },
        { key: 'bus_tel', label: 'companyPhone', group: 'business', componentType: 'TextField', type: 'tel', required: true, col: 'col-md-6', maxlength: 10, isNumeric: true },
        { key: 'bus_tax', label: 'taxID', group: 'business', componentType: 'TextField', type: 'tel', required: false, col: 'col-md-6', maxlength: 13, isNumeric: true },
        { key: 'bus_logo', label: 'companyLogo', group: 'business', componentType: 'Upload', required: false, col: 'col-md-6' },
        { key: 'bank_name', label: 'bankname', group: 'business', componentType: 'Dropdown', required: false, col: 'col-md-6', options: 'bankOptions', placeholder: 'กรุณาเลือกธนาคาร' },
        { key: 'bank_account', label: 'bankAccName', group: 'business', componentType: 'TextField', type: 'text', required: false, col: 'col-md-6' },
        { key: 'bank_number', label: 'bankaccount', group: 'business', componentType: 'TextField', type: 'tel', required: false, col: 'col-md-6', maxlength: 15, isNumeric: true },
      ],
      errorMessages: [],
      isPopupVisible_error: false,
      Business: [],
      bus_data: [],
      Image_bus: [],
      exp_files: [],
      isShowing: true,
      isEditMode: false,
      isLoading: false,
      isPopupVisible: false,
      formData: {
        userF_name: "",
        userL_name: "",
        userPhone: "",
        userEmail: "",
        userPassword: "",
        bus_id: "",
        bus_name: "",
        bus_address: "",
        bus_website: "",
        bus_tel: "",
        bus_tax: "",
        bus_logo: "",
        bank_name: "",
        bank_account: "",
        bank_number: "",
        userPassword2: "",
        user_title: "",
      },
      isEmpty: {
        userF_name: false,
        userL_name: false,
        userPhone:false,
        userEmail: false,
        userPassword: false,
        bus_id: false,
        bus_name: false,
        bus_address: false,
        bus_website: false,
        bus_tel: false,
        bus_tax: false,
        bus_logo: false,
        bank_name: false,
        bank_account: false,
        bank_number: false,
        userPassword2: false,
        user_title: false,
      },
      isExpandedLanguage: false,
      showPassword: false,
      showPassword2: false,
    };
  },
  computed: {
  userFields() {
      return this.fieldConfig.filter(f => f.group === 'user');
    },
    businessFields() {
      return this.fieldConfig.filter(f => f.group === 'business');
    },
    titleOptions() {
      return [
        { value: "Mr.", text: this.t("mister") },
        { value: "Mrs.", text: this.t("missis") },
        { value: "Miss", text: this.t("miss") },
      ];
    },
    bankOptions() {
      return [
        { value: "ธนาคารกรุงเทพ", text: "ธนาคารกรุงเทพ (BBL)" },
        { value: "ธนาคารกสิกรไทย", text: "ธนาคารกสิกรไทย (KBANK)" },
        { value: "ธนาคารกรุงไทย", text: "ธนาคารกรุงไทย (KTB)" },
        { value: "ธนาคารไทยพาณิชย์", text: "ธนาคารไทยพาณิชย์ (SCB)" },
        { value: "ธนาคารกรุงศรีอยุธยา", text: "ธนาคารกรุงศรีอยุธยา (BAY)" },
        { value: "ธนาคารทหารไทย", text: "ธนาคารทหารไทย (TMB)" },
        { value: "ธนาคารธนชาต", text: "ธนาคารธนชาต (TBANK)" },
        { value: "ธนาคารเกียรตินาคิน", text: "ธนาคารเกียรตินาคิน (KK)" },
        { value: "ธนาคารทิสโก้", text: "ธนาคารทิสโก้ (TISCO)" },
        { value: "ธนาคารซีไอเอ็มบีไทย", text: "ธนาคารซีไอเอ็มบีไทย (CIMBT)" },
        { value: "ธนาคารแลนด์แอนด์เฮ้าส", text: "ธนาคารแลนด์แอนด์เฮ้าส (LH)" },
        { value: "ธนาคารยูโอบี", text: "ธนาคารยูโอบี (UOB)" },
        {
          value: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
          text: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (BACC)",
        },
        { value: "ธนาคารไอซีบซี", text: "ธนาคารไอซีบซี (ICBC)" },
        { value: "ธนาคารไอซีบีซี (ไทย)", text: "ธนาคารไอซีบีซี (ไทย)" },
        { value: "ธนาคารออมสิน", text: "ธนาคารออมสิน (GSB)" },
      ];
    },
    tableHeaders() {
      return [
        { label: this.t("firstNameHeaderTable"), key: "First name" },
        { label: this.t("lastNameHeaderTable"), key: "Last name" },
        { label: this.t("phoneNumberHeaderTable"), key: "Phone number" },
        { label: this.t("emailHeaderTable"), key: "Email" },
        { label: this.t("passwordHeaderTable"), key: "Password" },
        { label: this.t("roleHeaderTable"), key: "Role" },
      ];
    },
  },
  methods: {
    validateFormData() {
      let fieldsToCheck = [
        "user_title",
        "userF_name",
        "userL_name",
        "userPhone",
        "userEmail",
        "userPassword",
        "userPassword2",
        "bus_name",
        "bus_address",
        "bus_tel",
      ];
      this.formData.bus_tel = this.formData.bus_tel.replace(/-/g, "");
      this.formData.bus_tax = this.formData.bus_tax.replace(/-/g, "");
      this.formData.bank_number = this.formData.bank_number.replace(/-/g, "");
      fieldsToCheck.forEach((field) => {
        this.isEmpty[field] = false;
      });

      let errorMessages = [];
      const password = this.formData.userPassword?.toString() || "";
      this.isEmpty.userPassword = false;

      fieldsToCheck.forEach((field) => {
        const value = this.formData[field]?.toString().trim();
        if (!value) {
          this.isEmpty[field] = true;
          errorMessages.push(this.$t(`validation.${field}`));
        } else {
          if (
            (field === "userPhone" || field === "bus_tel") &&
            !/^\d{9,10}$/.test(value)
          ) {
            this.isEmpty[field] = true;
            errorMessages.push(this.$t("validation.phone_invalid"));
          }
          if (
            field === "userEmail" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ) {
            this.isEmpty.userEmail = true;
            errorMessages.push(this.$t("validation.email_invalid"));
          }
          if (field === "userPassword") {
            const password = value;
            if (password.length < 12) {
              this.isEmpty.userPassword = true;
              errorMessages.push(this.$t("validation.password_min_length"));
            }
            if (!/\d/.test(password)) {
              this.isEmpty.userPassword = true;
              errorMessages.push(this.$t("validation.password_number"));
            }
            if (password.toLowerCase() === password) {
              this.isEmpty.userPassword = true;
              errorMessages.push(this.$t("validation.password_uppercase"));
            }
            if (password.toUpperCase() === password) {
              this.isEmpty.userPassword = true;
              errorMessages.push(this.$t("validation.password_lowercase"));
            }
          }
          if (field === "bank_number" && !/^\d{10,13}$/.test(value)) {
            this.isEmpty.bank_number = true;
            errorMessages.push(this.$t("validation.bank_account_invalid"));
          }
          if (field === "bus_tax" && value && !/^\d{10,13}$/.test(value)) {
            this.isEmpty.bus_tax = true;
            errorMessages.push(this.$t("validation.tax_invalid"));
          }
        }
      });

      if (this.formData.bus_tax !== "") {
        if (!/^\d{10,13}$/.test(this.formData.bus_tax)) {
          this.isEmpty.bus_tax = true;
          errorMessages.push(this.$t("validation.bus_txt_invalid"));
        }
      } else {
        this.isEmpty.bus_tax = false;
      }

      if (
        this.formData.userPassword &&
        this.formData.userPassword2 &&
        this.formData.userPassword !== this.formData.userPassword2
      ) {
        this.isEmpty.userPassword = true;
        this.isEmpty.userPassword2 = true;
        errorMessages.push("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
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
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    togglePassword2() {
      this.showPassword2 = !this.showPassword2;
    },
    toggleLanguage(lang) {
      if (lang === "EN") {
        this.setLanguage("th");
      } else {
        this.setLanguage("en");
      }
    },
    BacktoLogin() {
      this.$router.push("/login");
    },
    handleClearInput() {
      this.formData = {
        userF_name: "",
        userL_name: "",
        userPhone: "",
        userEmail: "",
        userPassword: "",
        RoleID: "",
        bus_name: "",
        bus_address: "",
        bus_website: "",
        bus_tel: "",
        bus_tax: "",
        bus_logo: "",
        bank_name: "",
        bank_account: "",
        bank_number: "",
      };
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    handleFileUpload(event) {
      this.errorMessages = [];
      const file = event.target.files[0];
      if (!file) return;
      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessages.push(this.$t("validation.validateImgOnly"));
        this.showPopup_validate(this.errorMessages);
        this.$refs.fileInput.value = "";
        this.Image_bus = [];
        this.exp_files = [];
        return;
      }
      this.Image_bus = event.target.files[0];
      const Image_file = this.Image_bus;
      console.log("Selected file:", Image_file);
      if (Image_file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.exp_files = e.target.result;
        };
        reader.readAsDataURL(Image_file);
      }
    },
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      this.isPopupVisible_error = false;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
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
    async RegisterNewUsers() {
      if (!this.validateFormData()) return;
      this.isLoading = true;
      const formDataBusiness = new FormData();
      formDataBusiness.append("user_title", this.formData.user_title);
      formDataBusiness.append("userF_name", this.formData.userF_name);
      formDataBusiness.append("userL_name", this.formData.userL_name);
      formDataBusiness.append("userPhone", this.formData.userPhone);
      formDataBusiness.append(
        "userEmail",
        this.formData.userEmail.toLowerCase().trim()
      );
      formDataBusiness.append("userPassword", this.formData.userPassword);
      formDataBusiness.append("bus_name", this.formData.bus_name);
      formDataBusiness.append("bus_address", this.formData.bus_address);
      formDataBusiness.append("bus_website", this.formData.bus_website);
      formDataBusiness.append("bus_tel", this.formData.bus_tel);
      formDataBusiness.append("bus_tax", this.formData.bus_tax);
      if (this.Image_bus) {
        formDataBusiness.append("file", this.Image_bus);
      }
      formDataBusiness.append("bank_name", this.formData.bank_name);
      formDataBusiness.append("bank_account", this.formData.bank_account);
      formDataBusiness.append("bank_number", this.formData.bank_number);
      for (var pair of formDataBusiness.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      console.log("formDataBusiness", formDataBusiness);
      try {
        const response = await fetch(`${API_CALL}/auth/RegisterNewUsers`, {
          method: "POST",
          body: formDataBusiness,
        });
        const json = await response.json();
        console.log(json);
        if (json.data === "User already exists") {
          this.errorMessages = [];
          this.isEmpty.userEmail = true;
          this.errorMessages.push(this.$t("validation.User_already_exists"));
          this.showPopup_validate(this.errorMessages);
        }
        if (json.statusCode === 200) {
          this.showPopup(this.$t("validation.AddSucc"));
          console.log("Add success");
          const response = await fetch(`${API_CALL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: this.formData.userEmail.toLowerCase().trim(),
              userPassword: this.formData.userPassword,
            }),
          });
          const json = await response.json();
          if (response.ok) {
            localStorage.setItem("@accessToken", json.token);
            localStorage.setItem("RoleName", json.RoleName);
            localStorage.setItem("user_id", json.userID);
            localStorage.setItem("user_name", json.userF_name);
            localStorage.setItem("RoleID", json.RoleID);
            localStorage.setItem("TokenCreate", json.TokenCreate);
            if (localStorage.getItem("@accessToken")) {
              console.log("Login successful:", json);
              this.$router.push("/home");
            } else {
              this.showPopup_error(json.data);
              this.$router.push("/");
            }
          } else {
            this.showPopup_error(`Login failed: ${json.data}`);
          }
          this.handleClearInput();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Add failed: Unexpected error occurred.");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
