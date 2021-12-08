import {NetworkStatus, Plugins} from "@capacitor/core";
import {useEffect, useState} from "react";

const {Network } = Plugins;

const initialState = {
    connected: false,
    connectionType: "unknown",
}

export const useNetwork = () => {
    const [networkStatus, setNetworkStatus] = useState(initialState)
    useEffect(() => {
        const networkHandler = Network.addListener('networkStatusChange', handleNetworkStatusChanged);
        Network.getStatus().then(handleNetworkStatusChanged);
        let canceled = false;

        return () => {
            canceled = true;
            networkHandler.remove();
        }

    }, [])

    function handleNetworkStatusChanged(status: NetworkStatus){
        console.log("Network Status: ", status)
        setNetworkStatus(status);
    }

    return {networkStatus}
}