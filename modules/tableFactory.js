const getAge = creationTime => {
  let elapsedTime = new Date().getTime() - new Date(creationTime).getTime()
    , times = elapsedTime / (1000 * 60 * 60 * 24)
    , days = Math.floor(times)
  return `${ days }d`
}
const getByteSize = (size) => {
  return (  
    ! /\D?(g|m)/gi.test(size)
    ? size?.replace(/\D/g, '') || 0
    : ( /\D?g/gi.test(size)
        ? size?.replace(/\D/g, '') * 1024 * 1024
        : size?.replace(/\D/g, '') * 1024 
      )
  )
}
const getUsageRate = (item, type) => {
  if (!/(cpu|memory)/i.test(type)
    || !item.status.resources?.cpuUsage
    || !item.status.resources?.cpuUsage) return 0
  let usage = 'cpu' == type
    ? item.status.resources.cpuUsage
    : item.status.resources.memoryUsage
    usage = getByteSize(usage)
  let maximum = 'cpu' == type
    ? item.status.resources.requestCpu
    : item.status.resources.requestMemory        
    maximum = getByteSize(maximum)
  let rate = 'cpu' == type ? 100 : 1
  return !usage || !maximum ? 0 : Math.round((usage/maximum) * rate)
}

const getUsageColor = (value = 0) => {
  if (value <= 25) return 'info'
  else if (value > 25 && value <= 50) return 'success'
  else if (value > 50 && value <= 75) return 'warning'
  else if (value > 75) return 'danger'
}

const getBadgeColor = (value = 0) => {
  switch (value) {
    case 'Running': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
export class TableFactory {
  constructor(args) {
    this.properties = args
    return this
  }
  set properties(args) {
    if (!args || typeof args != 'object') return
    Object.entries(args).forEach(([key, value]) => {
      this[key] = value
    })
  }
  get tableFields() {
    let data = {
      datastore_parents: [
        {key: "show_details", label: "", style: "width:1%", sorter: false, filter: false},
        {key: "namespace", label: "NAMESPACE", _style: 'min-width:100px'},
        {key: "name", label: "NAME", _style:'min-width:140px'},
        {key: "datastore", label: "DATASTORE"},
        {key: "version", label: "VERSION", _classes:'hide'},
        {key: "architecture", label: "ARCHITECTURE"},
        {key: "deployStatus", label: "DEPLOY\nSTATUS"},
        {key: "status", label: "STATUS"},
        {key: "ready", label: "READY"},
        {key: "requestCpu", label: "CPU\n(REQUEST)"},
        {key: "requestMemory", label: "MEMORY\n(REQUEST)"},
        {key: "storage", label: "STORAGE\n(DATA)"},
        {key: "message", label: "MESSAGE"},
        {key: "age", label: "AGE"}
      ],
      datastore_children: [
        {key: "namespace", label: "NAMESPACE"},
        {key: "name", label: "NAME", _style:'min-width:140px'},
        {key: "memberRole", label: "MEMBER\nROLE"},
        {key: "status", label: "STATUS"},
        {key: "ready", label: "READY"},
        {key: "nodeName", label: "HOST IP"},
        {key: "podIP", label: "POD IP"},
        {key: "workrPool", label: "WORKER POOL"},
        {key: "requestCpu", label: "CPU\n(REQUEST)"},
        {key: "requestMemory", label: "MEMORY\n(REQUEST)"},
        {key: "cpuUsage", label: "CPU\n(CORES)"},
        {key: "memoryUsage", label: "MEMORY\n(BYTES)"},
        {key: "storage", label: "STORAGE\n(DATA)"}
      ],
      mariadb_processes: [
        {key: "Id", label: "Id", style: "width:1%", sorter: false, filter: false},
        {key: "Progress", label: "Progress", _style: 'min-width:100px'},
        {key: "User", label: "User", _style:'min-width:140px'},
        {key: "Command", label: "Command"},
        {key: "State", label: "State"},
        {key: "Time", label: "Time"},
        {key: "Info", label: "Info"},
        {key: "db", label: "db"},
        {key: "kill", label: "", style: "width:1%", sorter: false, filter: false},
      ],
      mariadb_variables: [
        {key: "variable", label: "Variable"},
        {key: "value", label: "Value"},
      ]
    }
    return data[this.id]
  }
  get tableItems() {
    let metadata = (item) => {
      return {
        cluster: item.metadata.labels?.cluster,
        namespace: item.metadata.namespace,
        name: item.metadata.name,
      }
    }
    , data = {
      datastore_parents: () => {
        return this.items.map(item => {
          return {
            ...metadata(item),
            datastore: item.spec.datastore || '',
            version: item.spec.version || '',
            architecture: item.status.architecture || '',
            deployStatus: item.status.deployStatus || '',
            status: item.status.status || '',
            ready: item.status.ready || '',
            requestCpu: item.status.resources.requestCpu || '',
            requestMemory: item.status.resources.requestMemory || '',
            storage: item.status.storage.data || '',
            message: '',
            age: getAge(item.metadata.creationTimestamp),
            badgeColor: getBadgeColor(item.status.status)
          }
        })
      },
      datastore_children: () => {
        return this.items.map(item => {
          let cpuUsageRate = getUsageRate(item, 'cpu')
            , memoryUsageRate = getUsageRate(item, 'memory')
          return {
            ...metadata(item),
            datastore: item.spec.datastore || '',
            memberRole: item.status.memberRole || '',
            status: item.status.status || '',
            ready: item.status.ready || '',
            nodeName: item.status.nodeName || '',
            podIP: item.status.podIP || '',
            workrPool: item.status.workerPool || '',
            requestCpu: item.status.resources?.requestCpu || '',
            requestMemory: item.status.resources?.requestMemory || '',
            cpuUsage: { rate: cpuUsageRate, usage: item.status.resources?.cpuUsage } || {},
            memoryUsage: { rate: memoryUsageRate, usage: item.status.resources?.memoryUsage } || '',
            storage: item.status.storage?.data || '',
            cpuColor: getUsageColor(cpuUsageRate),
            memoryColor: getUsageColor(memoryUsageRate),
          }
        })
      },
      mariadb_processes: () => {
        return this.items.map(item => {
          return {
            Id: item.Id || '',
            Progress: item.Progress || '',
            User: item.User || '',
            Command: item.Command || '',
            State: item.State || '',
            Time: item.Time || '',
            Info: item.Info || '',
            db: item.db || '',
          }
        })
      },
      mariadb_variables: () => {
        return this.items.map(item => {
          return {
            variable: item[0] || '',
            value: item[1] || '',
          }
        })
      },
    }    
    return data[this.id]()
  }
  build(args) {
    this.properties = args
    return {
      tableFields: this.tableFields,
      tableItems: this.tableItems
    }
  }
}