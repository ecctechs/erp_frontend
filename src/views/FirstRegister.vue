<template>
  <div class="forget-password-body">
    <div class="switch-lang-login">
      <div class="icon_language_dark me-4"></div>
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
          <div class="col-md-2">
            <label class="form-label"
              ><span style="color: red">*</span>{{ t("title") }}</label
            >
            <select
              class="form-control col-sm-9 col-md-6 form-select"
              v-model="formData.user_title"
              required
              :class="{ error: isEmpty.user_title }"
            >
              <option value="Mr.">{{ t("mister") }}</option>
              <option value="Mrs.">{{ t("missis") }}</option>
              <option value="Miss">{{ t("miss") }}</option>
            </select>
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
              <button
                class="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                @click="togglePassword2"
              >
                <span
                  :class="
                    showPassword2
                      ? 'mdi mdi-eye-off-outline'
                      : 'mdi mdi-eye-circle'
                  "
                ></span>
              </button>
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
              <button
                class="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                @click="togglePassword"
              >
                <span
                  :class="
                    showPassword
                      ? 'mdi mdi-eye-off-outline'
                      : 'mdi mdi-eye-circle'
                  "
                ></span>
              </button>
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
            <!-- <div class="input-group input-upload-custom">
              <label class="input-group-text btn btn-primary">
                {{ t("SelectImage") }}
                <input type="file" hidden @change="handleFileUpload" />
              </label>
              <input
                type="text"
                class="form-control"
                :value="fileName || t('FileImageName')"
                readonly
              />
            </div> -->
            <img
              v-if="exp_files != ''"
              :src="exp_files"
              alt="Uploaded Image"
              class="image_exp"
            />

            <!-- <div class="input-group input-upload-custom">
              <label class="input-group-text btn btn-primary">
                {{ t("SelectImage") }}
                <input type="file" hidden @change="previewImage" />
              </label>
              <input
                type="text"
                class="form-control"
                :value="fileName || t('FileImageName')"
                @change="handleFileUpload"
                ref="fileInput"
                readonly
              />
              <img
                v-if="exp_files != ''"
                :src="exp_files"
                alt="Uploaded Image"
                class="image_exp"
              />
            </div> -->
          </div>
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <label class="form-label">{{ t("bankname") }}</label>
            <select
              class="form-select"
              aria-label="Default select example"
              v-model="formData.bank_name"
              :class="{ error: isEmpty.bank_name }"
            >
              <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ (BBL)</option>
              <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย (KBANK)</option>
              <option value="ธนาคารกรุงไทย">ธนาคารกรุงไทย (KTB)</option>
              <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์ (SCB)</option>
              <option value="ธนาคารกรุงศรีอยุธยา">
                ธนาคารกรุงศรีอยุธยา (BAY)
              </option>
              <option value="ธนาคารทหารไทย">ธนาคารทหารไทย (TMB)</option>
              <option value="ธนาคารธนชาต">ธนาคารธนชาต (TBANK)</option>
              <option value="ธนาคารเกียรตินาคิน">
                ธนาคารเกียรตินาคิน (KK)
              </option>
              <option value="ธนาคารทิสโก้">ธนาคารทิสโก้ (TISCO)</option>
              <option value="ธนาคารซีไอเอ็มบีไทย">
                ธนาคารซีไอเอ็มบีไทย (CIMBT)
              </option>
              <option value="ธนาคารแลนด์แอนด์เฮ้าส">
                ธนาคารแลนด์แอนด์เฮ้าส (LH)
              </option>
              <option value="ธนาคารยูโอบี">ธนาคารยูโอบี (UOB)</option>
              <option value="ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร">
                ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (BACC)
              </option>
              <option value="ธนาคารไอซีบซี">ธนาคารไอซีบซี (ICBC)</option>
              <option value="ธนาคารไอซีบีซี (ไทย)">ธนาคารไอซีบีซี (ไทย)</option>
              <option value="ธนาคารออมสิน">ธนาคารออมสิน (GSB)</option>
            </select>
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

        <!-- <h5 style="text-decoration: underline">{{ t("businessform") }}</h5> -->
        <div class="mt-3">
          <div class="row">
            <!-- <div class="col-md-1 col-form-label mb-3">
              <label class="col-sm-5 col-md-6">{{ t("customerName") }}</label>
            </div>
            <div class="col-md-5 mb-3">
              <input
                class="form-control"
                v-model="formData.bus_name"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- <div class="col-md-1 col-form-label mb-3">
              <label class="col-sm-5 col-md-6">{{ t("companyWebsite") }}</label>
            </div>
            <div class="col-md-5 mb-3">
              <input
                class="form-control"
                v-model="formData.bus_website"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- </div> -->
            <!-- <div> -->
            <!-- <div class="row"> -->
            <!-- <div class="col-md-1 col-form-label mb-3">
                <label class="col-sm-5 col-md-6">{{ t("address") }}</label>
              </div>
              <div class="col-md-5 mb-3">
                <input
                  class="form-control"
                  v-model="formData.bus_address"
                  :class="{ error: inputError }"
                />
              </div> -->
            <!-- </div> -->
            <!-- <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("customerName") }}</label>
              <input
                class="form-control"
                v-model="formData.bus_name"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("address") }}</label>

              <input
                class="form-control"
                v-model="formData.bus_address"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("companyWebsite") }}</label>

              <input
                class="form-control"
                v-model="formData.bus_website"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("companyPhone") }}</label>

              <input
                class="form-control"
                v-model="formData.bus_tel"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("taxID") }}</label>

              <input
                class="form-control"
                v-model="formData.bus_tax"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("companyLogo") }}</label>

              <br />
              <input type="file" @change="handleFileUpload" />
              <br />
              <img
                v-if="exp_files != ''"
                :src="exp_files"
                alt="Uploaded Image"
                class="image_exp"
              />
            </div> -->
            <!-- <div class="mb-3 mt-3 edit_about">
              <label class="col-sm-5 col-md-6">{{ t("bankname") }}</label>

              <input
                class="form-control"
                v-model="formData.bank_name"
                :class="{ error: inputError }"
              />
            </div>
            <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("bankAccName") }}</label>

              <input
                class="form-control"
                v-model="formData.bank_account"
                :class="{ error: inputError }"
              />
            </div> -->
            <!-- <div class="mb-3 mt-3">
              <label class="col-sm-5 col-md-6">{{ t("bankaccount") }}</label>

              <input
                class="form-control"
                v-model="formData.bank_number"
                :class="{ error: inputError }"
              />
            </div> -->
          </div>
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
          <!-- <div v-if="isPopupVisible_error" class="popup-success">
            <div class="popup-content-error">
              <a>{{ popupMessage_error }}</a>
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
              <ul>
                <li v-for="(msg, index) in errorMessages" :key="index">
                  {{ msg }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer top-table-for-filter">
          <button class="btn btn-secondary" @click="BacktoLogin">
            {{ t("backtologinbutton") }}
          </button>
          <!-- <button class="btn btn-primary" @click="RegisterNewUsers">
            {{ t("register") }}
          </button> -->

          <button
            :disabled="isLoading"
            class="btn btn-primary me-3"
            @click="RegisterNewUsers"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t("register") }}</span>
          </button>
        </div>
      </div>

      <div v-if="isPopupVisible" class="popup-success">
        <div class="popup-content-success">
          <a>{{ popupMessage }}</a>
        </div>
      </div>
      <!-- <div v-if="isPopupVisible_error" class="popup-success">
        <div class="popup-content-error">
          <a>{{ popupMessage_error }}</a>
        </div>
      </div> -->
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
</template>

