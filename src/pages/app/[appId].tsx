/* eslint-disable */

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [prompt, setPrompt] = useState<string>("");
  const [app, setApp] = useState<App>({} as App);
  const [chats, setChats] = useState<Array<Chat>>([]);

  function sendChat() {
    setLoading(true);
    fetch(`http://localhost:4001/chat`, {
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
    fetch(`http://localhost:4001/chats/${appId}`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
      });
  }

  useEffect(() => {
    if (!appId) return;
    fetch(`http://localhost:4001/app/${appId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (!data) {
          router.push("/404");
          return;
        }

        setApp(data);
      });

    fetchChats();
  }, [appId]);

  const getChats = () => {
    return !loading ? chats : [...chats, { prompt, completion: "Loading..." }];
  };

  return (
    <div className="w-full px-10 py-5 text-center">
      <h1 className="text-xl font-bold">{app.name}</h1>

      <div className="relative m-auto mt-10 h-[400px] w-[600px] rounded-md border border-zinc-600">
        <div
          className="mb-10 overflow-y-scroll"
          style={{ height: "calc(100% - 40px)" }}
        >
          {getChats().map((chat, i) => (
            <div className="text-left">
              <p className="bg-zinc-200 px-3">{chat.prompt}</p>
              <p className="px-3">{chat.completion}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 flex w-[600px] border-t border-zinc-600">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            className="w-full border-r border-zinc-600 px-4 py-1"
          />
          <button onClick={sendChat} className="bg-white px-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppElm;
