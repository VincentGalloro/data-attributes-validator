
function markStatus(id, status, newText){
    const elem = document.querySelector(`#${id}`);
    if(!elem) return;

    if(status === 'SUCCESS'){
        elem.classList.add('checklistSuccess');
    } else if(status === 'FAIL'){
        elem.classList.add('checklistFail');
    } else if(status === 'MAYBE'){
        elem.classList.add('checklistMaybe');
    }

    if(newText && elem.childNodes[1].nodeType === document.TEXT_NODE){
        elem.childNodes[1].textContent = ` ${newText}`;
    }

    const elemIndicator = elem.querySelector('img');
    if(!elemIndicator) return;

    elemIndicator.classList.remove('checklistLoad');
    if(status === "SUCCESS"){
        elemIndicator.src = 'check.png'
    } else if(status === 'FAIL'){
        elemIndicator.src = 'x.png'
    } else if(status === 'MAYBE'){
        elemIndicator.src = 'maybe.png'
    } else if(status === 'IGNORE'){
        elemIndicator.src = 'ignore.png'
    }
}

function markHeaderStatus(id, status, newText){
    const elem = document.querySelector(`#${id}`);
    if(!elem) return;

    if(status === 'SUCCESS'){
        elem.classList.add('checklistSuccess');
    } else if(status === 'FAIL'){
        elem.classList.add('checklistFail');
    } else if(status === 'MAYBE'){
        elem.classList.add('checklistMaybe');
    }

    if(newText){
        elem.innerText = newText;
    }
}

function markDataAttribute(id, value, name, isPage, required){
    if(value !== null && value !== undefined){
        markStatus(id, 'SUCCESS', `${name}: ${value}`);
    } else {
        markStatus(id, isPage ? (required ? 'FAIL' : 'MAYBE') : 'IGNORE', `${name} Not Found`);
    }
}

function updateSearch(data){
    const { isSearchPage, numResults } = data.search;
    const isPartialSearchPage = isSearchPage || numResults !== null;

    markStatus('searchContainer', isSearchPage ? 'SUCCESS' : (isPartialSearchPage ? 'FAIL' : 'IGNORE'), undefined);

    markDataAttribute('searchNumResults', numResults, 'Num Results', isPartialSearchPage, true);

    const searchPageWorking = isSearchPage && numResults !== null;

    if(searchPageWorking){
        markHeaderStatus('search', 'SUCCESS', 'Search Page Detected');
    }
    else if(isPartialSearchPage){
        markHeaderStatus('search', 'MAYBE', 'Search Page is Missing Data');
    }
    else {
        markHeaderStatus('search', 'IGNORE', undefined);
    }
}

function updateBrowse(data){
    const { isBrowsePage, numResults, filterName, filterValue } = data.browse;
    const isPartialBrowsePage = isBrowsePage || numResults !== null || filterName !== null || filterValue !== null;

    markStatus('browseContainer', isBrowsePage ? 'SUCCESS' : (isPartialBrowsePage ? 'FAIL' : 'IGNORE'), undefined);

    markDataAttribute('browseNumResults', numResults, 'Num Results', isPartialBrowsePage, true);
    markDataAttribute('filterName', filterName, 'Filter Name', isPartialBrowsePage, false);
    markDataAttribute('filterValue', filterValue, 'Filter Value', isPartialBrowsePage, false);
    
    const browsePageWorking = isBrowsePage && numResults !== null && filterName !== null && filterValue !== null;

    if(browsePageWorking){
        markHeaderStatus('browse', 'SUCCESS', 'Browse Page is Detected');
    }
    else if(isSearchPage){
        markHeaderStatus('browse', 'MAYBE', 'Browse Page is Missing Data');
    }
    else {
        markHeaderStatus('browse', 'IGNORE', undefined);
    }
}

function countHasAttribute(results, attr){
    return results.filter(i => i[attr] !== null && i[attr] !== undefined).length;
}

