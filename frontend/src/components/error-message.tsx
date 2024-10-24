import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  children: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = "Error", children }) => (
  <Alert variant="destructive" data-testid="error">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{children}</AlertDescription>
  </Alert>
);

export default ErrorMessage;