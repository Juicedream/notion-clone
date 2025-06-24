"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument, inviteUserToDocument } from "../../actions/actions";
import { Input } from "./ui/input";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    const roomId = pathname.split("/").pop();
    if (!roomId) return;
    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email);
      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success("User Added to the Room successfully!");
      } else {
        toast.error("Failed to add user to the room!");
      }
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <AlertDialogTrigger>Invite</AlertDialogTrigger>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invite a User to collaborate!</AlertDialogTitle>
          <AlertDialogDescription>
            Email the email of the user you want to invite
          </AlertDialogDescription>
        </AlertDialogHeader>
          <form className="flex gap-2" onSubmit={handleInvite}>
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={!email || isPending}>
              {isPending ? "Inviting..." : "Invite"}
            </Button>
          </form>
          <AlertDialogCancel className="absolute top-2 outline-none border-white right-2">
           <XIcon size={40}/>
          </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default InviteUser;
