import { useState } from 'react'
import { toast } from 'sonner'
import { createUser } from '../../services/users-api.js'

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false)

  const createUserFunction = async (event) => {
    setLoading(true)
    const res = await createUser(event)
    setLoading(false)

    const error = res.err?.response?.data?.error
    if (error) {
      toast.error(error)
      return
    }
    console.log(res)
    toast.success('Usuario creado correctamente')
  }

  return {
    loading,
    createUser: createUserFunction,
  }
}