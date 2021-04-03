import {useEffect} from 'react'

export const useSubscribeOnData = (setDataFunction, deleteDataFunction, [...parameters]) => {
  return useEffect(() => {
      setDataFunction(...parameters)
      if(deleteDataFunction) return () => deleteDataFunction()
    }, [...parameters])
}
