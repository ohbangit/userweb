/**
 * 빌드 타임 sitemap.xml 생성 스크립트
 *
 * 동작:
 *   1. GET /api/tournaments 호출 → 활성 대회 slug 수집
 *   2. 정적 URL + 동적 대회 URL 합쳐 public/sitemap.xml 생성
 *
 * 실행: node scripts/generate-sitemap.mjs
 * API 호출 실패 시 기본 sitemap(루트 URL만)으로 폴백
 */

import { writeFileSync } from 'fs'

const SITE_URL = 'https://ohbang-it.kr'
const API_BASE = process.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
const TODAY = new Date().toISOString().split('T')[0]

async function fetchTournaments() {
    try {
        const res = await fetch(`${API_BASE}/api/tournaments`)
        if (!res.ok) {
            console.warn(
                `[sitemap] 대회 목록 조회 실패 (HTTP ${res.status}) — 루트 URL만 생성`,
            )
            return []
        }
        const data = await res.json()
        return data.tournaments ?? []
    } catch (err) {
        console.warn(
            `[sitemap] API 호출 오류 — 루트 URL만 생성\n  ${err.message}`,
        )
        return []
    }
}

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
    const tournaments = await fetchTournaments()

    const staticUrls = [
        {
            loc: `${SITE_URL}/`,
            lastmod: TODAY,
            changefreq: 'hourly',
            priority: '1.0',
        },
    ]

    const tournamentUrls = tournaments.map((t) => ({
        loc: `${SITE_URL}/tournament/${t.slug}`,
        lastmod: t.endedAt ? t.endedAt.split('T')[0] : TODAY,
        changefreq: t.isActive ? 'daily' : 'monthly',
        priority: t.isActive ? '0.9' : '0.7',
    }))

    const allUrls = [...staticUrls, ...tournamentUrls]
    const xml = buildXml(allUrls)

    writeFileSync('public/sitemap.xml', xml, 'utf-8')

    console.log(
        `[sitemap] 생성 완료 — 총 ${allUrls.length}개 URL (대회: ${tournamentUrls.length}개)`,
    )
    tournamentUrls.forEach((u) => console.log(`  + ${u.loc}`))
}

main().catch((err) => {
    console.error('[sitemap] 예상치 못한 오류:', err)
    process.exit(1)
})
