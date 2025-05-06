"use client";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";
  import { ReactNode } from "react";
  
  interface CustomAlertDialogProps {
    trigger: ReactNode;
    title: string;
    description: string | ReactNode;
    cancelText?: string;
    actionText: string;
    onAction: () => void;
    disabled?: boolean;
    hasTasks?: boolean;
  }
  
  export const CustomAlertDialog = ({
    trigger,
    title,
    description,
    cancelText = "Cancel",
    actionText,
    onAction,
    disabled = false,
    hasTasks = true,
  }: CustomAlertDialogProps) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="bg-[#2D333F] text-white border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              {cancelText}
            </AlertDialogCancel>
            {hasTasks ? (
              <AlertDialogAction
                onClick={onAction}
                className="bg-red-600 hover:bg-red-700"
                variant="default"
              >
                {actionText}
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };