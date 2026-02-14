import { ComponentExample } from "@/components/component-example";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Page() {
return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
    <div className="container mx-auto py-24 px-4 text-center">
      <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Welcome to Voice Agent
      </h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        AI-powered voice processing with LangGraph orchestration
      </p>
      <Link href="/voice-agent">
        <Button size="lg" className="text-lg h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Sparkles className="w-5 h-5 mr-2" />
          Try Voice Agent
        </Button>
      </Link>
    </div>
  </div>
);
}