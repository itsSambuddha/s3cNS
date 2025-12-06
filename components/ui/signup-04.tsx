"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export const Signup04 = ({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (values: any) => void;
  loading: boolean;
  error?: string;
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to s3cNS
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Create an account to get started
      </p>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Tyler Durden"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </LabelInputContainer>
        </div>

        <Button
          className="w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            type="button"
            disabled={loading}
          >
            <IconBrandGithub className="h-4 w-4 mr-2" />
            Sign up with GitHub
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={loading}
          >
            <IconBrandGoogle className="h-4 w-4 mr-2" />
            Sign up with Google
          </Button>
        </div>
      </form>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
