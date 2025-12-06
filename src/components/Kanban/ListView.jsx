import React from "react";
import { FileText, Plus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ListView = ({ tasks, columns }) => {
  const getPriorityStyle = (p) => {
    if (p === "High") return "text-[#f87171] bg-[#351c1c] border-[#452222]";
    if (p === "Medium") return "text-[#fbbf24] bg-[#352a15] border-[#453616]";
    return "text-neutral-400 bg-neutral-800 border-neutral-700";
  };

  const getTagStyle = (tag) => {
    if (tag === "Website Conversion") return "text-[#60a5fa] bg-[#1e2738] border-[#2b3a55]";
    if (tag === "Offer & Pricing") return "text-[#4ade80] bg-[#192b23] border-[#223d2e]";
    return "text-neutral-400 bg-neutral-800 border-neutral-700";
  };

  // Enhance tasks with column data for display
  const tasksWithStatus = tasks.map(task => ({
      ...task,
      status: columns.find(c => c.id === task.columnId) || { title: 'Unknown', color: 'grey' }
  }));

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-[#161616] rounded-xl border border-white/5 flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/5 bg-[#1A1A1A] text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">Task Name</div>
            <div className="flex items-center gap-2">Category</div>
            <div className="flex items-center gap-2">Status</div>
            <div className="flex items-center gap-2">Priority</div>
            <div className="flex items-center gap-2">Assignee</div>
          </div>

          <div className="divide-y divide-white/5 bg-[#161616]">
            {tasksWithStatus.map((task) => (
              <div key={task.id} className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1fr] gap-4 px-6 py-3.5 items-center hover:bg-[#1c1c1c] transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded bg-neutral-800/50 text-neutral-500 group-hover:text-neutral-300 transition-colors">
                    <FileText size={14} />
                  </div>
                  <span className="text-sm font-medium text-neutral-200 truncate">{task.title}</span>
                </div>
                <div>
                  {task.tag && (
                    <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md border inline-flex truncate", getTagStyle(task.tag))}>
                      {task.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full shrink-0",
                    task.status.color === 'blue' ? "bg-blue-500" :
                    task.status.color === 'green' ? "bg-green-500" :
                    task.status.color === 'grey' ? "bg-neutral-400" : "bg-neutral-600"
                  )} />
                  <span className="text-sm text-neutral-400">{task.status.title}</span>
                </div>
                <div>
                  <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-md border inline-flex", getPriorityStyle(task.priority))}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#161616]">
                    BG
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="p-8 text-center text-neutral-500">No tasks found.</div>
          )}

          <button className="w-full flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-500 hover:text-neutral-300 hover:bg-[#1c1c1c] transition-colors border-t border-white/5">
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>
    </div>
  );
};
