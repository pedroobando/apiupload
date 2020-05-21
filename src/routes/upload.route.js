import { Router } from 'express';
import { createEntity, updateEntity, removeEntity, createIndex, getEntityAll, getEntityOne, getEntityFileOne } from '../controllers/upload.controller';
const theRouter = Router();

// theRouter.get('/file')

theRouter.get('/',  async (req, res) => {
  try {
    const result = await getEntityAll(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.get('/createindex',  async (req, res) => {
  try {
    const result = await createIndex();
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.get('/:id', async (req, res) => {
  try {    
    const result = await getEntityOne(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.get('/file/:id', async (req, res) => {
  try {    
    const result = await getEntityFileOne(req);
    // res.writeHead(result.status, {'Content-Type': result.data.contenttype});
    // res.end(result.data['file']);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.post('/', async (req, res) => {
  try {
    const result = await createEntity(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.put('/:id', async (req, res) => {
  try {
    const result = await updateEntity(req);
    res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
  }  
});

theRouter.delete('/:id', async (req, res) => {
  try {
    const result = await removeEntity(req);
    res.status(result.status).json(result.deletedCount);
  } catch (error) {
    console.log(error);
  }  
});


export default theRouter;