"use client";
import {
  ClientSideSuspense,
  RoomProvider as RoomProviderWrapper,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "./LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";
import { useEffect, useState } from "react";

interface RoomProviderProps {
  children: React.ReactNode;
  roomId: string;
}


const RoomProvider = ({ children, roomId }: RoomProviderProps) => {
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    useEffect(() => {
      const authorize = async () => {
        try {
          const res = await fetch("/auth-endpoint", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ room: roomId }),
          });

          if (res.ok) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } catch (err) {
          console.error("Auth error:", err);
          setAuthorized(false);
        }
      };

      authorize();
    }, [roomId]);

    if (authorized === null) {
      return <LoadingSpinner />;
    }

    if (authorized === false) {
      return (
        <div className="text-center mt-10 text-red-600 font-semibold">
          🚫 You are not authorized to access this room.
        </div>
      );
    }
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
};

export default RoomProvider;
