
import { useController } from "react-hook-form";
import type { Control, FieldValues, FieldPath, UseControllerProps } from "react-hook-form";
import { InputFieldPassword, type InputFieldPasswordProps } from "../ui/InputFieldPassword";

export type FormInputPasswordProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps<T>["rules"];
} & Omit<InputFieldPasswordProps, "name" | "value" | "onChange" | "onBlur" | "ref" | "error" | "type">;

const FormInputPassword = <T extends FieldValues>({
  name,
  control,
  rules,
  ...inputProps
}: FormInputPasswordProps<T>) => {
  const {
    field: { onChange, onBlur, name: fieldName, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <InputFieldPassword
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

export { FormInputPassword };
export default FormInputPassword;
