# Audio Path to Embed Converter

这是一个 Logseq 插件，用于快速将音频文件路径转换为 Logseq 的音频嵌入语法。

## 功能

- 将音频文件路径自动转换为 Logseq 的音频嵌入语法
- 支持常见的音频格式：mp3, wav, m4a, ogg, aac

## 使用方法

1. 在 block 中输入音频文件的绝对路径
2. 使用斜杠命令 `/Convert to Audio Embed` ，或者使用快捷键`cmd+shift+I`
3. 插件会自动将路径转换为 `![](路径)` 格式

## 示例

输入:
```
/Users/username/Music/recording.mp3
```

转换后:
```
![](/Users/username/Music/recording.mp3)
```

