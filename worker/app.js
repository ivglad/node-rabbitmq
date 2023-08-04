import express from 'express'
import MessageService from './services/messageService.js'

const app = express()
app.disable('x-powered-by')
app.use(express.json())

const init = async () => {
    try {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`${process.env.CONTAINER} started on port ${process.env.SERVER_PORT}`)
        })

        MessageService.handle()
    } catch (e) {
        console.log(e)
    }
}
init()