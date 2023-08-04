import * as amqp from 'amqplib'
import { setTimeout } from 'timers/promises'
import Log from '../helpers/logger.js'

class MessageService {
  connection
  channel

  async createChannel() {
    try {
      if (!this.connection) this.connection = await amqp.connect('amqp://user:password@rabbitmq-node-rabbit')
      this.channel = await this.connection.createChannel()
      Log.send('Соединение с RabbitMQ установлено', 'd')
    } catch(e) {
      Log.send('Подключаюсь к RabbitMQ...', 'd')
      // Для первой инициализации контейнера rabbitmq
      await setTimeout(20000)
      await this.createChannel()
    }
  }

  async publishQueue(queueName, msg) {
    try {
      await this.channel.assertQueue(queueName)
      await this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(msg))
      )
      Log.send(`Сообщение id:${msg.id} добавлено в очередь ${queueName}`)
    } catch(e) {
      Log.send(`Сообщение id:${msg.id} не добавлено в очередь ${queueName}`, 'e')
    }
  }

  async consumeQueue(queueName) {
    try {
      await this.channel.assertQueue(queueName)
      await this.channel.consume(queueName, async (msg) => {

        const newMsg = await this.addMessageInfo(queueName, msg)

        this.channel.ack(msg)
        Log.send(`Сообщение id:${newMsg.id} обработано и изъято из очереди ${queueName}`)

        await this.publishQueue('result_messages', newMsg)

      })
    } catch(e) {
      Log.send(e, 'e')
    }
  }

  async addMessageInfo(queueName, msg) {
    const msgData = JSON.parse(msg.content)
    Log.send(`Сообщение id:${msgData.id} из очереди ${queueName} обрабатывается...`)

    // Эмуляция длительности обработки задачи
    await setTimeout(Math.random() * 2000)

    return msgData
  }

  async handle() {
    if (!this.channel) {
      await this.createChannel()
    }
    process.once('SIGINT', async () => { 
      await this.channel.close()
      await this.connection.close()
    })

    await this.consumeQueue('messages')
  }
}

export default new MessageService()