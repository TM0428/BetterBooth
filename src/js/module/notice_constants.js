/**
 * トップページに表示するお知らせポップアップのID定義
 *
 * 新しいお知らせを追加する手順:
 * 1. ここにIDを追加する(過去に使ったIDは再利用しない)
 * 2. content.jsのshowNotices()内のnotices配列に定義を追加する
 *
 * IDはchrome.storage.localのshown_notice_idsに保存され、
 * 未保存のIDを持つお知らせが1度だけ表示される。
 * 新規インストール時はbackground.jsが全IDを表示済みにするため、
 * お知らせは「バージョンアップしたユーザー」にのみ表示される。
 */
export const noticeIds = {
    hiddenShopsMigration: "hidden_shops_migration"
};

export const allNoticeIds = Object.values(noticeIds);

export const SHOWN_NOTICE_IDS_KEY = "shown_notice_ids";

/**
 * ポップアップの「移行」ボタンから移行UIの表示を要求するためのキー
 * ポップアップがtrueを保存してbooth.pmのタブを開き、
 * content.jsがトップページで消費して移行ポップアップを表示する
 */
export const MIGRATION_REQUEST_KEY = "migration_request_pending";
