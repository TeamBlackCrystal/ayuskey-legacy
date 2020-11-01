#!/usr/bin/env bash

echo "コマンドが正常に動作しない場合はfirewallなどに弾かれてる可能性があります。"

echo "ユーザー名を入力してください"
while [[ -z "${db_user}" ]];do
	read -r -p ">" db_user
done


echo "データベース名を入力してください"
while [[ -z "${db_name}" ]]; do
	read -r -p ">" db_name
done

sudo docker-compose exec db psql -U "${db_user}" -d "${db_name}" -c "ALTER TABLE \"user\" ADD COLUMN \"isLady\" boolean NOT NULL DEFAULT false"
