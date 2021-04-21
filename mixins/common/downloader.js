import { saveAs } from 'file-saver'

export const downloader = {
  methods: {
    _saveAs (content, filename, type) {
      const blob = new Blob([content], { type: (type || 'text/plain;charset=utf-8') })
      saveAs(blob, filename)
    }
  }
}
