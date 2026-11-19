import { createContext, useContext } from 'react';
export const CollectionContext = createContext({config:{enabled:false},loading:true,error:''});
export const useCollection = () => useContext(CollectionContext);
