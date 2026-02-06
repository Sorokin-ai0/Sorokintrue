"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
  model?: string;
}

export default function ChatMessage({ role, content, imageUrl, model }: ChatMessageProps) {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(index);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  let codeBlockIndex = 0;

  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%]">
          {imageUrl && (
            <div className="mb-2 flex justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Uploaded"
                className="max-w-xs max-h-48 rounded-lg border border-gray-200 dark:border-slate-600"
              />
            </div>
          )}
          <div className="bg-brand-600 text-white px-4 py-3 rounded-2xl rounded-br-md">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          {model && (
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {model}
            </span>
          )}
        </div>
        <div className="bg-gray-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md">
          <div className="markdown-content text-gray-900 dark:text-gray-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeText = String(children).replace(/\n$/, "");
                  const isInline = !match && !codeText.includes("\n");

                  if (isInline) {
                    return (
                      <code
                        className="bg-gray-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  const currentIndex = codeBlockIndex++;
                  return (
                    <div className="relative group my-3">
                      <div className="flex items-center justify-between bg-gray-800 dark:bg-slate-900 px-4 py-2 rounded-t-lg">
                        <span className="text-xs text-gray-400">
                          {match ? match[1] : "code"}
                        </span>
                        <button
                          onClick={() => copyToClipboard(codeText, currentIndex)}
                          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedBlock === currentIndex ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match ? match[1] : "text"}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                        }}
                      >
                        {codeText}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
