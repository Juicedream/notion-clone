import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../firebase-admin";


// app/api/auth/route.ts
export async function POST(req: NextRequest) {
    try {
      const { sessionClaims } = await auth.protect();
      const { room } = await req.json();
  
      if (!sessionClaims?.email) {
        throw new Error("User email is required for session preparation.");
      }
  
      const session = liveblocks.prepareSession(sessionClaims.email, {
        userInfo: {
          name: sessionClaims?.fullName!,
          email: sessionClaims?.email!,
          avatar: sessionClaims?.image!,
        },
      });
  
      const usersInRoom = await adminDb
        .collectionGroup("rooms")
        .where("userId", "==", sessionClaims.email)
        .get();
  
      const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);
      if (!userInRoom?.exists) {
        console.log("Unauthorized for this room");
        return NextResponse.json({ error: "Unauthorized for this room" }, { status: 403 });
      }
  
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();
  
      return new Response(body, { status });
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json({ error: "Auth failed" }, { status: 403 });
    }
  }
  