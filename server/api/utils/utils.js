import jsonpatch from 'fast-json-patch';

const respondWithResult = (res, statusCode = 200) => entity => {
  if (entity) {
    return res.status(statusCode).json(entity);
  }
  return null;
};


const patchUpdates = patches => entity => {
  try {
    jsonpatch.apply(entity, patches, /*validate*/ true);
  } catch (err) {
    console.error('ERROR at patchUpdates', err);
    return Promise.reject(err);
  }
  return entity.save();
};

const removeEntity = res => entity => {
  if (entity) {
    return entity.remove()
      .then(() => {
        res.status(204).end();
      });
  }
};


const handleEntityNotFound = res => entity => {
  if (!entity) {
    res.status(404).end();
    return null;
  }
  return entity;
};


const handleError = (res, statusCode = 500) => err => {
  res.status(statusCode).send(err);
};


// Updates an existing Project in the DB
const patchEntity = (req, res, Entity) => {
  if (req.body._id) {
    delete req.body._id;
  }
  return Entity.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

export { respondWithResult, patchUpdates, removeEntity, handleEntityNotFound, handleError, patchEntity };
