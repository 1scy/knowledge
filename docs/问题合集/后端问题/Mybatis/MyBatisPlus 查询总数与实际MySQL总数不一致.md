---
title: MyBatisPlus 查询总数与实际MySQL总数不一致
category: Mybatis
tag: Mybatis
---


::: info 相关信息

MyBatisPlus 分页插件文档：[分页插件](https://baomidou.com/plugins/pagination)

:::

## [背景](#背景)

有两张表，一个是主表logistics\_exception\_reporting，另一个是子表logistics\_exception\_reporting\_detail，是主子表式一对多的关系

### [表结构](#表结构)

**logistics\_exception\_reporting：**

```sql
create table logistics_exception_reporting
(
    id                  bigint auto_increment comment '主键' primary key,
    bill_code           varchar(255) null comment '差异单号',
    responsibility_type tinyint null comment '责任类型',
    logistics_code      varchar(64) null comment '物流单号',
    logistics_company   tinyint null comment '物流公司',
    origin_warehouse    varchar(64) null comment '始发仓',
    store_code          varchar(64) null comment '门店代码',
    store_name          varchar(128) null comment '门店名称',
    exception_type      tinyint null comment '异常类型',
    number              int null comment '异常数量',
    deleted             tinyint default 0 not null comment '是否删除',
    tenant_id           bigint            not null comment '租户号',
    creator             varchar(90) null comment '创建人',
    create_time         datetime null comment '创建时间',
    updater             varchar(90) null comment '更新人',
    update_time         datetime null comment '更新时间'
) comment '门店商品异常上报';
```

**logistics\_exception\_reporting\_detail：**

```sql
create table logistics_exception_reporting_detail
(
    id                            bigint auto_increment comment '主键' primary key,
    ex_rpt_id                     bigint null comment '异常上报id',
    goods_code                    varchar(255) null comment '商品代码',
    goods_name                    varchar(255) null comment '商品名称',
    goods_barcode                 varchar(255) null comment '商品条码',
    packing_code                  varchar(255) null comment '装箱码',
    goods_retail_price            decimal(24, 6) null comment '商品零售价',
    number                        int null comment '数量',
    exception_amount              decimal(24, 6) null comment '异常金额',
    exception_logistics_deduction decimal(24, 6) null comment '异常物流扣款',
    last_responsible_party        int null comment '责任方',
    last_responsible_user         varchar(50) null comment '责任人',
    last_process_node             int null comment '审核环节',
    last_process_user             varchar(64) null comment '审核人',
    last_process_time             datetime null comment '审核时间',
    deleted                       tinyint default 0 not null comment '是否删除',
    tenant_id                     bigint            not null comment '租户号',
    creator                       varchar(90) null comment '创建人',
    create_time                   datetime null comment '创建时间',
    updater                       varchar(90) null comment '更新人',
    update_time                   datetime null comment '更新时间'
) comment '门店商品异常上报明细';
```

### [查询SQL](#查询sql)

MyBatisPlus的查询Mapper如下：

```java
IPage<LogisticsExceptionGoodsPageRespVO> selectLogisticsExceptionGoodsPage(Page<LogisticsExRptPageReqVO> pageParam, LogisticsExRptPageReqVO pageReqVO);
```

```xml
<!---->
<select id="selectLogisticsExceptionGoodsPage"
        resultType="cn.iocoder.yudao.module.report.controller.admin.logisticsfee.exceptionreporting.vo.response.LogisticsExceptionGoodsPageRespVO">
    select
    er.id exRptId,
    erd.id exRptDetailId,
    er.create_time createTime,
    er.creator creator,
    erd.updater updater,
    erd.update_time updateTime,
    er.*,
    erd.*
    from logistics_exception_reporting er
    left join logistics_exception_reporting_detail erd on er.id = erd.ex_rpt_id and erd.deleted = 0
    <where>
        er.deleted = 0
        <if test="pageReqVO.storeCode != null and pageReqVO.storeCode != ''">
            and er.store_code = #{pageReqVO.storeCode}
        </if>
        <if test="pageReqVO.logisticsCode != null">
            and er.logistics_code = #{pageReqVO.logisticsCode}
        </if>
        <if test="pageReqVO.processUser != null">
            and erd.process_user = #{pageReqVO.processUser}
        </if>
        <if test="pageReqVO.updater != null">
            and erd.updater = #{pageReqVO.updater}
        </if>
    </where>
    order by erd.update_time desc
</select>
```

## [问题现象](#问题现象)

在分页查询时，通过MybatisPlus查询返回的总数十分奇怪：

+   分页查询时，除了分页参数外无其他条件，查询结果的Total是39条数据
+   分页查询时，除了分页参数外带上了updater参数，查询结果的Total是45条数据
+   通过数据库工具查看，发现logistics\_exception\_reporting表有39条数据，logistics\_exception\_reporting\_detail表有45条数据

## [猜测原因](#猜测原因)

MyBatisPlus 查询插件问题

## [定位问题](#定位问题)

配置MybatisPlus日志，将执行过程的SQL打印出来

**无updater查询条件时：**

```sql
-- count查询
SELECT COUNT(*) AS total
FROM logistics_exception_reporting er
WHERE er.deleted = 0
  AND er.tenant_id = 1;
-- 分页查询
SELECT er.id                             exRptId,
       erd.id                            exRptDetailId,
       er.create_time                    createTime,
       er.creator                        creator,
       erd.update_time                   updateTime,
       erd.updater                       updater,
       erd.number                        number,
       erd.exception_amount              exceptionAmount,
       erd.exception_logistics_deduction exceptionLogisticsDeduction,
       er.*,
       erd.*
FROM logistics_exception_reporting er
       LEFT JOIN logistics_exception_reporting_detail erd
                 ON er.id = erd.ex_rpt_id AND erd.deleted = 0 AND erd.tenant_id = 1
WHERE er.deleted = 0
  AND er.tenant_id = 1
ORDER BY erd.update_time DESC LIMIT 10;
```

**有updater查询条件时：**

```sql
-- count查询
SELECT COUNT(*) AS total
FROM logistics_exception_reporting er
       LEFT JOIN logistics_exception_reporting_detail erd
                 ON er.id = erd.ex_rpt_id AND erd.deleted = 0 AND erd.tenant_id = 1
WHERE er.deleted = 0
  AND erd.updater = 100001
  AND er.tenant_id = 1;
-- 分页查询
SELECT er.id                             exRptId,
       erd.id                            exRptDetailId,
       er.create_time                    createTime,
       er.creator                        creator,
       erd.update_time                   updateTime,
       erd.updater                       updater,
       erd.number                        number,
       erd.exception_amount              exceptionAmount,
       erd.exception_logistics_deduction exceptionLogisticsDeduction,
       er.*,
       erd.*
FROM logistics_exception_reporting er
       LEFT JOIN logistics_exception_reporting_detail erd
                 ON er.id = erd.ex_rpt_id AND erd.deleted = 0 AND erd.tenant_id = 1
WHERE er.deleted = 0
  AND erd.updater = 100001
  AND er.tenant_id = 1
ORDER BY erd.update_time DESC LIMIT 10;
```

从执行的SQL中可以发现，MyBatisPlus分页插件进行分页时分为2个步骤：

1.  通过count查询总条数
2.  实际执行分页查询

并且两次分页查询前的count查询的SQL是不一致的，因此是“count查询总条数”这一步出现了问题

## [原因分析](#原因分析)

**查看MyBatisPlus分页插件的文档发现，有这样的描述：** “生成 countSql 时，如果 left join 的表不参与 where 条件，会将其优化掉。建议在任何带有 left join 的 SQL 中，都给表和字段加上别名。”

回看上面Mapper中的查询SQL，发现没有查询条件时，left join 的表即logistics\_exception\_reporting\_detail表，确实是不参与 where 条件的。并且由于偷懒方便，使用了`er.*`、`erd.*`，所以也没有给字段加上别名

## [问题原因](#问题原因)

+   除了分页参数外无其他条件，MyBatisPlus生成 countSql 时，left join 的表logistics\_exception\_reporting\_detail，不参与 where 条件，因此被优化掉了，只查了主表的count
+   除了分页参数外带上了updater参数，MyBatisPlus生成 countSql 时，虽然使用了`er.*`、`erd.*` 没有给字段加上别名，但是参与了 where 条件，因此是联表的count

## [解决方法](#解决方法)

由于是count优化导致的，所以就要避免count优化生效

### [MyBatisPlus解决————关闭优化join count](#mybatisplus解决————关闭优化join-count)

MybatisPlus默认是开启join count优化的

在MybatisPlus的分页类Page中，有方法setOptimizeJoinOfCountSql，设置为false即可关闭join count优化

### [SQL解决————拆分\*加别名](#sql解决————拆分-加别名)

像查询SQL中的`er.*`、`erd.*`其实是不好的写法，因此，规范的写法应当只取想要的字段，并且给想要的字段加上别名

> 实际测试，将`er.*`、`erd.*`去掉后，还是会去优化，所以该方式不一定能解决

### [SQL解决————使where条件内必有多个表参数](#sql解决————使where条件内必有多个表参数)

其实就可以将联表条件中的`erd.deleted = 0`也放进where条件中，那么查询条件就有两个表的条件了`er.deleted = 0`和 `erd.deleted = 0` 。就不会发生join count优化了

## [防范措施](#防范措施)

使用MybatisPlus的分页机制进行联表查询时，如果总数不对，就要考虑到join count优化的问题