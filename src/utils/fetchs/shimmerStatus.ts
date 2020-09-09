export function revealShimmer(specifiedId: string = 'navigate-shimmer') {
    document.getElementById(specifiedId)?.classList.add('shimmering');
}

export function hideShimmer(specifiedId: string = 'navigate-shimmer') {
    document.getElementById(specifiedId)?.classList.remove('shimmering');
}