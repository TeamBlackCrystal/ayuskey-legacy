#!/usr/bin/env bash

echo "コマンドが正常に動作しない場合はfirewallなどに弾かれてる可能性があります。"

echo -e "ユーザー名を入力してください\n自分で変更していない場合は\"postgres\"である可能性が高いです"
while [[ -z "${db_user}" ]];do
	read -r -p ">" db_user
done


echo "データベース名を入力してください"
while [[ -z "${db_name}" ]]; do
	read -r -p ">" db_name
done

sudo -u postgres psql -U "${db_user}" -d "${db_name}" -c "ALTER TABLE \"user\" ADD COLUMN \"isLady\" boolean NOT NULL DEFAULT false"
