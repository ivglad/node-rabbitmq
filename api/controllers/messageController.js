import MessageService from '../services/messageService.js'

class MessageController {
  
  async handle(req, res, next) {
    try {
      const payload = req.body
      if (!payload) return res.sendStatus(400)
      const result = await MessageService.handle(payload)
      return res.json(result)
    } catch(e) {
      next(e)
    }
  }
}

export default new MessageController()