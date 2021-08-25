class NotesHandler {
  constructor (service) {
    this._service = service

    this.addNoteHandler = this.addNoteHandler.bind(this)
    this.getNotesHandler = this.getNotesHandler.bind(this)
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this)
    this.editNoteByIdHandler = this.editNoteByIdHandler.bind(this)
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this)
  }

  addNoteHandler (request, h) {
    try {
      const { title = 'untitled', tags, body } = request.payload

      const noteId = this._service.addNote({ title, tags, body })

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
      const response = h.response({
        status: 'fail',
        message: error.message
      })
      response.code(400)
      return response
    }
  }

  getNotesHandler () {
    const notes = this._service.getNotes()
    return {
      status: 'success',
      data: {
        notes
      }
    }
  }

  getNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      const note = this._service.getNoteById(id)

      return {
        status: 'success',
        data: {
          note
        }
      }
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message
      })
      response.code(404)
      return response
    }
  }

  editNoteByIdHandler (request, h) {
    try {
      const { id } = request.params

      this._service.editNoteById(id, request.payload)

      return {
        status: 'success',
        message: 'Note is successfully updated.'
      }
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message
      })
      response.code(404)
      return response
    }
  }

  deleteNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      this._service.deleteNoteById(id)
      return {
        status: 'success',
        message: 'Note is successfully deleted.'
      }
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Note is failed to delete. Cannot find ID.'
      })
      response.code(404)
      return response
    }
  }
}

module.exports = NotesHandler
