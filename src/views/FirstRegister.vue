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
import formConfig from '../config/field_config/first_register/form_first_register.json';

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
      fieldConfig: formConfig,
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
        user_first_name: "",
        user_last_name: "",
        user_phone: "",
        user_email: "",
        userPassword: "",
        bus_id: "",
        business_name: "",
        business_address: "",
        business_website: "",
        business_tel: "",
        business_tax: "",
        business_logo: "",
        bank_name: "",
        bank_account: "",
        bank_number: "",
        userPassword2: "",
        user_title: "",
      },
      isEmpty: {
        user_first_name: false,
        user_last_name: false,
        user_phone:false,
        user_email: false,
        userPassword: false,
        bus_id: false,
        business_name: false,
        business_address: false,
        business_website: false,
        business_tel: false,
        business_tax: false,
        business_logo: false,
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
        { label: this.t("emailHeaderTable"), key: "email" },
        { label: this.t("passwordHeaderTable"), key: "Password" },
        { label: this.t("roleHeaderTable"), key: "Role" },
      ];
    },
  },
  methods: {
    validateFormData() {
      let fieldsToCheck = [
        "user_title",
        "user_first_name",
        "user_last_name",
        "user_phone",
        "user_email",
        "userPassword",
        "userPassword2",
        "business_name",
        "business_address",
        "business_tel",
      ];
      this.formData.business_tel = this.formData.business_tel.replace(/-/g, "");
      this.formData.business_tax = this.formData.business_tax.replace(/-/g, "");
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
            (field === "user_phone" || field === "business_tel") &&
            !/^\d{9,10}$/.test(value)
          ) {
            this.isEmpty[field] = true;
            errorMessages.push(this.$t("validation.phone_invalid"));
          }
          if (
            field === "user_email" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ) {
            this.isEmpty.user_email = true;
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
          if (field === "business_tax" && value && !/^\d{10,13}$/.test(value)) {
            this.isEmpty.business_tax = true;
            errorMessages.push(this.$t("validation.tax_invalid"));
          }
        }
      });

      if (this.formData.business_tax !== "") {
        if (!/^\d{10,13}$/.test(this.formData.business_tax)) {
          this.isEmpty.business_tax = true;
          errorMessages.push(this.$t("validation.bus_txt_invalid"));
        }
      } else {
        this.isEmpty.business_tax = false;
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
        user_first_name: "",
        user_last_name: "",
        user_phone: "",
        user_email: "",
        userPassword: "",
        role_id: "",
        business_name: "",
        business_address: "",
        business_website: "",
        business_tel: "",
        business_tax: "",
        business_logo: "",
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
      formDataBusiness.append("user_first_name", this.formData.user_first_name);
      formDataBusiness.append("user_last_name", this.formData.user_last_name);
      formDataBusiness.append("user_phone", this.formData.user_phone);
      formDataBusiness.append(
        "user_email",
        this.formData.user_email.toLowerCase().trim()
      );
      formDataBusiness.append("userPassword", this.formData.userPassword);
      formDataBusiness.append("business_name", this.formData.business_name);
      formDataBusiness.append("business_address", this.formData.business_address);
      formDataBusiness.append("business_website", this.formData.business_website);
      formDataBusiness.append("business_tel", this.formData.business_tel);
      formDataBusiness.append("business_tax", this.formData.business_tax);
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
          this.isEmpty.user_email = true;
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
              user_email: this.formData.user_email.toLowerCase().trim(),
              userPassword: this.formData.userPassword,
            }),
          });
          const json = await response.json();
          if (response.ok) {
            localStorage.setItem("@accessToken", json.token);
            localStorage.setItem("role_name", json.role_name);
            localStorage.setItem("user_id", json.user_id);
            localStorage.setItem("user_name", json.user_first_name);
            localStorage.setItem("role_id", json.role_id);
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
