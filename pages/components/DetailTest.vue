<template>
  <CTabs @update:activeTab="activeTab = $event">
    <br/>
    <CTab title="Overview">
      <CDataTable
        :items="table_items"
        :fields="table_fields"
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
            <template v-for="(s, k) in data.item.Status">
              <template v-if="statusIcon(s) === 'Ready'">
                <CBadge :key="k" color="success">
                  {{ statusIcon(s) }}
                </CBadge>
              </template>
              <template v-if="statusIcon(s) === 'Not Ready'">
                <CBadge :key="k" color="danger">
                  {{ statusIcon(s) }}
                </CBadge>
              </template>
              <template v-if="statusIcon(s) === 'Unknown'">
                <CBadge :key="k" color="secondary">
                  {{ statusIcon(s) }}
                </CBadge>
              </template>
              <template v-if="statusIcon(s) === 'Scheduling Disabled'">
                <CBadge :key="k" color="secondary">
                  {{ statusIcon(s) }}
                </CBadge>
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
    </CTab>
    <CTab title="환경설정">
      <CRow class="card-dash-group">
        <CCol lg="12" xl="10" class="card-dash-icon-group">
          <CRow>
            <CCol v-for="(v, k) in dbservers" :key="k"
              sm="6" lg="6" xl="3">
              <CWidgetIcon
                :header="v.title"
                :icon-padding="true"
                :text="v.text"
                :color="v.color"
              >
                <CIcon name="cil-pencil" width="24"/>
              </CWidgetIcon>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CTab>
    <CTab title="Disabled" disabled>
      Text will not be shown.
    </CTab>
  </CTabs>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      table_fields: [],
      table_items: [],
      dbservers: [],
    };
  },
  created() {
    this.fetchTables()
  },
  methods: {
    fetchTables() {
      const url = 'http://localhost:3004/mytables'
      this.$axios.$get(url, {}).then(res => {
        if (!res) return this.toastError()
        this.table_fields = res.table_fields.filter(item => item.key != 'show_details')
        this.table_items = res.table_items
      })
    },
    fetchConfiguration() {
      const url = 'http://localhost:3004/mytables'
      this.$axios.$get(url, {}).then(res => {
        if (!res) return this._toast_err("Fail to fetch data from the server")
        this.dbservers = res.dbservers
      })
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
  },
  watch: {
    activeTab (value) {
      if (1 === value) {
        this.fetchConfiguration()
      }
    }
  }
}
</script>

<style>

</style>