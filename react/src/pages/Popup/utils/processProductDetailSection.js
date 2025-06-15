// Handles the Product Detail section logic for processResponseData
export function processProductDetailSection(data, checklist) {
  const { isProductDetail } = data.productDetail;
  const productDetailSection = checklist.find(s => s.id === 'productDetail');
  productDetailSection.items[0].status = isProductDetail ? 'SUCCESS' : 'IGNORE';
  productDetailSection.items[0].text = isProductDetail ? 'Product Detail Container Found' : null;
  productDetailSection.status = isProductDetail ? 'SUCCESS' : 'IGNORE';
  productDetailSection.headerText = isProductDetail ? 'Product Detail Page Detected' : null;
}
