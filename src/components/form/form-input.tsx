"use client";

import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { ClassValue } from "clsx";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormInputProps = React.ComponentPropsWithoutRef<typeof Input> & {
  name: string;
  label?: string;
  containerClassName?: ClassValue;
};

export function FormInput({
  name,
  label,
  required = false,
  containerClassName,
  ...props
}: FormInputProps) {
  const id = React.useId();

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error
          ? String(fieldState.error.message)
          : undefined;

        return (
          <div className={cn("w-full space-y-2", containerClassName)}>
            {label && (
              <Label
                htmlFor={id}
                className={cn(error ? "text-destructive" : undefined)}
              >
                {label}
                {required && <span className="text-destructive"> *</span>}
              </Label>
            )}

            <Input
              id={id}
              // hasError={!!error}
              aria-invalid={!!error}
              required={required}
              {...field}
              {...props}
            />

            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
          </div>
        );
      }}
    />
  );
}
