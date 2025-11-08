"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToUnproxiedDataStream } from "@orpc/client";
import { SparklesIcon } from "lucide-react";

import { orpc } from "@/lib/orpc";

import { RiskoMark } from "@/components/assets/risko-mark";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

const START_INTENT = "start";

type ChatProps = {
  startSignal?: number;
};

export function Chat({ startSignal = 0 }: ChatProps) {
  const lastStartSignalRef = useRef(0);

  const [input, setInput] = useState("");

  const { status, messages, sendMessage, setMessages } = useChat({
    transport: {
      async sendMessages(options) {
        return eventIteratorToUnproxiedDataStream(
          await orpc.chats.create(
            {
              id: options.chatId,
              messages: options.messages,
              trigger: options.trigger,
            },
            { signal: options.abortSignal },
          ),
        );
      },
      reconnectToStream() {
        throw new Error("Unsupported");
      },
    },
  });

  const removeSyntheticStartMessages = useCallback(() => {
    setMessages((current) =>
      current.filter((message) => {
        if (!message?.metadata || typeof message.metadata !== "object") {
          return true;
        }

        const intent = (message.metadata as { intent?: string }).intent;

        return intent !== START_INTENT;
      }),
    );
  }, [setMessages]);

  const startConversation = useCallback(async () => {
    if (
      messages.length > 0 ||
      status === "streaming" ||
      status === "submitted"
    ) {
      return;
    }

    try {
      sendMessage({
        metadata: { intent: START_INTENT },
        text: "",
      });
    } finally {
      removeSyntheticStartMessages();
    }
  }, [messages.length, sendMessage, status, removeSyntheticStartMessages]);

  function handleSubmit(message: PromptInputMessage) {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (hasAttachments) {
      console.log("Attachments are not supported yet");
      return;
    }

    if (!hasText) {
      return;
    }

    sendMessage({
      text: message.text ?? "",
    });

    setInput("");
  }

  useEffect(() => {
    if (startSignal <= 0 || startSignal === lastStartSignalRef.current) {
      return;
    }

    lastStartSignalRef.current = startSignal;

    startConversation();
  }, [startSignal, startConversation]);

  return (
    <div className="overscroll-behavior-contain flex-1 flex flex-col min-w-0 overflow-y-auto">
      <div
        className="overscroll-behavior-contain -webkit-overflow-scrolling-touch flex-1 pb-16"
        style={{ overflowAnchor: "none" }}
      >
        <Conversation className="mx-auto flex min-w-0 max-w-5xl flex-col gap-4 md:gap-6">
          <ConversationContent className="flex flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
            {messages.map((message) => {
              if (
                message.metadata &&
                typeof message.metadata === "object" &&
                "intent" in message.metadata &&
                message.metadata.intent === START_INTENT
              ) {
                return null;
              }

              return (
                <Message
                  from={message.role}
                  key={message.id}
                  className="flex items-start min-h-10 gap-3 max-w-full"
                >
                  {message.role === "assistant" && (
                    <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
                      <RiskoMark className="size-4" />
                    </div>
                  )}

                  {message.parts.map((part, index) => {
                    const { type } = part;

                    const key = `message-${message.id}-part-${index}`;

                    if (type === "text") {
                      return (
                        <MessageContent
                          key={key}
                          className="text-base group-[.is-user]:py-2.5 group-[.is-user]:bg-blue-500 group-[.is-user]:text-white"
                        >
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      );
                    }

                    return null;
                  })}
                </Message>
              );
            })}

            {status === "submitted" && (
              <div className="w-full flex items-start justify-start gap-3 min-h-10">
                <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
                  <SparklesIcon size={14} />
                </div>

                <div className="flex w-full flex-col gap-2 md:gap-4">
                  <div className="p-0 text-muted-foreground text-sm">
                    Pensando...
                  </div>
                </div>
              </div>
            )}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-5xl px-2 bg-background pb-3 md:px-4 md:pb-4">
        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Escreva sua mensagem aqui..."
              onChange={(event) => setInput(event.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter className="flex justify-end">
            <PromptInputSubmit
              disabled={!input.trim() || status === "streaming"}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );

  // return (
  //   <div className="overscroll-behavior-contain flex flex-1 min-w-0 touch-pan-y flex-col bg-background">
  //     <Messages messages={messages} />

  //     <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
  //       <ChatInput
  //         status={status}
  //         setMessages={setMessages}
  //         sendMessage={sendMessage}
  //         stop={stop}
  //       />
  //     </div>
  //   </div>
  // );
}
