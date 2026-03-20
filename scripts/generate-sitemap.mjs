/**
 * 빌드 타임 sitemap.xml 생성 스크립트
 *
 * 현재 공개 라우트 기준의 정적 sitemap.xml을 생성한다.
 *
 * 실행: node scripts/generate-sitemap.mjs
 */

import { writeFileSync } from 'fs'

const SITE_URL = 'https://ohbang-it.kr'
const TODAY = new Date().toISOString().split('T')[0]

const STATIC_URLS = [
    {
        loc: `${SITE_URL}/`,
        lastmod: TODAY,
        changefreq: 'hourly',
        priority: '1.0',
    },
    {
        loc: `${SITE_URL}/tournament/overwatch-vs-talon`,
        lastmod: '2026-03-13',
        changefreq: 'monthly',
        priority: '0.7',
    },
]

function buildXml(urls) {
    const entries = urls
        .map(({ loc, lastmod, changefreq, priority }) =>
            [
                '    <url>',
                `        <loc>${loc}</loc>`,
                `        <lastmod>${lastmod}</lastmod>`,
                `        <changefreq>${changefreq}</changefreq>`,
                `        <priority>${priority}</priority>`,
                '    </url>',
            ].join('\n'),
        )
        .join('\n')

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        entries,
        '</urlset>',
    ].join('\n')
}

async function main() {
    const xml = buildXml(STATIC_URLS)

    writeFileSync('public/sitemap.xml', xml, 'utf-8')

    console.log(`[sitemap] 생성 완료 — 총 ${STATIC_URLS.length}개 URL`)
    STATIC_URLS.forEach((url) => console.log(`  + ${url.loc}`))
}

main().catch((err) => {
    console.error('[sitemap] 예상치 못한 오류:', err)
    process.exit(1)
})
