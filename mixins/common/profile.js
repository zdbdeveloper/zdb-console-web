import { mapState, mapActions } from 'vuex'

export const profile = {
  data () {
    return {
      _loaded: false
    }
  },
  computed: {
    ...mapState('profile', 'realm,realms,project,projects,user'.split(','))
  },
  methods: {
    ...mapActions('profile', { _load: 'load' }),
    // for initialize
    _subscribe (mutation, state) {
      if (mutation.type === 'profile/update') {
        console.debug('[mixins/commmon/profile.js] - profile/update is changed', { component: this._name })
        !this._loaded && this.loaded()
        this._loaded = true
      }
    },
    loaded () {}
  },
  created () {
    console.debug('[mixins/commmon/profile.js] - Start created()', { component: this._name, realm: this.realm })
    // const project = findPathVariables(this.$route)
    this._unsubscribe = this.$store.subscribe(this._subscribe)
    this._load()
    console.debug('[mixins/commmon/profile.js] - End   created()', { component: this._name, realm: this.realm })
  },
  beforeRouteLeave (to, from, next) {
    console.debug('[mixins/commmon/profile.js] - Unsubscribe mutation', { component: this._name })

    this._unsubscribe()
    next()
  }
}
