"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCopyToClipboard } from "@/components/hooks/useCopyToClipboard";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { buttonText, handleCopy } = useCopyToClipboard();

  const handleChange = (event) => {
    const { value } = event.currentTarget;
    setInput(value);
    try {
      const parsedJSON = JSON.parse(value.trim());
      const formattedJSON = JSON.stringify(parsedJSON, null, 2);
      setOutput(formattedJSON);
    } catch {
      setOutput("Invalid JSON input");
    }
  };

  return (
    <>
      <div>
        <label className="text-sm mb-2 flex font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          JSON
        </label>
        <textarea
          onChange={handleChange}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-6"
          rows="6"
          placeholder="Paste JSON here"
        ></textarea>
        <label className="text-sm mb-2 flex font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Formatted JSON
        </label>
        <textarea
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4"
          rows="6"
          readOnly
          value={output}
        ></textarea>
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
