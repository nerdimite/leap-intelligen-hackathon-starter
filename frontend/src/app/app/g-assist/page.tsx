"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Layers, Loader, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function GAssistPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateChatId = async () => {
    try {
      const response = await fetch("/api/chat", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setChatId(data.chatId);
      } else {
        throw new Error("Failed to generate chat ID");
      }
    } catch (error) {
      console.error("Error generating chat ID:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start a new chat. Please try again.",
      });
    }
  };

  useEffect(() => {
    generateChatId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatId) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messages.length === 0 ? `[Customer ID: ${user?.customer_id}] ${input}` : input,
          chatId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description:
          "An error occurred while processing your message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    generateChatId();
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl flex flex-col h-[calc(97vh-4rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[70%] ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {message.role === "user" ? (
                <Image
                  src={
                    user?.profileImageUrl ??
                    process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL ??
                    ""
                  }
                  width={40}
                  height={40}
                  alt="User"
                  className="rounded-full"
                />
              ) : (
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Layers className="h-6 w-6" />
                </div>
              )}
              <div
                className={`bg-background p-3 rounded-lg shadow ${
                  message.role === "user"
                    ? "rounded-tr-none"
                    : "rounded-tl-none"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose dark:prose-invert max-w-none"
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[70%]">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Layers className="h-6 w-6" />
              </div>
              <div className="bg-background p-3 rounded-lg shadow rounded-tl-none flex items-center space-x-2">
                <Loader className="h-5 w-5 animate-spin" />
                <span>G-Assist is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex items-center gap-2 p-2 bg-background rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border-none text-base py-3 px-6 rounded-full focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading || !chatId}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full w-12 h-12 flex-shrink-0"
            disabled={isLoading || !chatId}
          >
            {isLoading ? (
              <Loader className="h-6 w-6 animate-spin" />
            ) : (
              <ArrowUpCircle className="h-6 w-6" />
            )}
            <span className="sr-only">Send</span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full w-12 h-12 flex-shrink-0"
            onClick={handleNewChat}
          >
            <RefreshCw className="h-6 w-6" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
