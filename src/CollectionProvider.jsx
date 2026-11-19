import { useEffect, useState } from 'react';
import { CollectionContext } from './collectionContext';
import { validateConfig } from './collectionApi';
import './Collection.css';
export default function CollectionProvider({children}) {
  const [state,setState]=useState({config:{enabled:false},loading:true,error:''});
  useEffect(()=>{
    const controller=new AbortController();
    fetch(`${import.meta.env.BASE_URL}collection-config.json`,{cache:'no-store',signal:controller.signal})
      .then(response=>{if(!response.ok)throw new Error('Collection settings are unavailable. Local saving and JSON download still work.');return response.json();})
      .then(value=>setState({config:validateConfig(value),loading:false,error:''}))
      .catch(error=>{if(error.name!=='AbortError')setState({config:{enabled:false},loading:false,error:error.message});});
    return ()=>controller.abort();
  },[]);
  return <CollectionContext.Provider value={state}>{children}</CollectionContext.Provider>;
}
