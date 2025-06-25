"use client";
import * as Y from "yjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { LanguagesIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
type Language =
  | "english"
  | "spanish"
  | "portugese"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "russian"
  | "japanese";

const languages: Language[] = [
  "english",
  "spanish",
  "portugese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();
  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get("default").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );

      if (res.ok){
        // const id = toast.loading("Translating...");
        const {translated_text} = await res.json();
        setSummary(translated_text);
        toast.success("Translatated summary successfully")
      }
    });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <AlertDialogTrigger>
          <LanguagesIcon />
          Translate
        </AlertDialogTrigger>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Translate the Document</AlertDialogTitle>
          <AlertDialogDescription>
            Select a Language and AI will translate a summary of the document in
            the selected language.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {
          summary && (
            <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 pb-5 bg-gray-100">
              <div className="flex">
                <Button className="w-10 flex-shrink"/>
                <p className="font-bold">
                  GPT {isPending ? "is thinking...": "Says"}
                </p>
              </div>
              <p>{isPending ? "Thinking...": <Markdown>{summary}</Markdown>}</p>
            </div>
          )
        }


        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          {/* <Input
                  type="email"
                  placeholder="Email"
                  className="w-full"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                /> */}
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
              {/* <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem> */}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
        <AlertDialogCancel className="absolute top-2 outline-none border-white right-2">
          <XIcon size={40} />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default TranslateDocument;
