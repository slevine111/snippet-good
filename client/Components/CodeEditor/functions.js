import axios from 'axios'

const runCode = function(postPayload) {
  this.setState({ fileGenerated: false }, function() {
    return axios
      .post('/api/code/runcode', postPayload)
      .then(res => {
        const stateObject =
          postPayload.language === 'javascript'
            ? {
                codeResponse: String(res.data),
                codeError: ''
              }
            : {
                codeResponse: String(res.data.stringToConsole),
                codeError: '',
                fileGenerated: true
              }
        this.setState(stateObject)
      })
      .catch(({ response: { data } }) => {
        this.setState({ codeError: data, codeResponse: '' })
      })
  })
}

const clearCodeResults = function() {
  this.setState({ codeResponse: '', codeError: '', fileGenerated: false })
}

export default { runCode, clearCodeResults }
