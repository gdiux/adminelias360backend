const { response } = require('express');

const Cotizacion = require('../models/cotizaciones.model');
const User = require('../models/users.model');

/** =====================================================================
 *  GET COTIZACIONES
=========================================================================*/
const getCotizaciones = async(req, res = response) => {

    try {

        const { desde, hasta, ...query } = req.body;

        const [cotizaciones, total, pending, processing, completed] = await Promise.all([
            Cotizacion.find(query)
            .limit(hasta)
            .skip(desde),
            Cotizacion.countDocuments(),
            Cotizacion.countDocuments({ status: 'Pending' }),
            Cotizacion.countDocuments({ status: 'Processing' }),
            Cotizacion.countDocuments({ status: 'Completed' }),

        ]);

        res.json({
            ok: true,
            cotizaciones,
            total,
            pending,
            processing,
            completed
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error, please try again!'
        });
    }

};

/** =====================================================================
 *  CREATE COTIZACION
=========================================================================*/
const postCotizacion = async(req, res = response) => {

    try {

        let { email, ...data } = req.body;

        email.trim().toLowerCase();
        data.email = email;

        // SAVE DEPARTMENT
        const cotizacion = new Cotizacion(data);
        await cotizacion.save();

        res.json({
            ok: true,
            cotizacion
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error, please try again!'
        });
    }

};

/** =====================================================================
 *  UPDATE COTIZACION
=========================================================================*/
const updateCotizacion = async(req, res = response) => {

    try {

        const cotid = req.params.id;

        // SEARCH HORNO
        const cotizacionDB = await Cotizacion.findById(cotid);
        if (!cotizacionDB) {
            return res.status(404).json({
                ok: false,
                msg: 'There is no quote with this ID'
            });
        }
        // SEARCH HORNO

        // VALIDATE HORNO
        const {...campos } = req.body;

        // UPDATE
        const cotizacionUpdate = await Cotizacion.findByIdAndUpdate(cotid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            cotizacion: cotizacionUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error, please try again!'
        });
    }

};

/** =====================================================================
 *  DELETE COTIZACION
=========================================================================*/
const deleteCotizacion = async(req, res = response) => {

    try {

        const cotid = req.params.id;
        const uid = req.uid;

        // SEARCH USER
        const userDB = await User.findById({ _id: uid });
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'There is no user with this ID'
            });
        } else {
            if (userDB.role !== 'ADMIN') {
                return res.status(400).json({
                    ok: false,
                    msg: 'You do not have the privileges to edit this quote'
                });
            }
        }
        // SEARCH USER

        // SEARCH COTIZACION
        const cotizacionDB = await Cotizacion.findById({ _id: cotid });
        if (!cotizacionDB) {
            return res.status(400).json({
                ok: false,
                msg: 'There is no quote with this ID'
            });
        }
        // SEARCH COTIZACION

        await Cotizacion.findByIdAndDelete(cotid);

        res.json({
            ok: true,
            msg: 'Quote has been successfully removed'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Unexpected error, please try again!'
        });
    }

};

// EXPORTS
module.exports = {
    getCotizaciones,
    postCotizacion,
    updateCotizacion,
    deleteCotizacion
};