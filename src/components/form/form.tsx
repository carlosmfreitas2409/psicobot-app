/** biome-ignore-all lint/suspicious/noExplicitAny: any */
"use client";

import type * as React from "react";

import { FormProvider, type UseFormReturn } from "react-hook-form";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  methods: UseFormReturn<any>;
};

export function Form({ methods, onSubmit, children, ...props }: FormProps) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} {...props} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
