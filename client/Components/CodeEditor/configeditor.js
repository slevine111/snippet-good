const addClosingCurlyBracket = (editor, editorSession) => {
  const cursorPosition = editor.getCursorPosition()
  const enteredCharacterPosition = {
    start: { ...cursorPosition },
    end: { ...cursorPosition, column: cursorPosition.column + 1 }
  }
  const { end } = enteredCharacterPosition
  const nextCharacterPosition = {
    start: end,
    end: { ...end, column: end.column + 1 }
  }
  if (
    editorSession.getTextRange(enteredCharacterPosition) === '{' &&
    editorSession.getTextRange(nextCharacterPosition) !== '}'
  ) {
    editorSession.insert(nextCharacterPosition.start, '}')
  }
}

const excludeCodePromptInStretchAnswer = (
  codePromptRowCount,
  editorSession
) => {
  let documentRowCount = editorSession.getLength()
  const arrayOfStretchLines = editorSession.getLines(
    codePromptRowCount,
    documentRowCount
  )
  return arrayOfStretchLines.reduce((acc, line) => {
    acc += `${line} \n`
    return acc
  }, [])
}

const configEditor = function(
  editor,
  editorSession,
  userOptions,
  handleCodeChange,
  codeTargetName,
  codePromptRowCount
) {
  const { initialCode, editorTheme, language, readOnly } = userOptions
  editorSession.setMode(`ace/mode/${language}`)
  if (initialCode) editor.setValue(initialCode)
  if (editorTheme) editor.setTheme(`ace/theme/${editorTheme}`)
  editor.setReadOnly(readOnly)

  editor.setShowPrintMargin(false)
  editor.setOptions({ minLines: 15 })
  editor.setOptions({ maxLines: 40 })
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    fontSize: 18,
    enableSnippets: true
  })

  editorSession.on('change', () => {
    addClosingCurlyBracket(editor, editorSession)
    handleCodeChange({
      target: {
        name: codeTargetName,
        value: `${
          codeTargetName === 'code'
            ? excludeCodePromptInStretchAnswer(
                codePromptRowCount,
                editorSession
              )
            : editorSession.getValue()
        }`
      }
    })
  })
}

export default configEditor
