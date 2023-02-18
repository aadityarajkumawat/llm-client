/* eslint-disable */

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface App {
  id: number;
  name: string;
  file: string;
  userId: string;
}

function MyApps() {
  const { data } = useSession();
  const [apps, setApps] = useState<Array<App>>([]);

  useEffect(() => {
    if (data && data.user) {
      fetch(
        `https://http-nodejs-production-0730.up.railway.app/apps/${data.user.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          setApps(data);
        });
    }
  }, [data]);

  return (
    <div className="w-full py-10 text-center">
      <h1 className="mb-10 text-xl">My Apps</h1>

      <div className="flex flex-col gap-4">
        {apps.map((app, i) => (
          <div
            className="m-auto max-w-[500px] rounded-md border px-10 py-5"
            key={i}
          >
            <p>{app.name}</p>
            <p>
              App:{" "}
              <a
                href={`https://http-nodejs-production-0730.up.railway.app/app/${app.id}`}
              >
                https://http-nodejs-production-0730.up.railway.app/app/{app.id}
              </a>
            </p>
          </div>
        ))}
        {apps.length === 0 && (
          <p className="text-gray-500">You have no apps yet.</p>
        )}
      </div>
    </div>
  );
}

export default MyApps;
