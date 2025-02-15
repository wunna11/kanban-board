import { date, InferType, object, string, mixed } from "yup";
import { requiredErrMsg } from "./validation-message";
import { TaskStatusOptions } from "@/types/task";

const allowedStatus = TaskStatusOptions.map(option => option.id);

export const taskSchema = object({
  title: string().required(requiredErrMsg("Title")),
  description: string().nullable(),
  startDate: date()
    .typeError("Start Date is invalid")
    .required(requiredErrMsg("Start Date")),
  endDate: date()
    .typeError("End Date is invalid")
    .required(requiredErrMsg("End Date"))
    .test("is-after-startDate", "End Date must be greater than Start Date", function (value) {
      const { startDate } = this.parent;
      return value && startDate ? value > startDate : true;
    }),
    status: mixed()
    .oneOf(allowedStatus, "Invalid status selected") 
    .required(requiredErrMsg("Status")),
})

export type TaskSchemaVType = InferType<typeof taskSchema>;