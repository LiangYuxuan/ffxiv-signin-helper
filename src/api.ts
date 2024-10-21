import assert from 'node:assert';
import got from 'got';

const UserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

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

export const getLoginInfo = async (cookies: string): Promise<LoginInfo> => {
    const result: APIReturn = await got.get('https://apiff14risingstones.web.sdo.com/api/home/GHome/isLogin', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);

    return result.data as LoginInfo;
};

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

export const getCharacterBindInfo = async (cookies: string): Promise<CharacterInfo> => {
    const result: APIReturn = await got.get('https://apiff14risingstones.web.sdo.com/api/home/groupAndRole/getCharacterBindInfo', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            platform: 1,
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);

    return result.data as CharacterInfo;
};

interface SignInResult {
    sqMsg: string,
    continuousDays: number,
    totalDays: string,
    sqExp: number,
    shopExp: number,
}

export const doSignIn = async (cookies: string): Promise<SignInResult | undefined> => {
    const result: APIReturn = await got.post('https://apiff14risingstones.web.sdo.com/api/home/sign/signIn', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            tempsuid: crypto.randomUUID(),
        },
        form: {
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(
        result.code === 10000
        || result.code === 10002
        || result.code === 0
        || result.code === 10001,
        result.msg,
    );

    return result.data as SignInResult | undefined;
};

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

export const getSignLog = async (cookies: string, month = new Date()): Promise<SignInLog> => {
    const result: APIReturn = await got.get('https://apiff14risingstones.web.sdo.com/api/home/sign/mySignLog', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            month: month.toISOString().slice(0, 7),
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);

    return result.data as SignInLog;
};

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

export const getSignInRewardList = async (
    cookies: string,
    month = new Date(),
): Promise<SignInReward[]> => {
    const result: APIReturn = await got.get('https://apiff14risingstones.web.sdo.com/api/home/sign/signRewardList', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            month: month.toISOString().slice(0, 7),
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);

    return result.data as SignInReward[];
};

export const getSignInReward = async (
    cookies: string,
    id: number,
    month = new Date(),
): Promise<void> => {
    const result: APIReturn = await got.post('https://apiff14risingstones.web.sdo.com/api/home/sign/getSignReward', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            tempsuid: crypto.randomUUID(),
        },
        form: {
            id,
            month: month.toISOString().slice(0, 7),
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);
};

interface PostCommentDetail {
    id: string,
    children_count: string,
    mask_content: string,
    comment_pic: string,
    uuid: string,
    character_name: string,
    area_name: string,
    group_name: string,
    created_at: string,
    ip_location: string,
    posts_id: string,
    like_count: string,
    avatar: string,
    test_limited_badge: number,
    posts2_creator_badge: number,
    collapse_badge: number,
    admin_tag: number,
    is_posts_author: number,
    is_like: number,
    is_mine: number,
}

interface PostCommentsResult {
    pageTime: string,
    rows: PostCommentDetail[],
}

export const getPostComments = async (
    cookies: string,
    id: string,
    order: 'latest' | 'hottest' | 'earliest',
    page = 1,
    limit = 10,
    onlyLandlord: 0 | 1 = 0,
): Promise<PostCommentDetail[]> => {
    const result: APIReturn = await got.get('https://apiff14risingstones.web.sdo.com/api/home/posts/postsCommentDetail', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            id,
            order,
            page,
            limit,
            onlyLandlord,

            pageTime: '',

            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);

    const data = result.data as PostCommentsResult;
    return data.rows;
};

export const createPostComment = async (
    cookies: string,
    content: string,
    posts_id: string,
    parent_id = '0',
    root_parent = '0',
    comment_pic = '',
): Promise<void> => {
    const result: APIReturn = await got.post('https://apiff14risingstones.web.sdo.com/api/home/posts/comment', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            tempsuid: crypto.randomUUID(),
        },
        form: {
            content,
            posts_id,
            parent_id,
            root_parent,
            comment_pic,
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);
};

export const createPostLike = async (cookies: string, type: string, id: string): Promise<void> => {
    const result: APIReturn = await got.post('https://apiff14risingstones.web.sdo.com/api/home/posts/like', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            tempsuid: crypto.randomUUID(),
        },
        form: {
            type,
            id,
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);
};

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

export const createDynamic = async (
    cookies: string,
    content: string,
    scope: 1 | 2 | 3 = 1,
    pic_url = '',
): Promise<DynamicDetail> => {
    const result: APIReturn = await got.post('https://apiff14risingstones.web.sdo.com/api/home/dynamic/create', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            tempsuid: crypto.randomUUID(),
        },
        form: {
            content,
            scope,
            pic_url,
            tempsuid: crypto.randomUUID(),
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);

    return result.data as DynamicDetail;
};

export const deleteDynamic = async (cookies: string, id: number): Promise<void> => {
    const result: APIReturn = await got.delete('https://apiff14risingstones.web.sdo.com/api/home/dynamic/deleteDynamic', {
        headers: {
            'User-Agent': UserAgent,
            Cookie: cookies,
            Referer: 'https://ff14risingstones.web.sdo.com/',
        },
        searchParams: {
            tempsuid: crypto.randomUUID(),
        },
        json: {
            dynamic_id: id,
        },
    }).json();

    assert(result.code === 10000 || result.code === 10002 || result.code === 0, result.msg);
};
