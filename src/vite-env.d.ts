/// <reference types="vite/client" />

declare module "*.svg" {
  const src: string
  export default src
}

declare module "*.svg?url" {
  const src: string
  export default src
}

declare module "*.svg?component" {
  import React from "react"
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export { ReactComponent }
  export default ReactComponent
}
