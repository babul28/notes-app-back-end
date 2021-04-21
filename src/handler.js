const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, h) => {
  const { title = 'untitled', tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === newNote.id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });

    response.code(500);

    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil ditambahkan',
    data: {
      noteId: id,
    },
  });

  response.code(201);

  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const note = notes.filter((note) => note.id === id)[0];

  if (note === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });

    response.code(404);

    return response;
  }

  return {
    status: 'success',
    data: {
      note,
    },
  };
};

const updateNoteByHandler = (req, h) => {
  const { id } = req.params;

  const { title, tags, body } = req.payload;

  const updatedAt = new Date().toISOString();

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });

    response.code(404);

    return response;
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title,
    tags,
    body,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil diperbarui',
  });

  response.code(200);

  return response;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menghapus catatan. Id tidak ditemukan',
    });

    response.code(404);

    return response;
  }

  notes.splice(noteIndex, 1);

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil dihapus',
  });

  response.code(200);

  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  updateNoteByHandler,
  deleteNoteByIdHandler,
};
