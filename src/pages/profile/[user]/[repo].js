import BarChart from "@/components/BarChart";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  CalendarIcon,
  EyeIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import BackButton from "@/components/BackButton";

const RepoInfo = () => {
  const [repoData, setRepoData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { repo, user } = router.query;
  const [chartData, setChartData] = useState({});

  async function getRepoInfo() {
    setIsLoading(true);
    const response = await Promise.all([
      fetch(`https://api.github.com/repos/${user}/${repo}`).then((data) =>
        data.json()
      ),
      fetch(`https://api.github.com/repos/${user}/${repo}/branches`).then(
        (data) => data.json()
      ),
      fetch(`https://api.github.com/repos/${user}/${repo}/languages`).then(
        (data) => data.json()
      ),
      fetch(`https://api.github.com/repos/${user}/${repo}/commits`).then(
        (data) => data.json()
      ),
    ]);

    // Preparing chart data
    const langBytes = Object.values(response[2]);
    const totalBytes =
      langBytes ?? langBytes.reduce((prev, curr) => prev + curr);
    const cData = {
      labels: Object.keys(response[2]),
      datasets: [
        {
          label: "%",
          data: langBytes.map((val) => parseInt((val / totalBytes) * 100)),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };
    setChartData(cData);
    setRepoData({
      meta: response[0],
      branches: response[1],
      languages: response[2],
      commits: response[3],
    });
    setIsLoading(false);
  }

  useEffect(() => {
    if (repo !== undefined) getRepoInfo();
  }, [repo]);

  return (
    <div>
      {isLoading ? (
        <p>loading..</p>
      ) : (
        <div className="p-14">
          <BackButton name="Profile" path={`/profile/${user}`}></BackButton>

          <div className="border fixed left-0 border-white-200 mt-20 ml-10 p-10 w-1/2 shadow-md shadow-gray-400">
            <div className="text-3xl mb-3">{repo}</div>
            <div className="text-xl mb-3">{repoData.meta.description}</div>
            <div className="flex mb-5">
              <div className="flex border border-white-2 p-3 mr-3 shadow-md shadow-gray-400">
                <StarIcon className="h-6 w-6 mr-3"></StarIcon>
                {repoData.meta.stargazers_count}
              </div>
              <div className="flex border border-white-2 p-3 mr-3 shadow-md shadow-gray-400">
                <EyeIcon className="h-6 w-6 mr-3"></EyeIcon>
                {repoData.meta.watchers_count}
              </div>
              <div className="flex border border-white-2 p-3 mr-3 shadow-md shadow-gray-400">
                Issues: {repoData.meta.open_issues_count}
              </div>
            </div>
            <div className="flex mb-3">
              <UserIcon className="h-6 w-6 mr-1"></UserIcon>
              {repoData.meta.owner?.login}
            </div>

            <div className="mb-3 flex">
              <CalendarIcon className="h-6 w-6 mr-2"></CalendarIcon>
              {repoData.meta.created_at}
            </div>

            <div className="h-200 mt-5">
              {chartData.labels.length ? (
                <BarChart data={chartData} />
              ) : (
                "No languages detected"
              )}
            </div>
          </div>

          <div className="w-2/5 right-0 absolute">
            <div className="border fixed border-white p-3 mr-10 bg-black">
              Branches ({repoData.branches.length})
              <div className="max-h-20 overflow-y-auto">
                {repoData.branches.map((branch) => {
                  return (
                    <div className="inline-block bg-gray-800 text-white rounded-full px-3 py-1 mr-1 text-xs">
                      {branch.name}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-20 pt-20 mr-10">
              <div className="text-xl mb-3">
                Commit History of default branch
              </div>

              {repoData.commits.map((commit, index) => {
                return (
                  <div className="flex flex-col border border-white-2 p-3 mr-3 shadow-md shadow-gray-400 mb-5">
                    <div className="flex items-center">
                      <div className="border px-2 py-1 mr-3">#{index}</div>
                      <div className="flex">
                        <UserIcon className="h-6 w-6 mr-2"></UserIcon>
                        {commit.commit.author.name}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div>{commit.commit.message}</div>
                      <div>
                        {new Date(commit.commit.author.date).toDateString() +
                          ", " +
                          new Date(
                            commit.commit.author.date
                          ).toLocaleTimeString("en-US", {
                            timeZoneName: "short",
                          })}
                      </div>
                    </div>
                    <div></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoInfo;
