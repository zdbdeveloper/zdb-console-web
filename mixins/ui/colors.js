
export const colors = {
  methods: {
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color
    },
    backgroundColor (value) {
      let $backgroundColor
      if (value <= 25) {
        $backgroundColor = '#3399ff'
      } else if (value > 25 && value <= 50) {
        $backgroundColor = '#2eb85c'
      } else if (value > 50 && value <= 75) {
        $backgroundColor = '#f9b115'
      } else if (value > 75 && value <= 100) {
        $backgroundColor = '#e55353'
      }
      return $backgroundColor
    }
  }
}
