"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { useCopyToClipboard } from "@/components/hooks/useCopyToClipboard";
import { Label, Textarea } from "@/components/ui/FormElements";

const JsonFormatter = () => {
  const [type, setType] = useState("encoder");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { buttonText, handleCopy } = useCopyToClipboard();

  const handleChange = (event) => {
    const { value } = event.currentTarget;
    setInput(value);

    if (value.trim() === "") {
      setOutput("");
      return;
    }

    try {
      const output =
        type === "encoder"
          ? encodeURIComponent(value)
          : decodeURIComponent(value);
      setOutput(output);
    } catch (error) {
      setOutput("Invalid input");
    }
  };

  const setActiveTab = (type) => {
    setType(type);
    setOutput("");
    setInput("");
  };

  return (
    <>
      <Tabs defaultValue="encoder" className="mb-6">
        <TabsList className="flex">
          <TabsTrigger
            className="flex flex-1"
            value="encoder"
            onClick={() => setActiveTab("encoder")}
          >
            Encode
          </TabsTrigger>
          <TabsTrigger
            className="flex flex-1"
            onClick={() => setActiveTab("decoder")}
            value="decoder"
          >
            Decode
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="c__form">
        <Label name="text-to-encode-or-decode">
          {type === "encoder" ? "Text to encode" : "Encoded URL"}
        </Label>
        <Textarea
          rows="6"
          placeholder="Paste here"
          onChange={handleChange}
          value={input}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-6"
          name="text-to-encode-or-decode"
        ></Textarea>

        <Label name="text-to-encode-or-decode-readonly">
          {type === "encoder" ? "Encoded URL" : "Decoded URL"}
        </Label>
        <Textarea
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-6"
          rows="6"
          name="text-to-encode-or-decode-readonly"
          readOnly
          value={output}
        ></Textarea>
        <Button
          onClick={() => handleCopy(output)}
          theme={`secondary`}
          title={buttonText}
          actionable
          size="small"
        />
      </div>
    </>
  );
};

export default JsonFormatter;
