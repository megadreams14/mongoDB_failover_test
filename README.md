
# Node.jsでMongoDBのフェイルオーバーを検証

このプログラムは、Node.js(v6.11.3)とmongoose(v4.11.7)を利用して、
MongoDB(v3.4.8)のフェイルオーバー時の挙動を検証するための簡易プログラムです。

詳細については、下記の２つの記事に記載しております。

- [MongoDBのレプリケーションとフェイルオーバーの設定](http://qiita.com/megadreams14/items/c6a54ba5eca08cd052cb)
- [MongoDBのフェイルオーバー時のNode.jsのプログラム制御と動作確認](http://qiita.com/megadreams14/items/f4f226d33d65f5a88e32)

# 環境設定

Vagrant内で利用することを想定しています。

## MongoDBの設定

- MongoDBの起動

フェイルオーバーを試すために、下記のように1台のなかで3台のMongoDBのプロセスを起動します。
（詳細な設定などは上記記事を参考にください）

```
# DB01の起動
mongod --port=50000 --dbpath=/var/lib/mongodb/db01 --logpath=/var/log/mongodb/db01.log --replSet=LocalRep --fork

# DB02の起動
mongod --port=50001 --dbpath=/var/lib/mongodb/db02 --logpath=/var/log/mongodb/db02.log --replSet=LocalRep --fork

# DB03の起動
mongod --port=50002 --dbpath=/var/lib/mongodb/db03 --logpath=/var/log/mongodb/db03.log --replSet=LocalRep --fork
```

## Node.jsプログラムの設定


- レポジトリをクローン

```
git clone https://github.com/megadreams14/mongoDB_failover_test.git
cd mongoDB_failover_test/
```

- Nodeのバージョン指定で起動

```
nvm use v6.11.3
```

- 必要なパッケージのインストール

```
nvm install
```

- 起動コマンド

```
 export NODE_ENV=development; node bin/www
```

- アクセス

```
curl http://localhost:8080/api/v1/login
```


# プログラムの構成

```
.
├── actions
│   └── index.js
├── app.js
├── models
│   ├── index.js
│   └── schema
│       ├── loginLog.js
│       └── users.js
├── modules
│   └── login
│       ├── actions
│       │   └── index.js
│       └── routers
│           └── index.js
└── routers
    └── index.js
```

ざっくりした説明

- app.js
   - node bin/www コマンドでサーバが起動した際に呼ばれるファイル
   - ルーティングなどの呼び出し設定を行う
- actions
   - 共通のアクションクラス
   - 各APIのロジックを管理する親クラスであり、認証が必要な場合やエラー処理などここで管理する
- routers
   - 共通のルータクラス
   - 各APIを呼び出すために、パスとファイルのマッピングやレスポンス処理などを管理する
- models
   - MongoDBのスキーマの管理やコネクションを管理する
- modules
   - 各APIのロジックを管理する


環境が出来れば、MongoDBのプロセスを落としたりしながらプログラムとして正常に動作するのか
パラメータのチューニングや処理としての設定を行います。
