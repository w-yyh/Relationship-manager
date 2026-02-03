export const TAG_CATEGORIES = {
    EXTERNAL: {
        id: 'EXTERNAL',
        label: '外部协作网络',
        description: '功能性关系',
        color: '#10b981', // green-500
        tags: [
            {
                id: 'life_experience',
                label: '生活体验圈',
                desc: '滋养身心，拓展视野',
                example: '吃喝玩乐、美食、旅行、艺术、运动'
            },
            {
                id: 'resource_pool',
                label: '专业资源池',
                desc: '解决问题，保障生活',
                example: '医疗/教育/法律（法律顾问、家庭医生、教育人脉）'
            },
            {
                id: 'info_exchange',
                label: '信息交换站',
                desc: '链接多元，保持敏锐',
                example: '朋友圈多样性（跨行业的盟友、不同年龄段的忘年交）'
            }
        ]
    },
    INTERNAL: {
        id: 'INTERNAL',
        label: '内部驱动核心',
        description: '成长性关系',
        color: '#f43f5e', // rose-500
        tags: [
            {
                id: 'value_foundation',
                label: '价值基石',
                desc: '事业的根本与支柱',
                example: '老板上司、合伙人/团队成员、重要客户'
            },
            {
                id: 'growth_engine',
                label: '成长引擎',
                desc: '探索人生更多可能性',
                example: '相关人脉、新技能导师、转型跨界/合作、投资人'
            },
            {
                id: 'influence_field',
                label: '影响力磁场',
                desc: '放大个人的价值',
                example: '能为你提供借势机会的人、内容创作/作品背书、公开演讲/媒体资源'
            },
            {
                id: 'wisdom_ally',
                label: '智慧同盟',
                desc: '为人生的导航护航',
                example: '从单向“智囊”到双向“同盟”（人生导师、专业教练、同行者）'
            },
            {
                id: 'emotional_harbor',
                label: '情感港湾',
                desc: '提供情感慰藉与支持',
                example: '从“家庭”到“亲密关系”（灵魂伴侣、核心挚友、家庭支持）'
            }
        ]
    }
};

export function getTagById(tagId) {
    for (const catKey in TAG_CATEGORIES) {
        const tag = TAG_CATEGORIES[catKey].tags.find(t => t.id === tagId);
        if (tag) return { ...tag, categoryId: TAG_CATEGORIES[catKey].id, color: TAG_CATEGORIES[catKey].color };
    }
    return null;
}
