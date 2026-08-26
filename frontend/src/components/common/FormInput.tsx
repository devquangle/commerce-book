
import { useController } from "react-hook-form";
import type { Control, FieldValues, FieldPath, UseControllerProps } from "react-hook-form";
import { InputField } from "./InputField";
import type { InputFieldProps } from "./InputField";

export type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps<T>["rules"];
} & Omit<InputFieldProps, "name" | "value" | "onChange" | "onBlur" | "ref" | "error">;

const FormInput = <T extends FieldValues>({
  name,
  control,
  rules,
  ...inputProps
}: FormInputProps<T>) => {
  const {
    field: { onChange, onBlur, name: fieldName, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <InputField
      {...inputProps}
      name={fieldName}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      error={error?.message}
    />
  );
};

export { FormInput };
export default FormInput;
