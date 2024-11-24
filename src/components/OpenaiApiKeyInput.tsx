// src/components/OpenaiKeyInput.tsx

import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setOpenaiApiKey } from "../store/openaiApiKeySlice";

interface OpenaiApiKeyInputProps {
  disabled: boolean;
}

const OpenaiApiKeyInput: React.FC<OpenaiApiKeyInputProps> = ({ disabled }) => {
  const openaiApiKey = useAppSelector((state) => state.openaiApiKey.openaiApiKey);
  const dispatch = useAppDispatch();

  const validateOpenaiApiKey = useCallback(() => {
    return openaiApiKey.startsWith("sk-");
  }, [openaiApiKey]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="password"
        placeholder="Enter OpenAI API Key"
        value={openaiApiKey}
        onChange={(e) => dispatch(setOpenaiApiKey(e.target.value))}
        style={{ padding: "5px", fontSize: "12px", width: "200px" }}
        disabled={disabled}
      />
      {!validateOpenaiApiKey() && openaiApiKey.length > 0 && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>Invalid API Key</p>
      )}
    </div>
  );
};

export default OpenaiApiKeyInput;
