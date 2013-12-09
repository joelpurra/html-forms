/*!
 * @license PageHasFormChanges
 * Copyright © 2012, 2013 Joel Purra <http://joelpurra.com/>
 * Released under MIT, BSD and GPL license. Comply with at least one.
 *
 * https://github.com/joelpurra/pagehasformchanges
 *
 * A jQuery plugin to check if *anything* has changed in *any form* on a page,
 * and warn the user before leaving the page.
 */

/*jslint white: true */
/*global window: true, document: true, JoelPurra: true, debug: true, jQuery: true */

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function($, namespace) {
    "use strict";

    var tag = "PageHasFormChanges",

        ns = namespace.PageHasFormChanges = {},

        defaultOptions = {
            leavingPageWarningMessage: "Changes have been detected in the form. Leaving the page will discard all form input.",
            resetWarningOnPreventedSubmit: false
        },

        options = $.extend(true, {}, defaultOptions),

        userHasChangedSomething = false,

        $document = $(document);

    $document.change(function(e) {
        debug.log(tag, "$(document).change() detected", e);

        if (userHasChangedSomething !== true) {
            debug.info(tag, "Triggered by change event. Will warn user before leaving the page.");
        }

        userHasChangedSomething = true;
    });

    $document.submit(function(e) {
        debug.log(tag, "$(document).submit() detected", e);

        if (e.isDefaultPrevented()) {
            debug.log(tag, "$(document).submit() event was already prevented from actually submitting the form.", e);

            if (options.resetWarningOnPreventedSubmit !== true) {
                return;
            }
        }

        if (userHasChangedSomething === true) {
            debug.info(tag, "Reset by submit event. Will not warn user before leaving the page.");
        }

        userHasChangedSomething = false;
    });

    function initializeOnBeforeUnloadListener() {
        // From http://jonathonhill.net/2011-03-04/catching-the-javascript-beforeunload-event-the-cross-browser-way/
        window.onbeforeunload = function(e) {
            if (userHasChangedSomething !== true) {
                return null;
            }

            e = e || window.event;

            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = options.leavingPageWarningMessage;
            }

            // For Safari
            return options.leavingPageWarningMessage;
        };
    }

    ns.setOptions = function(userOptions) {
        var optionsBefore = options;

        options = $.extend(true, {}, options, userOptions);

        debug.log(tag, "setOptions", optionsBefore, userOptions, options);
    };

    function atStartup() {
        initializeOnBeforeUnloadListener();
    }

    atStartup();

}(jQuery, JoelPurra));