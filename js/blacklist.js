var BLACKLIST = [
	'a',
	'the',
	'is',
	'it',
	'to',
	'and',
	'of',
	'nor',
	'but',
	'or',
	'yet',
	'so',
	'in',
	'I'
];

function isBlacklisted(word)
{
	return $.inArray(word, BLACKLIST);
}

function wordType(word)
{	
	if (isNoun())
		return "noun";
	else if (isVerb())
		return "verb";

	return "unknown";
}

function isNoun()
{
	prevWord = $($(".word")[INDEX - 2]).text();
	if (prevWord === "a" || prevWord === "an" || prevWord === "the")
		return true;
	else
		return false;
}

function isVerb()
{
	prevWord = $($(".word")[INDEX - 2]).text();
	if (prevWord === "to")
		return true;
	else
		return false;
}