<script>
import { config } from "../../constant.js";
import UserList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { useI18n } from "vue-i18n"; //for switch language
import { watchEffect } from "vue";

const API_CALL = config["url"]; // API base URL
const accessToken = localStorage.getItem("@accessToken"); // Fetch access token from localStorage

export default {
  components: {
    UserList,
    Popup,
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
      errorMessages: [],
      isPopupVisible_error: false, // Boolean to control error popup visibility
      Business: [], // Store business data
      bus_data: [], // Store business-related data
      Image_bus: [], // Store selected business image file
      exp_files: [], // Store the image to be previewed
      isShowing: true, // Boolean to toggle visibility (possibly for conditional rendering)
      isEditMode: false, // Boolean to determine if in edit mode
      isLoading: false, // Boolean to track loading state
      isPopupVisible: false, // Boolean to control success popup visibility
      formData: {
        // Form data object for both user and business details
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
      isExpandedLanguage: false,
      showPassword: false,
      showPassword2: false,
    };
  },
  computed: {
    // Table headers for user data (not used in this template, but might be for future components)
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
      // รายชื่อฟิลด์ทั้งหมดที่ต้องตรวจสอบ
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
        // "bus_website",
        "bus_tel",

        // "bus_tax",
        // "bank_name",
        // "bank_account",
        // "bank_number",
      ];

      // ลบขีดออกจากข้อมูลที่ต้องการ
      this.formData.bus_tel = this.formData.bus_tel.replace(/-/g, "");
      this.formData.bus_tax = this.formData.bus_tax.replace(/-/g, "");
      this.formData.bank_number = this.formData.bank_number.replace(/-/g, "");

      // รีเซ็ตค่า isEmpty ทุกฟิลด์เป็น false
      fieldsToCheck.forEach((field) => {
        this.isEmpty[field] = false;
      });

      let errorMessages = [];

      const password = this.formData.userPassword?.toString() || "";
      this.isEmpty.userPassword = false;

      fieldsToCheck.forEach((field) => {
        const value = this.formData[field]?.toString().trim();

        // ถ้าฟิลด์ว่าง
        if (!value) {
          this.isEmpty[field] = true;
          errorMessages.push(this.$t(`validation.${field}`));
        } else {
          // ✅ ตรวจสอบเบอร์โทรศัพท์ (userPhone, bus_tel)
          if (
            (field === "userPhone" || field === "bus_tel") &&
            !/^\d{9,10}$/.test(value)
          ) {
            this.isEmpty[field] = true;
            errorMessages.push(this.$t("validation.phone_invalid"));
          }

          // ✅ ตรวจสอบอีเมล
          if (
            field === "userEmail" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ) {
            this.isEmpty.userEmail = true;
            errorMessages.push(this.$t("validation.email_invalid"));
          }

          // ✅ ตรวจสอบรหัสผ่าน
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

          // ✅ ตรวจสอบเลขบัญชีธนาคาร
          if (field === "bank_number" && !/^\d{10,13}$/.test(value)) {
            this.isEmpty.bank_number = true;
            errorMessages.push(this.$t("validation.bank_account_invalid"));
          }

          // ✅ ตรวจสอบเลขผู้เสียภาษี (เฉพาะตอนกรอก)
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

      // if (this.formData.bank_name !== "") {
      //   if (this.formData.bank_account === "") {
      //     this.isEmpty.bank_account = true;
      //     errorMessages.push(this.$t("validation.bank_account"));
      //   }
      //   if (this.formData.bank_number === "") {
      //     this.isEmpty.bank_number = true;
      //     errorMessages.push(this.$t("validation.bank_number"));
      //   }
      // } else {
      // }

      // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกัน
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

    // showPopup_validate(messages) {
    //   if (Array.isArray(messages)) {
    //     this.errorMessages = messages; // เก็บข้อความใน errorMessages
    //     // this.showErrorPopup = true; // แสดง Popup
    //     this.isPopupVisible_error = true;
    //     setTimeout(() => {
    //       this.isPopupVisible_error = false; // ซ่อน Popup หลังจากหน่วงเวลา
    //     }, 3000); // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที)
    //   } else {
    //     this.showPopup_error(messages);
    //   }
    // },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages;
        this.isPopupVisible_error = true;
        // ไม่ auto close แล้ว
      } else {
        this.showPopup_error(messages);
      }
    },

    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // Allow only numbers
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
      //   this.isExpandedLanguage = !this.isExpandedLanguage;
      //   if (this.isExpandedLanguage) {
      //     console.log("expanded Lang");
      //   } else {
      //     console.log("Not expanded Lang");
      //   }
    },
    // Navigate back to the login page
    BacktoLogin() {
      this.$router.push("/login"); // Redirect to login page
    },
    // Clear all form input fields
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
    // Validate the email format using a regex pattern
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email); // Return true if email is valid
    },
    // Handle file input and preview for business logo upload
    handleFileUpload(event) {
      this.errorMessages = [];
      const file = event.target.files[0];

      if (!file) return;

      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        this.errorMessages.push(this.$t("validation.validateImgOnly"));
        this.showPopup_validate(this.errorMessages);
        this.$refs.fileInput.value = ""; // เคลียร์ค่า input
        this.Image_bus = [];
        this.exp_files = [];
        return;
      }

      this.Image_bus = event.target.files[0]; // Get the selected file from input
      const Image_file = this.Image_bus;
      console.log("Selected file:", Image_file);

      if (Image_file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.exp_files = e.target.result; // Store image data for preview
        };
        reader.readAsDataURL(Image_file); // Read file as Data URL to display the preview
      }
    },
    // Show success popup with a message
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      this.isPopupVisible_error = false;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000); // Display popup for 2 seconds
    },
    // Show error popup with a message
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000); // Display error popup for 2 seconds
    },
    // Method to register a new user along with their business details
    async RegisterNewUsers() {
      if (!this.validateFormData()) return;
      this.isLoading = true;
      // Prepare form data to send, including the image and other business details

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
      // แนบไฟล์ถ้ามี
      if (this.Image_bus) {
        formDataBusiness.append("file", this.Image_bus);
      }
      formDataBusiness.append("bank_name", this.formData.bank_name);
      formDataBusiness.append("bank_account", this.formData.bank_account);
      formDataBusiness.append("bank_number", this.formData.bank_number);

      // Log all the form data for debugging purposes
      for (var pair of formDataBusiness.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      console.log("formDataBusiness", formDataBusiness);

      try {
        // API call to register a new user
        const response = await fetch(`${API_CALL}/auth/RegisterNewUsers`, {
          method: "POST",
          body: formDataBusiness, // Send the form data in the request body
        });

        // add Employee from User Register

        const json = await response.json();
        console.log(json);

        if (json.data === "User already exists") {
          this.errorMessages = [];
          this.isEmpty.userEmail = true;
          this.errorMessages.push(this.$t("validation.User_already_exists"));
          this.showPopup_validate(this.errorMessages);
        }
        if (json.statusCode === 200) {
          // On success, clear the form and show a success popup
          // this.getUser();
          this.showPopup(this.$t("validation.AddSucc"));
          console.log("Add success");
          const response = await fetch(`${API_CALL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: this.formData.userEmail.toLowerCase().trim(), // Send user email
              userPassword: this.formData.userPassword, // Send user password
            }),
          });

          const json = await response.json();

          if (response.ok) {
            // On successful login, store token and user info in localStorage
            localStorage.setItem("@accessToken", json.token);
            localStorage.setItem("RoleName", json.RoleName);
            localStorage.setItem("user_id", json.userID);
            localStorage.setItem("user_name", json.userF_name);
            localStorage.setItem("RoleID", json.RoleID);
            localStorage.setItem("TokenCreate", json.TokenCreate);

            // If token and user info are stored, redirect to home
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

          this.handleClearInput(); // Clear form data
        } else {
          // If there's an error, display an error popup
          // this.showPopup_error(`${json.data}`);
          // console.log("Add failed:", json.message);
          // console.log("ERROR >>>", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Add failed: Unexpected error occurred.");
      } finally {
        this.isLoading = false; // Turn off loading state
      }
    },
  },
  // },
};
</script>
<style scoped>
button.btn.btn-primary:hover {
  color: #0d6efd !important;
}
</style>
