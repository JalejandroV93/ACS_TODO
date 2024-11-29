"use client";

import dynamic from "next/dynamic";

const TodoList = dynamic(() => import("@/components/TodoList"), {
  ssr: false,
});

export default function TodoPage() {
  return (
      <TodoList />
  );
}