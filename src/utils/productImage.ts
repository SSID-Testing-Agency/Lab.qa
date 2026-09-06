export function getProductImageSrc(base: string, image: string, isBroken: boolean) {
  // This resource must stay absent: the exercise relies on the browser's real image error state.
  return isBroken
    ? `${base}images/products/missing-product-image.png`
    : `${base}${image}`
}
