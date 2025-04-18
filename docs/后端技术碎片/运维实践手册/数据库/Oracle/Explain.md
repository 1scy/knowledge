# EXPLAIN PLAN FOR

在 Oracle 中，可以使用 `EXPLAIN PLAN` 来获取查询的执行计划。
以下是使用 `EXPLAIN PLAN` 的教程：

### 1. **使用 EXPLAIN PLAN**

使用 `EXPLAIN PLAN` 获取查询的执行计划：

```sql
EXPLAIN PLAN FOR SELECT sysdate from dual
```

### 2. **查看执行计划**

执行以下查询以查看执行计划：

```sql
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

### 3. **输出解读**

执行计划的输出包含多列，以下是一些关键列的解释：

- **``Plan Hash Value``**: 查询计划的哈希值，相同的查询计划具有相同的哈希值。
- **``Id``**: 操作的唯一标识符，用于标识执行计划中的每个步骤。
- **``Operation``**: 执行的操作类型，如 `TABLE ACCESS`、`INDEX SCAN` 等。
- **``Options``**: 操作的选项，如 `FULL`（全表扫描）、`RANGE`（范围扫描）等。
- **``Object Name``**: 涉及的表或索引的名称。
- **``Object Alias``**: 查询中使用的表别名。
- **``Object Owner``**: 对象的所有者。
- **``Object Type``**: 对象的类型，如 `TABLE`、`INDEX` 等。
- **``Optimizer``**: 优化器的类型。
- **``Cost``**: 执行操作的成本。
- **``Cardinality``**: 预计返回的行数。
- **``Bytes``**: 预计返回的数据量（字节）。
- **``Time``**: 预计执行时间。
- **``Partition Start/Stop``**: 涉及的分区范围。
- **``Other Tag``**: 其他标签信息。
- **``Partition Identifier``**: 分区标识符。
- **``Distribution``**: 分布方式。
- **``CPU Cost``**: CPU 成本。
- **``IO Cost``**: I/O 成本。
- **``TempSpace``**: 临时空间使用量。
- **``Access Predicates``**: 访问谓词。
- **``Filter Predicates``**: 过滤谓词。

### 4. **优化查询**

根据执行计划的输出，可以优化查询性能：

- **使用索引**: 确保查询使用了适当的索引。
- **减少行数**: 通过优化查询条件减少需要访问的行数。
- **避免全表扫描**: 尽量避免 `TABLE ACCESS FULL` 类型的全表扫描。
