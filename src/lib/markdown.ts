import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

export async function renderMarkdown(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize) // Sanitize to prevent XSS
    .use(rehypeStringify)
    .process(markdown)

  return String(result)
}

export async function getMarkdownContent(
  tenantId: string,
  key: string,
  locale: string = 'es-CO'
): Promise<string | null> {
  const { prisma } = await import('./prisma')
  
  const content = await prisma.markdownContent.findUnique({
    where: {
      tenantId_key_locale: {
        tenantId,
        key,
        locale,
      },
    },
  })

  if (!content) {
    return null
  }

  return renderMarkdown(content.content)
}
