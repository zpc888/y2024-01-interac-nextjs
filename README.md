A quick dirty Next JS project to test [Interac IVC](https://portal.pp.vids.dev/auth/sign-in) integration.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### POC #1 - Interac IVC Integration
Open [Interac](http://localhost:3000/interac) with your browser to see the result.

### POC #2 - CSS display, position and float properties
Open [CSS Display, Position, Float Properties](http://localhost:3000/css-display-position-float.html) with your browser to see the result.

- **Position** determines in what manner n item is positioned on the page or relative to one another. 
By default, it is set to **static**, with elements displaying on the page in the order they appear in the document.
  - **static** -- Element displays on the page in the order it appeared in the document. Top, right, bottom, left and z-index properties have no effect when used with static. Not stackable due to z-index restrictions.
  - **relative** -- Similar to static but able to be offset by top, right, bottom, left and z-index properties.
  - **absolute** -- Element positioned relative to its first non-static ancestor element. Similar to relative in that it may be offset by top, right, bottom, left, and z-index properties.
  - **fixed** -- Similar to absolute, but positioned relative to the browser window. Scrolling will not move this element.
  - **sticky** -- Element is positioned relative until a specified offset position is met by scrolling, then the element is positioned 'fixed' in that position on the scrolling element.
- **Display** specifies the type of rendering box that is created from our HTML. A html element on the page is rendered as a box. Position property is to how to position those boxes, display property is for the type of rendering.
  - **block** -- Element starts on a new line and take up the entire width. By default, div, p, h1-h6, ui, li and canavas are block-type of rendering. But they can be changed to different display type.
  - **inline** -- Element can start anywhere on an existing line. Height and width properties have no effects. By default, span, input, button and img are in inline displayed.
  - **inline-block** -- Element is displayed inline but height and width may be defined.
  - **none** -- Removes this element and all children (different from visibility property -- which still take up space on the page)
  - **flex** -- Element is displayed block-level with inner content in flexbox layout.
  - **grid** -- Element is displayed block-level with inner content in grid layout.
- **Float** float default is to none, setting to left or right 'floats' an element to the left or right of a container respectively, wrapping the rest of the content around it.

