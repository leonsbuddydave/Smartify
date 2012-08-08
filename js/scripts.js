var API_KEY = "35fbda6a6a8ee348718c74517b1cccd1";
var INDEX = -1;
var MAX_SUGGEST = 10;

$(document).ready(function()
{
	$("#smartify").click(smartify);
});

function smartify()
{
	fullText = buildWordOutput($("#essayinput").val());
	$("#result").html(fullText);
	$(".word").click(function()
	{
		$($(".word")[INDEX - 1]).css( { "background-color" : "#ffffff" } );
		INDEX = $(this).index();
		next();
	});
	animateBoxes(next);
}

function evalWords()
{
	$(".word").each(function(i, val)
	{
		highlight(this);
		word = $(this).text();
	});
}

function next()
{
	$($(".word")[INDEX - 1]).css( { "background-color" : "#ffffff" } );
	obj = $(".word")[INDEX++];
	if (!isBlacklisted($(obj).text()))
	{
		next();
	}
	else
	{
		findSynonyms($(obj).text());
		highlight(obj);
	}
}

function highlight(obj)
{
	$(obj).css( { "background-color" : "#ffff00" } );
	$("#highlighter").stop().animate( { "top" : obj.offsetTop + obj.offsetHeight, "left" : obj.offsetLeft }, 500 );
}

function cleanupWord(word)
{
	
}

function findSynonyms(word)
{
	$("#highlighter").html("<img src='loading.gif?b=1' />");
	$.ajax({
		type: "GET",
		url: "http://words.bighugelabs.com/api/2/" + API_KEY + "/" + word + "/json?callback=?",
		processData : true,
		data: {},
		dataType: "json",
		success:
			function(data)
			{
				total = 0;
				list = "<ul>"

				list += "<li><b>" + $($(".word")[INDEX - 1]).text() + "</b></li>";

				type = wordType($($(".word")[INDEX - 1]).text());

				if (type !== "unknown" && data[type]["syn"] !== undefined)
				{
					$.each(data[type]["syn"], function(index, value)
					{
						list += "<li>" + value + "</li>";
						total++;
					});
				}
				else
				{
					$.each(data, function(index, value)
					{
						list += "<span class='title'>" + index + "</span><br />";
						if (value["syn"] !== undefined)
						{
							$.each(value["syn"], function(index, value)
							{
								list += "<li>" + value + "</li>";
								total++;
							});
						}
					});
				}

				console.log("The total is " + total);
				if (total === 0)
				{
					next();
				}

				list += "</ul>";
				$("#highlighter").html(list);
				$("#highlighter").find("li").click(pick);
			},
		error:
			function(x, y, z)
			{
				$("#highlighter").html("");
				next();
			}});
}

function pick(e)
{
	choice = $(this).text();
	$($(".word")[INDEX - 1]).text(choice);
	next();
}

function buildWordOutput(fullText)
{
	allWords = fullText.split(" ");
	for (i = 0; i < allWords.length; i++)
	{
		allWords[i] = "<span class='word'>" + allWords[i] + "</span> ";
	}
	return allWords.join('');
}

function animateBoxes(callback)
{
	$("#essayinput").slideUp(400, function()
	{
		$("#result").slideDown(400, callback);
	});
}
