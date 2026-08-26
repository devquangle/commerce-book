import { useController } from "react-hook-form";
import type { Control, FieldValues, FieldPath, UseControllerProps } from "react-hook-form";
import { TextAreaField } from "../ui/TextAreaField";
import type { TextAreaFieldProps } from "../ui/TextAreaField";

export type FormTextAreaProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps<T>["rules"];
} & Omit<TextAreaFieldProps, "name" | "value" | "onChange" | "onBlur" | "ref" | "error">;

const FormTextArea = <T extends FieldValues>({
  name,
  control,
  rules,
  ...textAreaProps
}: FormTextAreaProps<T>) => {
  const {
    field: { onChange, onBlur, name: fieldName, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <TextAreaField
      {...textAreaProps}
      name={fieldName}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      error={error?.message}
    />
  );
};

export { FormTextArea };
export default FormTextArea;
