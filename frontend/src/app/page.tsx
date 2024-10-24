"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";

export default function Home() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: process.env.NEXT_PUBLIC_DEFAULT_CUSTOMER_ID,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // The cookie is set by the server, so we don't need to manually set it here
          // The browser will automatically store the cookie sent in the response
          router.push("/app/dashboard");
        } else {
          console.error("Login failed:", data.error);
        }
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
    setIsLoggingIn(false);
  };

  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <span className="sr-only">Greenbase Assist</span>
              <Layers className="h-8 w-8 text-green-600 dark:text-green-400" />
              <span className="ml-2 font-mono text-xl font-bold text-foreground">
                Greenbase Assist
              </span>
            </Link>
          </div>

          <div className="flex flex-1 justify-end">
            <div className="mr-4">
              <ThemeToggle />
            </div>
            <Button onClick={handleLogin} disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-500 to-indigo-400 dark:from-blue-600 dark:to-purple-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] "
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-28">
          <div className="mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 dark:text-secondary-foreground ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:ring-white/10 dark:hover:ring-white/20">
              Welcome to Greenbase Assist, our AI-powered customer support.{" "}
              <Link
                href="#"
                className="font-semibold text-indigo-600 dark:text-indigo-400"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="text-left md:text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
                AI-powered insights
              </span>{" "}
              for your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-600">
                financial journey.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-secondary-foreground">
              Greenbase Assist provides intelligent support for all your
              financial needs. Get expert guidance on accounts, investments, and
              financial planning in seconds.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Button
                asChild
                className="rounded-md bg-green-600 dark:bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <Link href="/app/g-assist">Chat with Greenbase Assist</Link>
              </Button>
              <Link
                href="/app/dashboard"
                className="text-sm font-semibold leading-6 text-secondary-foreground"
              >
                Login to your account <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-8rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-20rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[20rem] -translate-x-1/2 bg-gradient-to-tr from-pink-500 to-indigo-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[40rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600 dark:text-green-400">
              Our Solutions
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Empowering your financial decisions
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Discover how our AI-powered tools can revolutionize your financial
              management experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                  <svg
                    className="h-5 w-5 flex-none text-green-600 dark:text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Generative Search
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Get natural language answers to your queries about
                    Greenbase's services, products, and financial information
                    from our comprehensive Wiki.
                  </p>
                  <p className="mt-6">
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-green-600 dark:text-green-400"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                  <svg
                    className="h-5 w-5 flex-none text-green-600 dark:text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  G-Assist
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Interact with our AI chatbot to get platform-specific
                    information and perform tasks like placing trades or moving
                    money within the Greenbase ecosystem.
                  </p>
                  <p className="mt-6">
                    <Link
                      href="#"
                      className="text-sm font-semibold leading-6 text-green-600 dark:text-green-400"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
