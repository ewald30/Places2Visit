import {Photo} from "../photos/usePhotoGallery";

export interface ListingsProps {
  _id?: string;
  text: string;
  title: string;
  price: number;
  photo?: Photo
}
