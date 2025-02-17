import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { Plus, Layout, CalendarIcon } from "lucide-react";
import { Task, TaskStatus, TaskStatusOptions } from "./types/task";
import { TaskForm } from "./components/TaskForm";
import { useTaskStore } from "./store/useTaskStore";
import { TaskColumn as TaskColumnComponent } from "./components/TaskColumn";
import { TaskCard } from "./components/TaskCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Button } from "./components/ui/button";
import { format, isWithinInterval, parseISO } from "date-fns";
import { Calendar } from "./components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "./lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();
  const [filteredTasks, setFilteredTasks] = useState<Task[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">(
    "all"
  );

  const { tasks, addTask, updateTask, moveTask } = useTaskStore();

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const overId = over.id.toString();
      const dropOverColumn = TaskStatusOptions.some((col) => col.id === overId);
      if (active.id !== over.id) {
        const activeTask = tasks.find((t) => t.id === active.id);
        const dropOverOtherTask = tasks.find((t) => t.id === over.id);
        if (activeTask) {
          // If dropping over a column, use that column's status
          // If dropping over another task, use that task's status
          const newStatus = dropOverColumn
            ? (overId as TaskStatus)
            : dropOverOtherTask
            ? dropOverOtherTask?.status
            : activeTask.status;
          console.log(
            "new status",
            newStatus,
            tasks.find((t) => t.id === over.id)
          );
          moveTask(activeTask.id, newStatus);
        }
      }
    }
    setActiveTask(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmitTask = (taskData: Task) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    handleCloseForm();
  };

  const handleClearTask = () => {
    setDate(undefined);
    setSelectedStatus("all");
  };

  useEffect(() => {
    let filtered = tasks;
    if (date?.from && date?.to) {
      filtered = filtered.filter((task) => {
        if (!task.startDate || !task.endDate) return false;

        const taskStartDate =
          typeof task.startDate === "string"
            ? parseISO(task?.startDate)
            : task?.startDate;
        const taskEndDate =
          typeof task.endDate === "string"
            ? parseISO(task?.endDate)
            : task?.endDate;

        return (
          isWithinInterval(taskStartDate, {
            start: date?.from as Date,
            end: date?.to as Date,
          }) ||
          isWithinInterval(taskEndDate, {
            start: date?.from as Date,
            end: date?.to as Date,
          })
        );
      });
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }

    setFilteredTasks(filtered);
  }, [date, selectedStatus, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Layout className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Kanban Board
            </h1>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Plus size={20} className="mr-2" />
            Add Task
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date as DateRange}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as TaskStatus | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  {selectedStatus === "all"
                    ? "Select Status"
                    : TaskStatusOptions.find(
                        (task) => task.id === selectedStatus
                      )?.title}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {TaskStatusOptions.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {filteredTasks?.length} of {tasks?.length} tasks
              </span>
              <button
                onClick={handleClearTask}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TaskStatusOptions.map((column) => (
              <TaskColumnComponent
                key={column.id}
                column={column}
                tasks={
                  filteredTasks
                    ? filteredTasks.filter((task) => task.status === column.id)
                    : tasks.filter((task) => task.status === column.id)
                }
                onEditTask={handleEditTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} onEdit={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>

        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseForm}
            submit={handleSubmitTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;
