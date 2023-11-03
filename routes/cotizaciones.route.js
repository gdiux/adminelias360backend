/** =====================================================================
 *  COTIZACIONES ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { postCotizacion, getCotizaciones, deleteCotizacion, updateCotizacion } = require('../controllers/cotizaciones.controller');

const router = Router();

/** =====================================================================
 *  POST QUERY COTIZACION
=========================================================================*/
router.post('/query', validarJWT, getCotizaciones);

/** =====================================================================
 *  POST NEW COTIZACION
=========================================================================*/
router.post('/', [
        check('email', 'email is mandatory').isEmail(),
        check('name', 'names are mandatory').not().isEmpty(),
        check('address', 'the address is mandatory').not().isEmpty(),
        check('phone', 'the phone is mandatory').not().isEmpty(),
        validarCampos
    ],
    postCotizacion
);

/** =====================================================================
 *  PUT HORNO
=========================================================================*/
router.put('/:id', validarJWT, updateCotizacion);

/** =====================================================================
 *  DELETE COTIZACION
=========================================================================*/
router.delete('/:id', validarJWT, deleteCotizacion);


// EXPORT
module.exports = router;