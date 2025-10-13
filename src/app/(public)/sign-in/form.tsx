"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { useRouter } from "next/navigation";

import { signIn } from "@/lib/auth/client";

import { Form, FormCheckbox, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

type SignInSchema = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(data: SignInSchema) {
    try {
      setIsLoading(true);

      await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      router.push("/");

      setIsLoading(false);
    } catch {
      toast.error("E-mail ou senha inválidos.");

      setIsLoading(false);
    }
  }

  return (
    <Form
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <FormInput
        name="email"
        type="email"
        label="E-mail"
        placeholder="Insira seu e-mail"
      />

      <FormInput
        name="password"
        type="password"
        label="Senha"
        placeholder="Insira sua senha"
      />

      <div className="flex justify-between">
        <FormCheckbox name="rememberMe" label="Lembrar de mim" />

        <a href="/" className="text-primary text-sm underline">
          Esqueceu sua senha?
        </a>
      </div>

      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Entrar
      </Button>
    </Form>
  );
}
