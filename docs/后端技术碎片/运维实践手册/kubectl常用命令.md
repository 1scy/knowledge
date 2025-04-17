# kubectl常用命令

```text
[root@master1 yudao-module-system]# kubectl get pods
NAME                                       READY   STATUS             RESTARTS      AGE
everfavour-module-cp-6cdf868dbc-8p58f      1/1     Running            0             14d
everfavour-module-hd-6d7f97dbd9-ch4z8      1/1     Running            0             13d
everfavour-module-hd-6d7f97dbd9-z86hz      1/1     Running            0             13d
gateway-65db86757f-qg4md                   1/1     Running            0             2d12h
gateway-65db86757f-xcrdr                   1/1     Running            0             3d9h
mysql-2gx9f                                1/1     Running            3 (74d ago)   84d
nacos-0                                    1/1     Running            0             84d
nfs-client-provisioner-5b665784d9-mvljs    1/1     Running            3 (74d ago)   84d
nginx-7fc9f7684f-2swx4                     1/1     Running            0             25d
nginx-7fc9f7684f-vkfvb                     1/1     Running            0             27d
sentinel-f89684fb-gw49z                    1/1     Running            3 (74d ago)   84d
xxl-job-admin-df744cdbf-f7jj2              1/1     Running            0             16h
yudao-module-bpm-765d856694-4q8wm          1/1     Running            0             17h
yudao-module-bpm-765d856694-gn8jj          1/1     Running            0             17h
yudao-module-crm-5c74976b86-25fx4          1/1     Running            0             67d
yudao-module-erp-86d5c8c665-6kjst          1/1     Running            0             68d
yudao-module-infra-7586b9c7df-cr7nt        1/1     Running            0             13d
yudao-module-infra-7586b9c7df-ks262        1/1     Running            0             16h
yudao-module-member-5b9d57ff6c-zmp72       1/1     Running            6 (74d ago)   86d
yudao-module-mp-5c7785455d-blrfb           1/1     Running            6 (74d ago)   87d
yudao-module-pay-6bcc7bd75f-zg4cm          1/1     Running            0             83d
yudao-module-product-7fbf99ffc9-8fcxr      1/1     Running            0             28m
yudao-module-product-7fbf99ffc9-kjtsb      1/1     Running            0             28m
yudao-module-promotion-679dc6c44b-wlht5    1/1     Running            6 (74d ago)   87d
yudao-module-report-df456b97f-6x5gq        1/1     Running            0             47h
yudao-module-report-df456b97f-ls7wt        1/1     Running            0             47h
yudao-module-statistics-856cd59fcf-jh9cm   1/1     Running            0             64d
yudao-module-system-74fc76bb8d-5sgpd       1/1     Running            0             130m
yudao-module-system-74fc76bb8d-fxd6n       1/1     Running            0             130m
yudao-module-trade-79cb5ff589-hhh2g        1/1     Running            0             41h
yudao-module-trade-79cb5ff589-nrvlx        1/1     Running            0             41h
yudao-module-trade-7f68449b68-wx6qp        0/1     CrashLoopBackOff   9 (25s ago)   21m

```

出现 Error from server (NotFound): pods "yudao-module-trade-677b9788b9-rrmhl" not found 错误，通常是因为 Kubernetes 无法找到指定的 Pod。以下是排查和解决方法：
1. 检查 Pod 名称
   确保输入的 Pod 名称正确。Pod 名称是区分大小写的，并且可能包含特定的字符组合。

```sh
kubectl get pods
```