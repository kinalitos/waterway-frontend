import { useState } from "react";
import toast from "sonner";

import {deleteEvent} from '../services/events-api.js'

export const useDeleteEvent = () => {
    const [isLoading, setIsLoading] = useState(false);

    const deleteEventById = async (id) => {
        setIsLoading(true);
        const response = await deleteEvent(id);
        setIsLoading(false);
        if (response.error) {
            if (response?.err?.response?.data?.errors) {
                let arr = response?.err?.response?.data?.errors;
                arr.forEach(error => {
                    toast.error(error.msg);
                });
            } else {
                toast.error(
                    response?.err?.response?.data?.msg ||
                    response?.err?.data?.msg ||
                    'Error deleting event. Try again.'
                );
            }
        } else {
            toast.success('Event deleted successfully!');
        }
    }; 
    return {
        deleteEventById,
        isLoading
    };
}