<template>
  <div>
    <h2>Buttons</h2>
    <CButton color="primary" class="my-0" size="sm" @click="toast()">
      <CIcon name="cil-check-circle"/>
      <span class="icon-text ml-1">toast</span>
    </CButton>
    <CButton color="secondary" class="my-0" size="sm" @click="toastError()">
      <CIcon name="cil-arrow-circle-left"/>
      <span class="icon-text ml-1">Cancel</span>
    </CButton>
    <CButton color="success" size="sm">
      <font-awesome-icon icon="plus-circle" class="c-icon mr-2 align-middle"/>
      <span class="align-middle">Add</span>
    </CButton>
    <CButton color="danger" size="sm" @click="confirm()">
      <font-awesome-icon icon="times-circle" class="c-icon mr-2 align-middle"/>
      <span class="align-middle">Delete</span>
    </CButton>
    <CButton color="primary" @click="alert()">
      <CIcon class="mr-1" name="cil-asterisk-circle"/>
      Request
    </CButton>
    <CButton color="info">
      <CIcon class="mr-1" name="cil-asterisk-circle"/>
      Request
    </CButton>
    <CButton color="info" size="sm" class="ml-2" style="margin-top: -5px;">
      <CIcon name="cil-clone"/>
    </CButton>
    <CButton v-tooltip.top="{ content: 'Delete' }" color="danger" size="sm" class="mx-1">
      <CIcon class="m-0" name="cil-trash"/>
    </CButton>
    <CButton type="button" size="sm" color="success">
      <CIcon name="cil-data-transfer-down"/>
      <span class="icon-text ml-1">Download</span>
    </CButton>
    <CButton color="warning" size="sm" class="mx-1">
      <CIcon class="m-0" name="cil-pencil"/>
    </CButton>
    <CForm>
      <CRow>
        <CCol tag="label" sm="2" class="col-form-label">
          <CInput
            v-model="value"
            placeholder="0000"/>
        </CCol>
        <CCol sm="9">
          <CButton v-clipboard:copy="value"
                   v-clipboard:success="copySuccess"
                   v-clipboard:error="copyError"
                   style="margin-top: 6px;">
            <CIcon name="cil-clone"/>
          </CButton>
        </CCol>
      </CRow>
    </CForm>
    <h2>Tables</h2>
    <CDataTable
      :fields="usage_fields"
      :items="riskUsageCpu"
      hover
      pagination
      sorter
      striped
    >
      <template #Provider="{item}">
        <td class="text-center">
          <img :alt="item.Provider" :src="providerIcon(item.Provider)" width="22">
        </td>
      </template>
      <template #Status="data">
        <td class="text-center">
          <template v-for="s in data.item.Status">
            <template v-if="statusIcon(s) === 'Ready'">
              <CBadge :key="s" color="success">
                {{ statusIcon(s) }}
              </CBadge>
              <br :key="s">
            </template>
            <template v-if="statusIcon(s) === 'Not Ready'">
              <CBadge :key="s" color="danger">
                {{ statusIcon(s) }}
              </CBadge>
              <br :key="s">
            </template>
            <template v-if="statusIcon(s) === 'Unknown'">
              <CBadge :key="s" color="secondary">
                {{ statusIcon(s) }}
              </CBadge>
              <br :key="s">
            </template>
            <template v-if="statusIcon(s) === 'Scheduling Disabled'">
              <CBadge :key="s" color="secondary">
                {{ statusIcon(s) }}
              </CBadge>
              <br :key="s">
            </template>
          </template>
        </td>
      </template>
      <template #Health="{item}">
        <td class="text-center">
          <font-awesome-icon v-if="item.health === 'green'" icon="check-circle" class="c-icon mt-1 text-success"/>
          <font-awesome-icon v-else-if="item.health === 'yellow'" icon="exclamation-circle"
                             class="c-icon mt-1 text-warning"/>
          <font-awesome-icon v-else-if="item.health === 'red'" icon="exclamation-circle"
                             class="c-icon mt-1 text-danger"/>
          <font-awesome-icon v-else icon="question-circle" class="c-icon mt-1 text-secondary"/>
        </td>
      </template>
      <template #CPU_Usage="{item}">
        <td>
          <div class="clearfix" style="min-width: 160px;">
            <div class="float-left">
              <strong>{{ item.CPU_Usage.value }} %</strong>
            </div>
            <div class="float-right">
              <small class="text-muted">{{ item.CPU_Usage.range }} / {{ item.CPU_Usage.full }}</small>
            </div>
          </div>
          <CProgress
            v-model="item.CPU_Usage.value"
            :color="color(item.CPU_Usage.value)"
            class="progress-xs"
          />
        </td>
      </template>
      <template #Memory_Usage="{item}">
        <td>
          <div class="clearfix" style="min-width: 160px;">
            <div class="float-left">
              <strong>{{ item.Memory_Usage.value }} %</strong>
            </div>
            <div class="float-right">
              <small class="text-muted">{{ item.Memory_Usage.range }} / {{ item.Memory_Usage.full }}</small>
            </div>
          </div>
          <CProgress
            v-model="item.Memory_Usage.value"
            :color="color(item.Memory_Usage.value)"
            class="progress-xs"
          />
        </td>
      </template>
    </CDataTable>
    <h2>Tabs</h2>
    <CTabs @update:activeTab="activeTab = $event">
      <CTab active>
        <template slot="title">
          <CIcon name="cil-list-rich" class="mr-2"/>
          Overview
        </template>
        <CRow>
          <CCol sm="6">
            <CWidgetProgress class="custom-card">
              lala
              <img src="/img/services/service-img-big-mariadb.png" width="70" height="70">
            </CWidgetProgress>
          </CCol>
        </CRow>
      </CTab>
      <CTab active>
        <template slot="title">
          <CIcon name="cil-compass" class="mr-2"/>
          Add-ons
        </template>
        <CRow>
          <CCol sm="6">
            <CWidgetProgress class="custom-card">
              lalabla
            </CWidgetProgress>
          </CCol>
        </CRow>
      </CTab>
    </CTabs>
    <h2>Cards</h2>
    <CRow class="card-dash-group">
      <CCol lg="12" xl="10" class="card-dash-icon-group">
        <CRow>
          <CCol sm="6" lg="6" xl="3">
            <CWidgetIcon
              :header="'backup-test-cuj'"
              :icon-padding="true"
              text="MariaDB"
              color="primary"
            >
              <CIcon name="cil-pencil" width="24"/>
            </CWidgetIcon>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { dialog } from "~/mixins";
