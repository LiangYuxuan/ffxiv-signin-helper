import {
    getLoginInfo, getCharacterBindInfo, doSignIn, getSignLog, getSignInRewardList, getSignInReward,
    createPostComment, createDynamic, deleteDynamic,
} from './api.ts';
import logger from './logger.ts';

export default async (cookies: string) => {
    await getLoginInfo(cookies);

    const characterInfo = await getCharacterBindInfo(cookies);
    if (characterInfo.isSign !== 1) {
        logger.info('今天尚未签到');

        const signInResult = await doSignIn(cookies);

        if (signInResult) {
            logger.info(`签到成功：连续签到${signInResult.continuousDays.toString()}天，获得${signInResult.sqExp.toString()}经验`);
        } else {
            logger.info('今天已签到');
        }

        await new Promise((resolve) => { setTimeout(resolve, 5000); });
    } else {
        logger.info('今天已签到');
    }

    await getSignLog(cookies);

    const signInReward = await getSignInRewardList(cookies);
    const pendingReward = signInReward.filter((item) => item.is_get === 0);
    const incompleteReward = signInReward.filter((item) => item.is_get === -1);

    logger.info(`尚有${pendingReward.length.toString()}个签到奖励待领取`);
    logger.info(`尚有${incompleteReward.length.toString()}个签到奖励未完成`);

    if (pendingReward.length > 0) {
        await Promise.all(pendingReward
            .map(async (item) => {
                logger.info(`领取签到奖励：${item.item_name}`);

                try {
                    await getSignInReward(cookies, item.id);
                    logger.info(`领取成功：${item.item_name}`);
                } catch (err) {
                    logger.error(`领取失败：${(err as Error).message}`);
                }
            }));

        await new Promise((resolve) => { setTimeout(resolve, 5000); });
    }

    // XXX: 目前官方水贴已失效
    for (let i = 0; i < 0; i += 1) {
        const content = '<p><span class="at-emo">[emo1]</span>&nbsp;</p>';
        const postID = '9365';

        logger.info(`水贴发表评论（${(i + 1).toString()} / 5）`);

        // eslint-disable-next-line no-await-in-loop
        await createPostComment(cookies, content, postID);

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => { setTimeout(resolve, 5000); });
    }

    for (let i = 0; i < 5; i += 1) {
        const content = '<p><span class="at-emo">[emo1]</span>&nbsp;</p>';

        logger.info(`发表动态并删除（${(i + 1).toString()} / 5）`);

        logger.info(`发表动态（${(i + 1).toString()} / 5）`);

        // eslint-disable-next-line no-await-in-loop
        const data = await createDynamic(cookies, content);

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => { setTimeout(resolve, 5000); });

        logger.info(`删除动态（${(i + 1).toString()} / 5）`);

        // eslint-disable-next-line no-await-in-loop
        await deleteDynamic(cookies, data.id);

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => { setTimeout(resolve, 5000); });
    }
};
