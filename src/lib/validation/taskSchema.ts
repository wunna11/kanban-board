import { date, InferType, object, string } from "yup";
import { requiredErrMsg } from "./validation-message";

export const taskSchema = object({
  title: string().required(requiredErrMsg("Title")),
  startDate: date()
    .typeError("Start Date is invalid")
    .required(requiredErrMsg("Start Date")),
  endDate: string()
    .typeError("End Date is invalid")
    .required(requiredErrMsg("End Date"))
    .test("is-after-startDate", "End Date must be greater than Start Date", function (value) {
      const { startDate } = this.parent;
      return value && startDate ? value > startDate : true;
    }),
})

export type TaskSchemaVType = InferType<typeof taskSchema>;