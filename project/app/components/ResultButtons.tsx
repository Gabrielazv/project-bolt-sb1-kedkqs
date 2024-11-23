"use client";

import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

interface ResultButtonsProps {
  onShare: () => void;
  onFeedback: (isPositive: boolean) => void;
  onReport: () => void;
}

export default function ResultButtons({ onShare, onFeedback, onReport }: ResultButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => onShare()}
      >
        <Share2 className="h-4 w-4" />
        Partager
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onFeedback(true)}
        >
          <ThumbsUp className="h-4 w-4" />
          Utile
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onFeedback(false)}
        >
          <ThumbsDown className="h-4 w-4" />
          Pas utile
        </Button>
      </div>
      <Button
        variant="outline"
        className="flex items-center gap-2 text-red-600 hover:text-red-700"
        onClick={() => onReport()}
      >
        <AlertTriangle className="h-4 w-4" />
        Signaler un problème
      </Button>
    </div>
  );
}