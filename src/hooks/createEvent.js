import { useState } from 'react'
import { toast } from 'sonner'
import { createEvent } from '../services/events-api.js'

export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false)

  const createEventFunction = async (event) => {
    setLoading(true)
    const res = await createEvent(event)
    setLoading(false)

    const error = res.err?.response?.data?.error
    if(error) {
      toast.error(error)
      return
    }
    toast.success('Event created successfully')
  }

  return {
    loading,
    createEventFunction
  }
}