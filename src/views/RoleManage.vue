<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body">
      <div class="mb-3">
        <h2>{{ t("headerRole") }}</h2>
      </div>
      <div class="mt-3">
        <div class="mb-3">
          <tableList
            :tableHeaders="tableHeaders"
            :initialTableData="roles"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
            v-if="roles && roles.length > 0"
            :isLoading="isLoading"
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
      </div>
      <div>
        <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
          <div class="mb-3">
            <h2>Edit Role</h2>
          </div>
          <div class="mb-3">
            <label class="col-sm-5 col-md-6">Role name: </label>
            <input
              class="form-control col-sm-9 col-md-6"
              v-model="formRole.RoleName"
              type="text"
              id="input-text"
              required
              :class="{ error: inputError }"
            />
          </div>
          <div class="modal-footer">
            <button
              :disabled="isLoading"
              class="btn btn-primary me-3"
              @click="editRole"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>Save</span>
            </button>
            <button class="btn btn-secondary" @click="closePopup">
              Cancel
            </button>
          </div>
        </Popup>
        <div class="delete-popup">
          <Popup
            :isOpen="isDeleteConfirmPopupOpen"
            :closePopup="closeDeleteConfirmPopup"
          >
            <div class="mb-5">
              <a>Are you sure? you want to delete.</a>
            </div>
            <div class="modal-footer">
              <button
                :disabled="isLoading"
                class="btn btn-danger me-3"
                @click="deleteRole"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-else>Delete</span>
              </button>
              <button
                class="btn btn-secondary"
                @click="closeDeleteConfirmPopup"
              >
                Cancel
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
            <ul>
              <li v-for="(msg, index) in errorMessages" :key="index">
                {{ msg }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigate from "../components/Navigation.vue";
import tableList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");
export default {
  components: {
    Navigate, // Component for navigation bar
    tableList, // Component for listing table data
    Popup, // Component for popups (edit/delete confirmation)
  },
  setup() {
    const { t } = useI18n(); // Internationalization setup for translating text
    return {
      t, // Returning translation function to be used in template
    };
  },
  data() {
    return {
      isPopupVisible_error: false, // State to control visibility of error popup
      isPopupOpen: false, // State to control visibility of the edit popup
      isDeleteConfirmPopupOpen: false, // State to control visibility of delete confirmation popup
      roles: [], // Stores roles fetched from the API
      isLoading: false, // Indicates if data is being loaded (used for loading spinner)
      isPopupVisible: false, // State to control visibility of success popup
      inputError: false, // Used for validation errors on input fields
      formRole: {
        // Form data for role being edited or added
        RoleID: "", // Role ID for editing
        RoleName: "", // Role name for input
      },
    };
  },
  computed: {
    // Define table headers for the role table
    tableHeaders() {
      return [{ label: this.t("roleHeaderTable"), key: "Role" }];
    },
  },
  methods: {
    // Open the popup for adding or editing a role
    openPopup() {
      this.isPopupOpen = true;
    },
    // Close the popup and reset the form
    closePopup() {
      this.isPopupOpen = false;
      this.formRole = {
        RoleID: "",
        RoleName: "",
      };
    },
    // Close the delete confirmation popup
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    // Prepare the form with role data for editing
    handleEdit(item) {
      console.log("Edit item:", item);
      this.isPopupOpen = true;
      this.formRole = {
        RoleID: item.ID, // Set the Role ID
        RoleName: item.Role, // Set the Role Name
      };
    },
    // Open the delete confirmation popup
    handleDelete(item) {
      console.log("Delete item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formRole = {
        RoleID: item.ID, // Set the Role ID for deletion
      };
    },
    // Show a success popup with the provided message
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false; // Automatically hide the popup after 2 seconds
      }, 2000);
    },
    // Show an error popup with the provided message
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible_error = false; // Automatically hide the error popup after 2 seconds
      }, 2000);
    },
    // Fetch the list of roles from the server
    async getRole() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true; // Show loading spinner
      try {
        const response = await fetch(`${API_CALL}/auth/GetRole`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          // Map the role data to display in the table
          this.roles = json.data.map((item) => {
            let initialTableData = {
              ID: item.RoleID,
              Role: item.RoleName,
            };
            return initialTableData;
          });
        } else {
          this.showPopup_error(json.data); // Show error if data fetch fails
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data:", error); // Log any errors
      } finally {
        this.isLoading = false; // Hide loading spinner
      }
    },
    // Add a new role to the system
    async addRole() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formRole.RoleName === "") {
        this.inputError = true; // Show validation error if role name is empty
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        try {
          const response = await fetch(`${API_CALL}/auth/AddRole`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              RoleName: this.formRole.RoleName, // Send the role name to the API
            }),
          });
          const json = await response.json();

          if (json.statusCode === 200) {
            this.showPopup(this.$t("validation.AddSucc")); // Show success message
            this.getRole(); // Refresh the role list
            this.formRole = { RoleID: "", RoleName: "" }; // Reset the form
          } else {
            this.showPopup_error(`${json.data}`); // Show error message
            console.log("Add role error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false; // Hide loading spinner
        }
      }
    },
    // Edit an existing role
    async editRole() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formRole.RoleName === "") {
        this.inputError = true; // Show validation error if role name is empty
      } else {
        this.inputError = false;
        this.isLoading = true;
        const RoleID = this.formRole.RoleID; // Get the Role ID for editing
        try {
          const response = await fetch(`${API_CALL}/auth/EditRole/${RoleID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              RoleName: this.formRole.RoleName, // Send the new role name to the API
            }),
          });
          const json = await response.json();

          if (json.statusCode === 200) {
            this.showPopup(this.$t("validation.EditSucc")); // Show success message
            this.getRole(); // Refresh the role list
          } else {
            this.showPopup_error(json.data); // Show error message
            console.log("Edit role error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false; // Hide loading spinner
        }
      }
    },
    // Delete a role
    async deleteRole() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true; // Show loading spinner
      const RoleID = this.formRole.RoleID; // Get the Role ID for deletion
      try {
        const response = await fetch(`${API_CALL}/auth/DeleteRole/${RoleID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ RoleID }), // Send the Role ID to the API
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.showPopup(this.$t("validation.DelateSucc")); // Show success message
          this.getRole(); // Refresh the role list
          this.isDeleteConfirmPopupOpen = false; // Close the delete confirmation popup
        } else {
          this.showPopup_error(json.data); // Show error message
          console.log("Delete role error", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false; // Hide loading spinner
      }
    },
  },
  created() {
    this.getRole(); // Fetch roles when the component is created
  },
};
</script>
