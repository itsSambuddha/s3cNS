"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { IconBrandGoogle } from "@tabler/icons-react";

export const Login04 = ({
  onEmailSubmit,
  onGoogleSubmit,
  loading,
  error,
}: {
  onEmailSubmit: (values: any) => void;
  onGoogleSubmit: () => void;
  loading: boolean;
  error?: string;
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEmailSubmit({ email, password });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-card">
      <h2 className="font-bold text-xl">
        Welcome Back to s3cNS
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mt-2">
        Login to continue to your dashboard
      </p>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <form className="my-8" onSubmit={handleEmailSubmit}>
        <div className="flex flex-col space-y-4 mb-4">
          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="name@example.com"
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
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="bg-gradient-to-r from-transparent via-border to-transparent my-8 h-[1px] w-full" />

        <Button
          variant="outline"
          type="button"
          disabled={loading}
          onClick={onGoogleSubmit}
          className="w-full"
        >
          <IconBrandGoogle className="h-4 w-4 mr-2" />
          Continue with Google
        </Button>
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
