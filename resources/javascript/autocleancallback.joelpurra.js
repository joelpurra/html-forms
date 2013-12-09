/*!
 * @license AutoCleanCallback
 * Copyright (c) 2011, 2012, 2013 The Swedish Post and Telecom Authority (PTS)
 * Developed for PTS by Joel Purra <http://joelpurra.com/>
 * Released under the BSD license.
 *
 * https://github.com/joelpurra/autocleancallback
 *
 * A jQuery plugin to clean input fields with common functionality, like
 * trim, normalize whitespace, digits only. It is also easily extensible.
 */

/*jslint white:true */
/*global jQuery:true, JoelPurra:true, debug:true*/

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function($, debug, namespace, undefined) {
    "use strict";

    var EMPTYSTRING = "";

    // TODO: put in common library for reuse
    namespace.getFunctionName = function(fn) {
        if (fn === undefined) {
            return undefined;
        }

        var fnStr = (EMPTYSTRING + fn);

        return $.trim(fnStr.substr(0, fnStr.indexOf("(")));
    };

    // TODO: put in common library for reuse
    namespace.getFunctionSignature = function(fn) {
        if (fn === undefined) {
            return undefined;
        }

        var fnStr = (EMPTYSTRING + fn);

        return $.trim(fnStr.substr(0, fnStr.indexOf(")") + 1));
    };

    namespace.autoCleanCallback = function($input, callback) {
        var callbackName = namespace.getFunctionName(callback);

        debug.log(".autoCleanCallback($input, callback)", $input, callbackName);

        if ($input.length === 0) {
            debug.error(".autoCleanCallback($input, callback)", $input, callbackName, "Called with an empty $input.");

            return;
        }

        if ($input.length !== 1) {
            debug.error(".autoCleanCallback($input, callback)", $input, callbackName, "Called with more than one matched $input.");

            return;
        }

        // Could also be checked against
        // http://www.w3.org/TR/html5/the-input-element.html#attr-input-type
        if (!$input.is(":input")) {
            debug.error(".autoCleanCallback($input, callback)", $input, callbackName, "Called with a non-:input $input.");

            return;
        }

        if (callback === undefined) {
            debug.error(".autoCleanCallback($input, callback)", $input, callbackName, "Called without callback($input).");

            return;
        }

        if (callback === null) {
            debug.error(".autoCleanCallback($input, callback)", $input, callbackName, "Called with a null callback($input).");

            return;
        }

        if (!$.isFunction(callback)) {
            debug.error(".autoCleanCallback($input, callback)", $input, callbackName, "Called with a non-function callback($input).");

            return;
        }

        function cleanCallback(evt) {
            debug.log(".autoCleanCallback($input, callback)", $input, callbackName, "cleanCallback(evt)", evt);

            var field = $(evt.target),
                clean = callback(field);

            if (clean !== null) {
                field.val(clean);
            }
        }

        // TODO: might be better to check the key events and then allow/disallow them
        // Right now the unclean character flashes before being deleted
        $input.keyup(cleanCallback);
        $input.change(cleanCallback);
    };

    namespace.autoCleanTrim = function($input) {
        debug.log(".autoCleanTrim($input)", $input);

        function cleanTrim($inputToClean) {
            debug.log(".autoCleanTrim($input)", $input, "cleanTrim($inputToClean)", $inputToClean);

            var val = $inputToClean.val(),
                clean = val.trim();

            if (val !== clean) {
                return clean;
            }

            return null;
        }

        namespace.autoCleanCallback($input, cleanTrim);
    };

    namespace.autoCleanTrimLeft = function($input) {
        debug.log(".autoCleanTrimLeft($input)", $input);

        function cleanTrimLeft($inputToClean) {
            debug.log(".autoCleanTrimLeft($input)", $input, "cleanTrimLeft($inputToClean)", $inputToClean);

            var val = $inputToClean.val(),
                clean = val.trimLeft();

            if (val !== clean) {
                return clean;
            }

            return null;
        }

        namespace.autoCleanCallback($input, cleanTrimLeft);
    };

    namespace.autoCleanTrimRight = function($input) {
        debug.log(".autoCleanTrimRight($input)", $input);

        function cleanTrimRight($inputToClean) {
            debug.log(".autoCleanTrimRight($input)", $input, "cleanTrimRight($inputToClean)", $inputToClean);

            var val = $inputToClean.val(),
                clean = val.trimRight();

            if (val !== clean) {
                return clean;
            }

            return null;
        }

        namespace.autoCleanCallback($input, cleanTrimRight);
    };

    namespace.autoCleanLowerCase = function($input) {
        debug.log(".autoCleanLowerCase($input)", $input);

        function cleanLowerCase($inputToClean) {
            debug.log(".autoCleanLowerCase($input)", $input, "cleanLowerCase($inputToClean)", $inputToClean);

            var val = $inputToClean.val(),
                clean = val.toLowerCase();

            if (val !== clean) {
                return clean;
            }

            return null;
        }

        namespace.autoCleanCallback($input, cleanLowerCase);
    };

    namespace.autoCleanUpperCase = function($input) {
        debug.log(".autoCleanUpperCase($input)", $input);

        function cleanUpperCase($inputToClean) {
            debug.log(".autoCleanUpperCase($input)", $input, "cleanUpperCase($inputToClean)", $inputToClean);

            var val = $inputToClean.val(),
                clean = val.toUpperCase();

            if (val !== clean) {
                return clean;
            }

            return null;
        }

        namespace.autoCleanCallback($input, cleanUpperCase);
    };

    namespace.autoCleanReplace = function($input, disallowed, replaceWith) {
        debug.log(".autoCleanReplace($input, disallowed, replaceWith)", $input, disallowed, replaceWith);

        function cleanReplace($inputToClean) {
            debug.log(".autoCleanReplace($input, disallowed, replaceWith)", $input, disallowed, replaceWith, "cleanReplace($inputToClean)", $inputToClean);

            var val = $inputToClean.val(),
                clean = val.replace(disallowed, replaceWith);

            if (val !== clean) {
                return clean;
            }

            return null;
        }

        namespace.autoCleanCallback($input, cleanReplace);
    };

    namespace.autoCleanNormalizeWhitespace = function($input) {
        debug.log(".autoCleanNormalizeWhitespace($input)", $input);

        var disallowed = /(\s)\1/g,
            replaceWith = "$1";

        namespace.autoCleanReplace($input, disallowed, replaceWith);
    };

    namespace.autoCleanKeepNumbersOnly = function($input) {
        debug.log(".autoCleanKeepNumbersOnly($input)", $input);

        var disallowed = /[^\d]/g,
            replaceWith = EMPTYSTRING;

        namespace.autoCleanReplace($input, disallowed, replaceWith);
    };
}(jQuery, debug, JoelPurra));