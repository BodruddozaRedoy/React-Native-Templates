import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * INTERNAL CRUD ENGINE
 * --------------------
 * Endpoint & queryKey are FIXED here.
 * UI gets instant updates via optimistic mutations.
 */
export function useBaseCrud<T>(queryKey: any[], endpoint: string) {
  const queryClient = useQueryClient();

  /* ---------- READ ---------- */
  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
  });

  /* ---------- CREATE (OPTIMISTIC) ---------- */
  const create = useMutation({
    mutationFn: async (data: Partial<T>) =>
      (await api.post(endpoint, data)).data,

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<T[]>(queryKey);

      queryClient.setQueryData<T[]>(queryKey, (old = []) => [
        ...old,
        { ...data, id: `temp-${Date.now()}` } as T,
      ]);

      return { previous };
    },

    onError: (_err, _data, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /* ---------- UPDATE (OPTIMISTIC) ---------- */
  const update = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<T>;
    }) => (await api.put(`${endpoint}/${id}/`, data)).data,

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<T[]>(queryKey);

      queryClient.setQueryData<T[]>(queryKey, (old = []) =>
        old.map((item: any) => (item.id === id ? { ...item, ...data } : item)),
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /* ---------- DELETE (OPTIMISTIC) ---------- */
  const remove = useMutation({
    mutationFn: async (id: string | number) =>
      (await api.delete(`${endpoint}/${id}/`)).data,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<T[]>(queryKey);

      queryClient.setQueryData<T[]>(queryKey, (old = []) =>
        old.filter((item: any) => item.id !== id),
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    list: listQuery.data,
    loading: listQuery.isLoading,
    error: listQuery.error,

    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,

    createLoading: create.isPending,
    updateLoading: update.isPending,
    deleteLoading: remove.isPending,
  };
}
