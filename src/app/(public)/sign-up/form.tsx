"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { enterprise } from "@/lib/auth/client";

import { Form, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";

const signUpSchema = z.object({
  password: z.string().min(8),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const methods = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(data: SignUpSchema) {
    if (!token) {
      return;
    }

    setIsLoading(true);

    await enterprise.signUp({
      token,
      password: data.password,
    });

    router.push("/sign-in");

    setIsLoading(false);
  }

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [router, token]);

  return (
    <Form
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <FormInput
        name="password"
        type="password"
        label="Senha"
        placeholder="Insira sua senha"
      />

      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Cadastrar
      </Button>
    </Form>
  );
}
