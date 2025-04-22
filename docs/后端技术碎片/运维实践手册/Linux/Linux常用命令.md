# Linux常用命令

以MB为单位显示内存使用情况

```bash
free -m
```

使用 zgrep 搜索框内容：

```bash
zgrep "pattern" file.gz
```

```bash
zgrep "pattern" *.gz/file.gz.*
```

使用 zgrep 解压文件后，使用 grep 进行二次搜索：

```bash
zgrep "pattern1" file.gz | grep "pattern2"
```
