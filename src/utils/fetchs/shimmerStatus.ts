export function revealShimmer(){
    document.getElementById('navigate-shimmer')?.classList.add('shimmering');
}

export function hideShimmer(){
    document.getElementById('navigate-shimmer')?.classList.remove('shimmering');
}