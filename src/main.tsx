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
    "Convert to Audio Embed",
    async () => {
      const block = await logseq.Editor.getCurrentBlock();
      if (block) {
        const content = block.content;
        // 检查内容是否是音频文件路径
        const audioExtensions = [".mp3", ".wav", ".m4a", ".ogg", ".aac"];
        const isAudioPath = audioExtensions.some(ext => 
          content.toLowerCase().endsWith(ext)
        );

        if (isAudioPath) {
          // 转换为 Logseq 的音频嵌入语法
          const newContent = `![](${content})`;
          await logseq.Editor.updateBlock(block.uuid, newContent);
        }
      }
    }
  );

  // 注册快捷键
  logseq.App.registerCommandPalette({
    key: "convert-audio-path",
    label: "Convert Audio Path to Embed",
    keybinding: {
      mode: "global",
      binding: "mod+shift+i"
    }
  }, async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (block) {
      const content = block.content;
      const audioExtensions = [".mp3", ".wav", ".m4a", ".ogg", ".aac"];
      const isAudioPath = audioExtensions.some(ext => 
        content.toLowerCase().endsWith(ext)
      );

      if (isAudioPath) {
        const newContent = `![](${content})`;
        await logseq.Editor.updateBlock(block.uuid, newContent);
      }
    }
  });
}

logseq.ready(main).catch(console.error);
