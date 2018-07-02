(function($) {
    $.fn.stacktack = function(opts) {
        var options = $.extend($.fn.stacktack.defaults, opts);
        // a list of options suitable for per-item overrides, lowercase for comparison
        var optionKeys = ['width', 'onlyshowacceptedanswer', 'answerlimit', 'filteranswers', 'showtags'];
        
        if (options.stylesheet) {
            // only include the stylesheet once
            if ($('link[href="' + options.stylesheet + '"]').length === 0) {
                // necessary for IE to dynamically load stylesheet
                if (document.createStyleSheet) {
                    document.createStyleSheet(options.stylesheet);
                } else {
               //     $('<link rel="stylesheet" type="text/css" href="' + options.stylesheet + '" />').appendTo('head'); 
                }
            }
        }
        
        function createProfile(user) {
            if (user) {
                return '<div class="stacktack-profile"><a href="http://' + options.site + '/users/' + user.user_id  + '" target="_blank">' + user.display_name + '</a></div>';
            } else {
                return '';
            }
        }
        
        return this.each(function() {
            var $this = $(this);
            $this.filter('[id^=stacktack], [class^=stacktack]').add($this.find('[id^=stacktack], [class^=stacktack]')).each(function(index, value) {
                var item = $(value);
                // try to retrieve the question id from the id attribute
                var questionId = '';
                if (value.id) {
                    var matches = /\d+$/.exec(value.id);
                    if (matches.length > 0) {
                        questionId = matches[0];
                    }
                }

                // parse override options from classes
                var itemOptions = $.extend({}, options);
                var classAttr = item.attr('class');
                if (classAttr && classAttr.length) {
                    classes = item.attr('class').split(' ');
                    for (var i = 0; i < classes.length; i++) {
                        clas = classes[i];
                        classTokens = clas.split('-');
                        // if there was a split
                        if (classTokens.length > 1) {
                            // search for a stacktack id class and use if it if the questionId hasn't been set yet
                            if (classTokens[0].toLowerCase() == 'stacktack') {
                                questionId = classTokens[1];
                                continue;
                            }
                            
                            // convert special value strings
                            for (var j = 1; j < classTokens.length; j++) {
                                classToken = classTokens[j].toLowerCase();
                                // replace booleans
                                if (classToken === 'true' || classToken === 'false') {
                                    classTokens[j] = (classToken==="true");
                                    continue;
                                }
                                // replace percentages since the % is not a valid class name character
                                classTokens[j] = classToken.replace(/percent/i, '%');
                            }
                            // if the first token of the class is an override option
                            if ($.inArray(classTokens[0].toLowerCase(), optionKeys) > -1) {
                                // it's a list
                                if (classTokens.length > 2 || classTokens[0].toLowerCase() == 'filteranswers') {
                                    itemOptions[classTokens[0]] = classTokens.slice(1);
                                }
                                // it's a single value
                                else {
                                    itemOptions[classTokens[0]] = classTokens[1];
                                }
                            }
                        }
                    }
                }
                // appended as last step
                var containerElement = $('<div class="stacktack-container"></div>');
                if (itemOptions.width) {
                    containerElement.css('width', itemOptions.width);
                }
                
                var contentElement = $('<div class="stacktack-content"></div>');
                containerElement.append(contentElement);
                var loadingElement = $('<p class="stacktack-loading">Loading Question ID ' + questionId + '</p>');
                contentElement.append(loadingElement);
                var questionURL = 'https://api.stackexchange.com/' + options.apiVersion + '/questions/' + questionId + '?site=' + options.site + '&filter=withbody';
                var answersURL = 'https://api.stackexchange.com/' + options.apiVersion + '/questions/' + questionId + '/answers/?site=' + options.site + '&filter=withbody';
                console.log(questionURL)

                $.ajax({
                    dataType: 'jsonp',
                    url: questionURL,
                    success: function(data) {
                        loadingElement.remove();
                        
                        var question = data.items[0];

                        var questionElement = $('<div class="stacktack-question"> <div class="stacktack-question-header clearfix">' + createProfile(question.owner) + '<h3><a href="http://' + options.site + '/questions/' + question.question_id + '" target="_blank">' + question.title + '</a></h3></div><div class="stacktack-question-body">' + question.body + '</div></div>');
                        contentElement.append(questionElement);

                        if (itemOptions.showTags) {
                            var tagsElement = $('<ul class="stacktack-tags"></ul>');
                            for (var i = 0; i < question.tags.length; i++) {
                                var tagElement = $('<li>' + question.tags[i] + '</li>');
                                tagsElement.append(tagElement);
                            }
                            questionElement.append(tagsElement);
                        }

                        var answersElement = $('<div class="stacktack-answers"></div>');
                        contentElement.append(answersElement);

                        // filter the answers
                        var visibleAnswers = [];
                        if (question.answer_count > 0) {
                            $.ajax({
                                dataType: 'jsonp',
                                url: answersURL,
                                success: function(data){
                                    if (itemOptions.onlyShowAcceptedAnswer) {
                                        for (var i = 0; i < data.items.length; i++) {
                                            if (data.items[i].is_accepted) {
                                                visibleAnswers.push(i);
                                            }
                                        }
                                    }
                                    else if (itemOptions.filterAnswers.length > 0) {
                                        for (var i = 0; i < data.items.length; i++) {
                                            if ($.inArray(data.items[i].answer_id.toString(), itemOptions.filterAnswers) > -1) {
                                                visibleAnswers.push(i);
                                            }
                                        }
                                    }
                                    else if (itemOptions.answerLimit > 0) {
                                        for (var i = 0; i < itemOptions.answerLimit; i++) {
                                            visibleAnswers.push(i);
                                        }
                                    }
                                    // render the answers
                                    for (var i = 0; i < data.items.length; i++) {
                                        var answer = data.items[i];
                                        
                                        var answerElement = $('<div class="stacktack-answer"><div class="stacktack-answer-header clearfix">' +'<h4><a href="http://' + options.site + '/questions/' + question.question_id + '#' + answer.answer_id + '" target="_blank">Answer ' + (i + 1) + '</a></h4></div><div class="stacktack-answer-body">' + answer.body + '</div></div>');
                                        if (answer.accepted) {
                                            answerElement.addClass('stacktack-answer-accepted');
                                            answerElement.find('.stacktack-answer-header h4').prepend('<span alt="Accepted" title="Accepted" class="stacktack-answer-check"></span>');
                                            answerElement.find('.stacktack-votes').append(' | Accepted');
                                        }
                                        // hide answer if it isn't in the visible list
                                        if (visibleAnswers.length > 0) {
                                            if ($.inArray(i, visibleAnswers) == -1) {
                                                answerElement.hide();
                                            }
                                        }
                                        answersElement.append(answerElement);
                                    }
                                }
                            });
                        }


                        // make all links open in a new window
                        containerElement.find('a').attr('target', '_blank');
                        
                        // render "more answers" button if the answers were filtered at all
                        if (visibleAnswers.length > 0) {
                            var moreElement = $('<a href="#" class="stacktack-answers-more">+ More Answers</a>"');
                            moreElement.click(function() {
                                $(this).hide();
                                answersElement.find('.stacktack-answer:hidden').slideDown('fast');
                                return false;
                            });
                            answersElement.append(moreElement);
                        }
                    }
                });

                item.append(containerElement);
            });
        });
    };


    $.fn.stacktack.defaults = {
        site: 'stackoverflow.com',
        apiVersion: '2.2',
        stylesheet: '/css/stacktack.min.css',
        answerLimit: 0,
        onlyShowAcceptedAnswer: true,
        filterAnswers: [],
        showTags: false,
        width: null
    };

})(jQuery);
