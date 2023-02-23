/* eslint-disable */

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL, CLIENT_URL } from "../constants";

interface App {
  id: number;
  name: string;
  file: string;
  userId: string;
}

function MyApps() {
  const { data, status } = useSession();
  const [apps, setApps] = useState<Array<App>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (data && data.user) {
      setLoading(true);
      fetch(`${API_URL}/apps/${data.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setApps(data);
          setLoading(false);
        });
    }
  }, [data]);

  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <div className="flex h-[80px] w-full items-center justify-end py-4 px-4">
        {status === "authenticated" ? (
          <Link href="/" className="underline">
            Home
          </Link>
        ) : (
          <button
            className="cursor-pointer rounded-md bg-black py-2 px-4 text-white"
            onClick={async () => {
              await signIn();
            }}
          >
            login
          </button>
        )}
      </div>
      <div className="flex w-full max-w-[1200px] flex-col items-start">
        <h1 className="mb-10 text-xl">My Apps</h1>

        <div className="flex w-full flex-wrap justify-center gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {apps.map((app, i) => (
                <div className="rounded-md border px-10 py-5" key={i}>
                  <p>{app.name}</p>
                  <p>
                    App:{" "}
                    <a href={`${CLIENT_URL}/app/${app.id}`}>
                      {`${CLIENT_URL}/app/${app.id}`}
                    </a>
                  </p>
                </div>
              ))}
              {apps.length === 0 && (
                <p className="text-gray-500">You have no apps yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApps;
