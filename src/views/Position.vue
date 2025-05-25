<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body">
      <div class="mb-4">
        <h2>{{ t("headerPosition") }}</h2>
      </div>
      <div class="add-btn mb-3">
        <a
          class="btn btn-success me-3 size-font-sm"
          @click="openAddPositionPopup"
          >{{ t("addPosition") }}</a
        >
      </div>
      <div>
        <tableList
          :tableHeaders="tableHeadersPosition"
          :initialTableData="Positions"
          :columnEditAndDelete="true"
          @handleEdit="handleEditPosition"
          @handleDelete="handleDeletePosition"
          v-if="Positions"
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
    </div>
  </div>
  <div>
    <Popup :isOpen="isAddPositionPopupOpen" :closePopup="closeAddPositionPopup">
      <div class="mb-4">
        <h3 v-if="isAddingMode">{{ t("headerPopupAddPosition") }}</h3>
        <h3 v-if="isEditMode">{{ t("headerPopupEditPosition") }}</h3>
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6 mb-3"><span style="color: red">*</span>{{ t("positionName") }}</label>
        <input
          class="col-sm-9 col-md-6 form-control"
          v-model="formPosition.Position"
          type="text"
          id="input-text"
          :class="{ error: isEmpty.Position }"
          required
        />
      </div>
      <div class="modal-footer mb-3">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addPosition"
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
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isEditMode"
          @click="editPosition"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </button>
        <button class="btn btn-secondary" @click="closeAddPositionPopup">
          {{ t("buttonCancel") }}
        </button>
      </div>
    </Popup>
    <div class="delete-popup">
      <Popup
        :isOpen="isDeleteConfirmPopupOpen"
        :closePopup="closeDeleteConfirmPopup"
      >
        <div class="mb-5">
          <a>{{ t("deleteConfirmSentence") }}</a>
        </div>
        <div class="modal-footer mb-3">
          <button
            :disabled="isLoading"
            class="btn btn-danger me-3"
            @click="deletePosition"
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
        <h3>{{ $t("validate_popupError") }}</h3>
        <ul>
          <li v-for="(msg, index) in errorMessages" :key="index">{{ msg }}</li>
        </ul>
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
import Popup from "../components/popup.vue";
import tableList from "../components/tableList.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import jsPDF from "jspdf";
import { computed } from "vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Positions",
  components: {
    Navigate, // Navigation component
    Popup, // Popup component
    tableList, // Table component to display departments and positions
  },
  setup() {
    const { t } = useI18n(); // Setup translation

    const documentName = computed(() => t("dontHavePosition"));
    return { t, documentName };
  },
  data() {
    return {
      errorMessages: [],
      isPopupVisible_error: false, // For error message popups
      isPopupOpen: false, // For department add/edit popup
      isDeleteConfirmPopupOpen: false, // For delete confirmation popup
      isManagePositionPopupOpen: false, // For managing positions popup
      isAddPositionPopupOpen: false, // For add/edit position popup
      Departments: [], // Array to hold department data
      Positions: [], // Array to hold position data
      isLoading: false, // Loading state
      isPopupVisible: false, // For success message popup
      inputError: false, // Validation flag for inputs
      formData: {
        // Form data for department
        departmentID: "",
        departmentName: "",
      },
      formPosition: {
        // Form data for position
        PositionID: "",
        Position: "",
      },
      isEmpty: {
        // Form data for position
        PositionID: "",
        Position: "",
      },
    };
  },
  computed: {
    // Define table headers for department table
    tableHeaders() {
      return [
        { label: this.t("departNameHeaderTable"), key: "Department Name" },
        { label: this.t("employeeNumHeaderTable"), key: "Employee" },
      ];
    },
    // Define table headers for position table
    tableHeadersPosition() {
      return [{ label: this.t("positionHeaderTable"), key: "Position" }];
    },
  },
  methods: {
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    async validateFormData() {
      this.isEmpty.Position = false;

      const errorMessages = [];

      if (this.formPosition.Position.trim() === "") {
        this.isEmpty.Position = true;
        errorMessages.push(this.$t("validation.Position"));
      }

      const isDuplicate = this.Positions.some(
        (item) =>
          item["Position"].trim() === this.formPosition.Position.trim() &&
          item.ID !== this.formPosition.Position // ตรวจสอบว่าข้อมูลไม่ได้เป็นตัวเอง
      );
      if (isDuplicate) {
        this.isEmpty.Position = true;
        errorMessages.push(this.$t("validation.positionDup"));
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
    // Opens the department add/edit popup
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true; // Add mode
      this.isEditMode = false; // Disable edit mode
    },
    // Closes the department add/edit popup
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        // Reset form data
        departmentID: "",
        departmentName: "",
      };
      this.inputError = false; // Reset validation errors
      this.isPopupVisible_error = false;
    },
    // Closes the delete confirmation popup
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    // Opens the manage position popup
    openManagePositionPopup() {
      this.isManagePositionPopupOpen = true;
    },
    // Closes the manage position popup
    closeManagePositionPopup() {
      this.isManagePositionPopupOpen = false;
    },
    // Opens the position add/edit popup
    openAddPositionPopup() {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = true; // Add mode
      this.isEditMode = false; // Disable edit mode
    },
    // Closes the position add/edit popup
    closeAddPositionPopup() {
      this.isAddPositionPopupOpen = false;
      this.formPosition = {
        // Reset form data
        PositionID: "",
        Position: "",
      };
      this.inputError = false; // Reset validation errors
    },
    // Opens the edit popup with selected department data
    handleEdit(item) {
      this.isPopupOpen = true;
      this.isAddingMode = false; // Edit mode
      this.isEditMode = true; // Enable edit mode
      this.formData = {
        // Fill form with selected data
        departmentID: item.ID,
        departmentName: item["Department Name"],
      };
    },
    // Opens the delete confirmation popup for department
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { departmentID: item.ID }; // Store department ID for deletion
    },
    // Opens the edit popup with selected position data
    handleEditPosition(item) {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = false; // Edit mode
      this.isEditMode = true; // Enable edit mode
      this.formPosition = {
        // Fill form with selected data
        PositionID: item.ID,
        Position: item.Position,
      };
    },
    // Opens the delete confirmation popup for position
    handleDeletePosition(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formPosition = { PositionID: item.ID }; // Store position ID for deletion
    },
    // Displays a success popup message
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false; // Auto-hide after 2 seconds
      }, 2000);
    },
    // Displays an error popup message
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible_error = false; // Auto-hide after 2 seconds
      }, 2000);
    },
    // Fetches the list of departments from the API
    async getDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getDepartment`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          // Map response to table format
          this.Departments = json.data.map((item) => ({
            ID: item.departmentID,
            "Department Name": item.departmentName,
            Employee: item.sumEmployee,
          }));
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // Adds a new department via API call
    async addDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formData.departmentName === "") {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        try {
          const response = await fetch(`${API_CALL}/employee/AddDepartment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              departmentName: this.formData.departmentName,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getDepartment(); // Refresh department list
            this.showPopup(this.$t("validation.AddSucc"));
            this.closePopup();
          } else {
            this.showPopup_error(json.data);
          }
        } catch (error) {
          console.error("Error adding department:", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    // Edits an existing department via API call
    async editDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formData.departmentName === "") {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        const departmentID = this.formData.departmentID;
        try {
          const response = await fetch(
            `${API_CALL}/employee/EditDepartment/${departmentID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                departmentName: this.formData.departmentName,
              }),
            }
          );
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getDepartment(); // Refresh department list
            this.showPopup(this.$t("validation.EditSucc"));
            this.closePopup();
          } else {
            this.showPopup_error(json.data);
          }
        } catch (error) {
          console.error("Error editing department:", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    // Deletes a department via API call
    async deleteDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const departmentID = this.formData.departmentID;
      try {
        const response = await fetch(
          `${API_CALL}/employee/DeleteDepartment/${departmentID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getDepartment(); // Refresh department list
          this.showPopup(this.$t("validation.DelateSucc"));
          this.closeDeleteConfirmPopup();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error deleting department:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // Fetches the list of positions from the API
    async getPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getPosition`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        console.log(json.data);

        if (json.statusCode === 200) {
          // Map response to table format
          this.Positions = json.data.map((item) => ({
            ID: item.PositionID,
            Position: item.Position,
          }));
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // Adds a new position via API call
    async addPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      // if (this.formPosition.Position === "") {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill data");
      // } else {
      //   this.inputError = false;
      //   this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/AddPosition`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ Position: this.formPosition.Position }),
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getPosition(); // Refresh position list
          this.showPopup(this.$t("validation.AddSucc"));
          this.closeAddPositionPopup();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error adding position:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
    // Edits an existing position via API call
    async editPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formPosition.Position === "") {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        const PositionID = this.formPosition.PositionID;
        try {
          const response = await fetch(
            `${API_CALL}/employee/EditPosition/${PositionID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ Position: this.formPosition.Position }),
            }
          );
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getPosition(); // Refresh position list

            this.showPopup(this.$t("validation.EditSucc"));

            this.closeAddPositionPopup();
          } else {
            this.showPopup_error(json.data);
          }
        } catch (error) {
          console.error("Error editing position:", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    // Deletes a position via API call
    async deletePosition() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const PositionID = this.formPosition.PositionID;
      try {
        const response = await fetch(
          `${API_CALL}/employee/DeletePosition/${PositionID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();
        if (json.statusCode === 200) {
          this.getPosition(); // Refresh position list
          this.showPopup(this.$t("validation.DelateSucc"));
          this.closeDeleteConfirmPopup();
        } else {
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error deleting position:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  // Fetches department and position data when the component is created
  created() {
    this.getDepartment();
    this.getPosition();
  },
};
</script>
