import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts and styles
    $('script, style, nav, footer').remove();

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 2000);

    return NextResponse.json({
      title,
      description,
      h1,
      text: bodyText
    });
  } catch (error: any) {
    console.error('Scrape error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
