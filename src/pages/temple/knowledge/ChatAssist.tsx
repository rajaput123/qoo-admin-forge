import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User, Sparkles, BookOpen, Clock } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
}

const suggestedQuestions = [
  "What is the SOP for temple opening?",
  "How to process donation receipts?",
  "What are the emergency protocols?",
  "Festival preparation checklist for Diwali",
  "Volunteer training requirements",
];

const KnowledgeChatAssist = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Namaste! 🙏 I'm your Knowledge Assistant. I can help you find information from the temple's knowledge base, SOPs, and documents. Ask me anything about temple operations, procedures, or guidelines.",
      timestamp: "Now",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: input,
      timestamp: "Just now",
    };

    const assistantMsg: Message = {
      id: String(messages.length + 2),
      role: "assistant",
      content: `Based on the temple's knowledge base, here's what I found regarding "${input}":\n\nThis is a demo response. When connected to a backend, this assistant will search through your documents, SOPs, and knowledge base to provide accurate answers with source references.`,
      timestamp: "Just now",
      sources: ["Temple Opening SOP", "Daily Operations Guide"],
    };

    setMessages([...messages, userMsg, assistantMsg]);
    setInput("");
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chat Assist</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered assistant to search and query your knowledge base</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" /> Knowledge Assistant
              <Badge variant="secondary" className="text-[10px] gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Powered</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-[10px] font-medium mb-1 opacity-70">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] mt-1 opacity-50">{msg.timestamp}</p>
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about temple operations, SOPs, guidelines..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestion(q)}
                    className="w-full text-left text-xs p-2.5 rounded-lg border hover:bg-accent transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Recent Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="truncate">Temple opening procedure</p>
                <p className="truncate">Donation tax exemption rules</p>
                <p className="truncate">Fire safety checklist</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeChatAssist;
