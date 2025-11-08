"use client";

import { useState } from "react";
import type { User } from "better-auth";

import { Chat } from "./chat";
import { Welcome } from "./welcome";

interface ChatExperienceProps {
  user: User;
}

export function ChatExperience({ user }: ChatExperienceProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [startSignal, setStartSignal] = useState(0);

  function handleStart() {
    setHasStarted(true);
    setStartSignal((value) => value + 1);
  }

  return (
    <div className="flex-1 flex flex-col">
      {!hasStarted ? (
        <Welcome user={user} onStart={handleStart} />
      ) : (
        <Chat startSignal={startSignal} />
      )}
    </div>
  );
}
