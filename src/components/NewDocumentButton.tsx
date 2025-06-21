"use client"

import { useTransition } from "react";
import { Button } from "./ui/button"

import { createNewDocument } from "../../actions/actions";
import { useRouter } from "next/navigation";



const NewDocumentButton = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    function handleCreateNewDocument() {
      startTransition(async () => {
        // create a new document
        const {docId} = await createNewDocument();
        router.push(`/doc/${docId}`);
      })
    }
  return (
    <div>
        <Button disabled={isPending} onClick={handleCreateNewDocument}>
            {isPending ? "Creating..." : "New Document"}
        </Button>
    </div>
  )
}

export default NewDocumentButton