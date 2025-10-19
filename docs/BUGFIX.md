# Bug 修复记录

**更新时间：** 2025-01-19

---

## 🐛 Bug #1: 删除文件时崩溃

### 问题描述
当用户点击删除文件按钮时，应用崩溃并显示错误：
```
TypeError: Cannot read properties of null (reading 'name')
```

### 错误位置
`src/store/translation-store.ts:77`

### 根本原因
`setFile` 函数在接收 `null` 时，仍然尝试读取 `file.name`：
```typescript
setFile: (file) => {
  set({
    file,
    filename: file.name,  // ❌ 当 file 为 null 时崩溃
    error: null,
  });
}
```

### 解决方案
使用可选链操作符（`?.`）和空值合并操作符（`||`）：
```typescript
setFile: (file) => {
  set({
    file,
    filename: file?.name || '',  // ✅ 安全处理 null
    error: null,
  });
}
```

### 测试步骤
1. ✅ 上传文件
2. ✅ 点击删除按钮
3. ✅ 确认不再崩溃
4. ✅ 可以重新上传文件

---

## 🐛 Bug #2: 阿拉伯语 SRT 文件解析失败

### 问题描述
用户上传阿拉伯语字幕文件 `spiderman arabic.srt` (42KB) 后，显示：
```
No valid subtitle entries found
```

### 可能的原因
1. **时间格式不标准**
   - 某些 SRT 使用点号 (`.`) 而不是逗号 (`,`) 作为毫秒分隔符
   - 例如：`00:00:01.000` 而不是 `00:00:01,000`

2. **缺少毫秒**
   - 某些 SRT 省略毫秒：`00:00:01` 而不是 `00:00:01,000`

3. **小时数格式**
   - 单位数小时：`1:00:01` 而不是 `01:00:01`

4. **时间分隔符变体**
   - 使用单箭头：`->` 而不是 `-->`

5. **BOM 字符**
   - UTF-8 文件可能包含 BOM (Byte Order Mark)：`\uFEFF`

### 解决方案

#### 1. 改进时间戳验证
**修改前（太严格）：**
```typescript
function isValidTimestamp(timestamp: string): boolean {
  const regex = /^\d{2}:\d{2}:\d{2},\d{3}$/;
  return regex.test(timestamp);
}
```

**修改后（宽松）：**
```typescript
function isValidTimestamp(timestamp: string): boolean {
  // 支持: HH:MM:SS,mmm | HH:MM:SS.mmm | HH:MM:SS | H:MM:SS,mmm
  const regex = /^\d{1,2}:\d{2}:\d{2}([.,]\d{1,3})?$/;
  return regex.test(timestamp);
}
```

#### 2. 标准化时间戳
添加新函数，将所有格式统一为标准格式：
```typescript
function normalizeTimestamp(timestamp: string): string {
  // 1. 替换点号为逗号
  let normalized = timestamp.replace('.', ',');

  // 2. 添加缺失的毫秒
  if (!normalized.includes(',')) {
    normalized += ',000';
  }

  // 3. 补齐毫秒位数（如果是 .5 变成 .500）
  const parts = normalized.split(',');
  if (parts[1] && parts[1].length < 3) {
    parts[1] = parts[1].padEnd(3, '0');
  }

  // 4. 补齐小时位数（1:00:01 变成 01:00:01）
  const timeParts = parts[0].split(':');
  if (timeParts[0].length === 1) {
    timeParts[0] = '0' + timeParts[0];
  }

  return timeParts.join(':') + ',' + (parts[1] || '000');
}
```

#### 3. 支持多种时间分隔符
```typescript
function parseTimeLine(line: string): { start: string; end: string } | null {
  // 支持 --> 或 ->
  const parts = line.split(/-->|->/).map((s) => s.trim());
  // ...
}
```

#### 4. 移除 BOM 字符
```typescript
const indexLine = lines[0].replace(/^\uFEFF/, ''); // 移除 BOM
const index = parseInt(indexLine, 10);
```

#### 5. 过滤空行
```typescript
const lines = block.split('\n')
  .map((line) => line.trim())
  .filter(line => line); // ✅ 移除空行
```

