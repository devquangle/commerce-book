import React from "react";
import { useController } from "react-hook-form";
import type { Control, FieldValues, FieldPath, UseControllerProps } from "react-hook-form";
import { SelectBox } from "../ui/SelectBox";
import type { SelectBoxProps } from "../ui/SelectBox";

export type FormSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: UseControllerProps<T>["rules"];
  onValueChange?: (value: string | number) => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
} & Omit<SelectBoxProps, "name" | "value" | "onChange" | "onBlur" | "ref" | "error" | "defaultValue">;

const FormSelect = <T extends FieldValues>({
  name,
  control,
  rules,
  onValueChange,
  onChange: customOnChange,
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    if (customOnChange) customOnChange(e);
    if (onValueChange) onValueChange(e.target.value);
  };

  return (
    <SelectBox
      {...selectProps}
      name={fieldName}
      value={value ?? ""}
      onChange={handleChange}
      onBlur={onBlur}
      ref={ref}
      error={error?.message}
    />
  );
};

export { FormSelect };
export default FormSelect;
