import { ObjectID } from 'mongodb';
import assert from 'assert';
import fs from 'fs-extra';
import connect from '../database/mongoCnn';

const collectionName = 'uploads';

function validateError(errParam) {
  let errMessage = {};
  const errValue = 'ss';
  if (errParam.name === 'SequelizeValidationError') {
    errMessage = {
      msg: `El ${errParam.errors[0].path} ${errValue} no es valido, por favor verifique.`,
    };
  }
  if (errParam.name === 'SequelizeUniqueConstraintError') {
    errMessage = {
      msg: `El ${errParam.errors[0].path} ${errValue} ya esta registrado, por favor ingrese otro.`,
    };
  }
  return errMessage;
}

function dataEntity(valueEnt) {
  return {
    fieldname: valueEnt.fieldname !== undefined ? valueEnt.fieldname : null,
    originalname: valueEnt.originalname !== undefined ? valueEnt.originalname : null,
    encoding: valueEnt.encoding !== undefined ? valueEnt.encoding : null,
    mimetype: valueEnt.mimetype !== undefined ? valueEnt.mimetype : null,
    destination: valueEnt.destination !== undefined ? valueEnt.destination : '',
    filename: valueEnt.filename !== undefined ? valueEnt.filename : '',
    path: valueEnt.path !== undefined ? valueEnt.path : '',
    category: valueEnt.category !== undefined ? valueEnt.category : null,
    comentary: valueEnt.comentary !== undefined ? valueEnt.comentary : null,
  };
}

function retdataEntity(valueEnt) {
  return {
    // eslint-disable-next-line no-underscore-dangle
    _id: valueEnt._id !== undefined ? valueEnt._id : null,
    fieldname: valueEnt.fieldname !== undefined ? valueEnt.fieldname : null,
    originalname: valueEnt.originalname !== undefined ? valueEnt.originalname : null,
    encoding: valueEnt.encoding !== undefined ? valueEnt.encoding : null,
    mimetype: valueEnt.mimetype !== undefined ? valueEnt.mimetype : null,
    destination: valueEnt.destination !== undefined ? valueEnt.destination : null,
    filename: valueEnt.filename !== undefined ? valueEnt.filename : null,
    path: valueEnt.path !== undefined ? valueEnt.path : null,
    category: valueEnt.category !== undefined ? valueEnt.category : null,
    comentary: valueEnt.comentary !== undefined ? valueEnt.comentary : null,
  };
}

// sequelize crud
export async function getEntityAll(req) {
  const retAccion = { status: 200, data: [] };
  let { page, pageSize, orderBy, orderType, onlyEnabled } = req.query;
  page = page !== undefined ? parseInt(page, 10) : 1;
  pageSize = pageSize !== undefined ? parseInt(pageSize, 10) : 10;
  orderBy = orderBy !== undefined ? orderBy : 'name';
  orderType = orderType !== undefined ? orderType : 'ASC';
  onlyEnabled = onlyEnabled !== undefined;
  const nskip = (page - 1) * pageSize;
  try {
    const norderType = orderType === 'ASC' ? 1 : -1;
    const db = await connect();
    const countAll = await db
      .collection(collectionName)
      .countDocuments(onlyEnabled ? { enabled: true } : {});
    const result = await db
      .collection(collectionName)
      .find(onlyEnabled ? { enabled: true } : {})
      .limit(pageSize)
      .skip(nskip)
      .sort({ [orderBy]: norderType })
      .toArray();
    const resultData = result.map((item) => {
      return retdataEntity(item);
    });
    retAccion.data = { record: resultData, countAll };
  } catch (error) {
    retAccion.status = 400;
  }
  return retAccion;
}

export async function getEntityOne(req) {
  let retAccion = { status: 200, data: {} };
  const { id } = req.params;
  try {
    const db = await connect();
    const result = await db.collection(collectionName).findOne({ _id: ObjectID(id) });
    if (result !== null) {
      retAccion.data = retdataEntity(result);
    } else {
      retAccion = { status: 404, data: { msg: `id ${id} not found` } };
    }
  } catch (error) {
    retAccion = { status: 404, data: validateError(error) };
  }
  return retAccion;
}

