import CScrollbar from '@coreui/vue/src/components/scrollbar/CScrollbar'

export const scrollbar = {
  components: {
    CScrollbar
  },
  computed: {
    psSettings: () => {
      return {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollY: true,
        wheelPropagation: true,
        useBothWheelAxes: true
      }
    }
  },
  methods: {
    scrollHandle (evt) {
      console.debug(evt)
    }
  }
}
