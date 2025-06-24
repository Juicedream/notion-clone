"use client";

import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { stringToColor } from "@/lib/stringToColor";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
};

const BlockNote = ({ doc, provider, darkMode }: EditorProps) => {
  const userInfo = useSelf((me) => me.info);
  console.log("Rendering BlockNote for", userInfo?.email);
  // checking if available
  const ready = userInfo?.name || userInfo?.email;
 

  const editor = useCreateBlockNote({
    collaboration:
      ready
        ? {
            provider,
            fragment: doc.getXmlFragment("default"),
            user: {
              name: userInfo.name,
              color: stringToColor(userInfo.email),
            },
          }
        : undefined,
  });
  

  if (!editor) {
    return (
      <div className="text-center py-10 text-gray-500">
        Setting up editor...
      </div>
    );
  }
  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    yProvider.connect();
    setDoc(yDoc);
    setProvider(yProvider);

    // return () => {
    //   yDoc?.destroy();
    //   yProvider?.destroy();
    // };
    const onSync = (isSynced: boolean) => {
      console.log("SYNCED: ", isSynced);
      setSynced(isSynced)
    };
    yProvider.on("sync", onSync);
    return () => {
      yProvider.off("sync", onSync);
      yProvider.destroy();
    };
  }, [room]);



  // if (!doc || !provider) {
  //   return null;
  // }

  if (!synced || !doc || !provider) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">Syncing document...</div>
    );
  }
  const style = darkMode
    ? "bg-gray-700 text-gray-300 hover:bg-gray-100 hover:text-gray-700"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-700";
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        {/* translate document */}
        {/* chattodocument ai */}

        {/* dark mode */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/* block note */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
};
export default Editor;
