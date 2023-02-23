/* eslint-disable */

import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../constants";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { data, status } = useSession();
  const [app, setApp] = useState<any>({ name: "", file: null });

  return (
    <>
      <Head>
        <title>Build Chat Apps</title>
      </Head>
      <div className="flex h-[80px] items-center justify-end py-4 px-4">
        {status === "authenticated" ? (
          <Link href="/my-apps" className="underline">
            My Apps
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
      <div
        className="relative flex w-full flex-col items-center justify-center text-center"
        style={{ height: "calc(100% - 150px)" }}
      >
        <h1 className="text-2xl font-medium">
          🪄 Build World's best AI applications
        </h1>
        <p className="mb-4 text-zinc-300">
          We help you simplify your task by building you a<br />
          personalized AI based application
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (status === "unauthenticated") {
              await signIn();
            }
            if (!data || !data.user) {
              return;
            }
            setLoading(true);
            const user = data.user;
            const id = user.id;

            const form = new FormData();
            form.append("name", app.name);
            form.append("file", app.file);
            form.append("userId", id);

            const res = await fetch(`${API_URL}/create-app`, {
              method: "POST",
              body: form,
            });

            const body = await res.json();

            setLoading(false);

            if (body.error) {
              toast(body.error, {
                hideProgressBar: true,
                position: "top-center",
              });
              return;
            }

            if (res.ok) {
              router.push("/my-apps");
            }
          }}
        >
          <div className="flex flex-col items-start justify-center gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="name" className="text-zinc-500">
                Name
              </label>
              <input
                onChange={(e) =>
                  setApp((a: any) => ({ ...a, name: e.target.value }))
                }
                type="text"
                name="name"
                id="name"
                className="w-[400px] rounded-md border border-zinc-400 bg-[#141414] px-2 py-1 outline-zinc-500 focus:outline-dashed"
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="name" className="text-zinc-300">
                Upload a file (only .txt allowed, more extensions coming soon)
              </label>
              <input
                onChange={(e) => {
                  if (e.target.files) {
                    const [file] = e.target.files;
                    if (file) {
                      setApp((a: any) => ({ ...a, file }));
                    }
                  }
                }}
                type="file"
                name="name"
                id="name"
                className="w-[400px] rounded-md border border-zinc-400 px-2 py-1 outline-zinc-500 focus:outline-dashed"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-[400px] rounded-md bg-zinc-50 py-2 text-black"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? "..." : "Build App"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
