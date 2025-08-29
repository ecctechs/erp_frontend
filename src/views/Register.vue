<template>
  <div class="bg-img-Register main-page">
    <div class="page-body">
      <div class="header-center-page mb-3">
        <h2>{{ t("headerManageUSer") }}</h2>
      </div>
      <div class="add-btn mb-3">
        <a class="btn btn-success size-font-sm" @click="openPopup">{{
          t("addUser")
        }}</a>
      </div>
      <div>
        <UserList
          :tableHeaders="tableHeaders"
          :initialTableData="Users"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          v-if="Users && Users.length > 0"
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
      <div>

<Popup :isOpen="isPopupOpen" :closePopup="closePopup">
  <h2 v-if="isAddingMode">{{ t("addNewUser") }}</h2>
  <h2 v-if="isEditMode">{{ t("editUser") }}</h2>

  <div v-if="isAddingMode">
      <div class="form-check">
        <input class="form-check-input" type="radio" id="radio-new-user" name="userType" @change="selectUserType('new')" :checked="isNewUser"/>
        <label class="form-check-label" for="radio-new-user">{{ t("NewUser") }}</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" id="radio-existing-user" name="userType" @change="selectUserType('existing')" :checked="isExistingUser"/>
        <label class="form-check-label" for="radio-existing-user">{{ t("UserExitsEmployee") }}</label>
      </div>
  </div>
  <div v-if="isExistingUser && isAddingMode" class="mt-3">
    <select id="employeeSelect" v-model="selectedEmployee" class="form-select" @change="selectUser(selectedEmployee)">
      <option disabled value="">-- กรุณาเลือกพนักงาน --</option>
      <option v-for="emp in Employees" :key="emp.employee_id" :value="emp.employee_id">
        {{ emp.first_name + " " + emp.last_name }}
      </option>
    </select>
  </div>

  <form class="row g-3 mt-3">
    <div v-for="field in fieldConfig" :key="field.key" :class="field.col">
      <label><span v-if="field.required" style="color: red">*</span>{{ t(field.label) }}</label>

      <Dropdown
        v-if="field.componentType === 'Dropdown'"
        v-model="formData[field.key]"
        :options="this[field.options]"
        :error="isEmpty[field.key]"
      />

      <TextField
        v-else
        v-model="formData[field.key]"
        :type="field.type"
        :class="{ error: isEmpty[field.key] }"
        :disabled="isExistingUser && field.key !== 'userPassword'"
        :maxlength="field.maxlength"
        @keypress="field.isNumeric ? validateInput($event) : null"
      />
    </div>
  </form>
  
  <div class="mt-4" style="display: flex; justify-content: flex-end">
    <Button
      v-if="isAddingMode"
      :disabled="isLoading"
      customClass="btn btn-primary me-3"
      @click="addUser"
    >
      <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
      <span v-else>{{ t("buttonAdd") }}</span>
    </Button>
    <Button
      v-if="isEditMode"
      :disabled="isLoading"
      customClass="btn btn-primary me-3"
      @click="editUser"
    >
      <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
      <span v-else>{{ t("buttonSave") }}</span>
    </Button>
    <Button customClass="btn btn-outline-secondary" @click="closePopup">
      {{ t("buttonCancel") }}
    </Button>
  </div>
