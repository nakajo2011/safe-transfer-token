# safe-transfer-token
# Overview
安全に送金可能なToken実装

# Motivation
ERC-223ではまだまだtokenが失われる場合がある。なので、絶対にtokenが失われないtokenを実装してみた。

とりあえずコンセプトを形にしただけなので、調整が必要な部分がまだ残っているかも。

# Problrem
tokenが失われる原因は直接_toに対して転送してしまうところにある。
_toが存在しているaddressなのか確認せずにすぐに転送するため、実際は存在しないaddressだったり、また存在していたとしてもそもそもtokenの受け取りを想定していないContractのaddressだったりするためににtokenの喪失が発生する。

# Specification
上記問題を解決するため、このtokenではtransferと対応するreceiveを定義した。
receiverは実際にtokenを受け取るためにはsenderがtransferした後にreceiveを呼び出す必要がある。
また、senderが送金を取りやめることが可能なcancelも実装した。これによりヒューマンエラーで送金先addressを間違えていた場合などにsenderがtokenを取り戻すことができる。

いかに、送金手順とキャンセルの手順を例示する

## 送金
1. senderはtransferを呼び出し、receiverに任意のtokenを送金する
1. receiverはreceiveFromを呼び出し、senderからのtokenを受け取る

## 送金キャンセル
1. senderはtransferを呼び出し、任意のaddressに任意tokenを送金する
1. senderはcancelFromを呼び出し、1.の送金を取り消す

詳しくはtestを参照。

# Issue
* cancelとreceiveのタイミングで意図しないtokenの移動が起きないか？（多分起きないようにはしてるとは思うが。。。）
* https://github.com/ethereum/EIPs/issues/738 approve + transferFromの意図しない攻撃への対応
