import * as amqp from 'amqplib'
import { setTimeout } from 'timers/promises'
import Log from '../helpers/logger.js'

class MessageService {
  connection
  channel
  message

  async createChannel() {
    try {
      if (!this.connection) this.connection = await amqp.connect('amqp://user:password@rabbitmq-node-rabbit')
      this.channel = await this.connection.createChannel()
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
      this.channel.prefetch(1)
      const msg = await this.getMessage(queueName)
      this.channel.ack(msg)
      Log.send(`Сообщение id:${this.message.id} изъято из очереди ${queueName}`)
    } catch(e) {
      Log.send(e, 'e')
    }
  }

  async getMessage(queueName) {
    return new Promise((resolve) => {
      this.channel.consume(queueName, (msg) => {
        const msgData = JSON.parse(msg.content)
          this.message = msgData
          resolve(msg)
      })
    })
  }

  async handle(msg) {
    if (!this.channel) {
      await this.createChannel()
    }
    this.message = {}
    msg.id = Date.now().toString(36) + Math.random().toString(36).substring(2)
    msg.jobStartDateTime = new Date().toJSON()

    await this.publishQueue('messages', msg)
    await this.consumeQueue('result_messages')

    this.message.jobEndDateTime = new Date().toJSON()

    await this.channel.close()
    this.channel = undefined

    return {
      status: 'ok',
      message: this.message
    }
  }
}

export default new MessageService()