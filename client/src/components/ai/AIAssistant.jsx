import { useEffect, useRef, useState } from "react"
import api from "../../services/api"
import ReactMarkdown from "react-markdown"

import {
  FiSend,
  FiUpload,
  FiMic,
  FiPlus,
  FiCopy,
  FiVolume2,
  FiRefreshCw,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi"

function AIAssistantV3() {

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const [mode, setMode] =
    useState("General AI")

  const [uploadedFile, setUploadedFile] =
    useState(null)

  const [messages, setMessages] =
    useState([])

  const [chatHistory, setChatHistory] =
    useState([])
  const [editingChatId,setEditingChatId] =
    useState(null)
  const [feedback,setFeedback] =
    useState({})
  const [isSpeaking,
setIsSpeaking] =
  useState(false)

  const messagesEndRef =
    useRef(null)

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "careerforge_ai"
      )

    if (saved) {

      const parsed =
        JSON.parse(saved)

      setMessages(
        parsed.messages || []
      )

      setChatHistory(
        parsed.chatHistory || []
      )

    }

  }, [])

  useEffect(() => {

    localStorage.setItem(
      "careerforge_ai",

      JSON.stringify({
        messages,
        chatHistory,
      })
    )

  }, [messages, chatHistory])

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })

  }, [messages])

  const promptCards = [

    {
      icon: "💻",
      title: "Coding Assistant",
      prompt:
        "Help me solve coding problems and debug code.",
    },

    {
      icon: "🎯",
      title: "Career Coach",
      prompt:
        "Guide me in my career growth.",
    },

    {
      icon: "📄",
      title: "Resume Expert",
      prompt:
        "Review and improve my resume.",
    },

    {
      icon: "🎤",
      title: "Interview Coach",
      prompt:
        "Help me prepare for interviews.",
    },

    {
      icon: "🔍",
      title: "Research Assistant",
      prompt:
        "Explain a topic in detail.",
    },

    {
      icon: "✍️",
      title: "Content Writer",
      prompt:
        "Help me write professional content.",
    },

  ]

  const createNewChat = () => {

  if (messages.length > 1) {

    const firstUserMessage =
      messages.find(
        (m) =>
          m.role === "user"
      )

    const newChat = {

      id: Date.now(),

      title:
        firstUserMessage?.content?.slice(
          0,
          40
        ) || "New Chat",

      messages: [...messages],

    }

    setChatHistory(
      (prev) => [
        newChat,
        ...prev,
      ]
    )

  }

  setMessages([])

  setUploadedFile(null)

}

 const copyMessage =
(text) => {

  navigator.clipboard.writeText(
    text
  )

  console.log("Copied!")

}
  const regenerateResponse = async () => {

  const lastUserMessage =
    [...messages]
      .reverse()
      .find(
        (m) =>
          m.role === "user"
      )

  if (!lastUserMessage)
    return

  setLoading(true)

  try {

    const token =
      localStorage.getItem(
        "careerforge_token"
      )

    const formData =
  new FormData()

formData.append(
  "prompt",
  lastUserMessage.content
)

if (uploadedFile) {

  formData.append(
    "file",
    uploadedFile
  )

}

const response =
  await api.post(
    "/ai/ask",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  )

    setMessages(
      (prev) => [

        ...prev.filter(
          (
            m,
            index
          ) =>
            index !==
            prev.length - 1
        ),

        {
          role:
            "assistant",

          content:
            response.data.reply,

          timestamp:
            new Date().toLocaleTimeString(),
        },

      ]
    )

  } finally {

    setLoading(false)

  }

}

  const handleFileUpload = (
    event
  ) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    setUploadedFile(file)

  }

  const speakMessage = (
  text
) => {

  window.speechSynthesis.cancel()

  const speech =
    new SpeechSynthesisUtterance(
      text
    )

  speech.lang = "en-US"

  speech.onstart = () => {

    setIsSpeaking(true)

  }

  speech.onend = () => {

    setIsSpeaking(false)

  }

  speech.onerror = () => {

    setIsSpeaking(false)

  }

  window.speechSynthesis.speak(
    speech
  )

}
const stopSpeaking = () => {

  window.speechSynthesis.cancel()

  setIsSpeaking(false)

}

  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {

      alert(
        "Voice input not supported"
      )

      return

    }

    const recognition =
      new SpeechRecognition()

    recognition.lang = "en-US"

    recognition.start()

    recognition.onresult =
      (event) => {

        setInput(
          event.results[0][0]
            .transcript
        )

      }

  }
