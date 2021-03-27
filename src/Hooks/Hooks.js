import {useEffect} from 'react'
import { URLSearchParams } from "url";
import { useLocation } from "react-router-dom";

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export const useSubscribeOnData = (setDataFunction, deleteDataFunction, [...parameters]) => {
  return useEffect(() => {
      setDataFunction(...parameters)
      if(deleteDataFunction) return () => deleteDataFunction()
    }, [...parameters])
}
