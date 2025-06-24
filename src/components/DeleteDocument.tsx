'use client';
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
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument } from "../../actions/actions";
import { toast } from "sonner";

function DeleteDocument() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname(); 
    const router = useRouter();

    async function handleDelete(){
        const roomId = pathname.split("/").pop();
        if(!roomId) return;
        
        startTransition(async () => {
            const {success} = await deleteDocument(roomId);
            if(success){
                setIsOpen(false);
                router.replace("/");
                toast.success("Room Deleted successfully!");
            } else{
                toast.error("Failed to delete room!");
            }
        })
    }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="destructive">
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
           This will delete the document and all its contents, removing all users from the document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-end gap-2">
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction> */}
          <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
          >
            {isPending ? "Deleting...": "Delete"}
          </Button>
          <AlertDialogCancel asChild>
            <Button
            type="button"
            variant="secondary"
            >
                Close
            </Button>

          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeleteDocument