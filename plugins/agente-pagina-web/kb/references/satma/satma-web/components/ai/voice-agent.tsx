"use client";

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import {
  Mic,
  MicOff,
  X,
  Send,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

type ChatMessage = {
  id: number;
  role: "user" | "agent";
  text: string;
};

/**
 * SATMA — ElevenLabs Conversational AI floating chat.
 *
 * Hybrid widget: visitors can TYPE or TALK with the agent. One session
 * carries both modalities — the user can mute the mic and type, then
 * un-mute later. The agent always responds with both audio (when mic
 * input is active) and a text transcript that appears in the chat log.
 *
 * Flow
 * ────
 * 1. User clicks the floating bubble → panel opens with welcome state
 *    (no session yet, no permissions asked).
 * 2. User either:
 *    a) types a message → session starts MUTED, message sent as text
 *    b) clicks the mic   → mic permission requested, session starts UN-MUTED
 * 3. Once active, transcript fills with `user_transcript` and
 *    `agent_response` events from the SDK.
 * 4. Closing the panel ends the session. Re-opening starts fresh.
 *
 * SSR-safe: returns `null` if the agent-id env var is missing (with a
 * dev-only console warning) so a misconfigured deploy doesn't crash.
 */
export function VoiceAgent() {
  // Dev-only one-shot warning — fires from an effect so it complies with
  // React's "render must be pure" rule.
  useEffect(() => {
    if (!AGENT_ID) {
      console.warn(
        "[VoiceAgent] NEXT_PUBLIC_ELEVENLABS_AGENT_ID is not set. " +
          "The voice/chat widget will not render.",
      );
    }
  }, []);

  if (!AGENT_ID) return null;

  return (
    <ConversationProvider>
      <ChatPanel />
    </ConversationProvider>
  );
}

const SUGGESTED_PROMPTS = [
  "¿Qué hace SATMA?",
  "Quiero ver casos de éxito",
  "Necesito un proyecto nuevo",
];

/**
 * Nudge messages shown in the bubble that floats above the trigger button
 * to invite engagement. One is picked at random per session — they all
 * sit in the SATMA tone (warm, direct, mexicano natural).
 */
const NUDGE_MESSAGES = [
  "¿Te ayudo a encontrar algo? 👋",
  "¿Tienes una pregunta? Escribime.",
  "¿Querés conocer lo que hacemos?",
  "Hablá con nuestro asistente — es gratis.",
  "¿Buscás algo específico? Te guío.",
];

// Storage key used to remember that the visitor dismissed the nudge in
// this session — keeps the bubble from feeling pushy on subsequent
// page navigations within the same visit.
const NUDGE_DISMISSED_KEY = "satma:chat-nudge-dismissed";

function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Nudge bubble — shown 5s after first paint, hidden after 15s if untouched,
  // permanently dismissed via the X button (sessionStorage). The message is
  // picked once with a lazy `useState` initializer so the visitor sees the
  // same line across short re-renders within the same mount.
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [nudgeMessage] = useState(
    () => NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)],
  );
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Buffer outgoing user messages until the session is connected. The SDK
  // can't send before `status === "connected"` so anything typed during
  // the connect handshake gets queued here.
  const pendingTextRef = useRef<string[]>([]);

  const addMessage = useCallback((role: "user" | "agent", text: string) => {
    setMessages((prev) => {
      // Dedup adjacent identical messages from the same role (the SDK
      // occasionally re-emits the same event during corrections).
      const last = prev[prev.length - 1];
      if (last && last.role === role && last.text === text) return prev;
      return [
        ...prev,
        { id: Date.now() + Math.random(), role, text },
      ];
    });
  }, []);

  const conversation = useConversation({
    onMessage: (event: unknown) => {
      // Type-narrow the event union from the SDK without a hard dep.
      const e = event as {
        type?: string;
        user_transcription_event?: { user_transcript?: string };
        agent_response_event?: { agent_response?: string };
        agent_response_correction_event?: { corrected_agent_response?: string };
      };
      if (!e?.type) return;
      if (e.type === "user_transcript") {
        const t = e.user_transcription_event?.user_transcript;
        if (t) addMessage("user", t);
      } else if (e.type === "agent_response") {
        const t = e.agent_response_event?.agent_response;
        if (t) addMessage("agent", t);
      } else if (e.type === "agent_response_correction") {
        const t = e.agent_response_correction_event?.corrected_agent_response;
        if (t) {
          // Replace the most recent agent message with the corrected version.
          setMessages((prev) => {
            for (let i = prev.length - 1; i >= 0; i--) {
              if (prev[i].role === "agent") {
                const next = [...prev];
                next[i] = { ...next[i], text: t };
                return next;
              }
            }
            return [...prev, { id: Date.now() + Math.random(), role: "agent", text: t }];
          });
        }
      }
    },
    onError: (err: unknown) => {
      console.error("[VoiceAgent]", err);
      setError(typeof err === "string" ? err : "Algo falló. Intentá de nuevo.");
    },
    onConnect: () => {
      setError(null);
      // Flush queued text now that the socket is open.
      const queued = pendingTextRef.current;
      pendingTextRef.current = [];
      queued.forEach((t) => conversation.sendUserMessage(t));
    },
  });

  const { status, isMuted, setMuted, isSpeaking, sendUserMessage } = conversation;
  const isActive = status === "connected";
  const isConnecting = status === "connecting";

  // Auto-scroll the transcript on each new message / state change.
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, isSpeaking, isConnecting]);

  // Focus the input when the panel opens — keyboard-first UX.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  // End any active session if the component unmounts.
  useEffect(() => {
    return () => {
      if (status === "connected" || status === "connecting") {
        conversation.endSession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Nudge bubble lifecycle ───────────────────────────────────────────
  // First show: 5s after mount, only if the visitor hasn't dismissed it
  // earlier in the session and the chat panel isn't already open.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (open) return;
    if (sessionStorage.getItem(NUDGE_DISMISSED_KEY)) return;
    const showTimer = window.setTimeout(() => setNudgeVisible(true), 5000);
    return () => window.clearTimeout(showTimer);
  }, [open]);

  // Auto-hide after 15s without interaction. The bubble becomes invisible
  // but is NOT marked as dismissed — it'll just sit out the rest of the
  // visit unless the visitor actively engages.
  useEffect(() => {
    if (!nudgeVisible) return;
    const hideTimer = window.setTimeout(() => setNudgeVisible(false), 15000);
    return () => window.clearTimeout(hideTimer);
  }, [nudgeVisible]);

  const dismissNudge = () => {
    setNudgeVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(NUDGE_DISMISSED_KEY, "1");
    }
  };

  // Single entry point for opening the chat — also kills the nudge
  // permanently for the session so it doesn't pop back if the visitor
  // closes the chat and stays on the site.
  const openChat = () => {
    setOpen(true);
    dismissNudge();
  };

  const ensureSession = async (startMuted: boolean): Promise<boolean> => {
    if (isActive) {
      if (!startMuted && isMuted) setMuted(false);
      return true;
    }
    if (isConnecting) return true;

    try {
      // Mic permission must be requested in response to the user gesture
      // that called us. We always ask — the SDK uses the stream even in
      // text-only flows (and the user can mute right away).
      await navigator.mediaDevices.getUserMedia({ audio: true });
      conversation.startSession({ agentId: AGENT_ID! });
      // Apply intent immediately; the SDK respects mute state across
      // connect handshakes.
      if (startMuted) setMuted(true);
      return true;
    } catch (err) {
      const msg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Sin permiso de mic. Podés seguir por chat de texto — escribime abajo."
          : "No pudimos abrir el micrófono. Intentá de nuevo o usá el chat.";
      setError(msg);
      return false;
    }
  };

  const handleSend = async (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text) return;
    setInput("");
    // Optimistically show the user's text in the transcript regardless
    // of whether the SDK confirms the message back to us.
    addMessage("user", text);

    if (!isActive) {
      // First send → start session muted (text-only flow).
      pendingTextRef.current.push(text);
      const ok = await ensureSession(true);
      if (!ok) {
        addMessage(
          "agent",
          "No pude conectarme. Escribinos a santiago@satma.mx y respondemos directo.",
        );
        pendingTextRef.current = [];
      }
    } else {
      sendUserMessage(text);
    }
  };

  const handleMicToggle = async () => {
    if (!isActive && !isConnecting) {
      await ensureSession(false);
    } else {
      setMuted(!isMuted);
    }
  };

  const handleClose = () => {
    if (isActive || isConnecting) conversation.endSession();
    setOpen(false);
  };

  const showWelcome = messages.length === 0 && !isConnecting;

  return (
    <>
      {/* ── Nudge bubble — invitation that floats above the trigger.
            Click anywhere on the bubble opens the chat. The X button
            dismisses it permanently for this visit (sessionStorage). ── */}
      {nudgeVisible && !open && (
        <div
          className="fixed right-[max(1.5rem,env(safe-area-inset-right))] bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[54] flex max-w-[260px] items-start gap-2 rounded-2xl rounded-br-md border border-line bg-ink-soft px-3.5 py-2.5 shadow-xl shadow-ink/30 backdrop-blur-md"
          style={{
            animation:
              "satma-chat-nudge-in 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Tail/pointer aiming at the trigger button below */}
          <span
            aria-hidden
            className="absolute -bottom-[6px] right-5 h-3 w-3 rotate-45 border-b border-r border-line bg-ink-soft"
          />
          <button
            onClick={openChat}
            className="flex-1 cursor-pointer text-left text-sm leading-snug text-off"
          >
            {nudgeMessage}
          </button>
          <button
            onClick={dismissNudge}
            className="-mr-1 -mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink hover:text-off"
            aria-label="Cerrar invitación"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Floating trigger ─────────────────────────────────────────── */}
      <button
        onClick={openChat}
        className={cn(
          // bottom/right use max(...) with env(safe-area-inset-*) so the
          // button stays clear of the iPhone home indicator and any side
          // notches on landscape — falls back to 1.5rem on devices with
          // no inset.
          "fixed right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[55] flex h-14 w-14 items-center justify-center rounded-full",
          "bg-periwinkle text-navy shadow-xl shadow-periwinkle/30",
          "transition-all hover:scale-105 hover:shadow-periwinkle/50 active:scale-95",
          // Class drives the periodic bounce — defined globally so we can
          // gate it behind `prefers-reduced-motion: no-preference`.
          !open && "satma-chat-bounce",
          open && "pointer-events-none scale-90 opacity-0",
        )}
        aria-label="Abrir chat con SATMA AI"
        title="Hablá con SATMA AI"
      >
        <MessageSquare size={22} />
        {/* Subtle ping when idle to draw the eye on first paint */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-periwinkle"
          style={{
            animation: "satma-chat-ping 3.2s ease-out infinite",
            opacity: 0.35,
          }}
        />
      </button>

      {/* ── Chat panel ───────────────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat con SATMA AI"
          className={cn(
            "fixed right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[60] flex flex-col overflow-hidden",
            "w-[min(380px,calc(100vw-2rem))] h-[min(580px,calc(100vh-3rem))]",
            "rounded-2xl border border-line bg-ink-soft shadow-2xl shadow-ink/40",
          )}
          style={{
            animation: "satma-chat-in 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Header status={status} onClose={handleClose} />

          {/* Transcript area */}
          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto p-4 [scrollbar-width:thin]"
          >
            {showWelcome ? (
              <Welcome onPick={(t) => handleSend(t)} />
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <Bubble key={m.id} role={m.role} text={m.text} />
                ))}
                {(isConnecting ||
                  (isActive &&
                    messages[messages.length - 1]?.role === "user" &&
                    !isSpeaking)) && <TypingIndicator />}
                {isActive && isSpeaking && <SpeakingIndicator />}
              </div>
            )}
          </div>

          {error && (
            <ErrorBar message={error} onDismiss={() => setError(null)} />
          )}

          {/* Input bar */}
          <div className="flex shrink-0 items-end gap-2 border-t border-line bg-ink-soft p-3">
            <button
              onClick={handleMicToggle}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
                "border border-line",
                isActive && !isMuted
                  ? "bg-periwinkle text-navy shadow-lg shadow-periwinkle/30"
                  : "bg-ink text-off hover:bg-ink/80",
                isConnecting && "animate-pulse",
              )}
              aria-label={
                isActive
                  ? isMuted
                    ? "Activar micrófono"
                    : "Silenciar micrófono"
                  : "Empezar a hablar"
              }
              title={
                isActive
                  ? isMuted
                    ? "Activar mic"
                    : "Silenciar mic"
                  : "Hablar con voz"
              }
            >
              {isActive && !isMuted ? <Mic size={16} /> : <MicOff size={16} />}
            </button>

            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escribí tu mensaje…"
                className="w-full rounded-full border border-line bg-ink px-4 py-2.5 text-sm text-off placeholder:text-muted/70 focus:border-periwinkle focus:outline-none focus:ring-2 focus:ring-periwinkle/20"
                disabled={isConnecting}
              />
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isConnecting}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
                input.trim()
                  ? "bg-periwinkle text-navy shadow-lg shadow-periwinkle/30 hover:scale-105"
                  : "bg-ink text-muted",
                "disabled:opacity-50",
              )}
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Inline keyframes — global so they apply to the portal-like fixed
          elements above. Scoped names avoid collisions with site CSS. */}
      <style jsx global>{`
        @keyframes satma-chat-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes satma-chat-ping {
          0% {
            transform: scale(1);
            opacity: 0.35;
          }
          70%,
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes satma-chat-typing {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes satma-chat-nudge-in {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        /* Periodic attention bounce on the floating trigger.
           ~6.5s cycle: idle ~5s, then a quick double-rebound (~1.3s),
           rolling back to idle. Uses the modern 'translate' property so
           it composes cleanly with Tailwind's transform-based hover
           scale (transform and translate are independent in CSS). */
        @keyframes satma-chat-bounce-kf {
          0%, 75%, 100% {
            translate: 0 0;
          }
          80% {
            translate: 0 -12px;
          }
          85% {
            translate: 0 0;
          }
          90% {
            translate: 0 -6px;
          }
          95% {
            translate: 0 0;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .satma-chat-bounce {
            animation: satma-chat-bounce-kf 6.5s ease-out infinite;
          }
        }
      `}</style>
    </>
  );
}

function Header({
  status,
  onClose,
}: {
  status: string;
  onClose: () => void;
}) {
  const dot =
    status === "connected"
      ? "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/70"
      : status === "connecting"
        ? "bg-amber-400 animate-pulse"
        : "bg-muted";
  const label =
    status === "connected"
      ? "En línea"
      : status === "connecting"
        ? "Conectando…"
        : "Listo para charlar";

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-line p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-periwinkle to-lilac text-navy">
          <Sparkles size={16} />
        </div>
        <div>
          <div className="font-display text-sm font-medium text-off">
            SATMA AI
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
            {label}
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink hover:text-off"
        aria-label="Cerrar"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function Welcome({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-2 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-periwinkle to-lilac text-navy shadow-lg shadow-periwinkle/30">
        <Sparkles size={22} />
      </div>
      <div>
        <div className="font-display text-base font-medium text-off">
          Hola 👋 Soy el asistente de SATMA.
        </div>
        <div className="mt-1.5 text-sm text-muted">
          Podés escribirme o hablarme. ¿Qué te interesa?
        </div>
      </div>
      <div className="flex flex-col gap-2 self-stretch">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-full border border-line bg-ink px-4 py-2 text-left text-sm text-off transition-all hover:border-periwinkle/50 hover:bg-periwinkle/10"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "agent"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-snug",
          isUser
            ? "rounded-br-md bg-periwinkle text-navy"
            : "rounded-bl-md border border-line bg-ink text-off",
        )}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-ink px-3.5 py-3">
        {[0, 0.15, 0.3].map((delay) => (
          <span
            key={delay}
            className="block h-1.5 w-1.5 rounded-full bg-muted"
            style={{
              animation: `satma-chat-typing 1.2s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SpeakingIndicator() {
  return (
    <div className="flex items-center gap-2 self-start rounded-full border border-periwinkle/30 bg-periwinkle/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-periwinkle">
      <span className="flex gap-0.5">
        {[0, 0.15, 0.3, 0.45].map((d) => (
          <span
            key={d}
            className="h-2.5 w-0.5 rounded-full bg-periwinkle"
            style={{
              animation: "satma-chat-typing 0.9s ease-in-out infinite",
              animationDelay: `${d}s`,
            }}
          />
        ))}
      </span>
      Hablando…
    </div>
  );
}

function ErrorBar({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex shrink-0 items-start gap-2 border-t border-line bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-red-300/70 hover:text-red-200"
        aria-label="Cerrar"
      >
        <X size={12} />
      </button>
    </div>
  );
}
