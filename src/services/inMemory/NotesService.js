const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class NotesService {
  constructor () {
    this._notes = []
  }

  addNote ({ title, body, tags }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
      title, tags, body, id, createdAt, updatedAt
    }

    this._notes.push(newNote)

    const isSuccess = this._notes.filter((note) => note.id === id).length > 0

    if (!isSuccess) {
      throw new InvariantError('Note is failed to add.')
    }

    return id
  }

  getNotes () {
    return this._notes
  }

  getNoteById (id) {
    const note = this._notes.filter((n) => n.id === id)[0]
    if (!note) {
      throw new NotFoundError('Note cannot be found.')
    }
    return note
  }

  editNoteById (id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id)

    if (index === -1) {
      throw new NotFoundError('Note is failed to update. Cannot find ID.')
    }

    const updatedAt = new Date().toISOString()

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt
    }
  }

  deleteNoteById (id) {
    const index = this._notes.findIndex((note) => note.id === id)
    if (index === -1) {
      throw new NotFoundError('Note is failed to delete. Cannot find ID.')
    }
    this._notes.splice(index, 1)
  }
}

module.exports = NotesService
