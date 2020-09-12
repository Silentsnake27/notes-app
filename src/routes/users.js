const router = require('express').Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/login', (req,res) =>{
    res.render('users/login');
});

router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/login',
  failureFlash: true
}));

router.get('/users/signup', (req,res) =>{
    res.render('users/signup');
});

router.post('/users/signup', async (req,res) => {
  const {name,email,password,password2} = req.body;
  let errors =[];
  if (name.length <= 0) {
      errors.push({text: 'Porfavor ingrese un nombre'})
  }
  if (password != password2) {
      errors.push({text: 'Las contraseñas no coinciden'});
  }
  if (password.length < 4 ) {
      errors.push({text: 'La contraseña debe tener mas de 4 caracteres'});
  }
  if(errors.length > 0) {
    res.render('users/signup', {errors,name,email,password,password2});
  }else {
 const emailUser = await User.findOne({email: email});
 if (emailUser) {
   req.flash('error', 'El correo ya esta en uso');
   res.redirect('/users/signup');
 }
    const newUser = new User({name,email,password});
  newUser.password = await newUser.encryptPassword(password);
   await newUser.save();
   req.flash('success_msg', 'Se ha registrado Correctamente');
   res.redirect('/users/login');
  } 
});

router.get('/users/logout', (req,res) => {
  req.logout();
  res.redirect('/');
})
 module.exports = router;