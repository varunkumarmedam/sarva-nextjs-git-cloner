import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const BackButton = ({ name, path }) => {
  const router = useRouter();

  function goTo() {
    router.push(path);
  }
  return (
    <button
      className="absolute float-left border border-white-10 shadow-md shadow-white"
      onClick={goTo}
    >
      <div className="flex items-center justify-center p-1 pr-5">
        <ArrowLeftIcon className="m-2 h-6 w-6"></ArrowLeftIcon>
        {name}
      </div>
    </button>
  );
};

export default BackButton;
