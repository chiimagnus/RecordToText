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
        const blocks = await logseq.Editor.getSelectedBlocks();
        if (!blocks?.length) {
          (logseq.App as any).showMsg("请先选择多个块", "warning");
          return;
        }
        
        await Promise.all(
          blocks.map(async (block) => {
            const newContent = convertToEmbed(block.content);
            await logseq.Editor.updateBlock(block.uuid, newContent);
          })
        );
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
        const blocks = await logseq.Editor.getSelectedBlocks();
        if (!blocks?.length) {
          (logseq.App as any).showMsg("请先选择多个块", "warning");
          return;
        }
        
        await Promise.all(
          blocks.map(async (block) => {
            const newContent = convertToEmbed(block.content);
            await logseq.Editor.updateBlock(block.uuid, newContent);
          })
        );
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

// 添加格式检测函数
function isAlreadyEmbed(content: string) {
  // 匹配标准的嵌入语法 ![](path)
  const embedPattern = /^!\[\]\(.+\)$/;
  return embedPattern.test(content);
}

// 修改转换逻辑
function convertToEmbed(content: string) {
  return isAlreadyEmbed(content) ? content : `![](${content})`;
}

logseq.ready(main).catch(console.error);
