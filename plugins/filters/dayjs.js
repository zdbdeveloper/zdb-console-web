import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

const gaurd = (value, filter) => {
  try {
    const ret = filter(value)
    return ret !== 'Invalid Date' ? ret : value
  } catch (e) {
    console.debug(e)
    return value
  }
}

const filters = {
  // https://day.js.org/docs/en/display/format
  date (value) {
    return gaurd(value, v => dayjs(v).format('YYYY-MM-DD'))
  },
  datetime (value) {
    return gaurd(value, v => dayjs(v).format('YYYY-MM-DD HH:mm:ss'))
  },
  datemin (value) {
    return gaurd(value, v => dayjs(v).format('YYYY-MM-DD HH:mm'))
  }
}

export default { ...filters }
