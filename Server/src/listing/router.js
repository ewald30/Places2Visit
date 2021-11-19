import Router from 'koa-router';
import listingStore from './store';
import { broadcast } from "../utils";

export const router = new Router();

router.get('/', async (ctx) => {
  const response = ctx.response;
  const userId = ctx.state.user._id;
  response.body = await listingStore.find({ userId });
  response.status = 200; // ok
});

router.get('/offset/:offset/:nbItems', async (ctx) =>{
  const offset = ctx.params.offset;
  const nbItems = ctx.params.nbItems;
  const list = await listingStore.find({});
  const response = ctx.response;
  response.status = 200;
  response.body   = list.slice(offset, Number(offset)+Number(nbItems))
})

router.get('/search/:key', async (ctx) => {
  const key  = ctx.params.key;
  const list = await listingStore.find({});
  const result = list.filter(item => item.title.toLowerCase().includes(key.toLowerCase()))

  if (result.length){
    ctx.response.status = 200;
    ctx.response.body = result;
  } else {
    ctx.response.status = 404;
  }
})

router.get('/filter/:lowerLimit/:upperLimit', async (ctx) => {
  const lowerLimit = ctx.params.lowerLimit;
  const upperLimit = ctx.params.upperLimit;
  const list = await listingStore.find({});
  const tempResult = list.filter(item => item.price > Number(lowerLimit))
  const result = tempResult.filter(item => item.price < Number(upperLimit))

  if (result.length){
    ctx.response.status = 200;
    ctx.response.body = result;
  } else {
    ctx.response.status = 404;
  }
})


router.get('/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const listing = await listingStore.findOne({ _id: ctx.params.id });
  const response = ctx.response;
  if (listing) {
    if (listing.userId === userId) {
      response.body = listing;
      response.status = 200; // ok
    } else {
      response.status = 403; // forbidden
    }
  } else {
    response.status = 404; // not found
  }
});

const createListing = async (ctx, listing, response) => {
  try {
    const userId = ctx.state.user._id;
    listing.userId = userId;
    response.body = await listingStore.insert(listing);
    response.status = 201; // created
    broadcast(userId, { type: 'created', payload: listing });
  } catch (err) {
    response.body = { message: err.message };
    response.status = 400; // bad request
  }
};

router.post('/', async ctx => await createListing(ctx, ctx.request.body, ctx.response));

router.put('/:id', async (ctx) => {
  const listing = ctx.request.body;
  const id = ctx.params.id;
  const listingId = listing._id;
  const response = ctx.response;
  if (listingId && listingId !== id) {
    response.body = { message: 'Param id and body _id should be the same' };
    response.status = 400; // bad request
    return;
  }
  if (!listingId) {
    await createListing(ctx, listing, response);
  } else {
    const userId = ctx.state.user._id;
    listing.userId = userId;
    const updatedCount = await listingStore.update({ _id: id }, listing);
    if (updatedCount === 1) {
      response.body = listing;
      response.status = 200; // ok
      broadcast(userId, { type: 'updated', payload: listing });
    } else {
      response.body = { message: 'Resource no longer exists' };
      response.status = 405; // method not allowed
    }
  }
});

router.del('/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const listing = await listingStore.findOne({ _id: ctx.params.id });
  if (listing && userId !== listing.userId) {
    ctx.response.status = 403; // forbidden
  } else {
    await listingStore.remove({ _id: ctx.params.id });
    ctx.response.status = 204; // no content
  }
});
