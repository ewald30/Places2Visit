import React, {useEffect, useState} from 'react';
import {
    createAnimation,
    IonModal,
    IonButton,
    IonImg,
} from '@ionic/react';
import './PlaceDetailsModalStyle.css';
import {closeSharp, pin, pinOutline} from "ionicons/icons";
import NO_PREVIEW from '../assets/noPreview3.png'
import {LocationModal} from "../map/LocationModal";


export const PlaceDetailsModal = (props: { isVisible: any; place: any; handleCloseModal: any}) => {
    const {isVisible, place, handleCloseModal} = props;
    const [openModal, setOpenModal] = useState(false);

    const closeLocationModal = () => {
        setOpenModal(false);
    }

    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }


    return (

            <IonModal isOpen={isVisible} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <div className={'modal-content-container'}>
                    {(place && place.photoBase64Data && place.photoBase64Data !== '') ?
                        <IonImg className={'modal-place-image'} src={place.photoBase64Data} /> :
                        <img className={'modal-place-no-preview'} src={NO_PREVIEW} />
                    }
                    <div className={'modal-place-details'}>
                        {place && <div>Place Title: {place.title}</div>}
                        {place && <div>Description: <br/> {place.text}</div>}
                        {place && <div>Ticket price: {place.price} lei</div>}
                    </div>
                    <div className={'modal-buttons'}>
                        <div className={'modal-location-button'}>
                            <IonButton className={'modal-button'} onClick={() => {setOpenModal(true)}}>
                                View location
                            </IonButton>
                        </div>
                        <div className={'modal-close-button'}>
                            <IonButton className={'modal-button'} color={'light'} onClick={() => {handleCloseModal()}}>
                                Close
                            </IonButton>
                        </div>
                    </div>
                </div>

                <LocationModal show={openModal} place={place} handleCloseModal={closeLocationModal}/>

            </IonModal>
    );
};
