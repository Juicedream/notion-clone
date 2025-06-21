'use server';

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebase-admin";

export async function createNewDocument() {
    // auth.protect(); // Ensure the user is authenticated if not ask them to log in or sign up
    const { sessionClaims } = await auth();

    // crete a new document in the database
    const documentCollectionRef = adminDb.collection('documents');
    const docRef = await documentCollectionRef.add({
        title: "New Doc",
    });

    await adminDb.collection('users').doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email!,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    });
    return { docId: docRef.id };
}
