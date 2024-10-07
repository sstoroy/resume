const fs = require('fs')
const path = require('path')
const mime = require('mime/lite')
const { DateTime } = require('luxon')
const isEmpty = require('lodash/isEmpty')
const Xor = require("./../src/assets/js/link-xor.js")

module.exports = {
    dateToFormat: function (date, format) {
        return DateTime
            .fromISO(date)
            .setLocale(this.ctx.language)
            .toFormat(format)
    },

    dateToISO: function (date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    dateToHuman: function (date) {
        return DateTime
            .fromISO(date)
            .setLocale(this.ctx.language)
            .toLocaleString(DateTime.DATE_MED);
    },

    obfuscate: function (str) {
        const chars = [];
        const keys = [str[0], str[Math.floor(str.length / 2)], str[str.length - 1]];
        for (i=0;i<str.length;i++) {
            let c = str[i];
            if (c == '@' || keys.includes(c)) {
                chars.push(`<nospam${str.length%i}>`);
            }
            chars.push(c);
        }
        return chars.join('');
    },

    xor: function(input) {
        const key = this.ctx.site.hexkey
        const xor = new Xor(key);
        return xor.encode(input);
    },

    stripSpaces: function (str) {
        return str.replace(/\s/g, '')
    },

    stripProtocol: function (str) {
        return str.replace(/(^\w+:|^)\/\//, '')
    },

    base64file: function (file) {
        const filepath = path.join(__dirname, `../src/${file}`)
        const mimeType = mime.getType(file)
        const buffer = Buffer.from(fs.readFileSync(filepath))

        return `data:${mimeType};base64,${buffer.toString('base64')}`
    },

    themeColors: function (colors) {
        let style = ''
        if (!colors || isEmpty(colors)) {
            return ''
        }
        if (colors.primary) {
            style += `--primary-color:${colors.primary};`
        }
        if (colors.secondary) {
            style += `--secondary-color:${colors.secondary};`
        }
        return style
    },

    localize: function(str) {
        if (str == undefined || !(str instanceof Object)) {
            return str;
        }

        const language = this.ctx.language;
        const localizedString = str[language];

        if (!localizedString) {
            return str["en"];
        } 
        return localizedString;
    }
}
