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
        console.debug("Current block info:", {
          content: block?.content,
          pageId: block?.page?.id,
          uuid: block?.uuid
        });
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
      try {
        const block = await logseq.Editor.getCurrentBlock();
        console.debug("Current block info:", {
          content: block?.content,
          pageId: block?.page?.id,
          uuid: block?.uuid
        });
        if (!block) return;
        
        // 添加内容格式校验
        if (!isValidPath(block.content)) {
          (logseq.App as any).showMsg("内容不是有效的文件路径", "warning");
          return;
        }
        
        await logseq.Editor.updateBlock(block.uuid, `![](${block.content})`);
      } catch (error) {
        console.error("Conversion error:", error);
        (logseq.App as any).showMsg("转换失败，请检查控制台", "error");
      }
    });

    return () => {/* 清理函数 */};
  };

  // 返回清理函数
  return registerCommands();
}

// 添加简单的路径校验函数
function isValidPath(content: string) {
  return content.includes("/") || content.includes("\\");
}

logseq.ready(main).catch(console.error);
