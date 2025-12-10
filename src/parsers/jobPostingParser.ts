import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ExtractedJobData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  rawText: string;
}

export class JobPostingParser {
  /**
   * Fetch and parse job posting from URL
   */
  static async parseFromUrl(url: string): Promise<ExtractedJobData> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      return this.parseHtml(response.data, url);
    } catch (error) {
      throw new Error(`Failed to fetch URL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Parse job posting from plain text
   */
  static parseFromText(text: string, title?: string): ExtractedJobData {
    const requirements = this.extractSection(text, ['requirements', 'qualifications', 'required skills']);
    const responsibilities = this.extractSection(text, ['responsibilities', 'what you\'ll do', 'key duties']);
    const benefits = this.extractSection(text, ['benefits', 'perks', 'what we offer']);

    return {
      title: title || 'Unspecified Position',
      company: 'Not specified',
      description: text,
      requirements,
      responsibilities,
      benefits,
      rawText: text
    };
  }

  /**
   * Parse HTML content from job posting
   */
  private static parseHtml(html: string, _url: string): ExtractedJobData {
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style').remove();

    const text = $.text();
    const title = $('h1, .job-title, [data-job-title]').first().text().trim() || 'Job Position';
    const company = $('[data-company], .company-name, .company').first().text().trim() || 'Company';

    const requirements = this.extractSection(text, ['requirements', 'qualifications', 'required skills', 'must have']);
    const responsibilities = this.extractSection(text, ['responsibilities', 'what you\'ll do', 'key duties', 'about the role']);
    const benefits = this.extractSection(text, ['benefits', 'perks', 'what we offer']);

    return {
      title,
      company,
      description: text,
      requirements,
      responsibilities,
      benefits,
      rawText: html
    };
  }

  /**
   * Extract a section of text based on common headers
   */
  private static extractSection(text: string, headers: string[]): string[] {
    const lines = text.split('\n');
    const items: string[] = [];
    let inSection = false;

    for (const line of lines) {
      const trimmedLine = line.toLowerCase().trim();

      // Check if this line contains a section header
      if (headers.some(h => trimmedLine.includes(h))) {
        inSection = true;
        continue;
      }

      // Stop if we hit another section
      if (inSection && trimmedLine.match(/^[a-z\s]+:/i) && !headers.some(h => trimmedLine.includes(h))) {
        break;
      }

      // Collect bullet points and lines
      if (inSection && trimmedLine.length > 0 && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*'))) {
        items.push(line.replace(/^[\s•\-*]+/, '').trim());
      }
    }

    return items.filter(item => item.length > 0);
  }
}
