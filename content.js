console.log('bingus');

function cqs(name){
    return document.querySelector(`[data-cnstrc-${name}]`)
}

function cqsa(name){
    return document.querySelectorAll(`[data-cnstrc-${name}]`)
}

function cqsd(elem, name){
    return elem && elem.dataset && elem.dataset[`cnstrc${name}`]
}

function checkSearch(){
    const search = cqs('search');
    const numResults = cqsd(search, 'NumResults');

    return { isSearchPage: !!search, numResults };
}

function checkBrowse(){
    const browse = cqs('browse');
    const numResults = cqsd(browse, 'NumResults');
    const filterName = cqsd(browse, 'FilterName');
    const filterValue = cqsd(browse, 'FilterValue');

    return { isBrowsePage: !!browse, numResults, filterName, filterValue }
}

function checkResult(elem){
    const itemId = cqsd(elem, 'ItemId');
    const itemName = cqsd(elem, 'ItemName');
    const itemVariationId = cqsd(elem, 'ItemVariationId');
    const itemPrice = cqsd(elem, 'ItemPrice');

    return { itemId, itemName, itemVariationId, itemPrice }
}

function checkProductDetail(){
    const productDetail = cqs('product-detail');

    return { isProductDetail: !!productDetail }
}

function checkResults(){
    const items = cqsa('item-id');

    return Array.from(items).map(checkResult)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.type === 'dataAttributesRunCheck'){
        const data = {
            search: checkSearch(),
            browse: checkBrowse(),
            results: checkResults(),
            productDetail: checkProductDetail(),
        };
        sendResponse(data);
        return true;
    }
});