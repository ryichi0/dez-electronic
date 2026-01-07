const track = document.querySelector('.infinite-carousel__track');
const items = Array.from(track.children);

// clone همه آیتم‌ها
items.forEach(item => {
  track.appendChild(item.cloneNode(true));
});


const $cardsWrapper = document.querySelector('.home-products');
const $cards = document.querySelectorAll('.product');

// Pass the number of cards to the CSS because it needs it to add some extra padding.
// Without this extra padding, the last card won’t move with the group but slide over it.
const numCards = $cards.length;
$cardsWrapper.style.setProperty('--numcards', numCards);

// Each card should only shrink when it’s at the top.
// We can’t use exit on the els for this (as they are sticky)
// but can track $cardsWrapper instead.
const viewTimeline = new ViewTimeline({
	subject: $cardsWrapper,
	axis: 'block',
});

$cards.forEach(($card, index0) => {
	const index = index0 + 1;
	const reverseIndex = numCards - index0;
	const reverseIndex0 = numCards - index;

	// Scroll-Linked Animation
	$card.animate(
		{
			// Earlier cards shrink more than later cards
			transform: [ `scale(1)`, `scale(${1 - (0.1 * reverseIndex0)}`],
		},
		{
			timeline: viewTimeline,
			fill: 'forwards',
			rangeStart: `exit-crossing ${CSS.percent(index0 / numCards * 100)}`,
			rangeEnd: `exit-crossing ${CSS.percent(index / numCards * 100)}`,
		}
	);
});

