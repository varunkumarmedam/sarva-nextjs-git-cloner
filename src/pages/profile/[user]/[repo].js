import BarChart from "@/components/BarChart";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { UserIcon } from "@heroicons/react/24/outline";

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
    const totalBytes = langBytes.reduce((prev, curr) => prev + curr);
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
        <div className=" p-14">
          <div className="border fixed left-0 border-white-200 p-10 m-5 w-1/2">
            <div className="">{repo}</div>
            <div className="">{repoData.meta.description}</div>
            <div className="flex">
              <div>Stars : {repoData.meta.stargazers_count}</div>
              <div>Watching : {repoData.meta.watchers_count}</div>
              <div>Issues: {repoData.meta.open_issues_count}</div>
            </div>
            <div className="flex">
              <UserIcon className="h-6 w-6"></UserIcon>
              {repoData.meta.owner?.login}
            </div>
            <div className="max-h-20 overflow-y-auto">
              {repoData.branches.map((branch) => {
                return (
                  <div className="inline-block bg-red-300 text-white rounded-full px-2 py-1 text-xs">
                    {branch.name}
                  </div>
                );
              })}
            </div>
            <div>{repoData.meta.created_at}</div>
            {<BarChart data={chartData} />}
          </div>

          <div className="w-1/2 right-0 absolute p-20">
            commits history
            {repoData.commits.map((commit, index) => {
              return (
                <div className="flex">
                  <div>#{index}</div>
                  <div>
                    {commit.commit.author.name}
                    <div>{commit.commit.message}</div>
                    <div>{commit.commit.author.date}</div>
                  </div>
                  <div></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoInfo;
