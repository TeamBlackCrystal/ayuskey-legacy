#!/usr/bin/env bash

echo "コマンドが正常に動作しない場合はfirewallなどに弾かれてる可能性があります。"

echo -e "ユーザー名を入力してください (デフォルト: postgres)"
read -r -p ">" db_user
db_user=${db_user:-postgres}


echo "データベース名を入力してください"
while [[ -z "${db_name}" ]]; do
	read -r -p ">" db_name
done

cat <<EOF

本当に以下の設定でよろしいですか?
ユーザー名: ${db_user}
データベース名: ${db_name}
よろしい場合は y キャンセルする場合は n を入力してください

EOF
while :; do
	read -r -p ">" finall_answer
	case ${finall_answer} in

	[yY]|[yY][eE][sS])
		break
	;;
	[nN]|[nN][oO])
		echo "キャンセルしました"
		exit 0
	;;
	*)
		echo "y または n を入力してください"
		;;
	esac
done

sudo -u postgres psql -U "${db_user}" -d "${db_name}" -c "ALTER TABLE \"user\" ADD COLUMN \"isLady\" boolean NOT NULL DEFAULT false"
echo "アップデートが終了しました"
