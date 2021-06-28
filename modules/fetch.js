export class Fetch {
  // You can add the URIS and call it.
  static getUri(id) {
    let uris = {
      profile: `/api/v2/profile`,
      datastore_parents: `/api/v2/projects/${this._projectid}/datastorereleases`,
      datastore_children: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores?cluster=${this._cluster}`,
      mariadb_connections: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/connection?cluster=${this._cluster}`,
      mariadb_processes: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/processes?cluster=${this._cluster}`,
      mariadb_processKill: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/pid/${this._target}?cluster=${this._cluster}`,
      mariadb_statusVariables: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/statusVariables?cluster=${this._cluster}`,
      mariadb_systemVariables: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/systemVariables?cluster=${this._cluster}`,
    }
    // let server ='http://localhost:4000'
    // let uris = {
    //   profile: `${server}/profile`,
    //   datastore_parents: `${server}/parents`,
    //   datastore_children: `${server}/children`,
    //   mariadb_connections: `${server}/mariadbConnections`,
    //   mariadb_processes: `${server}/mariadbProcesses`,
    //   mariadb_processKill: `${server}/mariadbProcessKill`,
    //   mariadb_statusVariables: `${server}/mariadbStatusVariables`,
    //   mariadb_systemVariables: `${server}/mariadbSystemVariables`,
    // }
    return uris[id] || null
  }
  static get(id) {
    let uri = this.getUri(id)
    return uri ? this.axios.$get(uri) : null
  }
  static post(id) {
    let uri = this.getUri(id)
    return uri ? this.axios.$post(uri) : null
  }
  static put(id) {
    let uri = this.getUri(id)
    return uri ? this.axios.$put(uri) : null
  }
  static delete(id) {
    let uri = this.getUri(id)
    return uri ? this.axios.$delete(uri) : null
  }
  static patch(id) {
    let uri = this.getUri(id)
    return uri ? this.axios.$patch(uri) : null
  }
  static set(args) {
    if (!args || typeof args != 'object') return this
    Object.entries(args).forEach(([key, value]) => {
      this['_' + key] = value
    })
    return this
  }
}