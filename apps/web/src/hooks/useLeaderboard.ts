import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.getLeaderboard(),
    refetchInterval: 30000, // Refetch every 30s
  });
};
