
export const provider = {
  methods: {
    providerImage (provider) {
      let $url
      if (provider == 'azure') {
        $url = '/img/brand/img_logo_azure.png'
      } else if (provider == 'aws') {
        $url = '/img/brand/img_logo_aws.png'
      } else if (provider == 'gcp') {
        $url = '/img/brand/img_logo_gcs.png'
      } else if (provider == 'ibm') {
        $url = '/img/brand/img_logo_ibm.png'
      } else if (provider == 'zcp') {
        $url = '/img/brand/img_logo_cloud.png'
      }
      return $url
    },
    providerAlt (provider) {
      let $alt
      if (provider == 'azure') {
        $alt = 'Microsoft Azure'
      } else if (provider == 'aws') {
        $alt = 'Amazon Web System'
      } else if (provider == 'gcp') {
        $alt = 'Google Clould System'
      } else if (provider == 'ibm') {
        $alt = 'IBM'
      } else if (provider == 'zcp') {
        $alt = 'Cloud Z'
      }
      return $alt
    },
    providerStatus (status) {
      let $text
      if (status == 'attached' || status == 'created') {
        $text = 'Ready'
      } else if (status != '') {
        $text = 'Stop'
      } else {
        $text = 'Unknown'
      }
      return $text
    },
    providerStatusColor (status) {
      let $color
      if (status == 'attached' || status == 'created') {
        $color = 'success'
      } else if (status != '') {
        $color = 'danger'
      } else {
        $color = 'secondary'
      }
      return $color
    }
  }
}
