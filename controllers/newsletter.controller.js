const { response } = require('express');

const Newsletter = require('../models/newsletter.model');
const User = require('../models/users.model');


/** =====================================================================
 *  GET COTIZACIONES
=========================================================================*/
const getNewsletters = async(req, res = response) => {

    try {

        const { desde, hasta, ...query } = req.body;

        const [newsletters, total] = await Promise.all([
            Newsletter.find(query)
            .limit(hasta)
            .skip(desde),
            Newsletter.countDocuments()

        ]);

        res.json({
            ok: true,
            newsletters,
            total
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
 *  CREATE NEWSLETTER
=========================================================================*/
const postNewsletter = async(req, res = response) => {

    try {

        let { email, ...data } = req.body;

        email.trim().toLowerCase();
        data.email = email;

        const newsletterDB = await Newsletter.findOne({ email });
        if (newsletterDB) {
            return res.status(400).json({
                ok: false,
                msg: 'This email has already been saved in our database'
            });
        }

        // SAVE DEPARTMENT
        const newsletter = new Newsletter(data);
        await newsletter.save();

        res.json({
            ok: true,
            newsletter
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
 *  DELETE NEWSLETTER
=========================================================================*/
const deleteNesletter = async(req, res = response) => {

    try {

        const nelid = req.params.id;
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
        const newsletterDB = await Newsletter.findById({ _id: nelid });
        if (!newsletterDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Does not exist'
            });
        }
        // SEARCH COTIZACION

        await Newsletter.findByIdAndDelete(nelid);

        res.json({
            ok: true,
            msg: 'We have successfully deleted this email from the database'
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
    getNewsletters,
    postNewsletter,
    deleteNesletter
};