const usage_fields = [
  { key: "Provider", _style: "text-align: center;" },
  { key: "Cluster", _style: "text-align: center;" },
  { key: "Node", _style: "text-align: center;" },
  { key: "Roles", _style: "text-align: center;" },
  { key: "Status", _style: "text-align: center;" },
  { key: "CPU_Usage", label: "CPU Usage", _style: "text-align: center;" },
  { key: "Memory_Usage", label: "Memory Usage", _style: "text-align: center;" },
  { key: "Age", _style: "text-align: center;" }
];
const riskUsageCpu = [
  {
    Provider: "IBM",
    Cluster: "cloudzcp-pog-dev",
    Node: "10.178.218.148",
    Roles: "zdb",
    Status: ["READY"],
    Helath: "green",
    CPU_Req: { value: 15.62, full: "1920m", range: "1413m" },
    CPU_Limit: { value: 73.59, full: "1920m", range: "300m" },
    Memory_Req: { value: 17.06, full: "2861Mi", range: "2211Mi" },
    Memory_Limit: { value: 77.28, full: "2861Mi", range: "488Mi" },
    CPU_Usage: { value: 51.15, full: "1920m", range: "982m" },
    Memory_Usage: { value: 107.58, full: "2861Mi", range: "3078Mi" },
    Age: "647d",
    _cellClasses: {
      Cluster: "text-center",
      Node: "text-center",
      Roles: "text-center",
      Age: "text-center"
    }
  },
  {
    Provider: "AWS",
    Cluster: "cloudzcp-zdb-dev",
    Node: "10.178.218.177",
    Roles: "zdb",
    Status: ["NOTREADY"],
    Helath: "yellow",
    CPU_Req: { value: 455.86, full: "3910m", range: "2304m" },
    CPU_Limit: { value: 58.93, full: "3910m", range: "17824m" },
    Memory_Req: { value: 111.46, full: "13315Mi", range: "4664Mi" },
    Memory_Limit: { value: 35.03, full: "13315Mi", range: "14841Mi" },
    CPU_Usage: { value: 43.32, full: "3910m", range: "1694m" },
    Memory_Usage: { value: 98.43, full: "13315Mi", range: "13106Mi" },
    Age: "504d",
    _cellClasses: {
      Cluster: "text-center",
      Node: "text-center",
      Roles: "text-center",
      Age: "text-center"
    }
  }
];
export default {
  mixins: [dialog],
  data() {
    return {
      value: "0000",
      usage_fields,
      riskUsageCpu,
      activeTab: 0
    };
  },
  methods: {
    toast() {
      this._toast("_toast() BUTTON CLICKED !!"); //dialog mixin 함수.
    },
    toastError() {
      this._toast_err("_toast_err() BUTTON CLICKED !!"); //dialog mixin 함수.
    },
    confirm() {
      this._confirm("_confirm() CONFIRM CREATED !!"); //dialog mixin 함수.
    },
    alert() {
      this._alert("_alert() ALERT CREATED !!"); //dialog mixin 함수.
    },
    copySuccess(e) {
      this._toast(this.$t("copy.success") + ` ${e.text}`); //$t -> static.locale 값을 가져온다.
    },
    copyError(e) {
      this._toast(this.$t("copy.fail") + ` ${e.text}`); // $t -> static.locale 값을 가져온다.
    },
    providerIcon(provider) {
      const icons = {
        AZURE: "/img/brand/img_logo_azure.png",
        AWS: "/img/brand/img_logo_aws.png",
        IBM: "/img/brand/img_logo_ibm.png",
        GKE: "/img/brand/img_logo_gcs.png"
      };
      return icons[provider];
    },
    statusIcon(status) {
      const icons = {
        READY: "Ready",
        NOTREADY: "Not Ready",
        UNKNOWN: "Unknown",
        SCHEDULINGDISABLED: "Scheduling Disabled"
      };
      return icons[status];
    },
    color(value) {
      let $color;
      if (value <= 25) {
        $color = "info";
      } else if (value > 25 && value <= 50) {
        $color = "success";
      } else if (value > 50 && value <= 75) {
        $color = "warning";
      } else if (value > 75 && value <= 100) {
        $color = "danger";
      } else if (value > 100) {
        $color = "danger";
      }
      return $color;
    }
  }
};
</script>
<style></style>
