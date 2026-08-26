import { useController } from "react-hook-form";
import type { Control, FieldValues, FieldPath, UseControllerProps } from "react-hook-form";
import { SelectBox } from "../ui/SelectBox";
import type { SelectBoxProps } from "../ui/SelectBox";

export type FormSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps<T>["rules"];
} & Omit<SelectBoxProps, "name" | "value" | "onChange" | "onBlur" | "ref" | "error" | "defaultValue">;

const FormSelect = <T extends FieldValues>({
  name,
  control,
  rules,
  ...selectProps
}: FormSelectProps<T>) => {
  const {
    field: { onChange, onBlur, name: fieldName, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <SelectBox
      {...selectProps}
      name={fieldName}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      error={error?.message}
    />
  );
};

export { FormSelect };
export default FormSelect;
