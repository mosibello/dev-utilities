"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCopyToClipboard } from "@/components/hooks/useCopyToClipboard";
import { Label, Textarea } from "@/components/ui/FormElements";
import { convertQueryParamsToJSON } from "@/lib/helpers";

const JsonFormatter = () => {
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
      const output = convertQueryParamsToJSON(value.trim());
      setOutput(output);
    } catch (error) {
      setOutput("Invalid input, please provide valid query parameters");
    }
  };

  return (
    <>
      <div className="c__form">
        <Label name="query-params-to-json-textarea">Query Parameters</Label>
        <Textarea
          rows="6"
          placeholder="Paste here"
          onChange={handleChange}
          value={input}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-6"
          name="query-params-to-json-textarea"
        ></Textarea>

        <Label name="query-params-to-json-textarea-readonly">JSON Output</Label>
        <Textarea
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-6"
          rows="6"
          name="query-params-to-json-textarea-readonly"
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
