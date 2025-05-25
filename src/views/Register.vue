<template>
  <div class="bg-img-Register main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
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
          <div v-if="isAddingMode" class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="radio-new-user"
              name="userType"
              @change="selectUserType('new')"
              :checked="isNewUser"
            />
            <label class="form-check-label" for="radio-new-user">
              {{ t("NewUser") }}
            </label>
          </div>

          <div v-if="isAddingMode" class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="radio-existing-user"
              name="userType"
              @change="selectUserType('existing')"
              :checked="isExistingUser"
            />
            <label class="form-check-label" for="radio-existing-user">
              {{ t("UserExitsEmployee") }}
            </label>
          </div>
          <!-- Dropdown: แสดงเฉพาะเมื่อเลือก "พนักงานที่มีอยู่" -->
          <div v-if="isExistingUser && isAddingMode" class="mt-3">
            <select
              id="employeeSelect"
              v-model="selectedEmployee"
              class="form-select"
              @change="selectUser(selectedEmployee)"
            >
              <option disabled value="">-- กรุณาเลือกพนักงาน --</option>
              <option
                v-for="emp in Employees"
                :key="emp.employeeID"
                :value="emp.employeeID"
              >
                {{ emp.F_name + " " + emp.L_name }}
              </option>
            </select>
          </div>
          <div class="mb-3 mt-3 div-for-formControl">
            <label><span style="color: red">*</span>{{ t("firstname") }}</label>
            <input
              v-model="formData.userF_name"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userF_name }"
              :disabled="isExistingUser"
            />
          </div>
          <div class="mb-3 div-for-formControl">
            <label><span style="color: red">*</span>{{ t("lastname") }}</label>
            <input
              v-model="formData.userL_name"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userL_name }"
              :disabled="isExistingUser"
            />
          </div>
          <div class="mb-3 div-for-formControl">
            <label><span style="color: red">*</span>{{ t("phoneNum") }}</label>
            <input
              v-model="formData.userPhone"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userPhone }"
              :disabled="isExistingUser"
              @keypress="validateInput"
              maxlength="10"
            />
          </div>
          <div class="mb-3 div-for-formControl">
            <label><span style="color: red">*</span>{{ t("email") }}</label>
            <input
              v-model="formData.userEmail"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userEmail }"
              :disabled="isExistingUser"
            />
          </div>
          <div class="mb-3 div-for-formControl">
            <label><span style="color: red">*</span>{{ t("password") }}</label>
            <input
              v-model="formData.userPassword"
              type="text"
              class="form-control"
              :class="{ error: isEmpty.userPassword }"
            />
          </div>
          <div class="mb-3 div-for-formControl">
            <div class="me-3">
              <label><span style="color: red">*</span>{{ t("role") }}</label>
            </div>
            <select
              class="form-control col-sm-5 col-md-6 form-select"
              v-model="formData.RoleID"
              required
              :class="{ error: isEmpty.RoleID }"
            >
              <option
                v-for="user in Roles"
                :key="user.RoleID"
                :value="user.RoleID"
              >
                {{ user.RoleName }}
              </option>
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end">
            <button
              v-if="isAddingMode"
              :disabled="isLoading"
              class="btn btn-primary me-3"
              @click="addUser"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>{{ t("buttonAdd") }}</span>
            </button>
            <button
              v-if="isEditMode"
              :disabled="isLoading"
              class="btn btn-primary me-3"
              @click="editUser"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>{{ t("buttonSave") }}</span>
            </button>
            <button class="btn btn-outline-secondary" @click="closePopup">
              {{ t("buttonCancel") }}
            </button>
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
            <button
              :disabled="isLoading"
              class="btn btn-danger me-3"
              @click="deleteUser"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>{{ t("buttonDelete") }}</span>
            </button>
            <button class="btn btn-secondary" @click="closeDeleteConfirmPopup">
              {{ t("buttonCancel") }}
            </button>
          </div>
        </Popup>
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

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  components: {
    Navigate, // The navigation bar component used for the page
    UserList, // The component that lists users
    Popup, // The component used for popups like adding/editing users
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
        userF_name: "", // First name of the user
        userL_name: "", // Last name of the user
        userPhone: "", // User's phone number
        userEmail: "", // User's email
        userPassword: "", // User's password
        RoleID: "", // The selected role ID for the user
      },
      isEmpty: {
        // Stores form data for user creation or editing
        ID: "", // ID of the user (used when editing)
        userF_name: "", // First name of the user
        userL_name: "", // Last name of the user
        userPhone: "", // User's phone number
        userEmail: "", // User's email
        userPassword: "", // User's password
        RoleID: "", // The selected role ID for the user
      },
    };
  },
  computed: {
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
      const selected = this.Employees.find((emp) => emp.employeeID === id);
      if (selected) {
        this.formData.userF_name = selected.F_name;
        this.formData.userL_name = selected.L_name;
        this.formData.userPhone = selected.Phone_num;
        this.formData.userEmail = selected.Email;
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

        // this.Employees = json.data;

    
            // Set raw data
    const allEmployees = json.data;

    // Get email list of users
    const userEmails = this.Users.map(user => user.Email);

    // Filter employees: remove ones whose email is in userEmails
    this.Employees = allEmployees.filter(
      employee => !userEmails.includes(employee.Email)
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
        this.formData.userF_name = "";
        this.formData.userL_name = "";
        this.formData.userPhone = "";
        this.formData.userEmail = "";
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
        userF_name: "",
        userL_name: "",
        userPhone: "",
        userEmail: "",
        userPassword: "",
        RoleID: "",
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
      // setTimeout(() => {
      //   this.isPopupVisible_error = false; // Hides the popup after 2 seconds
      // }, 2000);
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
        userF_name: "",
        userL_name: "",
        userPhone: "",
        userEmail: "",
        userPassword: "",
        RoleID: "",
      };
      this.inputError = false; // Resets input error flag
      this.isPopupVisible_error = false;
    },
    // Prepares the form data for editing a user
    handleEdit(item) {
      this.isPopupOpen = true; // Opens the popup
      this.isAddingMode = false; // We are editing, not adding
      this.isEditMode = true; // Sets the flag to editing mode
      let role = this.Roles.find((r) => r.RoleName === item.Role); // Finds the role associated with the user
      this.formData = {
        // Pre-populates the form with the selected user's data
        ID: item.ID,
        userF_name: item["First name"],
        userL_name: item["Last name"],
        userPhone: item["Phone number"],
        userEmail: item.Email,
        userPassword: item.Password,
        RoleID: role ? role.RoleID : "", // Finds the RoleID for the user
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
              ID: item.userID,
              "First name": item.userF_name,
              "Last name": item.userL_name,
              "Phone number": item.userPhone,
              Email: item.userEmail,
              // Password: item.userPassword,
              Role: item.role.RoleName,
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
      // if (
      //   this.formData.userF_name === "" ||
      //   this.formData.userL_name === "" ||
      //   this.formData.userPhone === "" ||
      //   this.formData.userEmail === "" ||
      //   this.formData.userPassword === "" ||
      //   this.formData.RoleID === ""
      // ) {
      //   this.inputError = true; // Triggers input validation error if any field is empty
      //   this.showPopup_error("Please fill all fields");
      // } else if (!this.validateEmail(this.formData.userEmail)) {
      //   this.inputError = true; // Triggers if the email format is invalid
      //   this.showPopup_error("Invalid email format");
      // } else if (this.formData.userPhone.length !== 10) {
      //   this.inputError = true; // Triggers if the phone number is not 10 digits
      //   this.showPopup_error("Phone number must be 10 digits");
      // } else {
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
              userF_name: this.formData.userF_name,
              userL_name: this.formData.userL_name,
              userPhone: this.formData.userPhone,
              userEmail: this.formData.userEmail.toLowerCase(),
              userPassword: this.formData.userPassword,
              RoleID: this.formData.RoleID,
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
      // if (
      //   this.formData.userF_name === "" ||
      //   this.formData.userL_name === "" ||
      //   this.formData.userPhone === "" ||
      //   this.formData.userEmail === "" ||
      //   this.formData.userPassword === "" ||
      //   this.formData.RoleID === ""
      // ) {
      //   this.inputError = true; // Validation for empty fields
      //   this.showPopup_error("Please all fill data");
      // } else if (!this.validateEmail(this.formData.userEmail)) {
      //   this.inputError = true; // Validation for email format
      //   this.showPopup_error("Invalid email format");
      // } else if (this.formData.userPhone.length !== 10) {
      //   this.inputError = true; // Validation for phone number length
      //   this.showPopup_error("Phone number must be 10 digits");
      // } else {
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
            userF_name: this.formData.userF_name,
            userL_name: this.formData.userL_name,
            userPhone: this.formData.userPhone,
            userEmail: this.formData.userEmail,
            userPassword: this.formData.userPassword,
            RoleID: this.formData.RoleID,
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
      // }
    },
    async validateFormData() {
      const errorMessages = [];

      // รีเซ็ตค่าว่าง
      this.isEmpty = {
        userF_name: false,
        userL_name: false,
        userPhone: false,
        userEmail: false,
        userPassword: false,
        RoleID: false,
      };

      // ตรวจชื่อจริง
      if (this.formData.userF_name.trim() === "") {
        this.isEmpty.userF_name = true;
        errorMessages.push(this.$t("validation.F_name"));
      }

      // ตรวจนามสกุล
      if (this.formData.userL_name.trim() === "") {
        this.isEmpty.userL_name = true;
        errorMessages.push(this.$t("validation.L_name"));
      }

      // ตรวจเบอร์โทร
      const phone = this.formData.userPhone.trim();
      if (phone === "") {
        this.isEmpty.userPhone = true;

        errorMessages.push(this.$t("validation.userPhone"));
      } else if (!/^\d{9,10}$/.test(phone)) {
        this.isEmpty.userPhone = true;
        errorMessages.push(this.$t("validation.cus_tel_length"));
      }

      // ตรวจอีเมล
      const email = this.formData.userEmail.trim();
      if (email === "") {
        this.isEmpty.userEmail = true;

        errorMessages.push(this.$t("validation.cus_email"));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.isEmpty.userEmail = true;
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
      if (this.formData.RoleID === "") {
        this.isEmpty.RoleID = true;
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
