class Log {
  static send(text, type = 'i') {
    let logType = '| DEBUG |'
    if (type === 'i') logType = '| INFO |'
    else if (type === 'w') logType = '| WARNING |'
    else if (type === 'e') logType = '| ERROR |'
    console.log(`${new Date().toJSON()} ${logType} ${text}`)
  }
}

export default Log