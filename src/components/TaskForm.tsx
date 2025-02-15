import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "./form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskSchema } from "@/lib/validation/taskSchema";
import { FormTextAera } from "./form/FormTextArea";
import { FormDatePicker } from "./form/FormDatePicker";
import { FormSelect } from "./form/FormSelect";
import { Task, TaskStatusOptions } from "@/types/task";
import { useEffect } from "react";

interface TaskFormProps {
  task?: Task;
  submit: (task: Task) => void;
  onClose: () => void;
}

export function TaskForm({ task, submit, onClose }: TaskFormProps) {
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(taskSchema),
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = (data: any) => {
    submit(data);
  };

  useEffect(() => {
    if (task) {
      setValue("title", task.title || "");
      setValue("description", task.description || "");
      setValue(
        "startDate",
        task.startDate ? new Date(task.startDate) : new Date()
      );
      setValue("endDate", task.endDate ? new Date(task.endDate) : new Date());
      setValue("status", task.status);
    }
  }, [task, setValue]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl p-6 w-fit max-w-xl shadow-xl border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </Button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-fit">
            <FormInput
              id="title"
              label="Title"
              placeholder="Enter your task title"
            />

            <FormTextAera
              id="description"
              label="Description"
              placeholder="Enter your task description"
            />

            <div className="flex space-x-4 w-fit">
              <FormDatePicker id="startDate" label="Select Start Date" />
              <FormDatePicker id="endDate" label="Select End Date" />
            </div>

            <FormSelect
              id="status"
              label="Select Status"
              placeholder="Select Status"
              options={TaskStatusOptions}
              value={task ? task?.status : ''}
            />

            <Button type="submit">{task ? "Update" : "Create"}</Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
