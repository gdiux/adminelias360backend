/** =====================================================================
 *  NEWSLETTER ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { postNewsletter, deleteNesletter, getNewsletters } = require('../controllers/newsletter.controller');

const router = Router();

/** =====================================================================
 *  POST QUERY COTIZACION
=========================================================================*/
router.post('/query', validarJWT, getNewsletters);

/** =====================================================================
 *  POST NEWSLETTER
=========================================================================*/
router.post('/', [
        check('email', 'email is mandatory').isEmail(),
        validarCampos
    ],
    postNewsletter
);

/** =====================================================================
 *  DELETE COTIZACION
=========================================================================*/
router.delete('/:id', validarJWT, deleteNesletter);


// EXPORT
module.exports = router;