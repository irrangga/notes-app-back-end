const ClientError = require('../../exceptions/ClientError')

class NotesHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addNoteHandler = this.addNoteHandler.bind(this)
    this.getNotesHandler = this.getNotesHandler.bind(this)
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this)
    this.editNoteByIdHandler = this.editNoteByIdHandler.bind(this)
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this)
  }

  async addNoteHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)
      const { title = 'untitled', tags, body } = request.payload

      const noteId = await this._service.addNote({ title, tags, body })

      const response = h.response({
        status: 'success',
        message: 'Note is successfully added.',
        data: {
          noteId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      const response = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getNotesHandler () {
    const notes = await this._service.getNotes()
    return {
      status: 'success',
      data: {
        notes
      }
    }
  }

  async getNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      const note = await this._service.getNoteById(id)

      return {
        status: 'success',
        data: {
          note
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      const response = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async editNoteByIdHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)
      const { id } = request.params

      await this._service.editNoteById(id, request.payload)

      return {
        status: 'success',
        message: 'Note is successfully updated.'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      const response = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deleteNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      await this._service.deleteNoteById(id)
      return {
        status: 'success',
        message: 'Note is successfully deleted.'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      const response = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = NotesHandler
