"use client";

import { useMemo, memo, useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { InlineTaskForm } from "./InlineTaskForm";
import { CheckCircle2, MoreHorizontal, Plus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const KanbanColumn = memo(function KanbanColumn({ column, tasks, onRemoveFromKanban, onCreateTask }) {
  const [isCreating, setIsCreating] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const getPillStyle = (color) => {
    switch (color) {
      case 'grey': return "bg-[#3F3F46] text-neutral-300";
      case 'blue': return "bg-[#2563EB] text-white";
      case 'green': return "bg-[#166534] text-green-100";
      default: return "";
    }
  };

  const handleCreateTask = (taskData) => {
    if (onCreateTask) {
      onCreateTask(taskData);
    }
    setIsCreating(false);
  };

  return (
    <div
      className="flex flex-col w-[350px] shrink-0 bg-[#1a1a1a] rounded-xl p-3 border border-authBorder"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1 mt-1">
        <div className="flex items-center gap-3">
          {column.color === "neutral" ? (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-normal text-textMain">{column.title}</span>
              <span className="text-textMuted text-sm font-normal">{tasks.length}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={cn("px-2.5 py-1 rounded-full text-xs font-normal flex items-center gap-1.5", getPillStyle(column.color))}>
                {column.color === 'grey' && <div className="w-2 h-2 rounded-full bg-neutral-400" />}
                {column.color === 'blue' && <div className="w-2 h-2 rounded-full bg-blue-200" />}
                {column.color === 'green' && <CheckCircle2 size={12} className="text-green-200" />}
                {column.title}
              </span>
              <span className="text-textMuted text-sm font-normal">{tasks.length}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1 text-textMuted">
          <button className="p-1 hover:text-textMain hover:bg-white/5 rounded transition-colors"><MoreHorizontal size={18} /></button>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 hover:text-textMain hover:bg-white/5 rounded transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-2 min-h-[150px]"
      >
        {/* Inline Create Form - appears at top */}
        {isCreating && (
          <InlineTaskForm
            columnId={column.id}
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreating(false)}
          />
        )}

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} column={column} onRemoveFromKanban={onRemoveFromKanban} />
          ))}
        </SortableContext>
      </div>

      {/* New Task Button */}
      <button
        onClick={() => setIsCreating(true)}
        className="group mt-3 flex items-center gap-2 w-full py-2.5 px-3 rounded-lg border border-dashed border-authBorder hover:border-solid hover:bg-[#1f1f1f] hover:border-authPrimary/50 transition-all text-left"
      >
        <Plus size={16} className="text-authPrimary group-hover:text-authPrimary" />
        <span className="text-sm font-normal text-textMuted group-hover:text-textMain">New task</span>
      </button>
    </div>
  );
});
