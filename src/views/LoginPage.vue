<template>
  <div class="bg-img-login">
    <div class="switch-lang-login">
      <div class="icon_language me-4"></div>
      <div class="me-3">
        <div style="cursor: pointer" @click="toggleLanguage(t('headerLang'))">
          <a class="text-switch-lang-login">{{ t("headerLang") }}</a>
        </div>
      </div>
    </div>
    <div class="expanded-content">
      <div v-if="isExpandedLanguage" class="dropdown-content">
        <p @click="setLanguage('th')">TH</p>
        <p @click="setLanguage('th')">TH</p>
      </div>
    </div>
    <form @submit.prevent="login" class="login-contain">
      <h1>{{ t("login") }}</h1>
      <div class="mb-3">
        <label class="col-sm-3 col-md-6" for="email"
          ><b>{{ t("email") }}</b></label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formUser.useremail"
          type="text"
          required
        />
        <span v-if="!isEmailValid" class="error-message text-danger">{{
          t("errormessage-login")
        }}</span>
      </div>
      <div class="mb-3">
        <label class="col-sm-3 col-md-6" for="psw"
          ><b>{{ t("password") }}</b></label
        >
        <!-- <input
          class="form-control col-sm-9 col-md-6"
          v-model="formUser.password"
          type="password"
          required
        /> -->
        <div class="input-group mb-3">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :class="{ error: isEmpty.password }"
            aria-label="Comfirm Password"
            aria-describedby="basic-addon2"
            v-model="formUser.password"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            @click="togglePassword"
          >
            <span
              :class="
                showPassword ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-circle'
              "
            ></span>
          </button>
        </div>
      </div>
      <div>
        <!-- <a href="forgetpassword">{{ t("forgetpassword") }}</a> -->
      </div>
      <div class="footer mt-2 mb-2">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitDisabled || isLoading"
        >
          <span v-if="!isLoading">{{ t("login") }}</span>
          <span
            v-else
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Loading...</span>
        </button>
      </div>
      <div>
        <a>{{ t("registersentence") }}</a>
        <a href="register">{{ t("registerlink") }}</a>
      </div>
    </form>
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
      <div class="popup-content-error2 text-center">
        {{ popupMessage_error }}
      </div>
    </div>
  </div>
</template>

<script>
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n"; //for switch language
import { watchEffect } from "vue";

const API_CALL = config["url"];
export default {
  name: "login",
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
      showPassword: false,
      formUser: {
        useremail: "", // Stores user email
        password: "", // Stores user password
      },
      isEmpty: {
        password: "",
      },
      isEmailValid: true, // Flag for email validation
      isPasswordValid: true, // Flag for password validation
      isLoading: false, // Loading state for login
      isPopupVisible_error: false, // Flag to show error popup
      isExpandedLanguage: false,
      text_lang: "",
    };
  },
  computed: {
    isSubmitDisabled() {
      return !this.isEmailValid || !this.isPasswordValid; // Disables submit if email or password is invalid
    },
  },
  watch: {
    "formUser.useremail"(newValue) {
      this.isEmailValid = this.validateEmail(newValue); // Validates email format when changed
      this.updateSubmitButton();
    },
    "formUser.password"(newValue) {
      this.isPasswordValid = newValue.trim() !== ""; // Ensures password is not empty
      this.updateSubmitButton();
    },
  },
  methods: {
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleLanguage(lang) {
      if (lang === "EN") {
        this.setLanguage("th");
      } else {
        this.setLanguage("th");
      }
      // this.isExpandedLanguage = !this.isExpandedLanguage;
      // if (this.isExpandedLanguage) {
      //     console.log("expanded Lang")
      // } else {
      //     console.log("Not expanded Lang")
      // }
    },
    // Navigate to forgot password page
    forgetpassword() {
      this.$router.push("/forgetpassword");
    },
    // Navigate to registration page
    firstRegis() {
      this.$router.push("/firstregis");
    },
    // Validate email format using regex
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    // Update submit button state based on validation
    updateSubmitButton() {
      this.$nextTick(() => {
        const submitButton = document.querySelector(".btn.btn-primary");
        if (submitButton) {
          submitButton.disabled = !this.isEmailValid || !this.isPasswordValid;
        }
      });
    },
    // Show error message popup for login failure
    showPopup_error(message) {
      if (this.t("lang") === "en") {
        message = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      }
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      // setTimeout(() => {
      //   this.isPopupVisible = false;
      //   this.isPopupVisible_error = false;
      // }, 2000); // Hide popup after 2 seconds
    },
    // Login method to authenticate user
    async login() {
      this.isLoading = true; // Show loading spinner
      try {
        const response = await fetch(`${API_CALL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: this.formUser.useremail.toLowerCase().trim(), // Send user email
            userPassword: this.formUser.password, // Send user password
          }),
        });

        const json = await response.json();
        console.log(json);

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
      } catch (error) {
        console.error("Error during login:", error);
      } finally {
        this.isLoading = false; // Hide loading spinner
      }
    },
  },
};
</script>
