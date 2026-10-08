/** Minimal Lexical paragraph used for service FAQ answers. */
export function lexicalText(text: string, direction: 'ltr' | 'rtl' = 'ltr') {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction,
          format: '' as const,
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
