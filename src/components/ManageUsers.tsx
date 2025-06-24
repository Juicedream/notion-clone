"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

import { XIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { collectionGroup, query, where } from "firebase/firestore";
import { removeUserFromDocument } from "../../actions/actions";
import { toast } from "sonner";

function ManageUsers() {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  function handleDelete(userId: string) {
    startTransition(async () => {
      if (!user) return;
      const { success } = await removeUserFromDocument(room.id, userId);
      if (success) {
        toast.success("User removed from the room successfully!");
      } else {
        toast.error("Failed to remove user from the room!");
      }
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <AlertDialogTrigger>
          Users ({usersInRoom?.docs.length})
        </AlertDialogTrigger>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Users with Access</AlertDialogTitle>
          <AlertDialogDescription>
            Below is a list of users who have access to this document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <hr className="my-2" />
        <div className="flex flex-col space-y-2">
          {/* users in the room */}
          {usersInRoom?.docs.map((doc) => (
            <div
              key={doc.data().userId}
              className="flex items-center justify-between"
            >
              <p className="font-light">
                {doc.data().userId === user?.emailAddresses[0].toString()
                  ? `You (${doc.data().userId})`
                  : doc.data().userId}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline">{doc.data().role}</Button>

                {isOwner &&
                  doc.data().userId !== user?.emailAddresses[0].toString() && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(doc.data().userId)}
                      disabled={isPending}
                      size="sm"
                    >
                      {isPending ? "Removing..." : "X"}
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>

        <AlertDialogCancel className="absolute top-2 outline-none border-white right-2">
          <XIcon size={40} />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ManageUsers;