const sendMessage = async (
  customPrompt = null
) => {

  const messageText =
    customPrompt || input

  const finalPrompt =
    messageText.trim() ||
    (uploadedFile
      ? "Analyze this uploaded file"
      : "")

  if (!finalPrompt)
    return

  const userMessage = {

    role: "user",

    content: finalPrompt,

    fileName:
      uploadedFile?.name,

    timestamp:
      new Date().toLocaleTimeString(),
  }

  setMessages(
    (prev) => [
      ...prev,
      userMessage,
    ]
  )

  setInput("")

  setLoading(true)

  try {

   

    const formData =
      new FormData()

    formData.append(
      "prompt",
      finalPrompt
    )

    if (uploadedFile) {

      formData.append(
        "file",
        uploadedFile
      )

    }
const response =
  await api.post(
    "/ai/ask",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  )
    const aiMessage = {

      role: "assistant",

      content:
        response.data.reply,

      timestamp:
        new Date().toLocaleTimeString(),
    }

    setMessages(
      (prev) => [
        ...prev,
        aiMessage,
      ]
    )

    setUploadedFile(null)

  } catch (error) {

    console.error(error)

    alert(
      "AI request failed"
    )

  } finally {

    setLoading(false)

  }

}
  
  return (

    <div className="flex h-[88vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* LEFT SIDEBAR */}

      <div className="w-72 border-r border-slate-200 bg-slate-50">
                <div className="p-4">

          <button
            onClick={createNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-white hover:bg-slate-800"
          >

            <FiPlus />

            New Chat

          </button>

        </div>

        <div className="h-[calc(100%-80px)] overflow-y-auto px-3 pb-4">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">

            Recent Chats

          </p>

          <div className="space-y-2">

           {chatHistory.map((chat) => (

  <div
    key={chat.id}
    className="group relative"
  >

    <button
      onClick={() =>
        setMessages(
          chat.messages
        )
      }
      className="w-full rounded-xl bg-white px-3 py-3 pr-10 text-left text-sm transition hover:shadow-sm"
    >

      {editingChatId ===
chat.id ? (

  <input
    autoFocus
    defaultValue={
      chat.title
    }
    onBlur={(e) => {

      setChatHistory(
        (prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  title:
                    e.target.value,
                }
              : c
          )
      )

      setEditingChatId(
        null
      )

    }}
    className="w-full rounded border px-2 py-1 text-sm"
  />

) : (

  <p className="truncate font-medium text-slate-800">

    {chat.title}

  </p>

)}

    </button>

    <button
      onClick={(e) => {

        e.stopPropagation()

        setChatHistory(
          (prev) =>
            prev.filter(
              (c) =>
                c.id !== chat.id
            )
        )

      }}
      className="absolute right-2 top-3 hidden text-red-500 group-hover:block"
    >

      🗑

    </button>
    <button
  onClick={(e) => {

    e.stopPropagation()

    setEditingChatId(
      chat.id
    )

  }}
  className="absolute right-8 top-3 hidden text-blue-500 group-hover:block"
>

  ✏️

</button>
  </div>

))}

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex flex-1 flex-col">

        {/* HEADER */}

        <div className="border-b border-slate-200 px-8 py-5">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-2xl font-bold text-slate-900">

                AI Assistant

              </h1>

              <p className="text-sm text-slate-500">

                Your intelligent AI workspace

              </p>

            </div>

            <select
              value={mode}
              onChange={(e) =>
                setMode(
                  e.target.value
                )
              }
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >

              <option>
                General AI
              </option>

              <option>
                Career Coach
              </option>

              <option>
                Coding Assistant
              </option>

              <option>
                Research Assistant
              </option>

              <option>
                Resume Expert
              </option>

              <option>
                Interview Coach
              </option>

              <option>
                Content Writer
              </option>

            </select>

          </div>

        </div>

        {/* MAIN CONTENT */}

        <div className="flex-1 overflow-y-auto px-8 py-8">

          {messages.length === 0 && (

            <div className="mx-auto max-w-5xl">

              <div className="mb-12 text-center">

                <h2 className="text-4xl font-bold text-slate-900">

                  🚀 Welcome to CareerForge AI

                </h2>

                <p className="mt-4 text-lg text-slate-500">

                  Your intelligent AI assistant for coding,
                  learning, careers, writing and research.

                </p>

              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {promptCards.map((card) => (

                  <button
                    key={card.title}
                    onClick={() =>
                      sendMessage(
                        card.prompt
                      )
                    }
                    className="rounded-3xl border border-slate-200 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-sky-400 hover:shadow-xl"
                  >

                    <div className="mb-4 text-4xl">

                      {card.icon}

                    </div>

                    <h3 className="text-lg font-bold text-slate-900">

                      {card.title}

                    </h3>

                  </button>

                ))}

              </div>

            </div>

          )}

          {messages.length > 0 && (

            <div className="mx-auto max-w-4xl space-y-6">

                          {messages.map(
                (
                  message,
                  index
                ) => (

                  <div
                    key={index}
                    className={`flex ${
                      message.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`group max-w-[75%] rounded-3xl px-5 py-4 shadow-sm ${
                        message.role ===
                        "user"
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >

                      <div className="prose prose-sm max-w-none">

  {message.fileName && (

    <div className="mb-2 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-700">

      <FiUpload />

      {message.fileName}

    </div>

  )}

  <ReactMarkdown>
    {message.content}
  </ReactMarkdown>

</div>

                      <div className="mt-4 flex items-center justify-between">

                        <span
                          className={`text-xs ${
                            message.role ===
                            "user"
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >

                          {message.timestamp}

                        </span>

                        {message.role ===
  "assistant" && (

  <div className="mt-2 flex items-center gap-2 border-t pt-2">

    {/* LIKE */}

   <button
  onClick={() =>
    setFeedback((prev) => ({
      ...prev,
      [index]: "like",
    }))
  }
  className={`rounded-lg p-2 transition hover:bg-slate-100 ${
    feedback[index] === "like"
      ? "bg-green-100 text-green-600"
      : "opacity-70 hover:opacity-100"
  }`}
>
  <FiThumbsUp className="h-4 w-4" />
</button>
    {/* DISLIKE */}

    <button
  onClick={() =>
    setFeedback((prev) => ({
      ...prev,
      [index]: "dislike",
    }))
  }
  className={`rounded-lg p-2 transition hover:bg-slate-100 ${
    feedback[index] === "dislike"
      ? "bg-red-100 text-red-600"
      : "opacity-70 hover:opacity-100"
  }`}
>
  <FiThumbsDown className="h-4 w-4" />
</button>

    {/* COPY */}

    <button
      onClick={() =>
        copyMessage(
          message.content
        )
      }
      className="rounded-lg p-2 opacity-70 transition hover:bg-slate-100 hover:opacity-100"
    >
      <FiCopy className="h-4 w-4" />
    </button>

    {/* SPEAK */}

   <button
  onClick={() => {

    if (isSpeaking) {

      stopSpeaking()

    } else {

      speakMessage(
        message.content
      )

    }

  }}
  className="rounded-lg p-2 hover:bg-slate-100"
>
  {isSpeaking
    ? "⏹️"
    : <FiVolume2 className="h-4 w-4" />
  }
</button>

    {/* TRY AGAIN */}

    <button
  onClick={
    regenerateResponse
  }
  className="flex items-center gap-2 rounded-lg px-3 py-2 opacity-70 hover:bg-slate-100 hover:opacity-100"
>
  <FiRefreshCw className="h-4 w-4" />

  <span className="text-xs">
    Try Again
  </span>

</button>

  </div>

)}
                      </div>

                    </div>

                  </div>

                )
              )}

              {loading && (

                <div className="flex justify-start">

                  <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />

                      <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />

                      <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />

                      <span className="text-sm text-slate-500">

                        CareerForge AI is generating...

                      </span>

                    </div>

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>

          )}

        </div>

        {/* INPUT AREA */}

        <div className="border-t border-slate-200 bg-white px-8 py-5">

          <div className="mx-auto max-w-4xl">

            {uploadedFile && (

              <div className="mb-3 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-700">

                <FiUpload />

                {uploadedFile.name}

              </div>

            )}
            

            <div className="flex items-center gap-3 rounded-[28px] border border-slate-300 bg-white p-3 shadow-sm">

              {/* FILE */}

              <label className="cursor-pointer rounded-xl p-3 hover:bg-slate-100">

                <FiUpload className="h-5 w-5" />

                <input
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*"
                  onChange={
                    handleFileUpload
                  }
                />

              </label>

              {/* VOICE */}

              <button
                onClick={
                  startVoiceInput
                }
                className="rounded-xl p-3 hover:bg-slate-100"
              >

                <FiMic className="h-5 w-5" />

              </button>

              {/* INPUT */}

              <textarea
                rows={1}
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={(
                  e
                ) => {

                  if (
                    e.key ===
                      "Enter" &&
                    !e.shiftKey
                  ) {

                    e.preventDefault()

                    sendMessage()

                  }

                }}
                placeholder={`Message CareerForge AI (${mode})...`}
                className="max-h-40 flex-1 resize-none border-none bg-transparent px-3 py-2 outline-none"
              />

              {/* SEND */}
              
              <button
                disabled={
                  loading
                }
                onClick={() =>
                  sendMessage()
                }
                className="rounded-2xl bg-slate-950 p-4 text-white hover:bg-slate-800 disabled:opacity-50"
              >

                <FiSend className="h-5 w-5" />

              </button>

            </div>

            <p className="mt-3 text-center text-xs text-slate-500">

              CareerForge AI can make mistakes. Verify important information.

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default AIAssistantV3
