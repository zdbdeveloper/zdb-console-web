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
      parents: [
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
      children: [
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
      parents: () => {
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
          }
        })
      },
      children: () => {
        return this.items.map(item => {
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
            cpuUsage: { rate: getUsageRate(item, 'cpu'), usage: item.status.resources?.cpuUsage } || {},
            memoryUsage: { rate: getUsageRate(item, 'memory'), usage: item.status.resources?.memoryUsage } || '',
            storage: item.status.storage?.data || '',
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