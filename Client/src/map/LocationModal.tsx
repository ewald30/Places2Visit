import {IonButton, IonIcon, IonImg, IonModal} from "@ionic/react";
import NO_PREVIEW from "../assets/noPreview3.png";
import React from "react";
import {Map} from "./Map";
import './LocationModal.css'
import {pin} from "ionicons/icons";

export const LocationModal = (props: { show: any; place: any; handleCloseModal: any}) => {
    const {show, place, handleCloseModal} = props;
    return place.coordinates ? (
            <IonModal isOpen={show} >
                <div className={'modal-location-content-container'}>

                        <Map
                            id={"map"}
                            lat={place.coordinates.lat}
                            lng={place.coordinates.lng}
                        />

                    <div className={'modal-location-close-button'}>
                        <IonButton className={'location-button'} color={'light'} onClick={() => {handleCloseModal()}}>
                            Back
                        </IonButton>
                    </div>

                </div>
            </IonModal>
    ) :
        (
            <IonModal isOpen={show} >
                <div className={'modal-location-content-container-unavailable'}>
                    {!place.coordinates &&
                    <div className={'no-location-container'}>
                        <IonIcon className={'no-location-icon'} icon={pin}/>
                        <div>Location Services unavailable</div>
                    </div>}

                    <div className={'modal-location-close-button'}>
                        <IonButton className={'location-button'} color={'light'} onClick={() => {handleCloseModal()}}>
                            Back
                        </IonButton>
                    </div>

                </div>
            </IonModal>
        )

}