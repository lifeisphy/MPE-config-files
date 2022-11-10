# repository of configuration files for markdown preview enhanced

Note: this repository has all configuration files for editing markdown smoothly in the VSCode extension "Markdown Preview Enhanced".

### Usage:

1. install VSCode and "Markdown Preview Enhanced" extension
2. enable this extension, and put all files in your config directory "~/.mume".For example, you can press "ctrl shift P" and run "MPE: extend parser" command, which will open "parser.js" in the config directory.
3. [optional] you can replace your code snippets for markdown and latex by [latex.json](./code-snippets/latex.json) and [markdown.json](./code-snippets/markdown.json) . There are a lot of pre-defined snippets to speed up your editing.
4. [optional] if you want to export html representation as PDF format, you may install decktape:`npm install decktape`.

### Features:

You may already know the feature of [reveal.js](http://revealjs.com) and [MPE](https://shd101wyy.github.io/markdown-preview-enhanced); if not, read their docs first. This configuration file added some new features, which you may find useful:

- pre-defined css styles: there are several css files for making your document look better:[ppt.less](./ppt.less) for powerpoints; [passage.less](./passage.less) for passages; [bars.less](./bars.less) for colorful labelled blocks.

- mode switching: you can switch the type of document by changing `yaml` info.
  