function updateResults(data){
    const anyResults = data.results.length > 0;
    const itemsWithName = countHasAttribute(data.results, 'itemName');
    const itemsWithVariationId = countHasAttribute(data.results, 'itemVariationId');
    const itemsWithPrice = countHasAttribute(data.results, 'itemPrice');

    if(anyResults){
        markStatus('itemId', 'SUCCESS', `${data.results.length} Items with ID`)
        markStatus('itemName', itemsWithName === data.results.length ? 'SUCCESS' : 'FAIL', `${itemsWithName} Items with Name`)
        markStatus('itemVariationId', itemsWithVariationId === data.results.length ? 'SUCCESS' : 'MAYBE', `${itemsWithVariationId} Items with Variation ID`)
        markStatus('itemPrice', itemsWithPrice === data.results.length ? 'SUCCESS' : 'MAYBE', `${itemsWithPrice} Items with Price`)
    }
    else {
        markStatus('itemId', 'IGNORE', 'No Item IDs Found')
        markStatus('itemName', 'IGNORE', 'No Item Names Found')
        markStatus('itemVariationId', 'IGNORE', 'No Item Variation IDs Found')
        markStatus('itemPrice', 'IGNORE', 'No Item Prices Found')
    }

    const itemResultsWorking = itemsWithName === data.results.length;

    if(anyResults && itemResultsWorking){
        markHeaderStatus('itemResults', 'SUCCESS', `${data.results.length} Item Results Found`);
    }
    else if(anyResults){
        markHeaderStatus('itemResults', 'FAIL', `${data.results.length} Item Results Found, Some Incomplete`)
    }
}

function updateProductDetail(data){
    const { isProductDetail } = data.productDetail;

    markStatus(
        'productDetailContainer', 
        isProductDetail ? 'SUCCESS' : 'IGNORE', 
        isProductDetail ? 'Product Detail Container Found' : undefined
    );

    markHeaderStatus(
        'productDetail',
        isProductDetail ? 'SUCCESS' : 'IGNORE',
        isProductDetail ? 'Product Detail Page Detected' : undefined,
    );
}

function generateReportUi() {
    const sections = [
        {
            id: 'search',
            name: "Search", 
            items: [
                { id: "searchContainer", name: "Search Container" }, 
                { id: "searchNumResults", name: "Num Results" },
            ]
        },
        {
            id: 'browse',
            name: "Browse", 
            items: [
                { id: "browseContainer", name: "Browse Container" }, 
                { id: "browseNumResults", name: "Num Results" },
                { id: "filterName", name: "Filter Name" },
                { id: "filterValue", name: "Filter Value" },
            ]
        },
        {
            id: 'itemResults',
            name: "Item Results",
            items: [
                { id: "itemId", name: "Item ID" },
                { id: "itemName", name: "Item Name" },
                { id: "itemVariationId", name: "Item Vatiation ID" },
                { id: "itemPrice", name: "Item Price" },
            ]
        },
        {
            id: 'productDetail',
            name: "Product Detail",
            items: [
                { id: 'productDetailContainer', name: 'Product Detail Container' }
            ]
        }
    ];

    const elem = document.querySelector('.main > div');
    const mainList = document.createElement('ul');
    mainList.classList.add('checklistContainer');
    elem.appendChild(mainList);

    for(let section of sections){
        const headerElem = document.createElement('li');
        headerElem.innerText = section.name;
        headerElem.id = section.id;

        mainList.appendChild(headerElem);

        const subList = document.createElement('ul');
        subList.classList.add('checklistContainer');

        mainList.appendChild(subList);

        for(let item of section.items){
            const itemElem = document.createElement('li');
            itemElem.id = item.id;
            // itemElem.classList.add('checklistItem');

            subList.appendChild(itemElem);

            const indicatorElem = document.createElement('img');
            indicatorElem.src = 'load.png';
            indicatorElem.className = "checklistIndicator checklistLoad";

            itemElem.appendChild(indicatorElem);

            const textElem = document.createTextNode(` ${item.name}`);

            itemElem.appendChild(textElem);
        }
    }
}

function updateUi(response){
    setTimeout(() => updateSearch(response), 400);
    setTimeout(() => updateBrowse(response), 550);
    setTimeout(() => updateResults(response), 700);
    setTimeout(() => updateProductDetail(response), 850);
}

function pingAttributes(retry){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type:"dataAttributesRunCheck"}, function(response){                         
            try { 
                if(response === undefined){
                    throw Error('Did not recieve response')
                }
                // document.querySelector('#bing').innerHTML = JSON.stringify(response);
                updateUi(response);
            }
            catch(e) {
                if(retry > 0){
                    setTimeout(() => {
                        pingAttributes(retry - 1);
                    }, 750)
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    generateReportUi();
    pingAttributes(15);
});