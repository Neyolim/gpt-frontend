import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { CircleLoader } from "react-spinners";

export default function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats, setNewChat } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return; // prevent empty messages
    setNewChat(false);
    setLoading(true);

    console.log("message", prompt, "threadId", currThreadId);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, threadId: currThreadId })
      });

      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Append new Chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prevChats => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
      ]);
      setPrompt(""); // clear input after sending
    }
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="chatWindow">
      {/* Navbar */}
      <div className="navbar">
        <span>
          SigmaGPT &nbsp; <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {
        isOpen &&
        <div className="dropDown">
          <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
          <div className="dropDownItem"><i class="fa-solid fa-arrow-up-right-from-square"></i>Upgrade Plan</div>
          <div className="dropDownItem"><i class="fa-solid fa-right-from-bracket"></i>Logout</div>
        </div>
      }

      {/* Chat body */}
      <Chat />

      {/* Spinner */}
      {loading && <CircleLoader color="#fff" />}

      {/* Input area */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? getReply() : null}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
