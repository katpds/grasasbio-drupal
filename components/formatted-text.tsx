import Image from "next/image"
import { HTMLReactParserOptions, domToReact, DOMNode } from "html-react-parser"
import { Element } from "domhandler"
import parse from "html-react-parser"

import { isRelative } from "lib/utils/is-relative"
import Link from "next/link"
import { absoluteURL } from "lib/utils/absolute-url"

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element) {
      if (domNode.name === "img") {
        const { src, alt="Image description", width = "100", height = "100" } = domNode.attribs

        if (isRelative(src)) {
          return (
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${src}`}
              width={parseInt(width, 10)}
              height={parseInt(height, 10)}
              alt={alt}
              layout="intrinsic"
              objectFit="cover"
            />
          )
        }
      }

      if (domNode.name === "a") {
        const { href, class: className } = domNode.attribs

        if (href && isRelative(href)) {
          return (
            <Link href={href} passHref>
              <a className={className}>{domToReact(domNode.children as DOMNode[])}</a>
            </Link>
          )
        }
      }

      if (domNode.name === "input") {
        if (domNode.attribs.value === "") {
          delete domNode.attribs.value
        }

        return domNode
      }
    }
  },
}

interface FormattedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  format?: string
  processed: string
  value?: string
}

export function FormattedText({ processed, ...props }: FormattedTextProps) {
  return (
    <div data-cy="node--body" {...props}>
      {parse(processed, options)}
    </div>
  )
}

const MyComponent = ({ node }) => {
  return(
    <>
    {node.body?.summary ? <p>{node.body.summary}</p>: null}
    {node.field_image?.uri && (
      <Image 
      src={absoluteURL(node.field_image.uri.url)}
        width={1200}
        height={600}
        alt={node.field_image.alt || 'Image description'}
      />
    )}
    </>
  )
}

export default MyComponent;