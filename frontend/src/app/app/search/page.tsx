"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Citation {
  source: string;
  headers: string;
}

interface SearchResult {
  answer: string;
  citations: Citation[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setResult(data);
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Search Error",
          description: errorData.error || "An error occurred while searching.",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "An unexpected error occurred while searching.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-center">
        What can we help you with?
      </h1>
      <p className="text-sm text-center mb-8 text-gray-600 dark:text-gray-400">
        Ask anything about our products and services and get direct answers.
      </p>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex items-center gap-2 p-2 bg-background rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
          <Input
            type="text"
            placeholder="Enter your search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow border-none text-base py-3 px-6 rounded-full focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full w-12 h-12 flex-shrink-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-6 w-6 animate-spin" />
            ) : (
              <Search className="h-6 w-6" />
            )}
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>
      {result && (
        <div className="bg-background p-6 rounded-lg shadow-md">
          <div className="prose dark:prose-invert max-w-none mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.answer}
            </ReactMarkdown>
          </div>
          {result.citations.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Sources:</h3>
              <div className="flex flex-wrap gap-2">
                {result.citations.map((citation, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 text-sm"
                  >
                    <span className="font-semibold">{citation.source}</span>
                    <span className="mx-1">•</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {citation.headers}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
