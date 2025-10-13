"use client";

import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type FormCheckboxProps = React.ComponentPropsWithoutRef<typeof Checkbox> & {
  name: string;
  label?: string;
  containerClassName?: string;
};

export function FormCheckbox({
  className,
  name,
  label,
  containerClassName,
  ...props
}: FormCheckboxProps) {
  const id = React.useId();

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div
            className={cn("flex items-center space-x-2", containerClassName)}
          >
            <Checkbox
              id={id}
              className={cn(className)}
              checked={field.value}
              onCheckedChange={field.onChange}
              {...field}
              {...props}
            />

            {label && <Label htmlFor={id}>{label}</Label>}
          </div>
        );
      }}
    />
  );
}
