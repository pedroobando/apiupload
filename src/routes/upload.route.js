import { Router } from 'express';
import {
  createEntity,
  removeEntity,
  createIndex,
  getEntityAll,
  getEntityOne,
  getEntityFileOne,
} from '../controllers/upload.controller';

const theRouter = Router();

theRouter.get('/', async (req, res) => {
  try {
    const result = await getEntityAll(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
  }
});

theRouter.get('/createindex', async (req, res) => {
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

theRouter.get('/show/:id', async (req, res) => {
  try {
    const result = await getEntityFileOne(req);
    if (result.status === 200) {
      res.writeHead(result.status, { 'Content-type': result.data.mimetype });
      res.end(result.content);
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (error) {
    console.log(error);
  }
});

theRouter.get('/down/:id', async (req, res) => {
  try {
    const result = await getEntityOne(req);
    if (result.status === 200) {
      res.download(result.data.path, result.data.originalname, (err) => {
        if (err) {
          res.status(400).json({ err });
        }
      });
    } else {
      res.status(result.status).json(result.data);
    }
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

// theRouter.put('/:id', async (req, res) => {
//   try {
//     const result = await updateEntity(req);
//     res.status(result.status).json(result);
//   } catch (error) {
//     console.log(error);
//   }
// });

theRouter.delete('/:id', async (req, res) => {
  try {
    const result = await removeEntity(req);
    res.status(result.status).json(result.deletedCount);
  } catch (error) {
    console.log(error);
  }
});

export default theRouter;
