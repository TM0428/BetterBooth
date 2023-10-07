<template>
    <div>
        <h1>機能について</h1>
        <p>
            購入物が非公開になってしまった時、アイテム情報が見られなくなって悲しくならないように、その時点でのデータを保存する機能です。
        </p>
        <h1>使い方について</h1>
        <p>
            <em
                >この機能は実験的機能のため、今後機能しなくなる可能性もあります。ご了承ください。</em
            >
            <br /><br />
            この機能は、表示しているアイテム情報を取得し、Chrome上で保存しています。
            <br />
            JSON形式での保存であるため、できるだけ保存情報は少なくしていますが、
            <strong
                >重くなる可能性もありますので、いらないアイテムは削除してください。</strong
            >
            <br />
            アイテムを登録したい場合は、アイテムページの"ツイート"ボタンの隣に配置した、"+データを保存"ボタンを押すことで登録も可能です。
            <br /><br />
            これらのデータは、拡張機能の"オプション"ページから閲覧することができます。
            また、それぞれのアイテムをクリックすると、詳細を確認できます。
            <br />
            アイテムの削除は、このページから行ってください。
        </p>
        <br />
        <a v-bind:href="lang.howtoGithubLink">
            {{ lang.howtoGotoGithub }}
        </a>
        <br /><br />
        <router-link :to="{ name: 'Top' }" class="shop-button">
            {{ lang.itemBackToList }}
        </router-link>
    </div>
</template>

<script>
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";

export default {
    data() {
        return {
            lang: ja,
        };
    },
    methods: {
        changeLanguage() {
            switch (this.extended_settings.language) {
                case "en":
                    this.lang = en;
                    break;
                case "ko":
                    this.lang = ko;
                    break;
                case "zh-CN":
                    this.lang = zh_cn;
                    break;
                case "zh-TW":
                    this.lang = zh_tw;
                    break;
                case "zh":
                    this.lang = zh_cn;
                    break;
                default:
                    this.lang = ja;
            }
        },
    },
    created() {
        // 言語ファイルが正しく読み込まれることを確認してください
        const userLocale = window.navigator.language;
        console.log(userLocale);
        this.selLanguage = userLocale;
        switch (userLocale) {
            case "en":
                this.lang = en;
                break;
            case "ko":
                this.lang = ko;
                break;
            case "zh-CN":
                this.lang = zh_cn;
                break;
            case "zh-TW":
                this.lang = zh_tw;
                break;
            case "zh":
                this.lang = zh_cn;
                break;
            default:
                this.lang = ja;
                this.selLanguage = "ja";
        }
        chrome.storage.sync.get("extended_settings", (result) => {
            console.log(result.extended_settings);
            const extended_settings = result.extended_settings;
            if (extended_settings) {
                this.extended_settings = extended_settings;
                if (this.extended_settings.language) {
                    this.changeLanguage();
                } else {
                    this.extended_settings.language = userLocale;
                }
            } else {
                this.extended_settings.language = userLocale;
            }
        });
    },
};
</script>

<style scoped>
p,
a {
    font-size: 15px;
}
</style>
