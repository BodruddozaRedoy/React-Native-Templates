import { useBaseCrud } from "@/hooks/useBaseCrud";

export type Post = {
  id: number | string;
  title: string;
  body: string;
};

export function usePosts() {
  return useBaseCrud<Post>(
    ["posts"],       // ✅ queryKey lives here
    "/posts"         // ✅ endpoint lives here
  );
}


// const {
//   list: posts,
//   create,
//   update,
//   remove,
// } = usePosts();

// await create({ title: "Hello" });
// await update({ id: post.id, data: { title: "Updated" } });
// await remove(post.id);
