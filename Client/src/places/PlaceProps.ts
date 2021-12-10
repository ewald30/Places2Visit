export interface PlaceProps {
  _id?: string;
  text: string;
  title: string;
  price: number;
  photoBase64Data: string
  coordinates: {lat: number, lng: number},
}
