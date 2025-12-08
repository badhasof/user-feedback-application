import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileText, CheckCircle2, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const TaskCard = memo(function TaskCard({ task, column, isOverlay, onRemoveFromKanban }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const isBlue = column?.color === "blue";
  const isGreen = column?.color === "green";

  const cardBg = isBlue
    ? "bg-[#141d2e] border-[#1e2a42]"
    : isGreen
    ? "bg-[#112218] border-[#183320]"
    : "bg-[#1E1E1E] border-[#2E2E2E]";

  const getTagStyle = (tag) => {
    if (tag === "Website Conversion") return "bg-[#1e2738] text-[#60a5fa] border border-[#2b3a55]";
    if (tag === "Offer & Pricing") return "bg-[#192b23] text-[#4ade80] border border-[#223d2e]";
    return "bg-neutral-800 text-neutral-400 border border-neutral-700";
  };

  const getPriorityStyle = (p) => {
    if (p === "High") return "bg-[#351c1c] text-[#f87171] border border-[#452222]";
    if (p === "Medium") return "bg-[#352a15] text-[#fbbf24] border border-[#453616]";
    return "bg-neutral-800 text-neutral-400";
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-[#1E1E1E] p-4 rounded-xl border-2 border-dashed border-neutral-700 h-[150px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative rounded-xl border p-4 shadow-sm cursor-grab active:cursor-grabbing flex flex-col gap-3 select-none hover:border-white/10 transition-colors group",
        cardBg,
        isOverlay ? "ring-2 ring-blue-500 shadow-xl rotate-2 scale-105 z-50 cursor-grabbing" : ""
      )}
    >
      {/* Title & Icon */}
      <div className="flex items-start gap-2.5">
        {task.desc && <FileText size={16} className="text-neutral-500 mt-[3px] shrink-0" />}
        <h3 className="text-[15px] leading-relaxed font-medium text-neutral-200 flex-1">
          {task.title}
        </h3>
        {onRemoveFromKanban && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1 text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 data-[state=open]:text-neutral-300 data-[state=open]:bg-white/5"
              >
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#2E2E2E]">
              <DropdownMenuLabel className="text-neutral-400">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2E2E2E]" />
              <DropdownMenuItem
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                onSelect={() => onRemoveFromKanban(task.id)}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Tags */}
      {task.tag && (
        <div className="flex flex-wrap gap-2">
          <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getTagStyle(task.tag))}>
            {task.tag}
          </span>
        </div>
      )}

      {/* Description */}
      {task.desc && (
        <p className="text-[13px] text-neutral-400 leading-normal line-clamp-2">
          {task.desc}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-1.5">
        <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-md", getPriorityStyle(task.priority))}>
          {task.priority}
        </span>

        {column?.statusLabel && (
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium",
            isBlue ? "bg-[#1e293b] border-[#334155] text-blue-400" :
            isGreen ? "bg-[#14291f] border-[#22402e] text-green-400" :
            "bg-neutral-800 border-neutral-700 text-neutral-400"
          )}>
            {column.color === 'grey' && <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />}
            {isBlue && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
            {isGreen && <CheckCircle2 size={11} />}
            {column.statusLabel}
          </div>
        )}
      </div>
    </div>
  );
});
