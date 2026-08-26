import { useController } from "react-hook-form";
import type { Control, FieldValues, FieldPath, UseControllerProps } from "react-hook-form";
import { InputDate } from "../ui/InputDate";
import type { InputDateProps } from "../ui/InputDate";

export type FormDateProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps<T>["rules"];
} & Omit<InputDateProps, "name" | "value" | "onChange" | "onBlur" | "ref" | "error">;

const FormDate = <T extends FieldValues>({
  name,
  control,
  rules,
  ...dateProps
}: FormDateProps<T>) => {
  const {
    field: { onChange, onBlur, name: fieldName, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <InputDate
      {...dateProps}
      name={fieldName}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      error={error?.message}
    />
  );
};

export { FormDate };
export default FormDate;
