import $ from 'jquery';

const defaultOptions = {
    debug: false,                       // show the pdfFrame for debugging
    importCSS: true,                    // import parent page css
    importStyle: true,                  // import style tags
    pdfContainer: true,                 // print outer container/$.selector
    loadCSS: "",                        // path to additional css file - use an array [] for multiple
    pageTitle: "",                      // add title to print page
    removeInline: false,                // remove inline styles from print elements
    removeInlineSelector: "*",          // custom selectors to filter inline styles. removeInline must be true
    header: null,                       // prefix to html
    footer: null,                       // postfix to html
    base: false,                        // preserve the BASE tag or accept a string for the URL
    formValues: true,                   // preserve input/form values
    canvas: true,                       // copy canvas content
    removeScripts: false,               // remove script tags from print content
    copyTagClasses: true,               // copy classes from the html & body tag
    copyTagStyles: true,                // copy styles from html & body tag (for CSS Variables)
};

function appendContent($el, content) {
    if (!content) return;

    // Simple test for a jQuery element
    $el.append(content.jquery ? content.clone() : content);
}

function appendBody($body, $element, options) {
    // Clone for safety and convenience
    // Calls clone(withDataAndEvents = true) to copy form values.
    var $content = $element.clone(options.formValues);

    if (options.formValues) {
        // Copy original select and textarea values to their cloned counterpart
        // Makes up for inability to clone select and textarea values with clone(true)
        copyValues($element, $content, 'select, textarea');
    }

    if (options.removeScripts) {
        $content.find('script').remove();
    }

    if (options.pdfContainer) {
        // grab $.selector as container
        $content.appendTo($body);
    } else {
        // otherwise just print interior elements of container
        $content.each(function () {
            $(this).children().appendTo($body)
        });
    }
}

// Copies values from origin to clone for passed in elementSelector
function copyValues(origin, clone, elementSelector) {
    var $originalElements = origin.find(elementSelector);

    clone.find(elementSelector).each(function (index, item) {
        $(item).val($originalElements.eq(index).val());
    });
}

export function pdfThis(selector, options = {}) {

    options = {
        ...defaultOptions, ...options
    }
    var $element = $(selector);

    var strFrameName = "printThis-" + (new Date()).getTime();

    var $pdfFrame = $("#" + strFrameName);

    // show frame if in debug mode
    if (!options.debug) $pdfFrame.css({
        position: "absolute",
        width: "0px",
        height: "0px",
        left: "-600px",
        top: "-600px"
    });


    var $frame = $("<div id='" + strFrameName + "' name='printIframe'></div>");
    $frame.append($('<head></head>'));
    $frame.append($('<body></body>'));

    var $head = $frame.find('head'),
        $body = $frame.find('body'),
        $doc = $pdfFrame.contents(),
        $base = $('base'),
        baseURL;

    // add base tag to ensure elements use the parent domain
    if (options.base === true && $base.length > 0) {
        // take the base tag from the original page
        baseURL = $base.attr('href');
    } else if (typeof options.base === 'string') {
        // An exact base string is provided
        baseURL = options.base;
    } else {
        // Use the page URL as the base
        baseURL = document.location.protocol + '//' + document.location.host;
    }

    $head.append('<base href="' + baseURL + '">');

    // import page stylesheets
    if (options.importCSS) $("link[rel=stylesheet]").each(function () {
        var href = $(this).attr("href");
        if (href) {
            var media = $(this).attr("media") || "all";
            $head.append("<link type='text/css' rel='stylesheet' href='" + href + "' media='" + media + "'>");
        }
    });

    // import style tags
    if (options.importStyle) $("style").each(function () {
        $head.append(this.outerHTML.replace(/\/\*\# sourceMappingURL=.*\*\//gim, ''));
    });

    // add title of the page
    if (options.pageTitle) $head.append("<title>" + options.pageTitle + "</title>");

    // import additional stylesheet(s)
    if (options.loadCSS) {
        if ($.isArray(options.loadCSS)) {
            jQuery.each(options.loadCSS, function (index, value) {
                $head.append("<link type='text/css' rel='stylesheet' href='" + this + "'>");
            });
        } else {
            $head.append("<link type='text/css' rel='stylesheet' href='" + options.loadCSS + "'>");
        }
    }

    var pageHtml = $('html')[0];

    // // CSS VAR in html tag when dynamic apply e.g.  document.documentElement.style.setProperty("--foo", bar);
    $doc.find('html').prop('style', pageHtml.style.cssText);

    // copy 'root' tag classes
    var tag = options.copyTagClasses;
    if (tag) {
        tag = tag === true ? 'bh' : tag;
        if (tag.indexOf('b') !== -1) {
            $body.addClass($('body')[0].className);
        }
        if (tag.indexOf('h') !== -1) {
            $doc.find('html').addClass(pageHtml.className);
        }
    }

    // copy ':root' tag classes
    tag = options.copyTagStyles;
    if (tag) {
        tag = tag === true ? 'bh' : tag;
        if (tag.indexOf('b') !== -1) {
            $body.attr('style', $('body')[0].style.cssText);
        }
        if (tag.indexOf('h') !== -1) {
            $doc.find('html').attr('style', pageHtml.style.cssText);
        }
    }

    // print header
    appendContent($body, options.header);

    if (options.canvas) {
        // add canvas data-ids for easy access after cloning.
        var canvasId = 0;
        // .addBack('canvas') adds the top-level element if it is a canvas.
        $element.find('canvas').addBack('canvas').each(function () {
            $(this).attr('data-printthis', canvasId++);
        });
    }

    appendBody($body, $element, options);

    if (options.canvas) {
        // Re-draw new canvases by referencing the originals
        $body.find('canvas').each(function () {
            var cid = $(this).data('printthis'),
                $src = $('[data-printthis="' + cid + '"]');

            this.getContext('2d').drawImage($src[0], 0, 0);

            // Remove the markup from the original
            if ($.isFunction($.fn.removeAttr)) {
                $src.removeAttr('data-printthis');
            } else {
                $.each($src, function (i, el) {
                    el.removeAttribute('data-printthis');
                });
            }
        });
    }

    // remove inline styles
    if (options.removeInline) {
        // Ensure there is a selector, even if it's been mistakenly removed
        var selector = options.removeInlineSelector || '*';
        // $.removeAttr available jQuery 1.7+
        if ($.isFunction($.removeAttr)) {
            $body.find(selector).removeAttr("style");
        } else {
            $body.find(selector).attr("style", "");
        }
    }

    // print "footer"
    appendContent($body, options.footer);

    const html = '<html>' + $frame.html() + '<html>';

    $('#' + strFrameName).remove();

    return html
    // }, 333);

};
