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
        console.error(error);
        (logseq.App as any).showMsg(
          (error as Error).message?.includes("文件路径") ?? false
            ? "内容不是有效的文件路径" 
            : "转换失败，请检查控制台",
          "error"
        );
      }
    });

    return () => {/* 清理函数 */};
  };

  // 返回清理函数
  return registerCommands();
}

// 增强路径检测逻辑
function isValidPath(content: string) {
  const pathPattern = /^(?:[a-zA-Z]:\\|\\|\\\\|\/|\.\/|~\/)|.*\.[a-zA-Z0-9]{2,4}(?:[?#].*)?$/;
  return pathPattern.test(content) && (content.includes("/") || content.includes("\\"));
}

// 添加格式检测函数
function isAlreadyEmbed(content: string) {
  // 匹配标准的嵌入语法 ![](path)
  const embedPattern = /^!\[\]\(.+\)$/;
  return embedPattern.test(content);
}

// 在转换函数中添加校验
function convertToEmbed(content: string) {
  if (!isValidPath(content)) {
    throw new Error("内容不是有效的文件路径");
  }
  return isAlreadyEmbed(content) ? content : `![](${content})`;
}

logseq.ready(main).catch(console.error);