</Popup>
      </div>
      <div class="delete-popup">
        <Popup
          :isOpen="isDeleteConfirmPopupOpen"
          :closePopup="closeDeleteConfirmPopup"
        >
          <div class="mb-5">
            <a>{{ t("deleteConfirmSentence") }}</a>
          </div>
          <div class="modal-footer">
            <Button
              :disabled="isLoading"
              customClass="btn btn-danger me-3"
              @click="deleteUser"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>{{ t("buttonDelete") }}</span>
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
          <a>{{ popupMessage_error }}</a>
          <ul>
            <li v-for="(msg, index) in errorMessages" :key="index">
              {{ msg }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigate from "../components/Navigation.vue";
import { config } from "../../constant.js";
import UserList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import Button from "../components/button.vue";
import TextField from "../components/textField.vue";
import Dropdown from "../components/dropdown.vue";
import formConfig from '../config/field_config/register/form_user.json';

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  components: {
    Navigate, // The navigation bar component used for the page
    UserList, // The component that lists users
    Popup, // The component used for popups like adding/editing users
    Button,
    TextField,
    Dropdown
  },
  setup() {
    const { t } = useI18n(); // Enables internationalization (i18n) for translating text

    const documentName = computed(() => t("dontHaveUserActive"));
    return {
      t, // Returns the translation function to be used in the template
      documentName,
    };
  },
  data() {
    return {
      fieldConfig: formConfig,
      errorMessages: [],
      selectedEmployee: "",
      Employees: [],
      isNewUser: true, // ค่าเริ่มต้น: เลือกผู้ใช้งานใหม่
      isExistingUser: false,
      isPopupVisible_error: false, // Controls the visibility of the error popup
      Roles: [], // Array to store roles fetched from the API
      Users: [], // Array to store users fetched from the API
      isLoading: false, // Tracks if data is currently being fetched or submitted
      isPopupVisible: false, // Controls the visibility of the success popup
      inputError: false, // Flag for showing input validation errors
      isPopupOpen: false, // Toggles the user form popup (add/edit)
      isAddingMode: false, // Boolean flag to indicate if it's adding a new user
      isEditMode: false, // Boolean flag to indicate if it's editing a user
      isDeleteConfirmPopupOpen: false, // Controls the visibility of the delete confirmation popup
      formData: {
        // Stores form data for user creation or editing
        ID: "", // ID of the user (used when editing)
        user_first_name: "", // First name of the user
        user_last_name: "", // Last name of the user
        user_phone: "", // User's phone number
        user_email: "", // User's email
        userPassword: "", // User's password
        role_id: "", // The selected role ID for the user
      },
      isEmpty: {
        // Stores form data for user creation or editing
        ID: "", // ID of the user (used when editing)
        user_first_name: "", // First name of the user
        user_last_name: "", // Last name of the user
        user_phone: "", // User's phone number
        user_email: "", // User's email
        userPassword: "", // User's password
        role_id: "", // The selected role ID for the user
      },
    };
  },
  computed: {
      roleOptions() {
        return this.Roles.map(role => ({
          value: role.role_id,
          text: role.role_name
        }));
      },
    // Defines the table headers for the user list
    tableHeaders() {
      return [
        { label: this.t("firstNameHeaderTable"), key: "First name" },
        { label: this.t("lastNameHeaderTable"), key: "Last name" },
        { label: this.t("phoneNumberHeaderTable"), key: "Phone number" },
        { label: this.t("emailHeaderTable"), key: "Email" },
        // { label: this.t("passwordHeaderTable"), key: "Password" },
        { label: this.t("roleHeaderTable"), key: "Role" },
      ];
    },
  },
  methods: {
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // Allow only numbers
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    selectUser(id) {
      const selected = this.Employees.find((emp) => emp.employee_id === id);
      if (selected) {
        this.formData.user_first_name = selected.user_first_name;
        this.formData.user_last_name = selected.last_name;
        this.formData.user_phone = selected.Phone_num;
        this.formData.user_email = selected.email;
      }
    },
    async getEmployee() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployee`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        // Set raw data
        const allEmployees = json.data;

        // Get email list of users
        const userEmails = this.Users.map((user) => user.Email);

        // Filter employees: remove ones whose email is in userEmails
        this.Employees = allEmployees.filter(
          (employee) => !userEmails.includes(employee.Email)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    selectUserType(type) {
      if (type === "new") {
        this.isNewUser = true;
        this.isExistingUser = false;
        this.formData.user_first_name = "";
        this.formData.user_last_name = "";
        this.formData.user_phone = "";
        this.formData.user_email = "";
      } else {
        this.isNewUser = false;
        this.isExistingUser = true;
      }
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    // Clears all input fields in the form
    handleClearInput() {
      this.formData = {
        user_first_name: "",
        user_last_name: "",
        user_phone: "",
        user_email: "",
        userPassword: "",
        role_id: "",
      };
    },
    // Shows a success popup with the provided message
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false; // Hides the popup after 2 seconds
      }, 2000);
    },
    // Shows an error popup with the provided message
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible_error = true;
    },
    // Opens the add user popup
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true; // Indicates that we are in adding mode
      this.isEditMode = false; // Not in editing mode
    },
    // Closes the popup and resets form data
    closePopup() {
      this.isPopupOpen = false; // Closes the popup
      this.isAddingMode = false; // Resets the adding mode flag
      this.isEditMode = false; // Resets the editing mode flag
      this.formData = {
        // Resets the form data
        user_first_name: "",
        user_last_name: "",
        user_phone: "",
        user_email: "",
        userPassword: "",
        role_id: "",
      };
      this.inputError = false; // Resets input error flag
      this.isPopupVisible_error = false;
    },
    // Prepares the form data for editing a user
    handleEdit(item) {
      this.isPopupOpen = true; // Opens the popup
      this.isAddingMode = false; // We are editing, not adding
      this.isEditMode = true; // Sets the flag to editing mode
      let role = this.Roles.find((r) => r.role_name === item.Role); // Finds the role associated with the user
      this.formData = {
        // Pre-populates the form with the selected user's data
        ID: item.ID,
        user_first_name: item["First name"],
        user_last_name: item["Last name"],
        user_phone: item["Phone number"],
        user_email: item.Email,
        userPassword: item.Password,
        role_id: role ? role.role_id : "", // Finds the RoleID for the user
      };
    },
    // Opens the delete confirmation popup
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true; // Opens the delete confirmation popup
      this.formData = { ID: item.ID }; // Stores the ID of the user to be deleted
    },
    // Closes the delete confirmation popup
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false; // Closes the delete confirmation popup
    },
    // Validates if the email format is correct
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email); // Returns true if the email is valid
    },
    // Fetches the roles from the API
    async getRole() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/auth/GetRole`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Roles = json.data; // Stores the roles in the Roles array
        } else {
          this.showPopup_error(json.data); // Shows an error popup if the API call fails
        }
      } catch (error) {
        console.error("Error fetching roles:", error); // Logs the error if there's an issue
      }
    },
    // Fetches the users from the API
    async getUser() {
      const accessToken = localStorage.getItem("@accessToken");
      this.getRole(); // Fetches the roles first
      try {
        const response = await fetch(`${API_CALL}/auth/GetUsers`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Users = json.data.map((item) => {
            // Maps API response to a table format
            return {
              ID: item.user_id,
              "First name": item.user_first_name,
              "Last name": item.user_last_name,
              "Phone number": item.user_phone,
              Email: item.user_email,
              Role: item.role.role_name,
            };
          });
        } else {
          this.showPopup_error(json.data); // Shows an error popup if the API call fails
        }
      } catch (error) {
        console.error("Error fetching users:", error); // Logs the error if there's an issue
      }
    },
    // Sends an API request to update the user data
    async editUser() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.inputError = false; // Resets the input error flag
      this.isLoading = true; // Sets the loading state

      try {
        const response = await fetch(
          `${API_CALL}/auth/EditUsers/${this.formData.ID}`,
          {
            method: "PUT", // Sends a PUT request to update the user
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              user_first_name: this.formData.user_first_name,
              user_last_name: this.formData.user_last_name,
              user_phone: this.formData.user_phone,
              user_email: this.formData.user_email.toLowerCase(),
              userPassword: this.formData.userPassword,
              role_id: this.formData.role_id,
            }),
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.isPopupOpen = false;
          this.getUser(); // Fetches the updated user list
          this.showPopup(this.$t("validation.AddSucc")); // Shows a success popup
          this.closePopup(); // Closes the popup after editing
        } else {
          this.showPopup_error(json.data); // Shows an error popup if update fails
        }
      } catch (error) {
        console.error("Error updating user:", error); // Logs the error if there's an issue
      } finally {
        this.isLoading = false; // Resets the loading state
      }
      // }
    },
    // Sends an API request to delete the user
    async deleteUser() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true; // Sets the loading state
      try {
        const response = await fetch(
          `${API_CALL}/auth/DeleteUsers/${this.formData.ID}`,
          {
            method: "DELETE", // Sends a DELETE request to remove the user
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getUser(); // Fetches the updated user list
          this.showPopup(this.$t("validation.DelateSucc")); // Shows a success popup
          this.closeDeleteConfirmPopup(); // Closes the delete confirmation popup
        } else {
          this.showPopup_error(json.data); // Shows an error popup if deletion fails
        }
      } catch (error) {
        console.error("Error deleting user:", error); // Logs the error if there's an issue
      } finally {
        this.isLoading = false; // Resets the loading state
      }
    },
    // Sends an API request to add a new user
    async addUser() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.inputError = false; // No validation errors
      this.isLoading = true; // Starts the loading indicator

      try {
        const response = await fetch(`${API_CALL}/auth/RegisterUsers`, {
          method: "POST", // Sends a POST request to add the user
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_first_name: this.formData.user_first_name,
            user_last_name: this.formData.user_last_name,
            user_phone: this.formData.user_phone,
            user_email: this.formData.user_email,
            userPassword: this.formData.userPassword,
            role_id: this.formData.role_id,
          }),
        });
        const json = await response.json();
        3;
        console.log(json);
        if (json.statusCode === 200) {
          this.getEmployee();
          this.isPopupOpen = false;
          this.isPopupVisible_error = false;
          this.getUser(); // Fetches the updated user list
          this.showPopup(this.$t("validation.AddSucc")); // Shows success popup
          this.handleClearInput(); // Clears form after success
        } else {
          this.showPopup_error(`${json.data}`); // Shows error popup if failed
        }
      } catch (error) {
        console.error("Error adding user:", error); // Logs error if occurred
      } finally {
        this.isLoading = false; // Resets the loading state
      }
    },
    async validateFormData() {
      const errorMessages = [];

      // รีเซ็ตค่าว่าง
      this.isEmpty = {
        user_first_name: false,
        user_last_name: false,
        user_phone: false,
        user_email: false,
        userPassword: false,
        role_id: false,
      };

      // ตรวจชื่อจริง
      if (this.formData.user_first_name.trim() === "") {
        this.isEmpty.user_first_name = true;
        errorMessages.push(this.$t("validation.F_name"));
      }

      // ตรวจนามสกุล
      if (this.formData.user_last_name.trim() === "") {
        this.isEmpty.user_last_name = true;
        errorMessages.push(this.$t("validation.L_name"));
      }

      // ตรวจเบอร์โทร
      const phone = this.formData.user_phone.trim();
      if (phone === "") {
        this.isEmpty.user_phone = true;

        errorMessages.push(this.$t("validation.userPhone"));
      } else if (!/^\d{9,10}$/.test(phone)) {
        this.isEmpty.user_phone = true;
        errorMessages.push(this.$t("validation.cus_tel_length"));
      }

      // ตรวจอีเมล
      const email = this.formData.user_email.trim();
      if (email === "") {
        this.isEmpty.user_email = true;

        errorMessages.push(this.$t("validation.cus_email"));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.isEmpty.user_email = true;
        errorMessages.push(this.$t("validation.cus_email2"));
      }

      // ตรวจรหัสผ่าน
      const password = this.formData.userPassword;
      if (password === "" || password === undefined) {
        this.isEmpty.userPassword = true;
        errorMessages.push(this.$t("validation.userPassword"));
      }

      if (password) {
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

      // // ตรวจนามสกุล
      if (this.formData.role_id === "") {
        this.isEmpty.role_id = true;
        errorMessages.push(this.$t("validation.RoleID"));
      }

      // แสดง popup หากมี error
      if (errorMessages.length > 0) {
        this.showPopup_validate(errorMessages);
        return false;
      }

      return true;
    },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages; // เก็บข้อความใน errorMessages
        this.isPopupVisible_error = true;
      } else {
        this.showPopup_error(messages);
      }
    },
  },
  created() {
    this.getUser(); // Fetches users when the component is created
    this.getRole(); // Fetches roles when the component is created
    this.getEmployee();
  },
};
</script>
