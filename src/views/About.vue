<template>
  <div class="main-page">
    <div class="page-body">
      <div class="mb-3">
        <h2>{{ t("headerAbout") }}</h2>
      </div>
      <div class="mt-3">
    <div class="about-business-contain">
          <div
            v-for="field in fieldConfig"
            :key="field.key"
            class="mb-3 mt-3"
            :class="field.key === 'bank_name' ? 'edit_about' : ''"
          >
            <label class="col-sm-5 col-md-6">{{ t(field.label) }}</label>

            <template v-if="isShowing">
              <img
                v-if="field.type === 'image'"
                :src="formData[field.key]"
                class="image_exp"
              />
              <a v-else>{{ formData[field.key] }}</a>
            </template>

            <template v-if="isEditMode">
              <Dropdown
                v-if="field.componentType === 'dropdown'"
                v-model="formData[field.key]"
                :options="bankOptions"
                :error="isEmpty[field.key]"
              />
              <div v-else-if="field.componentType === 'upload'">
                <TextField type="file" @change="handleFileUpload" />
                <br />
                <img
                  :src="exp_files || formData[field.key]"
                  alt="Uploaded Image"
                  class="image_exp"
                />
              </div>
              <TextField
                v-else
                v-model="formData[field.key]"
                :error="isEmpty[field.key]"
                :type="field.type"
                :maxlength="field.key === 'bus_tel' ? 10 : field.key === 'bus_tax' ? 13 : field.key === 'bank_number' ? 15 : null"
              />
            </template>
          </div>
          <div class="modal-footer">
            <Button
              v-if="isShowing"
              @click="handleEdit"
              customClass="btn btn-primary"
            >
              {{ t("buttonEdit") }}
            </Button>
            <Button
              v-if="isEditMode"
              :disabled="isLoading"
              customClass="btn btn-primary me-3"
              @click="editBusiness"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>{{ t("buttonSave") }}</span>
            </Button>
            <Button
              customClass="btn btn-secondary"
              v-if="isEditMode"
              @click="closeEdit"
            >
              {{ t("buttonCancel") }}
            </Button>
            </div>
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
        <div v-if="isPopupVisible_error" class="popup-error2">
          <div class="text-end">
            <Button
              @click="closeErrorPopup"
              type="button"
              customClass="btn-close"
            >
            </Button>
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
    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>
