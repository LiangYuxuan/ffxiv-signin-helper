/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import-x/no-unused-modules */

import assert from 'node:assert';
import fs from 'node:fs';

import makeFetchCookie from 'fetch-cookie';
import { Jimp } from 'jimp';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import { CookieJar } from 'tough-cookie';

import userAgent from '../userAgent.ts';

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

const ssoRedirectURL = 'http://apiff14risingstones.web.sdo.com/api/home/GHome/login?redirectUrl=https://ff14risingstones.web.sdo.com/pc/index.html';
const appRedirectURL = 'https://ff14risingstones.web.sdo.com/pc/index.html';

// userinfo 和 __wftflow 都在 https://static.web.sdo.com/yxzm/js/ac.js 中生成
const userID = `445385824-${Math.round(899999999 * Math.random() + 1E9).toString()}-${Math.round(Date.now() / 1000).toString()}`;

const cookieJar = new CookieJar();
cookieJar.setCookieSync('__wftflow=1607418051=1', 'https://apiff14risingstones.web.sdo.com/');
cookieJar.setCookieSync(`userinfo=userid=${userID}&siteid=SDG-08132-01`, 'https://apiff14risingstones.web.sdo.com/');

const fetchCookie = makeFetchCookie(fetch, cookieJar);

const getLoginQRCode = async (
    appID: string,
    areaID: string,
): Promise<string> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Referer', 'https://login.u.sdo.com/');

    const params = new URLSearchParams();
    params.set('appId', appID);
    params.set('areaId', areaID);
    params.set('maxsize', '145');
    params.set('r', Math.random().toString());

    const req = await fetchCookie(`https://w.cas.sdo.com/authen/getcodekey.jsonp?${params}`, { headers });
    const res = await req.arrayBuffer();

    const image = await Jimp.read(res);
    const content = jsQR(
        new Uint8ClampedArray(image.bitmap.data),
        image.bitmap.width,
        image.bitmap.height,
    );

    assert(content, '解析二维码失败');

    return content.data;
};

const getLoginInfo = async (
    appID: string,
    areaID: string,
    serviceURL: string,
): Promise<LoginInfo> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Referer', 'https://login.u.sdo.com/');

    const params = new URLSearchParams();
    params.set('appId', appID);
    params.set('areaId', areaID);
    params.set('serviceUrl', serviceURL);
    params.set('callback', 'codeKeyLogin_JSONPMethod');
    params.set('code', '300');
    params.set('productId', '2');
    params.set('productVersion', '3.1.0');
    params.set('authenSource', '2');
    params.set('_', Date.now().toString());

    const req = await fetchCookie(`https://w.cas.sdo.com/authen/codeKeyLogin.jsonp?${params}`, { headers });
    const res = await req.text();

    const json = /^codeKeyLogin_JSONPMethod\((.+)\)$/.exec(res)?.[1];

    assert(typeof json === 'string', '解析登录信息失败');

    const result = JSON.parse(json) as LoginInfoAPIResponse;

    return result.data;
};

const waitLoginQRCode = async (
    appID: string,
    areaID: string,
    serviceURL: string,
): Promise<string> => {
    const startTime = Date.now();

    while (Date.now() - startTime < 60 * 1000) {
        // eslint-disable-next-line no-await-in-loop
        const res = await getLoginInfo(appID, areaID, serviceURL);

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
    ticket: string,
    redirectURL: string,
): Promise<void> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Referer', 'https://login.u.sdo.com/');

    const params = new URLSearchParams();
    params.set('ticket', ticket);
    params.set('redirectUrl', redirectURL);

    await fetchCookie(`http://apiff14risingstones.web.sdo.com/api/home/GHome/login?${params}`, { headers });
};

const loginQRCode = await getLoginQRCode('6788', '1');

console.info(await QRCode.toString(loginQRCode, { type: 'terminal', small: true }));

console.info('请使用叨鱼扫描二维码登录');

const ticket = await waitLoginQRCode('6788', '1', ssoRedirectURL);

await finishLogin(ticket, appRedirectURL);

const cookies = cookieJar.getCookieStringSync('https://apiff14risingstones.web.sdo.com/');

fs.writeFileSync('.cookies', cookies);

console.info('获取Cookies成功，已经写入.cookies文件。');
