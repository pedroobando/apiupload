import { connect } from '../database/mongoCnn';
import { ObjectID } from 'mongodb';
import assert from 'assert';

import fs from 'fs-extra'

const collectionName = 'uploads';

// sequelize crud
export async function getEntityAll(req) {
  let retAccion = {status:200, data:[]};
  let {page, pageSize, orderBy, orderType, onlyEnabled} = req.query;
  page = page !== undefined ? parseInt(page): 1;
  pageSize = pageSize !== undefined ? parseInt(pageSize): 10;
  orderBy = orderBy !== undefined ? orderBy: 'name';
  orderType = orderType !== undefined ? orderType: 'ASC';
  onlyEnabled = onlyEnabled !== undefined ? true: false;
  const nskip = (page-1) * pageSize;
  try {
    const norderType = orderType == 'ASC' ? 1: -1;
    const db = await connect();
    const countAll = await db.collection(collectionName).countDocuments(onlyEnabled ? { 'enabled': true }: {})
    const result = await db.collection(collectionName).find(onlyEnabled ? { 'enabled': true }: {})
      .limit(pageSize)
      .skip(nskip)
      .sort({[orderBy]: norderType})
      .toArray();
    let resultData = result.map((item) => {
        return retdataEntity(item);
      });
    retAccion.data = {record: resultData, countAll}
  } catch (error) {
    retAccion.status = 400;
    // console.log(error.stack);
  }
  return retAccion;
}

export async function getEntityOne(req) {
  let retAccion = {status:200, data:{}}
  const { id } = req.params;
  try {
    
    const db = await connect();
    const result = await db.collection(collectionName).findOne({_id: ObjectID(id)})
    if (result !== null) {
      retAccion.data = retdataEntity(result);
    } else {
      retAccion = {status:404, data:{msg: `id ${id} not found`}}
    }
  } catch (error) {
    retAccion = {status:404, data:validateError(error)}
    // retAccion = {status:400, data:{error}}
    // console.error(error);
  }
  return retAccion;
}

export async function createEntity(req) {
  let retAccion = {status:200, data:[]}
  try {
    // console.log(req.file);
    
    let dataObject = dataEntity(req.file);
    // Creacion de la categoria
    const category = req.body['category'] || 'nocategory';
    // Constantes de ubicacion
    const dirOrigen = dataObject.path;
    const dirDestino = dataObject.destination+'/'+category;
    const fileDestino = dirDestino+'/'+dataObject.filename
    // verificacion si existe el direcctorio origen
    if (!fs.exists(dirDestino)) {
      await fs.mkdir(dirDestino);  
    }
    // mover el archivo del origen al direcctorio destino
    await fs.move(dirOrigen,fileDestino);
    // replaza las viejas rutas x los nuevas (db)
    dataObject.destination = dirDestino;
    dataObject.path = fileDestino;
    dataObject.category = category;
    // - coneccion con base datos
    const db = await connect();
    const result = await db.collection(collectionName).insertOne(dataObject);
    assert.equal(1, result.insertedCount);
    retAccion = {status: 201, insertedCount: result.insertedCount, data: result.ops[0]}
  } catch (error) {
    console.error(error);
    retAccion = {status: 400, insertedCount: 0, data: validateError(error)}
  }
  return retAccion;
}

export async function updateEntity(req) {
  let retAccion = {status:400, modifiedCount:0, data:{}}
  try {
    const { id } = req.params;
    let dataObject = dataEntity(req.body);
    const db = await connect();
    const result = await db.collection(collectionName).updateOne({_id: ObjectID(id)}, {$set: dataObject});
    assert.equal(1, result.modifiedCount);
    retAccion = {status: 200, modifiedCount: result.modifiedCount}
  } catch (error) {
    retAccion = {status: 400, modifiedCount: 0, data: validateError(error) };
  }
  return retAccion;
}

export async function removeEntity(req) {
  let retAccion = {status:400, deletedCount:0, data:0}
  try {
    const db = await connect();
    const { id } = req.params;
    let result = await db.collection(collectionName).deleteOne({_id: ObjectID(id)});
    assert.equal(1, result.deletedCount);
    retAccion = {status: 200, deletedCount: result.deletedCount, data: {id, result}}
  } catch (error) {
    retAccion = {status: 400, deletedCount: 0, data: validateError(error) };
  }
  return retAccion;
}

export async function createIndex() {
  let retAccion = {status:400, deletedCount:0, data:0}
  try {
    const db = await connect();
    let result = await db.collection(collectionName).dropIndexes();
    if (result) {
      result = await db.collection(collectionName).ensureIndex({'dni':1},{'unique':false});
      await db.collection(collectionName).ensureIndex({'name':1});
    }
    
    retAccion = {status: 200, indexCount: result, data: {result: 'Ok'}}
  } catch (error) {
    retAccion = {status: 400, indexCount: 0, data: validateError(error) };
  }
  return retAccion;
}

function dataEntity(valueEnt) {
  return {
    fieldname: valueEnt.fieldname !== undefined ? valueEnt.fieldname: null,
    originalname: valueEnt.originalname !== undefined ? valueEnt.originalname: null,
    encoding: valueEnt.encoding !== undefined ? valueEnt.encoding: null,
    mimetype: valueEnt.mimetype !== undefined ? valueEnt.mimetype: null,
    destination: valueEnt.destination !== undefined ? valueEnt.destination: '',
    filename: valueEnt.filename !== undefined ? valueEnt.filename: '',
    path: valueEnt.path !== undefined ? valueEnt.path: ''
  }
}

function retdataEntity(valueEnt) {
  // console.log('phone:', valueEnt.locations !== undefined);
  return {
    _id: valueEnt._id !== undefined ? valueEnt._id: null,
    fieldname: valueEnt.fieldname !== undefined ? valueEnt.fieldname: null,
    originalname: valueEnt.originalname !== undefined ? valueEnt.originalname: null,
    encoding: valueEnt.encoding !== undefined ? valueEnt.encoding: null,
    mimetype: valueEnt.mimetype !== undefined ? valueEnt.mimetype: null,
    destination: valueEnt.destination !== undefined ? valueEnt.destination: null,
    filename: valueEnt.filename !== undefined ? valueEnt.filename: null,
    path: valueEnt.path !== undefined ? valueEnt.path: null
  }
}

function validateError(errParam) {
  let errMessage = {};
  let errValue = 'ss'; // errParam.errors[0].value == null ? '': errParam.errors[0].value;
  // console.error(errParam);
  if (errParam.name == 'SequelizeValidationError') {
    errMessage = {msg: `El ${errParam.errors[0].path} ${errValue} no es valido, por favor verifique.`}
  }
  // if (errParam.name == 'SequelizeUniqueConstraintError') {
  //   errMessage = {msg: `El ${errParam.fields} ${errValue} ya esta registrado, por favor ingrese otro.`}
  // }
  if (errParam.name == 'SequelizeUniqueConstraintError') {
    errMessage = {msg: `El ${errParam.errors[0].path} ${errValue} ya esta registrado, por favor ingrese otro.`}
  }
  // console.log(errParam.name);
  // console.log(errMessage.msg);
  return errMessage;  
}