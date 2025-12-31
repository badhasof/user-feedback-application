"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

export function InlineTaskForm({ columnId, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef(null);

  // Auto-focus the title input when form appears
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      columnId,
    });

    // Reset form
    setTitle("");
    setDescription("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-blue-500/30 rounded-lg p-3 mb-2 shadow-lg">
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title..."
        className="w-full bg-transparent text-sm font-medium text-neutral-100 placeholder:text-neutral-500 outline-none mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a description (optional)"
        rows={2}
        className="w-full bg-transparent text-xs text-neutral-400 placeholder:text-neutral-600 outline-none resize-none"
      />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <span className="text-[10px] text-neutral-600">Press Enter to save, Esc to cancel</span>
        <div className="flex gap-1">
          <button
            onClick={onCancel}
            className="p-1 text-neutral-500 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
