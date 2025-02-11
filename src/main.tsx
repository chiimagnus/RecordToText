import "@logseq/libs";

async function main() {
  console.log("plugin loaded");

  // 确保 root 元素存在
  if (!document.getElementById("root")) {
    const rootEl = document.createElement("div");
    rootEl.id = "root";
    document.body.append(rootEl);
  }

  // 将命令注册移到 ready 回调中
  const registerCommands = () => {
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

    return () => {/* 清理函数 */};
  };

  // 返回清理函数
  return registerCommands();
}

logseq.ready(main).catch(console.error);
