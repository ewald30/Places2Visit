import dataStore from 'nedb-promise';

export class ListingStore {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
  }
  
  async find(props) {
    return this.store.find(props);
  }
  
  async findOne(props) {
    return this.store.findOne(props);
  }
  
  async insert(listing) {
    let listingText = listing.text;
    let listingPrice = listing.price;
    let listingTitle = listing.title;
    if (!listingTitle || !listingPrice || !listingText) { // validation
      throw new Error('Missing text property')
    }
    return this.store.insert(listing);
  };
  
  async update(props, listing) {
    return this.store.update(props, listing);
  }
  
  async remove(props) {
    return this.store.remove(props);
  }
}

export default new ListingStore({ filename: './storage/listings.json', autoload: true });