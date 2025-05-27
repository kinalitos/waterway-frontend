import { useState } from "react";
import { toast } from "sonner";

import { createContaminationReport } from "../../services/contamination-reports-api.js";

export const useCreateReport = ()=>{
    const [loading, setLoading]  = useState(false)


    const createReportFunction = async(report)=>{
    setLoading(true)
    const res = await createContaminationReport(report)
    setLoading(false)

    const error = res.err?.response?.data?.error
    if(error){
        toast.error(error)
        return
    }

    console.log(res)
    toast.success('Report has been created succesfully')
    
    }

    return {
        loading,
        createReportFunction
    }

}
