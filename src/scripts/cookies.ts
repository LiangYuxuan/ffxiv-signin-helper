/* eslint-disable no-console */

import assert from 'node:assert';
import fs from 'node:fs';
import got from 'got';
import { CookieJar } from 'tough-cookie';
import Jimp from 'jimp';
import jsQR from 'jsqr';
import qrcode from 'qrcode-terminal';

const UserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

const getLoginQRCode = async (
    cookieJar: CookieJar,
    appID: string,
    areaID: string,
): Promise<string> => {
    const result = await got.get('https://w.cas.sdo.com/authen/getcodekey.jsonp', {
        headers: {
            'User-Agent': UserAgent,
            Referer: 'https://login.u.sdo.com/',
        },
        cookieJar,
        searchParams: {
            appId: appID,
            areaId: areaID,
            maxsize: 145,
            r: Math.random(),
        },
    });

    const image = await Jimp.read(result.rawBody);
    const content = jsQR(
        new Uint8ClampedArray(image.bitmap.data),
        image.bitmap.width,
        image.bitmap.height,
    );

    assert(content, '解析二维码失败');

    return content.data;
};

interface FailLoginInfo {
    appId: number,
    areaId: number,
    failReason: string,
    mappedErrorCode: number,
    nextAction: number,
}

interface SuccessLoginInfo {
    appId: number,
    areaId: number,
    inputUserId: string,
    isNeedFullInfo: number,
    nextAction: number,
    sndaId: string,
    ticket: string,
}

type LoginInfo = FailLoginInfo | SuccessLoginInfo;

interface LoginInfoAPIResponse {
    return_code: number,
    return_message: string,
    error_type: number,
    data: LoginInfo,
}

const getLoginInfo = async (
    cookieJar: CookieJar,
    appID: string,
    areaID: string,
    serviceURL: string,
): Promise<LoginInfo> => {
    const result = await got.get('https://w.cas.sdo.com/authen/codeKeyLogin.jsonp', {
        headers: {
            'User-Agent': UserAgent,
            Referer: 'https://login.u.sdo.com/',
        },
        cookieJar,
        searchParams: {
            appId: appID,
            areaId: areaID,
            serviceUrl: serviceURL,

            callback: 'codeKeyLogin_JSONPMethod',
            code: 300,
            productId: 2,
            productVersion: '3.1.0',
            authenSource: 2,

            _: Date.now(),
        },
    });

    const json = result.body.match(/^codeKeyLogin_JSONPMethod\((.+)\)$/)?.[1];

    assert(json, '解析登录信息失败');

    const res = JSON.parse(json) as LoginInfoAPIResponse;

    return res.data;
};

const waitLoginQRCode = async (
    cookieJar: CookieJar,
    appID: string,
    areaID: string,
    serviceURL: string,
): Promise<string> => {
    const startTime = Date.now();

    while (Date.now() - startTime < 60 * 1000) {
        // eslint-disable-next-line no-await-in-loop
        const res = await getLoginInfo(cookieJar, appID, areaID, serviceURL);

        if ('ticket' in res) {
            return res.ticket;
        }

        if (res.mappedErrorCode === -10515801) {
            throw new Error('二维码已失效');
        }

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => { setTimeout(resolve, 1000); });
    }

    throw new Error('二维码扫描超时');
};

const finishLogin = async (
    cookieJar: CookieJar,
    ticket: string,
    redirectURL: string,
): Promise<void> => {
    await got.get('http://apiff14risingstones.web.sdo.com/api/home/GHome/login', {
        headers: {
            'User-Agent': UserAgent,
            Referer: 'https://login.u.sdo.com/',
        },
        cookieJar,
        searchParams: {
            ticket,
            redirectUrl: redirectURL,
        },
    });
};

const ssoRedirectURL = 'http://apiff14risingstones.web.sdo.com/api/home/GHome/login?redirectUrl=https://ff14risingstones.web.sdo.com/pc/index.html';
const appRedirectURL = 'https://ff14risingstones.web.sdo.com/pc/index.html';

// userinfo 和 __wftflow 都在 https://static.web.sdo.com/yxzm/js/ac.js 中生成
const userID = `445385824-${Math.round(899999999 * Math.random() + 1E9).toString()}-${Math.round(Date.now() / 1000).toString()}`;

const cookieJar = new CookieJar();
cookieJar.setCookieSync('__wftflow=1607418051=1', 'https://apiff14risingstones.web.sdo.com/');
cookieJar.setCookieSync(`userinfo=userid=${userID}&siteid=SDG-08132-01`, 'https://apiff14risingstones.web.sdo.com/');

const loginQRCode = await getLoginQRCode(cookieJar, '6788', '1');

qrcode.generate(loginQRCode, {
    small: true,
});

console.log('请使用叨鱼扫描二维码登录');

const ticket = await waitLoginQRCode(cookieJar, '6788', '1', ssoRedirectURL);

await finishLogin(cookieJar, ticket, appRedirectURL);

const cookies = cookieJar.getCookieStringSync('https://apiff14risingstones.web.sdo.com/');

fs.writeFileSync('.cookies', cookies);

console.log('获取Cookies成功，已经写入.cookies文件。');
