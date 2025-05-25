<template>
  <div class="forget-password-body">
    <!-- <Navigate/> -->
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
      <div class="forget-password-content">
        <div class="password-header">
          <h1>{{ t("resetpassword") }}</h1>
        </div>
        <div style="text-align: center">
          <p>{{ t("adviceforresetpassword") }}</p>
        </div>
        <div class="mb-3" style="display: flex; justify-content: center">
          <label
            style="flex: 1; padding-top: 5px"
            class="col-sm-3 col-md-6 text-right text-center"
            for="email"
            ><b>{{ t("emailaddress") }}</b></label
          >
          <div style="display: flex; flex-direction: row; flex: 3">
            <input
              class="form-control col-sm-9 col-md-6"
              style="max-width: 50vh; margin-right: 10px"
              v-model="formData.userEmail"
              type="text"
              required
            />
            <button
              v-if="isverifyMode"
              class="btn btn-primary"
              @click="checkEmail"
            >
              {{ t("verify") }}
            </button>
          </div>
        </div>
        <div
          class="mb-3"
          v-if="resetcontain"
          style="display: flex; justify-content: center; padding: 10px 80px"
        >
          <label style="flex: 1" class="col-sm-3 col-md-6" for="email"
            ><b>{{ t("newpassword") }}</b></label
          >
          <div style="display: flex; flex-direction: row; flex: 3">
            <input
              class="form-control col-sm-9 col-md-6"
              style="max-width: 50vh; margin-right: 10px"
              v-model="formData.userPassword"
              type="text"
              required
            />
            <button
              v-if="isresetMode"
              class="btn btn-primary"
              @click="resetpassword"
            >
              {{ t("reset") }}
            </button>
          </div>
        </div>
      </div>
      <div style="display: flex; margin-top: 50px">
        <button @click="backtologin" class="btn btn-secondary">
          {{ t("backtologinbutton") }}
        </button>
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
</template>

<script>
import Navigate from "../components/Navigation.vue";
import CategoryList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n"; //for switch language
import { watchEffect } from "vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "ProductCategory", // Component name
  components: {
    Navigate,
    CategoryList,
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
      category_file: "",
      isExpandedLanguage: false,
      isPopupVisible_error: false,
      Categories: [],
      isPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isLoading: false,
      isPopupVisible: false,
      inputValue: "",
      inputError: false,
      formData: {
        userEmail: "",
        userPassword: "",
      },
      isPopupVisible: false,
      isPopupVisible_error: false,
      isverifyMode: true,
      isresetMode: false,
      resetcontain: false,
    };
  },
  methods: {
    toggleLanguage(lang) {
      if (lang === "EN") {
        this.setLanguage("th");
      } else {
        this.setLanguage("en");
      }
      // this.isExpandedLanguage = !this.isExpandedLanguage;
      // if (this.isExpandedLanguage) {
      //     console.log("expanded Lang")
      // } else {
      //     console.log("Not expanded Lang")
      // }
    },
    // Navigate back to the login page
    backtologin() {
      this.$router.push("/login"); // Route user back to the login page
    },
    // Open popup for adding or editing categories (unused in this template)
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
    },
    // Close the popup and reset the form data (unused in this template)
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        categoryID: "",
        categoryName: "",
      };
      this.category_file = "";
      this.inputError = false;
    },
    // Close the delete confirmation popup (unused in this template)
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    // Edit the selected category (unused in this template)
    handleEdit(item) {
      console.log("Edit item:", item);
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formData = {
        categoryID: item.ID,
        categoryName: item["Category Name"],
      };
    },
    // Delete the selected category (unused in this template)
    handleDelete(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formData = {
        categoryID: item.ID,
      };
    },
    // Show success popup with a message
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true; // Show the success popup
      setTimeout(() => {
        this.isPopupVisible = false; // Hide popup after 2 seconds
      }, 2000);
    },
    // Show error popup with a message
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false; // Ensure success popup is hidden
      this.isPopupVisible_error = true; // Show the error popup
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false; // Hide error popup after 2 seconds
      }, 2000);
    },
    // Method to check if the email exists in the system
    async checkEmail() {
      console.log("Checking email for verification");
      this.isLoading = true; // Set loading state to show spinner
      try {
        const response = await fetch(`${API_CALL}/auth/checkEmail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include access token in the request
          },
          body: JSON.stringify({
            userEmail: this.formData.userEmail, // Send the entered email
          }),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          // If the email is verified, switch to reset mode
          this.isverifyMode = false;
          this.isresetMode = true;
          this.resetcontain = true; // Show the reset password fields
        } else {
          // Show error if email is not verified
          this.showPopup_error(json.data);
          console.log(json.data);
          this.isverifyMode = true;
          this.isresetMode = false;
          this.resetcontain = false;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false; // Turn off loading spinner
      }
    },
    // Method to reset the password
    async resetpassword() {
      this.isLoading = true; // Set loading state to show spinner
      try {
        const response = await fetch(`${API_CALL}/auth/forgetPassword`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include access token in the request
          },
          body: JSON.stringify({
            userEmail: this.formData.userEmail, // Send the email and new password
            userPassword: this.formData.userPassword,
          }),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          // Show success popup if the password is reset successfully
          this.showPopup(json.data);
          console.log(json.data);
          this.isverifyMode = false;
          this.isresetMode = true;
          this.resetcontain = true;
        } else {
          // Show error if the password reset failed
          this.showPopup_error(json.data);
          console.log(json.data);
          this.isverifyMode = false;
          this.isresetMode = true;
          this.resetcontain = true;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false; // Turn off loading spinner
      }
    },
  },
};
</script>
