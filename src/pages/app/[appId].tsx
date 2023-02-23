/* eslint-disable */

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants";

interface App {
  id: number;
  name: string;
  file: string;
  userId: string;
}

interface Chat {
  prompt: string;
  completion: string;
}

function AppElm() {
  const router = useRouter();

  const { appId } = router.query;

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>("");
  const [app, setApp] = useState<App>({} as App);
  const [chats, setChats] = useState<Array<Chat>>([]);

  function sendChat() {
    setLoading(true);
    fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appId: appId,
        prompt,
      }),
    })
      .then((res) => res.json())
      .then(async () => {
        console.log("Sent!");
        setLoading(false);
        await fetchChats();
        setPrompt("");
      })
      .catch((e: any) => {
        console.log(e.message);
      });
  }

  async function fetchChats() {
    fetch(`${API_URL}/chats/${appId}`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
      });
  }

  useEffect(() => {
    if (!appId) return;
    setLoadingData(true);
    fetch(`${API_URL}/app/${appId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          router.push("/404");
          return;
        }
        setApp(data);
        setLoadingData(false);
      });

    fetchChats();
  }, [appId]);

  const getChats = () => {
    return !loading ? chats : [...chats, { prompt, completion: "Loading..." }];
  };

  return (
    <div className="h-full w-full px-10 py-5 text-center max-sm:px-5">
      {!loadingData ? (
        <>
          <h1 className="text-xl font-bold">{app.name}</h1>

          <div className="relative m-auto mt-10 h-[600px] w-full max-w-[900px] rounded-md border border-zinc-600">
            <div
              className="mb-10 overflow-y-scroll"
              style={{ height: "calc(100% - 40px)" }}
            >
              {getChats().map((chat, i) => (
                <div className="text-left" key={i}>
                  <p className="bg-zinc-700 px-3 py-2">{chat.prompt}</p>
                  {chat.completion === "Loading..." ? (
                    <div className="animate-pulse bg-zinc-300 px-3 py-3 dark:bg-zinc-600"></div>
                  ) : (
                    <p className="px-3 py-3">{chat.completion}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 flex w-full border-t border-zinc-600">
              <form
                className="flex w-full"
                onSubmit={async (e) => {
                  e.preventDefault();
                  sendChat();
                }}
              >
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  type="text"
                  className="w-full border-r border-zinc-600 bg-zinc-800 px-4 py-1"
                />
                <button
                  type="submit"
                  className="border-r border-black bg-zinc-800 px-2 text-white"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p>Loading your favourite AI application</p>
        </div>
      )}
    </div>
  );
}

export default AppElm;
