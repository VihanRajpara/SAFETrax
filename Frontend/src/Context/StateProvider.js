import React,{useState ,useEffect} from 'react';
import { ContextProvider } from './ContextProvider';

const StateProvider=({children})=>{
    return(
        <ContextProvider.Provider value={{}}>
            {children}
        </ContextProvider.Provider>
    );
}

export default StateProvider