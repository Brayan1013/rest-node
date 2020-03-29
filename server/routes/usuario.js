const express = require('express');
const mongoose = require('mongoose');
const app = express();
const _ = require('underscore');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');



app.post('/usuario', (req, res) => {
    let body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });


    });

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

app.get('/usuarios', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, docs) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, count) => {

                res.json({
                    ok: true,
                    usuarios: docs,
                    count
                });
            })
        })
});


app.delete('/usuarios/:id', (req, res) => {
    let id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Id no valido'
            }
        });
    }

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).status({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuarioBorrado
        });
    });
})

module.exports = app;