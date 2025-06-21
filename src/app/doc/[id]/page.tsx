"use client";

import Document from "@/components/Document";

type DocumentPageProps = {
  params: {
    id: string;
  };
};
  
const DocumentPage = ({params: {id}}: DocumentPageProps) => {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
        <Document id={id} />
    </div>
  )
}
export default DocumentPage