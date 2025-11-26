/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, Loader2Icon, Sparkles, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

type TProps = {
  position: { x: number; y: number } | null;
  onClose: () => void;
  handleAiChange: any;
  loading?: boolean;
};
const FloatingActionTool = ({
  position,
  onClose,
  handleAiChange,
  loading,
}: TProps) => {
  const [userAiPrompt, setUserAiPropmt] = useState<string>("");
  if (!position) return;
  return (
    <div
      className="absolute z-50 bg-white text-sm items-center px-3 py-2 rounded-lg shadow-xl border flex"
      style={{
        top: position.y + 10,
        left: position.x,
        transform: "translate(-80%)",
      }}
    >
      <div className="flex flex-row gap-2">
        <Sparkles className="h-4 2-4" />
        <input
          type="text"
          placeholder="Ask AI to edit this section..."
          className="outline-none border-none"
          onChange={(e) => setUserAiPropmt(e.target.value)}
          disabled={loading}
          value={userAiPrompt}
          onKeyDown={(e) => {
            if (!loading && e.key === "Enter") {
              handleAiChange(userAiPrompt);
              setUserAiPropmt("");
              onClose()
            }
          }}
        />
        {userAiPrompt && (
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={() => {
              handleAiChange(userAiPrompt);
              setUserAiPropmt("");
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {loading && <Loader2Icon className="animate-spin" />}
      </div>
      <Button variant={"ghost"} size={"icon-sm"} onClick={onClose}>
        <X />
      </Button>
    </div>
  );
};

export default FloatingActionTool;
