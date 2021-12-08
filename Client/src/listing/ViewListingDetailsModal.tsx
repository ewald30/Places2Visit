import React, {useEffect, useState} from 'react';
import {
    createAnimation,
    IonModal,
    IonButton,
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow, IonCol, IonImg, IonIcon
} from '@ionic/react';
import './ViewListingDetailsModalStyle.css';
import {closeSharp, pin, pinOutline} from "ionicons/icons";
import NO_PREVIEW from '../assets/noPreview3.png'


export const ViewListingDetailsModal = (props: { isVisible: any; listing: any; handleCloseModal: any}) => {
    const {isVisible, listing, handleCloseModal} = props;
    console.log("lsiting: ", listing)

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
        <>
            <IonModal isOpen={isVisible} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <div className={'modal-content-container'}>
                    {(listing && listing.photoBase64Data && listing.photoBase64Data !== '') ?
                        <IonImg className={'modal-listing-image'} src={listing.photoBase64Data} /> :
                        <img className={'modal-listing-no-preview'} src={NO_PREVIEW} />
                    }
                    <div className={'modal-listing-details'}>
                        {listing && <div>Listing Title: {listing.title}</div>}
                        {listing && <div>Description: {listing.text}</div>}
                        {listing && <div>Price: {listing.price} lei</div>}
                    </div>
                    <div className={'modal-buttons'}>
                        <div className={'modal-location-button'}>
                            <IonButton className={'modal-button'} >
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
            </IonModal>
        </>
    );
};