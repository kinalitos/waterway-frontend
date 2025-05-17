import { useState } from "react";
import { toast } from "sonner";

import { createPublication } from "../../services/publications-api.js";


export const useCreatePublication = ()=>{
    const [loading, setLoading]  = useState(false)


    const createPublicationFunction = async(publication)=>{
    setLoading(true)
    const res = await createPublication(publication)
    setLoading(false)

    const error = res.err?.response?.data?.error
    if(error){
        toast.error(error)
        return
    }

    console.log(res)
    toast.success('Publication has been created succesfully')
    
    }

    return {
        loading,
        createPublicationFunction
    }

}
