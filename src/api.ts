/* eslint-disable @typescript-eslint/naming-convention */

import assert from 'node:assert';

import userAgent from './userAgent.ts';

interface APIReturn {
    code: number;
    msg: string;
    data: unknown;
}

interface LoginInfo {
    displayAccount: string,
    character_name: string,
    area_name: string,
    group_name: string,
    isActivateUser: number,
    lastLoginTime: string,
    punishStatusArr: string[],
}

interface CharacterInfo {
    uuid: string,
    sndaId: string,
    character_id: string,
    character_name: string,
    area_id: number,
    area_name: string,
    group_id: number,
    group_name: string,
    avatar: string,
    profile: string,
    weekday_time: string,
    weekend_time: string,
    qq: string,
    career_publish: number,
    guild_publish: number,
    create_time_publish: number,
    last_login_time_publish: number,
    play_time_publish: number,
    house_info_publish: number,
    washing_num_publish: number,
    achieve_publish: number,
    resently_publish: number,
    experience: string,
    theme_id: string,
    status: number,
    created_at: string,
    updated_at: string,
    updated_by: string,
    last_login_ip: string,
    ip_location: string,
    last_login_time: string,
    test_limited_badge: number,
    posts2_creator_badge: number,
    admin_tag: number,
    publish_tab: string,
    achieve_tab: string,
    treasure_times_publish: number,
    kill_times_publish: number,
    newrank_publish: number,
    crystal_rank_publish: number,
    fish_times_publish: number,
    platform: string,
    characterDetail: {
        create_time: string,
        gender: string,
        last_login_time: string,
        race: string,
        character_name: string,
        character_id: string,
        area_id: string,
        play_time: string,
        group_id: string,
        guild_name: string,
        fc_id: string,
        tribe: string,
        guild_tag: string,
        washing_num: string,
        part_date: string,
    },
    isSign: number,
    sysNum: number,
    atNum: number,
    commentNum: number,
    beLikedNum: number,
    atMsgNum: string,
    commentMsgNum: string,
    beLikedMsgNum: string,
    ptId: string,
    createdAtLikePageMin: string,
}

interface SignInResult {
    sqMsg: string,
    continuousDays: number,
    totalDays: string,
    sqExp: number,
    shopExp: number,
}

interface SignInLog {
    count: number,
    rows: {
        id: string,
        uuid: string,
        character_name: string,
        area_name: string,
        group_name: string,
        sign_time: string,
        ip_location: string,
        platform: number,
    }[],
}

interface SignInReward {
    id: number,
    begin_date: string,
    end_date: string,
    rule: number,
    item_name: string,
    item_pic: string,
    num: number,
    item_desc: string,
    is_get: number,
}

interface DynamicDetail {
    status: number,
    comment_count: number,
    like_count: number,
    id: number,
    content: string,
    mask_content: string,
    pic_url: string,
    sndaId: string,
    uuid: string,
    author_cid: string,
    character_name: string,
    area_id: number,
    area_name: string,
    group_id: number,
    group_name: string,
    comment_status: number,
    is_admin: boolean,
    from: number,
    from_id: string,
    scope: string,
    mark_msg: string,
    ip: string,
    ip_location: string,
    created_at: string,
    mask_time: string,
    platform: string,
}

export const getLoginInfo = async (cookies: string): Promise<LoginInfo> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');

    const params = new URLSearchParams();
    params.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/GHome/isLogin?${params}`, { headers });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);

    return res.data as LoginInfo;
};

export const getCharacterBindInfo = async (cookies: string): Promise<CharacterInfo> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');

    const params = new URLSearchParams();
    params.set('platform', '1');
    params.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/groupAndRole/getCharacterBindInfo?${params}`, { headers });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);

    return res.data as CharacterInfo;
};

export const doSignIn = async (cookies: string): Promise<SignInResult | undefined> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const params = new URLSearchParams();
    params.set('tempsuid', crypto.randomUUID());

    const body = new URLSearchParams();
    body.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/sign/signIn?${params}`, { method: 'POST', headers, body });
    const res = await req.json() as APIReturn;

    assert(
        res.code === 10000
        || res.code === 10002
        || res.code === 0
        || res.code === 10001,
        res.msg,
    );

    return res.data as SignInResult | undefined;
};

export const getSignLog = async (cookies: string, month = new Date()): Promise<SignInLog> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');

    const params = new URLSearchParams();
    params.set('month', month.toISOString().slice(0, 7));
    params.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/sign/mySignLog?${params}`, { headers });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);

    return res.data as SignInLog;
};

export const getSignInRewardList = async (
    cookies: string,
    month = new Date(),
): Promise<SignInReward[]> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');

    const params = new URLSearchParams();
    params.set('month', month.toISOString().slice(0, 7));
    params.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/sign/signRewardList?${params}`, { headers });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);

    return res.data as SignInReward[];
};

export const getSignInReward = async (
    cookies: string,
    id: number,
    month = new Date(),
): Promise<void> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const params = new URLSearchParams();
    params.set('tempsuid', crypto.randomUUID());

    const body = new URLSearchParams();
    body.set('id', id.toString());
    body.set('month', month.toISOString().slice(0, 7));
    body.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/sign/getSignReward?${params}`, { method: 'POST', headers, body });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);
};

export const createPostComment = async (
    cookies: string,
    content: string,
    posts_id: string,
    parent_id = '0',
    root_parent = '0',
    comment_pic = '',
): Promise<void> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const params = new URLSearchParams();
    params.set('tempsuid', crypto.randomUUID());

    const body = new URLSearchParams();
    body.set('content', content);
    body.set('posts_id', posts_id);
    body.set('parent_id', parent_id);
    body.set('root_parent', root_parent);
    body.set('comment_pic', comment_pic);
    body.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/posts/comment?${params}`, { method: 'POST', headers, body });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);
};

export const createDynamic = async (
    cookies: string,
    content: string,
    scope: 1 | 2 | 3 = 1,
    pic_url = '',
): Promise<DynamicDetail> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const params = new URLSearchParams();
    params.set('tempsuid', crypto.randomUUID());

    const body = new URLSearchParams();
    body.set('content', content);
    body.set('scope', scope.toString());
    body.set('pic_url', pic_url);
    body.set('tempsuid', crypto.randomUUID());

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/dynamic/create?${params}`, { method: 'POST', headers, body });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);

    return res.data as DynamicDetail;
};

export const deleteDynamic = async (cookies: string, id: number): Promise<void> => {
    const headers = new Headers();
    headers.set('User-Agent', userAgent);
    headers.set('Cookie', cookies);
    headers.set('Referer', 'https://ff14risingstones.web.sdo.com/');
    headers.set('Content-Type', 'application/json');

    const params = new URLSearchParams();
    params.set('tempsuid', crypto.randomUUID());

    const body = JSON.stringify({ dynamic_id: id });

    const req = await fetch(`https://apiff14risingstones.web.sdo.com/api/home/dynamic/deleteDynamic?${params}`, { method: 'DELETE', headers, body });
    const res = await req.json() as APIReturn;

    assert(res.code === 10000 || res.code === 10002 || res.code === 0, res.msg);
};
