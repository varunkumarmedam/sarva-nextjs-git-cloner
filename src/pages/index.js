import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [input, setInput] = useState("");
  const router = useRouter();

  function onSearch() {
    router.push("/profile/" + input);
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div className="flex flex-col w-full w-100 items-center">
        <div>Sarva Git Tracker</div>
        <div className="flex  w-full">
          <input
            value={input}
            placeholder="search for github username"
            onChange={(e) => setInput(e.target.value)}
            className={
              "text-3xl bg-gray-50 h-20 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-5/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            }
          />
          <button
            type="button"
            className={`${
              input == "" ? "bg-gray-600" : ""
            } border border-white-200 w-1/6`}
            onClick={onSearch}
            disabled={input == ""}
          >
            <div className="flex items-center justify-center">
              Search
              {input !== "" && (
                <ArrowRightIcon className="m-2 h-6 w-6"></ArrowRightIcon>
              )}
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
