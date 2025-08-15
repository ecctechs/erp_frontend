<template>
  <div class="main-page">
    <div class="page-body">
      <div class="mb-4">
        <h2>{{ t("headerDepartment") }}</h2>
      </div>
      <div class="add-btn mb-3">
        <a class="btn btn-success size-font-sm" @click="openPopup">{{
          t("addDepartment")
        }}</a>
      </div>
      <div>
        <tableList
          :initialTableData="Departments"
          :tableHeaders="tableHeaders"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          v-if="Departments"
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
    <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <div class="mb-4">
        <h2 v-if="isAddingMode">{{ t("headerPopupAddDepartment") }}</h2>
        <h2 v-if="isEditMode">{{ t("headerPopupEditDepartment") }}</h2>
      </div>

      <div class="mb-3">
        <TextField
          v-model="formData.departmentName"
          :label="t('departName')"
          :error="isEmpty.departmentName"
          :required="true"
          id="input-text"
        />
      </div>
      <div class="modal-footer">
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addDepartment"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonAdd") }}</span>
        </Button>
        <Button
          :disabled="isLoading"
          customClass="btn btn-primary me-3"
          v-if="isEditMode"
          @click="editDepartment"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </Button>
        <Button customClass="btn btn-secondary" @click="closePopup">
          {{ t("buttonCancel") }}
        </Button>
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
          <Button
            :disabled="isLoading"
            customClass="btn btn-danger me-3"
            @click="deleteDepartment"
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
import Button from "../components/button.vue"; // 1. นำเข้า component
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import TextField from "../components/textField.vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Departments",
  components: {
    Navigate,
    Popup,
    tableList,
    Button, // 2. ลงทะเบียน component
    TextField,
  },
  setup() {
    const { t } = useI18n();
    const documentName = computed(() => t("dontHaveDepartment"));
    return { t, documentName };
  },
  data() {
    return {
      errorMessages: [],
      isPopupVisible_error: false,
      isPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isManagePositionPopupOpen: false,
      isAddPositionPopupOpen: false,
      Departments: [],
      Positions: [],
      isLoading: false,
      isPopupVisible: false,
      inputError: false,
      formData: {
        department_id: "",
        departmentName: "",
      },
      isEmpty: {
        department_id: false,
        departmentName: false,
      },
      formPosition: {
        position_id: "",
        position_name: "",
      },
    };
  },
  computed: {
    tableHeaders() {
      return [
        { label: this.t("departNameHeaderTable"), key: "Department Name" },
        { label: this.t("employeeNumHeaderTable"), key: "Employee" },
      ];
    },
    tableHeadersPosition() {
      return [{ label: this.t("positionHeaderTable"), key: "Position" }];
    },
  },
  methods: {
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    async validateFormData() {
      this.isEmpty.departmentName = false;

      const errorMessages = [];

      if (this.formData.departmentName.trim() === "") {
        this.isEmpty.departmentName = true;
        errorMessages.push(this.$t("validation.departmentName"));
      }

      const isDuplicateNDepartmentName = this.Departments.some(
        (item) =>
          item["Department Name"].trim() ===
            this.formData.departmentName.trim() &&
          item.ID !== this.formData.department_id
      );
      if (isDuplicateNDepartmentName) {
        this.isEmpty.departmentName = true;
        errorMessages.push(this.$t("validation.duplicateDepartmentName"));
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
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        department_id: "",
        departmentName: "",
      };
      this.inputError = false;
      this.isPopupVisible_error = false;
    },
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },
    openManagePositionPopup() {
      this.isManagePositionPopupOpen = true;
    },
    closeManagePositionPopup() {
      this.isManagePositionPopupOpen = false;
    },
    openAddPositionPopup() {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
    },
    closeAddPositionPopup() {
      this.isAddPositionPopupOpen = false;
      this.formPosition = {
        position_id: "",
        position_name: "",
      };
      this.inputError = false;
    },
    handleEdit(item) {
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formData = {
        department_id: item.ID,
        departmentName: item["Department Name"],
      };
    },
    handleDelete(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formData = { department_id: item.ID };
    },
    handleEditPosition(item) {
      this.isAddPositionPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formPosition = {
        position_id: item.ID,
        position_name: item.position_name,
      };
    },
    handleDeletePosition(item) {
      this.isDeleteConfirmPopupOpen = true;
      this.formPosition = { position_id: item.ID };
    },
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000);
    },
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible_error = false;
      }, 2000);
    },
    async getDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getDepartment`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Departments = json.data.map((item) => ({
            ID: item.department_id,
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
    async addDepartment() {
      if (!(await this.validateFormData())) return;
      const accessToken = localStorage.getItem("@accessToken");
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
          this.getDepartment();
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
    },
    async editDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formData.departmentName === "") {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        const departmentID = this.formData.department_id;
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
            this.getDepartment();
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
    async deleteDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const departmentID = this.formData.department_id;
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
          this.getDepartment();
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
    async getPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getPosition`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Positions = json.data.map((item) => ({
            ID: item.position_id,
            position_name: item.position_name,
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
    async addPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formPosition.position_name === "") {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        try {
          const response = await fetch(`${API_CALL}/employee/AddPosition`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ position_name: this.formPosition.position_name }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getPosition();
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
      }
    },
    async editPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      if (this.formPosition.position_name === "") {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;
        const PositionID = this.formPosition.position_id;
        try {
          const response = await fetch(
            `${API_CALL}/employee/EditPosition/${PositionID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ position_name: this.formPosition.position_name }),
            }
          );
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getPosition();
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
    async deletePosition() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const PositionID = this.formPosition.position_id;
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
          this.getPosition();
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
  created() {
    this.getDepartment();
    this.getPosition();
  },
};
</script>
