"use client";

import { useState, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";

// Custom collision detection that handles empty columns
// pointerWithin detects when pointer is inside any droppable (even empty ones)
// Falls back to rectIntersection for edge cases
function customCollisionDetection(args) {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  return rectIntersection(args);
}

export function KanbanBoard({ tasks, setTasks, columns, onRemoveFromKanban, onCreateTask }) {
  const [activeTask, setActiveTask] = useState(null);

  // Throttle refs to prevent rapid state updates
  const lastOverIdRef = useRef(null);
  const rafRef = useRef(null);
  const pendingUpdateRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = useCallback((event) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      lastOverIdRef.current = null;
      pendingUpdateRef.current = null;
    }
  }, []);

  // Process the actual state update - separated for throttling
  const processUpdate = useCallback((activeId, overId, isOverTask, isOverColumn) => {
    if (isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (activeIndex === -1 || overIndex === -1) return tasks;
        if (activeIndex === overIndex) return tasks;

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            columnId: tasks[overIndex].columnId,
          };
          return arrayMove(newTasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        if (activeIndex === -1) return tasks;
        if (tasks[activeIndex].columnId === overId) return tasks;

        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          columnId: overId,
        };
        return newTasks;
      });
    }
  }, [setTasks]);

  const onDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Skip if same position or same as last processed
    if (activeId === overId) return;
    if (lastOverIdRef.current === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Store pending update and throttle via requestAnimationFrame
    pendingUpdateRef.current = { activeId, overId, isOverTask, isOverColumn };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pendingUpdateRef.current) {
          const { activeId, overId, isOverTask, isOverColumn } = pendingUpdateRef.current;
          lastOverIdRef.current = overId;
          processUpdate(activeId, overId, isOverTask, isOverColumn);
          pendingUpdateRef.current = null;
        }
      });
    }
  }, [processUpdate]);

  const onDragEnd = useCallback(() => {
    setActiveTask(null);
    lastOverIdRef.current = null;
    pendingUpdateRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return (
    <div className="flex h-full gap-4 pb-4 items-start">
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)}
              onRemoveFromKanban={onRemoveFromKanban}
              onCreateTask={onCreateTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
                task={activeTask}
                column={columns.find(c => c.id === activeTask.columnId)}
                isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
