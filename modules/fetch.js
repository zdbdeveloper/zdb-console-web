export class Fetch {
  static getUri(id) {
    let uris = {
      datastore_parents: `/api/v2/projects/${this._projectid}/datastorereleases`,
      datastore_children: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores?cluster=${this._cluster}`,
      mariadb_connections: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/connection?cluster=${this._cluster}`,
      mariadb_processes: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/processes?cluster=${this._cluster}`,
      mariadb_processKill: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/pid/68729?cluster=${this._cluster}`,
      mariadb_statusVariables: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/statusVariables?cluster=${this._cluster}`,
      mariadb_systemVariables: `/api/v2/projects/${this._projectid}/datastorereleases/${this._name}/datastores/${this._pod}/systemVariables?cluster=${this._cluster}`,
    }
    return uris[id] || null
  }
  static get(id) {
    let uri = this.getUri(id)
    return uri ? this.axios.$get(uri) : null
  }
  static set(args) {
    if (!args || typeof args != 'object') return this
    Object.entries(args).forEach(([key, value]) => {
      this['_' + key] = value
    })
    return this
  }
}