// Simple Portable Text → HTML serializer
// Handles standard blocks: paragraphs, headings, lists, marks (bold, italic, link)

type PTSpan = {
  _type: 'span'
  text: string
  marks?: string[]
}

type PTBlock = {
  _type: 'block'
  style?: string
  listItem?: string
  level?: number
  markDefs?: Array<{ _key: string; _type: string; href?: string }>
  children?: PTSpan[]
}

type PTNode = PTBlock | { _type: string; [key: string]: unknown }

function serializeSpans(spans: PTSpan[], markDefs: PTBlock['markDefs'] = []): string {
  return spans
    .map((span) => {
      let text = span.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const marks = span.marks ?? []
      for (const mark of marks) {
        if (mark === 'strong') text = `<strong>${text}</strong>`
        else if (mark === 'em') text = `<em>${text}</em>`
        else if (mark === 'underline') text = `<u>${text}</u>`
        else if (mark === 'code') text = `<code>${text}</code>`
        else {
          // Could be a markDef key (e.g. link)
          const def = markDefs?.find((d) => d._key === mark)
          if (def?._type === 'link' && def.href) {
            text = `<a href="${def.href}" target="_blank" rel="noopener noreferrer">${text}</a>`
          }
        }
      }
      return text
    })
    .join('')
}

export function portableTextToHtml(blocks: unknown[]): string {
  if (!Array.isArray(blocks)) return ''

  const html: string[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i] as PTNode

    if (block._type === 'image' && (block.url || (block.asset as { url?: string })?.url)) {
      const src = (block.url as string) || (block.asset as { url?: string })?.url || ''
      const alt = (block.alt as string) ?? ''
      html.push(`<img src="${src}" alt="${alt}" style="width:100%;border-radius:8px;margin:16px 0 24px">`)
      i++
      continue
    }

    if (block._type === 'faqItem') {
      const q = (block.question as string) ?? ''
      const a = (block.answer as string) ?? ''
      const qEsc = q.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const aEsc = a.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      html.push(`<details><summary>${qEsc}</summary><p>${aEsc}</p></details>`)
      i++
      continue
    }

    if (block._type !== 'block') {
      i++
      continue
    }

    const b = block as PTBlock
    const style = b.style ?? 'normal'
    const children = b.children ?? []
    const markDefs = b.markDefs ?? []
    const inner = serializeSpans(children, markDefs)

    // List handling — group consecutive list items
    if (b.listItem) {
      const tag = b.listItem === 'bullet' ? 'ul' : 'ol'
      const items: string[] = [`<li>${inner}</li>`]
      while (
        i + 1 < blocks.length &&
        (blocks[i + 1] as PTBlock)._type === 'block' &&
        (blocks[i + 1] as PTBlock).listItem === b.listItem
      ) {
        i++
        const next = blocks[i] as PTBlock
        const nextInner = serializeSpans(next.children ?? [], next.markDefs ?? [])
        items.push(`<li>${nextInner}</li>`)
      }
      html.push(`<${tag}>${items.join('')}</${tag}>`)
      i++
      continue
    }

    switch (style) {
      case 'h1': html.push(`<h1>${inner}</h1>`); break
      case 'h2': html.push(`<h2>${inner}</h2>`); break
      case 'h3': html.push(`<h3>${inner}</h3>`); break
      case 'h4': html.push(`<h4>${inner}</h4>`); break
      case 'blockquote': html.push(`<blockquote>${inner}</blockquote>`); break
      default: html.push(inner ? `<p>${inner}</p>` : '<br>'); break
    }
    i++
  }

  return html.join('\n')
}
