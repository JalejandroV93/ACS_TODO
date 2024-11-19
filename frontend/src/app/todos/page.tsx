"use client";

import dynamic from "next/dynamic";
import { RequireAuth } from "@/components/RequireAuth";
const TodoList = dynamic(() => import("@/components/TodoList"), {
  ssr: false,
});

export default function TodoPage() {
  return (
    <RequireAuth>
      <TodoList />
    </RequireAuth>
  );
}
