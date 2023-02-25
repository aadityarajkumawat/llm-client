/* eslint-disable */

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL, CLIENT_URL } from "../constants";
import { GiTrashCan } from "react-icons/gi";

function Spinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="mr-2 h-8 w-8 animate-spin fill-zinc-300 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

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
  }, [data?.user.id]);

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
      <div className="flex w-full max-w-[1200px] flex-col items-start px-10 pb-16 max-sm:px-5">
        <h1 className="mb-10 text-xl">My Apps</h1>

        <div className="flex w-full flex-wrap justify-center gap-4">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {apps.map((app, i) => (
                <div className="rounded-md border px-5 pb-5" key={i}>
                  <div className="my-2 flex justify-end">
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`${API_URL}/app/${app.id}`, {
                            method: "DELETE",
                          });
                          setApps(apps.filter((a) => a.id !== app.id));
                        } catch (error: any) {
                          console.log(error.messgae);
                        }
                      }}
                    >
                      <GiTrashCan />
                    </button>
                  </div>
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
