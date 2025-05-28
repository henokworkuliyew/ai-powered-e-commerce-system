"use client"

import { useEffect, type RefObject } from "react"

interface UseChatScrollProps {
  chatRef: RefObject<HTMLDivElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
}

export function useChatScroll({ chatRef, bottomRef, shouldLoadMore, loadMore, count }: UseChatScrollProps) {
  // Handle scrolling to bottom when new messages are added
  useEffect(() => {
    const bottomElement = bottomRef.current;
    const chatContainer = chatRef.current;

    if (bottomElement && chatContainer) {
      // Scroll to bottom on new messages
      bottomElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottomRef, chatRef, count]);

  // Handle scrolling up to load more messages
  useEffect(() => {
    const chatContainer = chatRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop } = chatContainer;

      // If we're at the top and should load more, call loadMore
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);

    return () => {
      chatContainer.removeEventListener("scroll", handleScroll);
    };
  }, [chatRef, shouldLoadMore, loadMore]);
}