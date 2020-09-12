const router = require('express').Router();

const Note = require('../models/Notes');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/notes-form');
});

router.post('/notes/notes-form', isAuthenticated, async (req, res) => {
    const {
        title,
        description
    } = req.body
    const errors = [];
    if (!title) {
        errors.push({
            text: 'Please write a Title'
        });
    }
    if (!description) {
        errors.push({
            text: 'Please write a Description'
        });
    }
    if (errors.length > 0) {
        res.render('notes/notes-form', {
            errors,
            title,
            description
        });
    } else {

        const newNote = new Note({
            title,
            description
        });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota agregada correctamente');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req,res) =>{
  const note = await Note.findById(req.params.id)
    res.render('notes/notes-edit', {note});
});

router.put('/notes/notes-edit/:id', isAuthenticated, async (req,res) => {
 const {title, description} =  req.body;
await Note.findByIdAndUpdate(req.params.id, {title, description})
req.flash('success_msg', 'Nota actualizada correctamente');
res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) => {
    console.log(req.params.id)
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Nota Eliminada Correctamente');
  res.redirect('/notes');
})

module.exports = router;