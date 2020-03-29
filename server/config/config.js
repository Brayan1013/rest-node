//======================
//       PUERTO
//======================

process.env.PORT = process.env.PORT || 3000;

//======================
//   Base de datos
//======================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let coneccionDB;

if (process.env.NODE_ENV === 'dev') {
    coneccionDB = 'mongodb://localhost:27017/cafe';
} else {
    coneccionDB = 'mongodb+srv://brayan:GAdo1iXJNxgeAgLo@cluster0-vtovd.mongodb.net/cafe';
}

process.env.urlDB = coneccionDB;