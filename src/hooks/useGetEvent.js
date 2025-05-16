import { useState, useEffect } from "react";
import { getEvent, getEvents } from "@/services/events-api";
import { toast } from "sonner";

export function useGetEvent(eventId) {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvent = async (id) => {
    setIsLoading(true);
    const response = await getEvent(id);
    setIsLoading(false);
    if (response.error) {
      toast.error(
        response?.error?.response?.data?.msg ||
          response?.error?.data?.msg ||
          "Error al obtener el evento."
      );
      setEvent(null);
    } else {
      setEvent(response.data || response);
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent(eventId);
  }, [eventId]);

  return { event, isLoading };
}

export function useGetEvents({ searchQuery = "", status = "all" } = {}) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async (params) => {
    setIsLoading(true);
    const response = await getEvents(params);
    setIsLoading(false);
    if (response.error) {
      toast.error(
        response?.error?.response?.data?.msg ||
          response?.error?.data?.msg ||
          "Error al obtener eventos."
      );
      setEvents([]);
    } else {
      setEvents(response.data || response);
    }
  };

  useEffect(() => {
    fetchEvents({ searchQuery, status });
  }, [searchQuery, status]);

  return { events, isLoading };
}