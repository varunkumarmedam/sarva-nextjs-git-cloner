import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  BookmarkSquareIcon,
  BookOpenIcon,
  CodeBracketSquareIcon,
  MapIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Pagination from "@/components/pagination";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import BackButton from "@/components/BackButton";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [reposData, setReposData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReposLoading, setIsReposLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);

  const router = useRouter();
  const { user } = router.query;

  async function getUserData() {
    setIsLoading(true);
    const response = await fetch(`https://api.github.com/users/${user}`);
    const data = await response.json();
    setIsLoading(false);
    setUserData(data);
  }

  async function getRepos(page) {
    setIsReposLoading(true);
    const response = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=6&page=${page + 1}`
    );
    const data = await response.json();
    setIsReposLoading(false);
    setReposData(data);
  }

  useEffect(() => {
    if (user !== undefined) getUserData(), getRepos(activePage);
  }, [user]);

  return (
    <div className="p-14">
      <BackButton name={"Dashboard"} path={"/"}></BackButton>
      {isLoading ? (
        <p>Loading..</p>
      ) : (
        <div className="flex flex-col w-full items-center">
          <img className="rounded-full h-200" src={userData.avatar_url}></img>
          <div className="text-4xl mt-3 mb-3">{userData.name}</div>
          <div className="text-xl mb-2">{userData.bio}</div>
          {userData.location && (
            <div className="flex mb-2">
              <MapPinIcon className="h-6 w-6" /> {userData.location}
            </div>
          )}

          <div className="flex mb-3">
            <div
              className="flex border border-white-2 p-3 mr-3 shadow-md shadow-gray-400"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Followers"
            >
              <UsersIcon className="h-6 w-6 mr-2" />
              {userData.followers}
            </div>
            <div
              className="flex border border-white-2 p-3 mr-3 shadow-md shadow-gray-400"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Following"
            >
              <UserPlusIcon className="h-6 w-6 mr-2" />
              {userData.following}
            </div>
            <div
              className="flex border border-white-2 p-3 shadow-md shadow-gray-400"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Public Gists"
            >
              <CodeBracketSquareIcon className="h-6 w-6 mr-2" />
              {userData.public_gists}
            </div>
          </div>
          {isReposLoading && (
            <BarLoader
              color={"#fff"} // Color of the progress bar
              loading={true}
              width={100} // Width of the progress bar
              height={8} // Height of the progress bar
            />
          )}
          <div className="flex flex-wrap mb-10 justify-around w-full">
            {reposData.map((repo) => {
              return (
                <Link
                  className="sm:w-1/2 lg:w-1/4 p-4 bg-gray-800 shadow-md shadow-gray-400 mt-6 ml-1"
                  href={`${user}/` + repo.name}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookmarkSquareIcon className="m-2 h-6 w-6"></BookmarkSquareIcon>
                      {repo.name}
                    </div>
                    <ArrowRightIcon className="m-2 h-6 w-6"></ArrowRightIcon>
                  </div>
                </Link>
              );
            })}
          </div>
          {userData.public_repos > 6 && (
            <Pagination
              steppers={userData.public_repos}
              activePage={activePage}
              onBtnClk={(val) => {
                if (val !== activePage) {
                  setActivePage(val);
                  getRepos(val);
                }
              }}
            ></Pagination>
          )}
          <Tooltip id="my-tooltip" />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
