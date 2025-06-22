import { stringToColor } from "@/lib/stringToColor";
import { motion } from "framer-motion";

type FollowPointerProps = {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
};

const FollowPointer = ({ x, y, info }: FollowPointerProps) => {
  const color = stringToColor(info.email || "1");
  return (
    <motion.div
      className="h-4 w-4 pointer-events-none rounded-full absolute z-50"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {/* Cursor dot
      <div
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: color }}
      /> */}

      {/* Arrow (SVG) */}
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -top-4 left-1/2 -translate-x-1/2"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      <motion.div
        className="px-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs py-2 rounded-full"
        style={{ background: color }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
      >
        {info.name || info.email}
      </motion.div>
    </motion.div>
  );
};
export default FollowPointer;
