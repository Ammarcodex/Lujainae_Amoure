"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "../site-config";

export default function WhatsAppButton() {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const label = open ? "Close WhatsApp chat" : "Open WhatsApp chat";

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="whatsapp-widget">
      {open ? (
        <section className="chat-panel" aria-label="WhatsApp chat">
          <div className="chat-panel-header">
            <span className="chat-avatar">LA</span>
            <div>
              <h2>Lujainae Amoure</h2>
              <p>We&apos;ll respond soon</p>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chat-panel-body">
            <p className="chat-time">TODAY</p>
            <div className="chat-message">
              Hello! Thanks for reaching out. Our WhatsApp line is being set
              up, but we&apos;ll be ready to chat soon.
              <span>Just now</span>
            </div>
            <p className="chat-coming-soon">WhatsApp chat will be available soon.</p>
          </div>
          <form
            className="chat-composer"
            onSubmit={(event) => {
              event.preventDefault();
              if (number && message.trim()) {
                window.open(
                  `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              } else {
                setMessage("");
              }
            }}
          >
            <label className="visually-hidden" htmlFor="whatsapp-message">
              Message
            </label>
            <input
              id="whatsapp-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={number ? "Write a message..." : "Chat will be available soon"}
              disabled={!number}
            />
            {number ? (
              <button type="submit" aria-label="Send message">
                ↗
              </button>
            ) : null}
          </form>
        </section>
      ) : null}
      <button
        className="whatsapp-button"
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <span className="chat-launcher-close" aria-hidden="true">×</span>
        ) : (
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 3.5a12.1 12.1 0 0 0-10.3 18.4L4 28l6.3-1.7A12.2 12.2 0 1 0 16 3.5Z" />
            <path d="M12 10.2c-.3-.7-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.4-1.5 1.5-1.5 3.6s1.6 4.1 1.8 4.4c.2.3 3 4.8 7.3 6.5 3.6 1.4 4.3 1.1 5.1 1 .8-.1 2.5-1 2.9-2.1.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.8-.6-.4-.2-2.5-1.2-2.9-1.4-.4-.1-.7-.2-1 .3s-1.1 1.4-1.4 1.7c-.3.3-.5.4-.9.1-.4-.2-1.8-.7-3.4-2.2-1.3-1.2-2.2-2.6-2.5-3-.3-.4 0-.6.2-.8.2-.2.4-.5.7-.8.2-.3.3-.4.4-.7.1-.3 0-.5 0-.7L12 10.2Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
