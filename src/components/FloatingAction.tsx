import Link from "next/link";

const FloatingAction: typeof Link = (props) => {
  return (
    <Link
      className="inline-block text-center p-2 border border-gray-300 w-12 h-12 rounded-full text-2xl absolute bottom-8 right-8"
      {...props}
    />
  );
};

export default FloatingAction;
