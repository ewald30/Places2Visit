import {useCamera} from "@ionic/react-hooks/camera";
import {CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory} from "@capacitor/core";
import {useEffect, useState} from "react";
import {base64FromPath, useFilesystem} from "@ionic/react-hooks/filesystem";
import {useStorage} from "@ionic/react-hooks/storage";

export interface Photo{
    filePath: string,
    webviewPath?: string
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery(){
    const {getPhoto} = useCamera();
    const [photos, setPhotos] = useState<Photo[]>([]);

    const takePhoto = async () => {
        const cameraPhoto = await getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);
        set(PHOTO_STORAGE, JSON.stringify(newPhotos));
        return {
            filePath: savedFileImage.filePath,
            webviewPath: savedFileImage.webviewPath
        }
    }

    const {deleteFile, readFile, writeFile} = useFilesystem();
    const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
        const base64Data = await base64FromPath(photo.webPath!);
        await writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Data
        })

        return {
          filePath: fileName,
          webviewPath: photo.webPath
        };
    };

    const {get, set} = useStorage();
    useEffect(() => {
        const loadSaved = async () => {
            const photoString = await get(PHOTO_STORAGE);
            const photos = (photoString ? JSON.parse(photoString): []) as Photo[];

            for (let photo of photos){
                const file = await readFile({
                    path: photo.filePath,
                    directory: FilesystemDirectory.Data
                });
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
            setPhotos(photos);
        };
        loadSaved();
    }, [get, readFile]);

    const deletePhoto = async (photo: Photo) => {
        const updatedPhotos = photos.filter(item => item.filePath !== photo.filePath);
        set(PHOTO_STORAGE, JSON.stringify(updatedPhotos));
        const fileName = photo.filePath.substr(photo.filePath.lastIndexOf('/') + 1);
        await deleteFile({
            path: fileName,
            directory: FilesystemDirectory.Data
        });
        setPhotos(updatedPhotos);
    };

    return{
        photos,
        takePhoto,
        deletePhoto,
    };
}