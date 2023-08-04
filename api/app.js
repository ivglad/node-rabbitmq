import express from 'express'
import router from './router/index.js'

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use('/api', router)

const init = async () => {
    try {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`${process.env.CONTAINER} started on port ${process.env.SERVER_PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
init()