import "./Sidebar.css";
import logo from "./assets/last.jpg";
import { MyContext } from "./MyContext";
import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
      // console.log(filteredData);
      setAllThreads(filteredData);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getAllThreads();
  }, [currThreadId])

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  }

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
      const res = await response.json();
      // console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.log(error)
    }
  }

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
      const res = await response.json();

      //updated threads re-render
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

      if (threadId === currThreadId) {
        createNewChat();
      }
      console.log(res);
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div>
      <section className="sidebar">

        <button onClick={createNewChat}>
          <img src={logo} alt="gpt logo" className="logo" />
          <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>


        <ul className="history">
          {
            allThreads?.map((thread, idx) => {
              return <li key={idx}
                onClick={() => changeThread(thread.threadId)}
                className={thread.threadId === currThreadId ? "highlighted" : " "}
              >
                {thread.title}
                <i class="fa-solid fa-trash"
                  onClick={(e) => {
                    e.stopPropagation(); //stop even bubbling
                    deleteThread(thread.threadId);
                  }}
                ></i>
              </li>;
            })
          }

        </ul>


        <div className="sign">
          <p>By NeyooL &hearts;</p>
        </div>
      </section>
    </div>
  );
}
