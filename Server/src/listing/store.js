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
    let listingTitle = listing.title;
    if (!listingTitle || !listingText) { // validation
      throw new Error('Missing property')
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

export default new ListingStore({ filename: './storage/places.json', autoload: true });