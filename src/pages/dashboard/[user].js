import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
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

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [reposData, setReposData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReposLoading, setIsReposLoading] = useState(true);
  const activePage = useRef(1);
  const router = useRouter();
  const { user } = router.query;

  async function getUserData() {
    setIsLoading(true);
    const response = await fetch(`https://api.github.com/users/${user}`);
    const data = await response.json();
    setIsLoading(false);
    setUserData(data);
  }

  async function getRepos() {
    setIsReposLoading(true);
    const response = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=6&page=${activePage.current}`
    );
    const data = await response.json();
    setIsReposLoading(true);
    setReposData(data);
  }

  useEffect(() => {
    if (user !== undefined) getUserData(), getRepos();
  }, [user]);

  return (
    <div className="flex flex-col items-center p-14">
      {isLoading ? (
        <p>Loading..</p>
      ) : (
        <div className="flex flex-col items-center">
          <img className="rounded-full h-200" src={userData.avatar_url}></img>
          <div>{userData.name}</div>
          <div>{userData.bio}</div>
          {userData.location && (
            <div className="flex">
              <MapPinIcon className="h-6 w-6" /> {userData.location}
            </div>
          )}

          <div className="flex">
            <div
              className="flex"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Followers"
            >
              <UsersIcon className="h-6 w-6" />
              {userData.followers}
            </div>
            <div
              className="flex"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Following"
            >
              <UserPlusIcon className="h-6 w-6" />
              {userData.following}
            </div>
            <div
              className="flex"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Public Gists"
            >
              <CodeBracketSquareIcon className="h-6 w-6" />
              {userData.public_gists}
            </div>
          </div>
          <div className="flex flex-wrap">
          {reposData.map((repo) => {
            return (
                <div className="sm:w-1/2 lg:w-1/3 p-4 bg-gray-200">{repo.name}</div>
            );
          })}
          </div>
          <Pagination steppers={10} activePage={1}></Pagination>
          <Tooltip id="my-tooltip" />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
