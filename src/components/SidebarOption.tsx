"ise client";

import { doc } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { usePathname } from "next/navigation";

const SidebarOption = ({ id, href }: { id: string; href: string }) => {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathName = usePathname();
  const isActive = href.includes(pathName) && pathName !== "/";
  if (!data) return null;
  return (
    <Link
      href={href}
      className={`relative border p-2 rounded-md ${
        isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
      }`}
    >
      <p className="truncate">{data?.title}</p>
    </Link>
  );
};
export default SidebarOption;
