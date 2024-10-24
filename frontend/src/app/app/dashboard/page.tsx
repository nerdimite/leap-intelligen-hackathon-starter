"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle } from "lucide-react";
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Welcome to Greenbase Assist</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Search className="mr-2 text-primary" /> Generative Search
            </CardTitle>
            <CardDescription>
              Get instant answers to your financial queries using our AI-powered search.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Access comprehensive information about Greenbase's services, products, and financial data. 
              Our advanced AI interprets your questions and provides accurate, tailored responses.
            </p>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/app/search">Go to Search</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <MessageCircle className="mr-2 text-primary" /> G-Assist
            </CardTitle>
            <CardDescription>
              Interact with our AI chatbot for personalized financial assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Get platform-specific information, perform tasks like placing trades or moving money, 
              and receive tailored financial advice through our intelligent chatbot interface.
            </p>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/app/g-assist">Go to G-Assist</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
