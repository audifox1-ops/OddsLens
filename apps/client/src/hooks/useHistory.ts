import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllHistory,
  getFavorites,
  toggleFavorite,
  deleteHistory,
  clearAllHistory,
} from '../db/database';

const HISTORY_KEY = ['history'];
const FAVORITES_KEY = ['history', 'favorites'];

export function useHistory() {
  return useQuery({
    queryKey: HISTORY_KEY,
    queryFn: () => getAllHistory(50),
    staleTime: 0, // 항상 최신
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: getFavorites,
    staleTime: 0,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAllHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}
