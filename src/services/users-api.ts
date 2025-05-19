import { api } from "@/lib/auth.js";
import { User } from "@/services/types.js";

type PaginatedResult<T> = {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  results: T[];
}

type Props = {
  q?: string;
  role?: string;
  page: number;
  pageSize: number;
}

export const getUsers = async (params: Props) => {
  try {
    return await api.get<PaginatedResult<User>>('/users', { params }).then((res) => {
      return res.data
    });
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}

export const getUser = async (id) => {
  try {
    return await api.get(`/users/${id}`)
  } catch (err) {
    console.log(err)
    return {
      error: true,
      err
    }
  }
}

export const createUser = async (user) => {
  try {
    return await api.post('/users', user)
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}

export const updateUser = async (id, user) => {
  try {
    return await api.put(`/users/${id}`, user)
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}
export const deleteUser = async (id) => {
  try {
    return await api.delete(`/users/${id}`)
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}