export async function createEntity(req) {
  let retAccion = { status: 200, data: [] };
  try {
    const dataObject = dataEntity(req.file);
    // Creacion de la categoria
    const category = req.body.category || 'nocategory';
    const comentary = req.body.comentary || null;
    // Constantes de ubicacion
    const dirOrigen = dataObject.path;
    const dirDestino = `${dataObject.destination}/${category}`;
    const fileExtension = dataObject.originalname.split('.').pop();
    const fileDestino = `${dirDestino}/${dataObject.filename}.${fileExtension}`;
    // verificacion si existe el direcctorio origen
    if (!fs.exists(dirDestino)) {
      await fs.mkdir(dirDestino);
    }
    // mover el archivo del origen al direcctorio destino
    await fs.move(dirOrigen, fileDestino);
    // replaza las viejas rutas x los nuevas (db)
    dataObject.destination = dirDestino;
    dataObject.path = fileDestino;
    dataObject.category = category;
    dataObject.comentary = comentary;

    // - coneccion con base datos
    const db = await connect();
    const result = await db.collection(collectionName).insertOne(dataObject);
    assert.equal(1, result.insertedCount);
    retAccion = { status: 201, insertedCount: result.insertedCount, data: result.ops[0] };
  } catch (error) {
    // throw Error(`${error} in createEntity()`);
    retAccion = { status: 400, insertedCount: 0, data: validateError(error) };
  }
  return retAccion;
}

export async function updateEntity(req) {
  let retAccion = { status: 400, modifiedCount: 0, data: {} };
  try {
    const { id } = req.params;
    const dataObject = dataEntity(req.body);
    const db = await connect();
    const result = await db
      .collection(collectionName)
      .updateOne({ _id: ObjectID(id) }, { $set: dataObject });
    assert.equal(1, result.modifiedCount);
    retAccion = { status: 200, modifiedCount: result.modifiedCount };
  } catch (error) {
    retAccion = { status: 400, modifiedCount: 0, data: validateError(error) };
  }
  return retAccion;
}

export async function removeEntity(req) {
  let retAccion = { status: 400, deletedCount: 0, data: 0 };
  try {
    const db = await connect();
    const { id } = req.params;
    const dataObject = await db.collection(collectionName).findOne({ _id: ObjectID(id) });
    if (dataObject == null) {
      retAccion = { status: 404, deletedCount: 0, data: { id, dataObject } };
    } else {
      const fileOrigen = dataObject.path;
      fs.access(fileOrigen, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(fileOrigen);    
        }
      });
      const result = await db.collection(collectionName).deleteOne({ _id: ObjectID(id) });
      assert.equal(1, result.deletedCount);
      retAccion = { status: 200, deletedCount: result.deletedCount, data: { id, result } };
    }
  } catch (error) {
    retAccion = { status: 400, deletedCount: 0, data: validateError(error) };
  }
  return retAccion;
}

export async function createIndex() {
  let retAccion = { status: 400, deletedCount: 0, data: 0 };
  try {
    const db = await connect();
    let result = await db.collection(collectionName).dropIndexes();
    if (result) {
      result = await db.collection(collectionName).ensureIndex({ dni: 1 }, { unique: false });
      await db.collection(collectionName).ensureIndex({ name: 1 });
    }

    retAccion = { status: 200, indexCount: result, data: { result: 'Ok' } };
  } catch (error) {
    retAccion = { status: 400, indexCount: 0, data: validateError(error) };
  }
  return retAccion;
}

// export async function getEntityFileOne(req) {
//   let retAccion = { status: 200, data: {}, content: null };
//   const { id } = req.params;
//   try {
//     const db = await connect();
//     const result = await db.collection(collectionName).findOne({ _id: ObjectID(id) });
//     if (result !== null) {
//       // const rdataEntity = retdataEntity(result).path;
//       const fileOrigen = retdataEntity(result).path;
//       fs.access(fileOrigen, fs.constants.F_OK, (err) => {
//         if (process.env.NODE_ENV === 'DEV') {
//           throw Error(`${fileOrigen} ${err ? '(no existe)' : '(existe)'}`);
//         }
//       });
//       retAccion.data = retdataEntity(result);
//       retAccion.content = await fs.readFile(fileOrigen);
//       console.log(retAccion.content);
//     } else {
//       retAccion = { status: 404, data: { msg: `id ${id} not found` } };
//     }
//   } catch (error) {
//     retAccion = { status: 404, data: error };
//   }
//   return retAccion;
// }