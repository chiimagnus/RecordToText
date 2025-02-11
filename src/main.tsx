import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function main() {
  console.log("plugin loaded");
  
  // 注册斜杠命令
  logseq.Editor.registerSlashCommand(
    "Convert to Embed",
    async () => {
      const block = await logseq.Editor.getCurrentBlock();
      if (block) {
        const content = block.content;
        const newContent = `![](${content})`;
        await logseq.Editor.updateBlock(block.uuid, newContent);
      }
    }
  );

  // 注册快捷键
  logseq.App.registerCommandPalette({
    key: "convert-path",
    label: "Convert Path to Embed",
    keybinding: {
      mode: "global",
      binding: "mod+shift+i"
    }
  }, async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (block) {
      const content = block.content;
      const newContent = `![](${content})`;
      await logseq.Editor.updateBlock(block.uuid, newContent);
    }
  });
}

logseq.ready(main).catch(console.error);