<script>
import Navigate from "../components/Navigation.vue";
import Button from "../components/button.vue"; // Changed
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import Dropdown from "../components/dropdown.vue";
import TextField from "../components/textField.vue";
import formConfig from "../config/field_config/about/form_about_business.json";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "About",
  components: {
    Navigate,
    Button, // Changed
    Dropdown,
    TextField,
    formConfig
  },
  setup() {
    const { t } = useI18n();

    return {
      t,
    };
  },
  data() {
    return {
      fieldConfig: formConfig, // กำหนดค่าที่ import มา
      isPopupVisible_error: false,
      Business: [],
      bus_data: [],
      Image_bus: [],
      exp_files: [],
      AllBanks: [],
      BusinessJson: [],
      isShowing: true,
      isEditMode: false,
      isLoading: false,
      isPopupVisible: false,
      formData: {
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
      },
      isEmpty: {
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
      },
    };
  },
  computed: {
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
  },
  methods: {
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // Allow only numbers
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    closeEdit() {
      this.isEditMode = false;
      this.isShowing = true;
      this.exp_files = "";
      this.isPopupVisible_error = false;
      this.getBusiness();
      this.getBanks();
    },
    //send data to edit mode
    handleEdit(item) {
      console.log("Edit item:", item);
      this.isEditMode = true;
      this.isShowing = false;
      this.exp_files = this.formData.bus_logo;
    },
    //choose file for upload
    handleFileUpload(event) {
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
    //popup success message (set message where call this function)
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      this.isPopupVisible_error = false;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000); // 2 seconds
    },
    validateFormData() {
      // รายชื่อฟิลด์ทั้งหมดที่ต้องตรวจสอบ
      let fieldsToCheck = [
        "bus_id",
        "bus_name",
        "bus_address",
        // "bus_website",
        "bus_tel",
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

      // ตรวจสอบฟิลด์เว้นว่าง และกรณีพิเศษ
      fieldsToCheck.forEach((field) => {
        const value = this.formData[field];

        // ถ้าฟิลด์ว่าง
        if (!value) {
          this.isEmpty[field] = true;
          errorMessages.push(this.$t(`validation.${field}`));
        } else {
          // ตรวจสอบเฉพาะเบอร์โทรต้องเป็นตัวเลข 10 หลัก
          if (field === "userPhone" && !/^\d{9,10}$/.test(value)) {
            this.isEmpty.userPhone = true;
            errorMessages.push(this.$t("validation.phone_invalid"));
          }
          if (field === "bus_tel" && !/^\d{9,10}$/.test(value)) {
            this.isEmpty.bus_tel = true;
            errorMessages.push(this.$t("validation.phone_invalid"));
          }
          // ตรวจสอบเฉพาะ email ต้องมีรูปแบบที่ถูกต้อง
          if (
            field === "userEmail" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ) {
            this.isEmpty.userEmail = true;
            errorMessages.push(this.$t("validation.email_invalid"));
          }
          if (field === "bank_number" && !/^\d{10,13}$/.test(value)) {
            this.isEmpty.bank_number = true;
            errorMessages.push(this.$t("validation.bank_account_invalid"));
          }
          // bus_tax: ถ้ามีการกรอก ต้องเป็นตัวเลข 10-13 หลัก
          if (field === "bus_tax" && !/^\d{10,13}$/.test(value)) {
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
    //popup error message (set message where call this function)
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000); // 2 seconds
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    //call api for add business data
    async editBusiness() {
      const accessToken = localStorage.getItem("@accessToken");
      console.log("Add Business ");

      // if (
      //   this.formData.bus_tel.length < 9 ||
      //   this.formData.bus_tel.length > 10
      // ) {
      //   this.showPopup_error("Phone number must be 9 or 10 digits");
      //   return;
      // }
      // if (this.formData.bus_tax.length != 13) {
      //   this.showPopup_error("tax must be 13 digits");
      //   return;
      // }
      // if (this.formData.bank_number.length < 10) {
      //   this.showPopup_error("Bank account ID must be 10 digits");
      //   return;
      // }
      try {
        if (!this.validateFormData()) return;
        this.isLoading = true;
        //Set data in the form to be used only when sending data with an image
        const formDataBusiness = new FormData();
        formDataBusiness.append("bus_id", this.formData.bus_id);
        formDataBusiness.append("bus_name", this.formData.bus_name);
        formDataBusiness.append("bus_address", this.formData.bus_address);
        formDataBusiness.append("bus_website", this.formData.bus_website);
        formDataBusiness.append("bus_tel", this.formData.bus_tel);
        formDataBusiness.append("bus_tax", this.formData.bus_tax);
        formDataBusiness.append("file", this.Image_bus);
        formDataBusiness.append("bank_name", this.formData.bank_name);
        formDataBusiness.append("bank_account", this.formData.bank_account);
        formDataBusiness.append("bank_number", this.formData.bank_number);
        formDataBusiness.append("bank_id", this.BusinessJson.business.bank_id);

        for (const [key, value] of formDataBusiness.entries()) {
          console.log(`${key}: ${value}`);
        }
        const busID = this.formData.bus_id;
        const response = await fetch(
          `${API_CALL}/Quotation/editBusiness/${busID}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formDataBusiness,
          }
        );
        // console.log(formDataBusiness);
        // return;
        const json = await response.json();
        if (json.statusCode === 200) {
          console.log(json);
          console.log("Edit success");
          this.showPopup(this.$t("validation.EditSucc"));
          this.closeEdit();
          await this.getBusiness();
          await this.getBanks();
        } else {
          this.showPopup_error(json.data);
          console.log("Add Business error", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    //call api get business data
    async getBusiness() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getBusinessByID`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        this.BusinessJson = json.data;
        // console.log(this.BusinessJson.business.bank_id);
        if (json.statusCode === 200 && json.data) {
          //sendata to formData
          this.formData = {
            bus_id: json.data.business.bus_id || "",
            bus_name: json.data.business.bus_name || "",
            bus_address: json.data.business.bus_address || "",
            bus_website: json.data.business.bus_website || "",
            bus_tel: json.data.business.bus_tel || "",
            bus_tax: json.data.business.bus_tax || "",
            bus_logo: json.data.business.bus_logo || "",
            bank_name:
              json.data.business.banks && json.data.business.banks[0]
                ? json.data.business.banks[0].bank_name
                : "",
            bank_account:
              json.data.business.banks && json.data.business.banks[0]
                ? json.data.business.banks[0].bank_account
                : "",
            bank_number:
              json.data.business.banks && json.data.business.banks[0]
                ? json.data.business.banks[0].bank_number
                : "",
          };
          console.log(this.formData);
        } else {
          console.log("No data found:", json);
          this.showPopup_error("No data found");
          this.formData = {
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
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        this.showPopup_error("Error fetching data");
      } finally {
        this.isLoading = false;
      }
    },
    async getBanks() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getBank`, {
          method: "GET", // เปลี่ยน method เป็น 'POST'
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // เพิ่ม header Content-Type
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.AllBanks = json.data;
          const bank_detail = this.AllBanks.filter(
            (bank) => bank.bank_id === this.BusinessJson.business.bank_id
          );

          this.formData.bank_name = bank_detail[0].bank_name;
          this.formData.bank_account = bank_detail[0].bank_account;
          this.formData.bank_number = bank_detail[0].bank_number;
        } else {
          this.showPopup_error(json.data);
          console.log("Employee ", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    await this.getBusiness();
    await this.getBanks();
  },
};
</script>
