import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

const DocLayout = async({
  children,
  params: {id},
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  //show login if not authenticated
  //   auth.protect();
  // ✅ Protect and await the result
  const { userId } = await auth.protect();

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