#### 6. 详细错误报告
```typescript
const errors: string[] = [];

for (let i = 0; i < blocks.length; i++) {
  // ...
  if (isNaN(index)) {
    errors.push(`Block ${i + 1}: Invalid index "${indexLine}"`);
    continue;
  }
  // ...
}

if (entries.length === 0) {
  return {
    success: false,
    error: `No valid subtitle entries found. Errors:\n${errors.slice(0, 5).join('\n')}`
  };
}
```

### 现在支持的格式

| 格式 | 示例 | 状态 |
|-----|------|------|
| 标准 SRT | `00:00:01,000 --> 00:00:03,000` | ✅ 支持 |
| WebVTT 格式 | `00:00:01.000 --> 00:00:03.000` | ✅ 支持 |
| 无毫秒 | `00:00:01 --> 00:00:03` | ✅ 支持 |
| 单位小时 | `1:00:01,000 --> 1:00:03,000` | ✅ 支持 |
| 单箭头 | `00:00:01,000 -> 00:00:03,000` | ✅ 支持 |
| 短毫秒 | `00:00:01,5 --> 00:00:03,5` | ✅ 支持（自动补齐为 .500） |
| 带 BOM | `\uFEFF1\n00:00:01,000 --> ...` | ✅ 支持（自动移除） |

### 测试步骤
1. ✅ 上传您的 `spiderman arabic.srt` 文件
2. ✅ 查看详细的错误信息（如果仍然失败）
3. ✅ 根据错误信息进一步调试

---

## 🎨 UI 改进 #3: 添加详细错误提示

### 改进内容
在主页面添加红色错误提示框，显示解析失败的详细原因。

### 实现
```tsx
{error && status === 'error' && (
  <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/10">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-destructive mb-1">Error parsing SRT file</h3>
        <p className="text-sm text-destructive/90 whitespace-pre-wrap">{error}</p>
        <button onClick={() => setError(null)} className="mt-2 text-sm underline">
          Dismiss
        </button>
      </div>
    </div>
  </div>
)}
```

### 效果
- ✅ 显示详细的错误信息（包括失败的块号和原因）
- ✅ 可以点击 "Dismiss" 关闭错误提示
- ✅ 使用 `whitespace-pre-wrap` 保留换行格式

---

## 🧪 测试建议

### 测试用例 1：标准 SRT
```srt
1
00:00:01,000 --> 00:00:03,000
Hello World

2
00:00:04,000 --> 00:00:06,000
Test subtitle
```
**预期结果：** ✅ 解析成功

### 测试用例 2：WebVTT 格式（点号）
```srt
1
00:00:01.000 --> 00:00:03.000
Hello World
```
**预期结果：** ✅ 解析成功（自动转换为逗号）

### 测试用例 3：无毫秒
```srt
1
00:00:01 --> 00:00:03
Hello World
```
**预期结果：** ✅ 解析成功（自动添加 ,000）

### 测试用例 4：单箭头
```srt
1
00:00:01,000 -> 00:00:03,000
Hello World
```
**预期结果：** ✅ 解析成功

### 测试用例 5：混合格式
```srt
1
1:00:01.5 -> 1:00:03.5
Hello World
```
**预期结果：** ✅ 解析成功，自动转换为 `01:00:01,500 --> 01:00:03,500`

---

## 📝 下一步

1. **测试您的阿拉伯语文件**
   - 重新上传 `spiderman arabic.srt`
   - 查看是否解析成功
   - 如果仍然失败，请查看错误提示中的详细信息

2. **如果仍然失败**
   - 请复制错误提示中显示的前5个错误
   - 或者分享您的 SRT 文件的前 20-30 行
   - 我将进一步优化解析器

3. **测试删除功能**
   - 上传任意文件
   - 点击删除（X 按钮）
   - 确认不再崩溃

---

**修复完成时间：** 2025-01-19
**修复文件：**
- `src/store/translation-store.ts`
- `src/lib/srt-parser.ts`
- `src/app/[locale]/page.tsx`
